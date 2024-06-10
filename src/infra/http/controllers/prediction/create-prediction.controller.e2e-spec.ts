import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ChampionshipFactory } from 'test/factories/make-championship'
import { MatchFactory } from 'test/factories/make-match'
import { PredictionFactory } from 'test/factories/make-prediction'
import { RoundFactory } from 'test/factories/make-round'
import { TeamFactory } from 'test/factories/make-team'
import { UserFactory } from 'test/factories/make-user'

describe('Create Prediction (E2E)', () => {
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

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /prediction', async () => {
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

    const response = await request(app.getHttpServer())
      .post('/prediction')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        matchId: newMatch.id.toString(),
        predictionHome: 1,
        predictionAway: 1,
      })

    expect(response.statusCode).toBe(201)

    const predictionOnDatabase = await prisma.prediction.findFirst({
      where: {
        matchId: newMatch.id.toString(),
        userId: user.id.toString(),
      },
    })

    expect(predictionOnDatabase).toBeTruthy()
  })
})
