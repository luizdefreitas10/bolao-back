import { InMemoryMatchRepository } from 'test/repositories/in-memory-match-repository'
import { makeMatch } from 'test/factories/make-match'
import { makeTeam } from 'test/factories/make-team'
import { FetchActiveMatchesUseCase } from './fetch-active-matches'

let inMemoryMatchRepository: InMemoryMatchRepository
let sut: FetchActiveMatchesUseCase

describe('Fetch active matches', () => {
  beforeEach(() => {
    inMemoryMatchRepository = new InMemoryMatchRepository()
    sut = new FetchActiveMatchesUseCase(inMemoryMatchRepository)
  })

  it('should be able to fetch active matches', async () => {
    const teamHome = makeTeam({ name: 'Team Home' })
    const teamAway = makeTeam({ name: 'Team Away' })

    const match = makeMatch({
      teamIdAway: teamAway.id,
      teamIdHome: teamHome.id,
      status: 'WAITING',
    })
    const match2 = makeMatch({
      teamIdAway: teamAway.id,
      teamIdHome: teamHome.id,
      status: 'WAITING',
    })
    const match3 = makeMatch({
      teamIdAway: teamAway.id,
      teamIdHome: teamHome.id,
      status: 'DONE',
    })
    const match4 = makeMatch({
      teamIdAway: teamAway.id,
      teamIdHome: teamHome.id,
      status: 'IN_PROGRESS',
    })
    const match5 = makeMatch({
      teamIdAway: teamAway.id,
      teamIdHome: teamHome.id,
      status: 'CANCELED',
    })
    const match6 = makeMatch({
      teamIdAway: teamAway.id,
      teamIdHome: teamHome.id,
      status: 'INACTIVE',
    })
    const match7 = makeMatch({
      teamIdAway: teamAway.id,
      teamIdHome: teamHome.id,
      status: 'DONE',
    })

    inMemoryMatchRepository.items.push(
      match,
      match2,
      match3,
      match4,
      match5,
      match6,
      match7,
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(Array.isArray(result.value?.matches)).toBe(true)
    expect(inMemoryMatchRepository.items.length).toBeGreaterThan(0)
    const validStatus = ['WAITING', 'IN_PROGRESS', 'DONE']
    result.value?.matches.forEach((match) => {
      expect(validStatus.includes(match.status)).toBe(true)
    })
  })
})
