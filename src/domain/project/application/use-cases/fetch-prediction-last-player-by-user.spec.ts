import { makeChampionship } from 'test/factories/make-championship'
import { makeRound } from 'test/factories/make-round'
import { makeTeam } from 'test/factories/make-team'
import { makeMatch } from 'test/factories/make-match'
import { makePrediction } from 'test/factories/make-prediction'
import { makeUser } from 'test/factories/make-user'
import { FetchPredictionLastPlayerByUserUseCase } from './fetch-prediction-last-player-by-user'
import { InMemoryPredictionLastPlayerRepository } from 'test/repositories/in-memory-prediction-last-player'
import { makePredictionLastPlayer } from 'test/factories/make-prediction-last-player'

let inMemoryPredictionLastPlayerRepository: InMemoryPredictionLastPlayerRepository
let sut: FetchPredictionLastPlayerByUserUseCase

describe('Fetch Prediction Last Player By User', () => {
  beforeEach(() => {
    inMemoryPredictionLastPlayerRepository =
      new InMemoryPredictionLastPlayerRepository()

    sut = new FetchPredictionLastPlayerByUserUseCase(
      inMemoryPredictionLastPlayerRepository,
    )
  })

  it('should be able to fetch predictions last player', async () => {
    const prediciton = makePredictionLastPlayer()
    await inMemoryPredictionLastPlayerRepository.create(prediciton)
    const result = await sut.execute({
      userId: prediciton.userId.toString(),
    })
    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.predictions).toHaveLength(1)
    }
  })
})
