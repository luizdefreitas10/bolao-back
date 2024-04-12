import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { ChampionshipFactory } from 'test/factories/make-championship'
import { MatchFactory } from 'test/factories/make-match'
import { RoundFactory } from 'test/factories/make-round'
import { TeamFactory } from 'test/factories/make-team'
import { UserFactory } from 'test/factories/make-user'
import request from 'supertest'

describe('Fetch active matches (E2E)', () => {
  let app: INestApplication
  let championshioFactory: ChampionshipFactory
  let roundFactory: RoundFactory
  let teamFactory: TeamFactory
  let matchFactory: MatchFactory
  let userFactory: UserFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        ChampionshipFactory,
        RoundFactory,
        TeamFactory,
        MatchFactory,
        UserFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    championshioFactory = moduleRef.get(ChampionshipFactory)
    roundFactory = moduleRef.get(RoundFactory)
    teamFactory = moduleRef.get(TeamFactory)
    matchFactory = moduleRef.get(MatchFactory)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /match/active-matches', async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    const champ = await championshioFactory.makePrismaChampionship()

    const round = await roundFactory.makePrismaRound({
      championshipId: champ.id,
      name: 'Round Teste',
    })

    const teamHome = await teamFactory.makePrismaTeam({ name: 'TeamHome' })
    const teamAway = await teamFactory.makePrismaTeam({ name: 'TeamAway' })
    const teamHome2 = await teamFactory.makePrismaTeam({ name: 'TeamHome2' })
    const teamAway2 = await teamFactory.makePrismaTeam({ name: 'TeamAway2' })
    const teamHome3 = await teamFactory.makePrismaTeam({ name: 'TeamHome3' })
    const teamAway3 = await teamFactory.makePrismaTeam({ name: 'TeamAway3' })
    const teamHome4 = await teamFactory.makePrismaTeam({ name: 'TeamHome4' })
    const teamAway4 = await teamFactory.makePrismaTeam({ name: 'TeamAway4' })

    await matchFactory.makePrismaMatch({
      teamIdAway: teamAway.id,
      teamIdHome: teamHome.id,
      status: 'WAITING',
      roundId: round.id,
    })
    await matchFactory.makePrismaMatch({
      teamIdAway: teamAway2.id,
      teamIdHome: teamHome2.id,
      status: 'IN_PROGRESS',
      roundId: round.id,
    })
    await matchFactory.makePrismaMatch({
      teamIdAway: teamAway3.id,
      teamIdHome: teamHome3.id,
      status: 'DONE',
      roundId: round.id,
    })
    await matchFactory.makePrismaMatch({
      teamIdAway: teamAway4.id,
      teamIdHome: teamHome4.id,
      status: 'WAITING',
      roundId: round.id,
    })
    await matchFactory.makePrismaMatch({
      teamIdAway: teamAway4.id,
      teamIdHome: teamHome4.id,
      status: 'CANCELED',
      roundId: round.id,
    })
    await matchFactory.makePrismaMatch({
      teamIdAway: teamAway4.id,
      teamIdHome: teamHome2.id,
      status: 'INACTIVE',
      roundId: round.id,
    })
    await matchFactory.makePrismaMatch({
      teamIdAway: teamAway.id,
      teamIdHome: teamHome4.id,
      status: 'DONE',
      roundId: round.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/match/active-matches`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    const responseMatches = response.body.matches
    const validStatus = ['WAITING', 'IN_PROGRESS', 'DONE']
    responseMatches.forEach((match: { status: string }) => {
      expect(validStatus.includes(match.status)).toBe(true)
    })
  })
})
