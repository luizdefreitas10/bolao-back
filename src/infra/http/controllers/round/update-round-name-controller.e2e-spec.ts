import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ChampionshipFactory } from 'test/factories/make-championship'
import { RoundFactory } from 'test/factories/make-round'
import { UserFactory } from 'test/factories/make-user'

describe('Update Round (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: UserFactory
  let championshipFactory: ChampionshipFactory
  let roundFactory: RoundFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ChampionshipFactory, RoundFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    championshipFactory = moduleRef.get(ChampionshipFactory)
    jwt = moduleRef.get(JwtService)
    roundFactory = moduleRef.get(RoundFactory)

    await app.init()
  })

  test('[PATCH] /round/update-name', async () => {
    const championship = await championshipFactory.makePrismaChampionship()
    const user = await userFactory.makePrismaUserAdmin()
    const accessToken = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    const roundCreated = await roundFactory.makePrismaRound({
      championshipId: championship.id,
    })
    const name = 'Novo nome'
    const response = await request(app.getHttpServer())
      .patch('/round/update-name')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        roundId: roundCreated.id.toString(),
        name,
      })
    // console.log(response)
    expect(response.statusCode).toBe(204)

    const roundOnDatabase = await prisma.round.findFirst({
      where: {
        id: roundCreated.id.toString(),
        name,
      },
    })

    expect(roundOnDatabase).toBeTruthy()
  })
})
