import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ChampionshipFactory } from 'test/factories/make-championship'
import { PlayerFactory } from 'test/factories/make-player'
import { RoundFactory } from 'test/factories/make-round'
import { TeamFactory } from 'test/factories/make-team'
import { UserFactory } from 'test/factories/make-user'

describe('Fetch Players (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let userFactory: UserFactory
  let championshipFactory: ChampionshipFactory
  let roundFactory: RoundFactory
  let teamFactory: TeamFactory
  let playerFactory: PlayerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        RoundFactory,
        TeamFactory,
        ChampionshipFactory,
        PlayerFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    roundFactory = moduleRef.get(RoundFactory)
    teamFactory = moduleRef.get(TeamFactory)
    championshipFactory = moduleRef.get(ChampionshipFactory)
    playerFactory = moduleRef.get(PlayerFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /player', async () => {
    const champ = await championshipFactory.makePrismaChampionship()
    const round = await roundFactory.makePrismaRound({
      championshipId: champ.id,
    })
    const team = await teamFactory.makePrismaTeam()
    const user = await userFactory.makePrismaUserAdmin()
    await playerFactory.makePrismaPlayer({
      roundId: round.id,
      teamId: team.id,
      name: 'Jogador',
    })
    const accessToken = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    const response = await request(app.getHttpServer())
      .get(`/player/round/${round.id.toString()}/team/${team.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      players: expect.arrayContaining([
        expect.objectContaining({
          name: 'Jogador',
        }),
      ]),
    })
  })
})
