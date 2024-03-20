import { InMemoryTeamRepository } from 'test/repositories/in-memory-team-repository'
import { InMemoryMatchRepository } from 'test/repositories/in-memory-match-repository'
import { InMemoryRoundRepository } from 'test/repositories/in-memory-round-repository'
import { makeRound } from 'test/factories/make-round'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeTeam } from 'test/factories/make-team'
import { UpdateMatchDateUseCase } from './update-match-date'
import { makeMatch } from 'test/factories/make-match'

let inMemoryMatchRepository: InMemoryMatchRepository
let inMemoryTeamRepository: InMemoryTeamRepository
let inMemoryRoundRepository: InMemoryRoundRepository

let sut: UpdateMatchDateUseCase

describe('Update score match', () => {
  beforeEach(() => {
    inMemoryMatchRepository = new InMemoryMatchRepository()
    sut = new UpdateMatchDateUseCase(inMemoryMatchRepository)
    inMemoryTeamRepository = new InMemoryTeamRepository()
    inMemoryRoundRepository = new InMemoryRoundRepository()
  })

  it('should be able to update score match', async () => {
    const roundTest = makeRound({
      championshipId: new UniqueEntityID('1'),
    })

    const teamHomeTest = makeTeam()
    const teamAwayTest = makeTeam()

    await inMemoryRoundRepository.create(roundTest)
    await inMemoryTeamRepository.create(teamHomeTest)
    await inMemoryTeamRepository.create(teamAwayTest)

    const today = new Date()
    const newData = new Date(today.setDate(today.getDate() + 10))

    const newMatch = makeMatch({
      teamIdAway: teamAwayTest.id,
      teamIdHome: teamHomeTest.id,
      roundId: roundTest.id,
      scoreAway: 0,
      scoreHome: 0,
    })

    await inMemoryMatchRepository.create(newMatch)

    const result = await sut.execute({
      matchId: newMatch.id.toString(),
      date: newData,
    })

    await inMemoryMatchRepository.updateScore(newMatch.id.toString(), 0, 1)
    const resultVerifyNewData = await inMemoryMatchRepository.findById(
      newMatch.id.toString(),
    )
    expect(result.isRight()).toBe(true)
    expect(resultVerifyNewData?.scoreHome).toEqual(0)
    expect(resultVerifyNewData?.scoreAway).toEqual(1)
  })
})
