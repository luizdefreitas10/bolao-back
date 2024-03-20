import { InMemoryRoundRepository } from 'test/repositories/in-memory-round-repository'
import { CreateRoundUseCase } from './create-round'
import { InMemoryChampionshipRepository } from 'test/repositories/in-memory-championship-repository'
import { makeChampionship } from 'test/factories/make-championship'

let inMemoryRoundRepository: InMemoryRoundRepository
let inMemoryChampionshipRepository: InMemoryChampionshipRepository
let sut: CreateRoundUseCase

describe('Create new round', () => {
  beforeEach(() => {
    inMemoryRoundRepository = new InMemoryRoundRepository()
    inMemoryChampionshipRepository = new InMemoryChampionshipRepository()
    sut = new CreateRoundUseCase(
      inMemoryRoundRepository,
      inMemoryChampionshipRepository,
    )
  })

  it('should be able to register a new round', async () => {
    const champ = makeChampionship()
    await inMemoryChampionshipRepository.create(champ)
    const result = await sut.execute({
      championshipId: champ.id.toString(),
      name: 'Round Test',
    })

    expect(result.isRight()).toBe(true)
  })
})
