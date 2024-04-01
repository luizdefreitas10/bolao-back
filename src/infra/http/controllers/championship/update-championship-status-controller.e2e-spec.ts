import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ChampionshipFactory } from 'test/factories/make-championship'
import { UserFactory } from 'test/factories/make-user'

describe('Update Championship status (E2E)', () => {
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
    jwt = moduleRef.get(JwtService)
    championshipFactory = moduleRef.get(ChampionshipFactory)

    await app.init()
  })

  test('[PATCH] /championship/update-status', async () => {
    await championshipFactory.makePrismaChampionship({
      name: 'Test Championship',
    })

    const user = await userFactory.makePrismaUserAdmin()
    const accessToken = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    const response = await request(app.getHttpServer())
      .patch('/championship/update-status')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        championshipName: 'Test Championship',
        status: 'IN_PROGRESS',
      })

    expect(response.statusCode).toBe(200)

    const championshipOnDatabase = await prisma.championship.findFirst({
      where: {
        status: 'IN_PROGRESS',
      },
    })

    expect(championshipOnDatabase).toBeTruthy()
  })
})
