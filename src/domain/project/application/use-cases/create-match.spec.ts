import { InMemoryTeamRepository } from 'test/repositories/in-memory-team-repository'
import { CreateMatchUseCase } from './create-match'
import { InMemoryMatchRepository } from 'test/repositories/in-memory-match-repository'
import { InMemoryRoundRepository } from 'test/repositories/in-memory-round-repository'
import { makeRound } from 'test/factories/make-round'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeTeam } from 'test/factories/make-team'

let inMemoryMatchRepository: InMemoryMatchRepository
let inMemoryTeamRepository: InMemoryTeamRepository
let inMemoryRoundRepository: InMemoryRoundRepository
let sut: CreateMatchUseCase

describe('Create new match', () => {
  beforeEach(() => {
    inMemoryMatchRepository = new InMemoryMatchRepository()
    inMemoryTeamRepository = new InMemoryTeamRepository()
    inMemoryRoundRepository = new InMemoryRoundRepository()

    sut = new CreateMatchUseCase(
      inMemoryMatchRepository,
      inMemoryTeamRepository,
      inMemoryRoundRepository,
    )
  })

  it('should be able to register a new match', async () => {
    const roundTest = makeRound({
      championshipId: new UniqueEntityID('1'),
    })

    const teamHomeTest = makeTeam()
    const teamAwayTest = makeTeam()

    await inMemoryRoundRepository.create(roundTest)
    await inMemoryTeamRepository.create(teamHomeTest)
    await inMemoryTeamRepository.create(teamAwayTest)

    const result = await sut.execute({
      teamIdAway: teamAwayTest.id.toString(),
      teamIdHome: teamHomeTest.id.toString(),
      roundId: roundTest.id.toString(),
      date: new Date('11/12/2024'),
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able to register a new match with a past date', async () => {
    const roundTest = makeRound({
      championshipId: new UniqueEntityID('1'),
    })

    const teamHomeTest = makeTeam()
    const teamAwayTest = makeTeam()

    await inMemoryRoundRepository.create(roundTest)
    await inMemoryTeamRepository.create(teamHomeTest)
    await inMemoryTeamRepository.create(teamAwayTest)

    const result = await sut.execute({
      teamIdAway: teamAwayTest.id.toString(),
      teamIdHome: teamHomeTest.id.toString(),
      roundId: roundTest.id.toString(),
      date: new Date('11/12/2023'),
    })

    expect(result.isLeft()).toBe(true)
  })
})
