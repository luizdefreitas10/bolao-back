import { InMemoryRoundRepository } from 'test/repositories/in-memory-round-repository'
import { makeRound } from 'test/factories/make-round'
import { UpdateRoundNameUseCase } from './update-round-name'

let inMemoryRoundRepository: InMemoryRoundRepository

let sut: UpdateRoundNameUseCase

describe('Update round name', () => {
  beforeEach(() => {
    inMemoryRoundRepository = new InMemoryRoundRepository()
    sut = new UpdateRoundNameUseCase(inMemoryRoundRepository)
  })

  it('should be able to update round name', async () => {
    const round = makeRound()
    const name = 'Novo nome'
    await inMemoryRoundRepository.create(round)
    const result = await sut.execute({
      roundId: round.id.toString(),
      name,
    })
    const resultVerifyNewData = await inMemoryRoundRepository.findById(
      round.id.toString(),
    )
    expect(result.isRight()).toBe(true)
    expect(resultVerifyNewData?.name).toEqual(name)
  })
})
