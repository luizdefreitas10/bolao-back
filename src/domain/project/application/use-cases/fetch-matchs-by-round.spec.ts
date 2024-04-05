import { InMemoryChampionshipRepository } from 'test/repositories/in-memory-championship-repository'
import { InMemoryRoundRepository } from 'test/repositories/in-memory-round-repository'
import { InMemoryTeamRepository } from 'test/repositories/in-memory-team-repository'
import { InMemoryMatchRepository } from 'test/repositories/in-memory-match-repository'
import { makeChampionship } from 'test/factories/make-championship'
import { makeRound } from 'test/factories/make-round'
import { makeTeam } from 'test/factories/make-team'
import { makeMatch } from 'test/factories/make-match'
import { FetchMatchUseCase } from './fetch-match'
import { FetchMatchByRoundUseCase } from './fetch-matchs-by-round'

let inMemoryChampionshipRepository: InMemoryChampionshipRepository
let inMemoryRoundRepository: InMemoryRoundRepository
let inMemoryTeamRepository: InMemoryTeamRepository
let inMemoryMatchRepository: InMemoryMatchRepository
let sut: FetchMatchByRoundUseCase

describe('Fetch Match By Round', () => {
  beforeEach(() => {
    inMemoryRoundRepository = new InMemoryRoundRepository()
    inMemoryChampionshipRepository = new InMemoryChampionshipRepository()
    inMemoryTeamRepository = new InMemoryTeamRepository()
    inMemoryMatchRepository = new InMemoryMatchRepository()

    sut = new FetchMatchByRoundUseCase(
      inMemoryMatchRepository,
      inMemoryRoundRepository,
    )
  })

  it('should be able to fetch matchs round', async () => {
    const champ = makeChampionship()
    await inMemoryChampionshipRepository.create(champ)

    const round = makeRound({ championshipId: champ.id, name: ' Round Teste' })
    await inMemoryRoundRepository.create(round)

    const teamHome = makeTeam({ name: 'Team Home' })
    const teamAway = makeTeam({ name: 'Team Away' })
    await inMemoryTeamRepository.create(teamHome)
    await inMemoryTeamRepository.create(teamAway)

    const newMatch = makeMatch({
      teamIdAway: teamAway.id,
      teamIdHome: teamHome.id,
      roundId: round.id,
    })

    await inMemoryMatchRepository.create(newMatch)

    const result = await sut.execute({
      roundId: round.id.toString(),
      page: 1,
    })
    expect(result.isRight()).toBe(true)
  })
})
