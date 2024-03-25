import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/make-user'

describe('Create Team (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /team', async () => {
    const user = await userFactory.makePrismaUserAdmin()
    const accessToken = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    const response = await request(app.getHttpServer())
      .post('/team')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Time Teste',
      })
    // console.log(response)
    expect(response.statusCode).toBe(201)

    const roundOnDatabase = await prisma.team.findFirst({
      where: {
        name: 'Time Teste',
      },
    })

    expect(roundOnDatabase).toBeTruthy()
  })
})
