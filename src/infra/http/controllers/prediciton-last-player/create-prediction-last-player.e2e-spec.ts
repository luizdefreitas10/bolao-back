import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ChampionshipFactory } from 'test/factories/make-championship'
import { PlayerFactory } from 'test/factories/make-player'
import { PredictionLastPlayerFactory } from 'test/factories/make-prediction-last-player'
import { RoundFactory } from 'test/factories/make-round'
import { TeamFactory } from 'test/factories/make-team'
import { UserFactory } from 'test/factories/make-user'

describe('Create Prediction Last Player (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: UserFactory
  let predictionLastPlayerFactory: PredictionLastPlayerFactory
  let championshipFactory: ChampionshipFactory
  let roundFactory: RoundFactory
  let teamFactory: TeamFactory
  let playerFactory: PlayerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        PredictionLastPlayerFactory,
        ChampionshipFactory,
        RoundFactory,
        TeamFactory,
        PlayerFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    championshipFactory = moduleRef.get(ChampionshipFactory)
    roundFactory = moduleRef.get(RoundFactory)
    teamFactory = moduleRef.get(TeamFactory)
    playerFactory = moduleRef.get(PlayerFactory)
    predictionLastPlayerFactory = moduleRef.get(PredictionLastPlayerFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /prediction-last-player', async () => {
    const champ = await championshipFactory.makePrismaChampionship()
    const round = await roundFactory.makePrismaRound({
      championshipId: champ.id,
    })
    const team = await teamFactory.makePrismaTeam()
    const player = await playerFactory.makePrismaPlayer({
      roundId: round.id,
      teamId: team.id,
    })
    const user = await userFactory.makePrismaUserAdmin()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'ADMIN',
    })

    const response = await request(app.getHttpServer())
      .post('/prediction-last-player')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        playerId: player.id.toString(),
        roundId: round.id.toString(),
        teamId: team.id.toString(),
      })
    expect(response.statusCode).toBe(201)

    const roundOnDatabase = await prisma.predictionLastPlayer.findFirst({
      where: {
        userId: user.id.toString(),
        playerId: player.id.toString(),
        roundId: round.id.toString(),
        teamId: team.id.toString(),
      },
    })

    console.log(roundOnDatabase)

    expect(roundOnDatabase).toBeTruthy()
  })
})
