import { InMemoryPlayerRepository } from 'test/repositories/in-memory-player-repository'
import { CreatePlayerUseCase } from './create-player'
import { makeTeam } from 'test/factories/make-team'
import { makeRound } from 'test/factories/make-round'
import { InMemoryRoundRepository } from 'test/repositories/in-memory-round-repository'
import { InMemoryTeamRepository } from 'test/repositories/in-memory-team-repository'

let inMemoryPlayerRepository: InMemoryPlayerRepository
let inMemoryRoundRepository = new InMemoryRoundRepository()
let inMemoryTeamRepository = new InMemoryTeamRepository()
let sut: CreatePlayerUseCase

describe('Create new player', () => {
  beforeEach(() => {
    inMemoryPlayerRepository = new InMemoryPlayerRepository()
    inMemoryRoundRepository = new InMemoryRoundRepository()
    inMemoryTeamRepository = new InMemoryTeamRepository()
    sut = new CreatePlayerUseCase(inMemoryPlayerRepository)
  })

  it('should be able to register a new Player', async () => {
    const team = makeTeam()
    const round = makeRound()
    await inMemoryRoundRepository.create(round)
    await inMemoryTeamRepository.create(team)
    const result = await sut.execute({
      name: 'Jogador',
      teamId: team.id.toString(),
      roundId: round.id.toString(),
    })
    console.log(result)
    expect(result.isRight()).toBe(true)
  })
})
