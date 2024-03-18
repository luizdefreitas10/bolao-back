import { InMemoryTeamRepository } from 'test/repositories/in-memory-team-repository'
import { InMemoryMatchRepository } from 'test/repositories/in-memory-match-repository'
import { InMemoryRoundRepository } from 'test/repositories/in-memory-round-repository'
import { makeRound } from 'test/factories/make-round'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeTeam } from 'test/factories/make-team'
import { UpdateMatchDateUseCase } from './update-match-date'
import { makeMatch } from 'test/factories/make-match'
import { UpdateMatchStatusUseCase } from './update-match-status'
import { RemoveMatchUseCase } from './remove-match'

let inMemoryMatchRepository: InMemoryMatchRepository
let inMemoryTeamRepository: InMemoryTeamRepository
let inMemoryRoundRepository: InMemoryRoundRepository

let sut: RemoveMatchUseCase

describe('Create new match', () => {
  beforeEach(() => {
    inMemoryMatchRepository = new InMemoryMatchRepository()
    sut = new RemoveMatchUseCase(inMemoryMatchRepository)
    inMemoryTeamRepository = new InMemoryTeamRepository()
    inMemoryRoundRepository = new InMemoryRoundRepository()
  })

  it('should be able to update date match', async () => {
    const roundTest = makeRound({
      championshipId: new UniqueEntityID('1'),
    })

    const teamHomeTest = makeTeam()
    const teamAwayTest = makeTeam()

    await inMemoryRoundRepository.create(roundTest)
    await inMemoryTeamRepository.create(teamHomeTest)
    await inMemoryTeamRepository.create(teamAwayTest)

    const newMatch = makeMatch({
      teamIdAway: teamAwayTest.id,
      teamIdHome: teamHomeTest.id,
      roundId: roundTest.id,
    })

    await inMemoryMatchRepository.create(newMatch)

    const result = await sut.execute({
      matchId: newMatch.id.toString(),
    })
    const resultVerifyNewData = await inMemoryMatchRepository.findById(
      newMatch.id.toString(),
    )
    expect(result.isRight()).toBe(true)
    expect(resultVerifyNewData?.status).toEqual('INACTIVE')
  })
})
