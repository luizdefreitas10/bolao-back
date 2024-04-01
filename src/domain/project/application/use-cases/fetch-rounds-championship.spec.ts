import { InMemoryChampionshipRepository } from 'test/repositories/in-memory-championship-repository'
import { InMemoryRoundRepository } from 'test/repositories/in-memory-round-repository'
import { InMemoryTeamRepository } from 'test/repositories/in-memory-team-repository'
import { FetchRoundsChampionshipUseCase } from './fetch-rounds-championship'
import { InMemoryMatchRepository } from 'test/repositories/in-memory-match-repository'
import { makeChampionship } from 'test/factories/make-championship'
import { makeRound } from 'test/factories/make-round'
import { makeTeam } from 'test/factories/make-team'
import { makeMatch } from 'test/factories/make-match'

let inMemoryChampionshipRepository: InMemoryChampionshipRepository
let inMemoryRoundRepository: InMemoryRoundRepository
let inMemoryTeamRepository: InMemoryTeamRepository
let inMemoryMatchRepository: InMemoryMatchRepository
let sut: FetchRoundsChampionshipUseCase

describe('Fetch Rounds Championship', () => {
  beforeEach(() => {
    inMemoryRoundRepository = new InMemoryRoundRepository()
    inMemoryChampionshipRepository = new InMemoryChampionshipRepository()
    inMemoryTeamRepository = new InMemoryTeamRepository()
    inMemoryMatchRepository = new InMemoryMatchRepository()

    sut = new FetchRoundsChampionshipUseCase(inMemoryRoundRepository)
  })

  it('should be able to fetch rounds', async () => {
    const champ = makeChampionship()
    await inMemoryChampionshipRepository.create(champ)

    const round = makeRound({ championshipId: champ.id, name: ' Round Teste' })
    await inMemoryRoundRepository.create(round)

    const teamHome = makeTeam({ name: 'Team Home' })
    const teamAway = makeTeam({ name: 'Team Away' })
    await inMemoryTeamRepository.create(teamHome)
    await inMemoryTeamRepository.create(teamAway)

    const match = makeMatch({
      teamIdAway: teamAway.id,
      teamIdHome: teamHome.id,
      roundId: round.id,
    })

    await inMemoryMatchRepository.create(match)

    const result = await sut.execute({
      champId: champ.id.toString(),
      page: 20,
    })

    expect(result.value?.rounds).toHaveLength(1)
  })
})
