import { InMemoryPredictionRepository } from 'test/repositories/in-memory-prediction-repository'
import { InMemoryChampionshipRepository } from 'test/repositories/in-memory-championship-repository'
import { InMemoryRoundRepository } from 'test/repositories/in-memory-round-repository'
import { InMemoryTeamRepository } from 'test/repositories/in-memory-team-repository'
import { InMemoryMatchRepository } from 'test/repositories/in-memory-match-repository'
import { makeChampionship } from 'test/factories/make-championship'
import { makeRound } from 'test/factories/make-round'
import { makeTeam } from 'test/factories/make-team'
import { makeMatch } from 'test/factories/make-match'
import { FetchMatchByRoundUseCase } from './fetch-matchs-by-round'
import { FetchPredicitonByUserUseCase } from './fetch-predictions-by-user'
import { makePrediction } from 'test/factories/make-prediction'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'

let inMemoryChampionshipRepository: InMemoryChampionshipRepository
let inMemoryRoundRepository: InMemoryRoundRepository
let inMemoryTeamRepository: InMemoryTeamRepository
let inMemoryMatchRepository: InMemoryMatchRepository
let inMemoryPredictionRepository: InMemoryPredictionRepository
let inMemoryUserRepository: InMemoryUsersRepository
let sut: FetchPredicitonByUserUseCase

describe('Fetch Prediction By User', () => {
  beforeEach(() => {
    inMemoryRoundRepository = new InMemoryRoundRepository()
    inMemoryChampionshipRepository = new InMemoryChampionshipRepository()
    inMemoryTeamRepository = new InMemoryTeamRepository()
    inMemoryMatchRepository = new InMemoryMatchRepository()
    inMemoryPredictionRepository = new InMemoryPredictionRepository()
    inMemoryUserRepository = new InMemoryUsersRepository()
    sut = new FetchPredicitonByUserUseCase(inMemoryPredictionRepository)
  })

  it('should be able to fetch preditcions', async () => {
    const newUser = makeUser()
    const user = await inMemoryUserRepository.create(newUser)

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

    const match = await inMemoryMatchRepository.create(newMatch)

    const newPrediction = makePrediction({
      matchId: match.id,
      userId: user.id,
      predictionAway: 0,
      predictionHome: 1,
      predictionType: 'SCORE',
    })

    await inMemoryPredictionRepository.create(newPrediction)

    const result = await sut.execute({
      userId: user.id.toString(),
    })
    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.predictions).toHaveLength(1)
    }
  })
})
