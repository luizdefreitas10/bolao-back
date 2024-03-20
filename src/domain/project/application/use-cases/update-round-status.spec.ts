import { InMemoryRoundRepository } from 'test/repositories/in-memory-round-repository'
import { makeRound } from 'test/factories/make-round'
import { UpdateRoundStatusUseCase } from './update-round-status'

let inMemoryRoundRepository: InMemoryRoundRepository

let sut: UpdateRoundStatusUseCase

describe('Update round status', () => {
  beforeEach(() => {
    inMemoryRoundRepository = new InMemoryRoundRepository()
    sut = new UpdateRoundStatusUseCase(inMemoryRoundRepository)
  })

  it('should be able to update round status', async () => {
    const round = makeRound()
    const status = 'IN_PROGRESS'
    await inMemoryRoundRepository.create(round)
    const result = await sut.execute({
      roundId: round.id.toString(),
      status,
    })
    const resultVerifyNewData = await inMemoryRoundRepository.findById(
      round.id.toString(),
    )
    expect(result.isRight()).toBe(true)
    expect(resultVerifyNewData?.status).toEqual(status)
  })
})
