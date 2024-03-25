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

describe('Remove Team (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: UserFactory
  let teamFactory: TeamFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, TeamFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)
    teamFactory = moduleRef.get(TeamFactory)
    await app.init()
  })

  test('[DELETE] /team', async () => {
    const user = await userFactory.makePrismaUserAdmin()
    const accessToken = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    const teamCreated = await teamFactory.makePrismaTeam({
      name: 'Time Teste',
    })

    const response = await request(app.getHttpServer())
      .delete('/team')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        teamName: teamCreated.name,
      })
    // console.log(response)
    expect(response.statusCode).toBe(204)

    const teamOnDatabase = await prisma.team.findFirst({
      where: {
        id: teamCreated.id.toString(),
        status: 'INACTIVE',
      },
    })

    expect(teamOnDatabase).toBeTruthy()
  })
})
