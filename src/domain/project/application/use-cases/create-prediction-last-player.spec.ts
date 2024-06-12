import { CreatePredictionLastPlayerUseCase } from './create-prediction-last-player'
import { InMemoryPredictionLastPlayerRepository } from 'test/repositories/in-memory-prediction-last-player'
import { makePredictionLastPlayer } from 'test/factories/make-prediction-last-player'

let inMemoryPredictionLastPlayerRepository =
  new InMemoryPredictionLastPlayerRepository()
let sut: CreatePredictionLastPlayerUseCase

describe('Create new prediction last player', () => {
  beforeEach(() => {
    inMemoryPredictionLastPlayerRepository =
      new InMemoryPredictionLastPlayerRepository()
    sut = new CreatePredictionLastPlayerUseCase(
      inMemoryPredictionLastPlayerRepository,
    )
  })

  it('should be able to register a new prediction last player', async () => {
    const prediction = makePredictionLastPlayer()

    const result = await sut.execute({
      playerId: prediction.playerId.toString(),
      roundId: prediction.roundId.toString(),
      teamId: prediction.teamId.toString(),
      userId: prediction.userId.toString(),
    })
    console.log(result)
    expect(result.isRight()).toBe(true)
  })
})
