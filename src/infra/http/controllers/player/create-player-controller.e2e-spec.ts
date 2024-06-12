import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ChampionshipFactory } from 'test/factories/make-championship'
import { RoundFactory } from 'test/factories/make-round'
import { TeamFactory } from 'test/factories/make-team'
import { UserFactory } from 'test/factories/make-user'

describe('Create Player (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: UserFactory
  let championshipFactory: ChampionshipFactory
  let roundFactory: RoundFactory
  let teamFactory: TeamFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, RoundFactory, TeamFactory, ChampionshipFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    roundFactory = moduleRef.get(RoundFactory)
    teamFactory = moduleRef.get(TeamFactory)
    championshipFactory = moduleRef.get(ChampionshipFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /player', async () => {
    const champ = await championshipFactory.makePrismaChampionship()
    const round = await roundFactory.makePrismaRound({
      championshipId: champ.id,
    })
    const team = await teamFactory.makePrismaTeam()
    const user = await userFactory.makePrismaUserAdmin()
    const accessToken = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    const response = await request(app.getHttpServer())
      .post('/player')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Jogador',
        roundId: round.id.toString(),
        teamId: team.id.toString(),
      })
    expect(response.statusCode).toBe(201)

    const roundOnDatabase = await prisma.player.findFirst({
      where: {
        name: 'Jogador',
      },
    })

    expect(roundOnDatabase).toBeTruthy()
  })
})
