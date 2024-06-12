import { InMemoryRoundRepository } from 'test/repositories/in-memory-round-repository'
import { InMemoryTeamRepository } from 'test/repositories/in-memory-team-repository'
import { InMemoryPlayerRepository } from 'test/repositories/in-memory-Player-repository'
import { makeRound } from 'test/factories/make-round'
import { makeTeam } from 'test/factories/make-team'
import { FetchPlayerByTeamAndRoundUseCase } from './fetch-players-by-round-and-team'
import { makePlayer } from 'test/factories/make-player'

let inMemoryRoundRepository: InMemoryRoundRepository
let inMemoryTeamRepository: InMemoryTeamRepository
let inMemoryPlayerRepository: InMemoryPlayerRepository
let sut: FetchPlayerByTeamAndRoundUseCase

describe('Fetch Players By Round', () => {
  beforeEach(() => {
    inMemoryRoundRepository = new InMemoryRoundRepository()
    inMemoryTeamRepository = new InMemoryTeamRepository()
    inMemoryPlayerRepository = new InMemoryPlayerRepository()

    sut = new FetchPlayerByTeamAndRoundUseCase(inMemoryPlayerRepository)
  })

  it('should be able to fetch Players round', async () => {
    const round = makeRound()
    await inMemoryRoundRepository.create(round)

    const team = makeTeam()
    await inMemoryTeamRepository.create(team)

    const newPlayer = makePlayer({
      roundId: round.id,
      teamId: team.id,
      name: 'Jogador',
    })

    await inMemoryPlayerRepository.create(newPlayer)

    const result = await sut.execute({
      teamId: team.id.toString(),
      roundId: round.id.toString(),
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.players).toHaveLength(1)
  })
})
