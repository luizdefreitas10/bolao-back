import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { match } from 'assert'
import request from 'supertest'
import { ChampionshipFactory } from 'test/factories/make-championship'
import { MatchFactory } from 'test/factories/make-match'
import { PredictionFactory } from 'test/factories/make-prediction'
import { RoundFactory } from 'test/factories/make-round'
import { TeamFactory } from 'test/factories/make-team'
import { UserFactory } from 'test/factories/make-user'

describe('Fetch Prediction (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let roundFactory: RoundFactory
  let teamFactory: TeamFactory
  let userFactory: UserFactory
  let championshipFactory: ChampionshipFactory
  let matchFactory: MatchFactory
  let predictionFactory: PredictionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        RoundFactory,
        TeamFactory,
        UserFactory,
        ChampionshipFactory,
        PredictionFactory,
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
    predictionFactory = moduleRef.get(PredictionFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /predictions', async () => {
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
    const newData = new Date(today.setDate(today.getDate() + 10))

    const newMatch = await matchFactory.makePrismaMatch({
      teamIdAway: teamAway.id,
      teamIdHome: teamHome.id,
      date: newData,
      roundId: round.id,
      status: 'WAITING',
    })

    await predictionFactory.makePrismaPrediction({
      matchId: newMatch.id,
      userId: user.id,
      predictionAway: 0,
      predictionHome: 1,
      createdAt: new Date(),
    })

    const response = await request(app.getHttpServer())
      .get('/predictions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body.predictions).toHaveLength(1)
    console.log(response.body.predictions)
    // expect(response.body).toEqual({
    //   rounds: expect.arrayContaining([
    //     expect.objectContaining({
    //       name: 'Round Teste',
    //       status: 'WAITING',
    //       matchs: [
    //         {
    //           date: match.date.toISOString(),
    //           scoreAway: 0,
    //           scoreHome: 0,
    //           status: 'WAITING',
    //           teamAway: { name: 'TeamAway' },
    //           teamHome: { name: 'TeamHome' },
    //         },
    //       ],
    //     }),
    //   ]),
    // })
  })
})
