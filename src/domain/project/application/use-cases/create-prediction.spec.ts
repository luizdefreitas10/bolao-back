import { CreatePredictionUseCase } from './create-prediction'
import { InMemoryPredictionRepository } from 'test/repositories/in-memory-prediction-repository'

let inMemoryPredictionRepository: InMemoryPredictionRepository
let sut: CreatePredictionUseCase

describe('Create new prediction', () => {
  beforeEach(() => {
    inMemoryPredictionRepository = new InMemoryPredictionRepository()

    sut = new CreatePredictionUseCase(inMemoryPredictionRepository)
  })

  it('should be able to register a new prediction', async () => {
    const result = await sut.execute({
      matchId: '1',
      userId: '1',
      predictionAway: 0,
      predictionHome: 1,
    })

    expect(result.isRight()).toBe(true)
  })
})
