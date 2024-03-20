import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ChampionshipFactory } from 'test/factories/make-championship'
import { UserFactory } from 'test/factories/make-user'

describe('Create Round (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: UserFactory
  let championshipFactory: ChampionshipFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ChampionshipFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    championshipFactory = moduleRef.get(ChampionshipFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /round', async () => {
    const championship = await championshipFactory.makePrismaChampionship()
    const user = await userFactory.makePrismaUserAdmin()
    const accessToken = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    const response = await request(app.getHttpServer())
      .post('/round')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        championshipId: championship.id.toString(),
        name: 'Round Teste',
      })
    // console.log(response)
    expect(response.statusCode).toBe(201)

    const roundOnDatabase = await prisma.round.findFirst({
      where: {
        championshipId: championship.id.toString(),
        name: 'Round Teste',
      },
    })

    expect(roundOnDatabase).toBeTruthy()
  })
})
