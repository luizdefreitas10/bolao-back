import { InMemoryMatchRepository } from 'test/repositories/in-memory-match-repository'
import { FetchMatchesByStatusUseCase } from './fetch-matches-by-status'
import { makeMatch } from 'test/factories/make-match'
import { makeTeam } from 'test/factories/make-team'

let inMemoryMatchRepository: InMemoryMatchRepository
let sut: FetchMatchesByStatusUseCase

describe('Fetch Matches By Status', () => {
  beforeEach(() => {
    inMemoryMatchRepository = new InMemoryMatchRepository()
    sut = new FetchMatchesByStatusUseCase(inMemoryMatchRepository)
  })

  it('should be able to fetch matches by status', async () => {
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
      status: 'WAITING',
      page: 1,
    })

    expect(Array.isArray(result.value?.matches)).toBe(true)
    result.value?.matches.forEach((match) => {
      expect(match.status).toEqual('WAITING')
    })
  })
})
