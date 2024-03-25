import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { TeamFactory } from 'test/factories/make-team'
import { UserFactory } from 'test/factories/make-user'

describe('Update Team (E2E)', () => {
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
    teamFactory = moduleRef.get(TeamFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PATCH] /team', async () => {
    const oldNameTeam = 'Old Name Team'
    const newTeamName = 'New Name Team'
    await teamFactory.makePrismaTeam({ name: oldNameTeam })
    const user = await userFactory.makePrismaUserAdmin()
    const accessToken = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    const response = await request(app.getHttpServer())
      .patch('/team')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        teamName: oldNameTeam,
        newTeamName,
      })
    // console.log(response)
    expect(response.statusCode).toBe(204)

    const teamOnDatabase = await prisma.team.findFirst({
      where: {
        name: newTeamName,
      },
    })

    expect(teamOnDatabase).toBeTruthy()
  })
})
