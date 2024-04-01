import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ChampionshipFactory } from 'test/factories/make-championship'
import { MatchFactory } from 'test/factories/make-match'
import { RoundFactory } from 'test/factories/make-round'
import { TeamFactory } from 'test/factories/make-team'
import { UserFactory } from 'test/factories/make-user'

describe('Update Match Status (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let roundFactory: RoundFactory
  let teamFactory: TeamFactory
  let userFactory: UserFactory
  let championshipFactory: ChampionshipFactory
  let matchFactory: MatchFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        RoundFactory,
        TeamFactory,
        UserFactory,
        ChampionshipFactory,
        MatchFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    roundFactory = moduleRef.get(RoundFactory)
    teamFactory = moduleRef.get(TeamFactory)
    userFactory = moduleRef.get(UserFactory)
    championshipFactory = moduleRef.get(ChampionshipFactory)
    matchFactory = moduleRef.get(MatchFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /match/update-status', async () => {
    const championship = await championshipFactory.makePrismaChampionship()
    const user = await userFactory.makePrismaUserAdmin()
    const accessToken = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })
    const round = await roundFactory.makePrismaRound({
      championshipId: championship.id,
    })
    const teamHome = await teamFactory.makePrismaTeam({
      name: 'Time 1',
    })
    const teamAway = await teamFactory.makePrismaTeam({
      name: 'Time 2',
    })
    const today = new Date()
    const dateMatch = new Date(today.setDate(today.getDate() + 10))
    const match = await matchFactory.makePrismaMatch({
      teamIdAway: teamAway.id,
      teamIdHome: teamHome.id,
      date: dateMatch,
      scoreAway: 0,
      scoreHome: 0,
      status: 'WAITING',
      roundId: round.id,
    })

    const response = await request(app.getHttpServer())
      .put('/match/update-status')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        matchId: match.id.toString(),
        status: 'DONE',
      })
    // console.log(response)
    expect(response.statusCode).toBe(201)

    const matchOnDatabase = await prisma.match.findFirst({
      where: {
        teamIdAway: teamAway.id.toString(),
        teamIdHome: teamHome.id.toString(),
        roundId: round.id.toString(),
        date: dateMatch,
        status: 'DONE',
      },
    })

    expect(matchOnDatabase).toBeTruthy()
  })
})
