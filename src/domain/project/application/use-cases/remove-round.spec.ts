import { InMemoryRoundRepository } from 'test/repositories/in-memory-round-repository'
import { makeRound } from 'test/factories/make-round'
import { RemoveRoundUseCase } from './remove-round'

let inMemoryRoundRepository: InMemoryRoundRepository

let sut: RemoveRoundUseCase

describe('Remove round', () => {
  beforeEach(() => {
    inMemoryRoundRepository = new InMemoryRoundRepository()
    sut = new RemoveRoundUseCase(inMemoryRoundRepository)
  })

  it('should be able to remove round', async () => {
    const round = makeRound()

    await inMemoryRoundRepository.create(round)
    const result = await sut.execute({
      roundId: round.id.toString(),
    })
    const resultVerifyNewData = await inMemoryRoundRepository.findById(
      round.id.toString(),
    )
    expect(result.isRight()).toBe(true)
    expect(resultVerifyNewData?.status).toEqual('INACTIVE')
  })
})
