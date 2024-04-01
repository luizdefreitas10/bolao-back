import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ChampionshipFactory } from 'test/factories/make-championship'
import { MatchFactory } from 'test/factories/make-match'
import { RoundFactory } from 'test/factories/make-round'
import { TeamFactory } from 'test/factories/make-team'
import { UserFactory } from 'test/factories/make-user'

describe('Fetch question answers (E2E)', () => {
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

  test('[GET] /rounds/:champId', async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    const champ = await championshioFactory.makePrismaChampionship()
    const round = await roundFactory.makePrismaRound({
      championshipId: champ.id,
      name: 'Round Teste',
    })
    const teamHome = await teamFactory.makePrismaTeam({ name: 'TeamHome' })
    const teamAway = await teamFactory.makePrismaTeam({ name: 'TeamAway' })

    const match = await matchFactory.makePrismaMatch({
      teamIdAway: teamAway.id,
      teamIdHome: teamHome.id,
      roundId: round.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/rounds/${champ.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    console.log(response.body)
    expect(response.body).toEqual({
      rounds: expect.arrayContaining([
        expect.objectContaining({
          name: 'Round Teste',
          status: 'WAITING',
          matchs: [
            {
              date: match.date.toISOString(),
              scoreAway: 0,
              scoreHome: 0,
              status: 'WAITING',
              teamAway: { name: 'TeamAway' },
              teamHome: { name: 'TeamHome' },
            },
          ],
        }),
      ]),
    })
  })
})
