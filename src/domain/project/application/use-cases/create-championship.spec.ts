import { InMemoryChampionshipRepository } from 'test/repositories/in-memory-championship-repository'
import { CreateChampionshipUseCase } from './create-championship'
import { makeChampionship } from 'test/factories/make-championship'
import { ChampionshipAlreadyExistsError } from './errors/championship-already-exists-error'

let inMemoryChampionshipRepository: InMemoryChampionshipRepository
let sut: CreateChampionshipUseCase

describe('Create new championship', () => {
  beforeEach(() => {
    inMemoryChampionshipRepository = new InMemoryChampionshipRepository()
    sut = new CreateChampionshipUseCase(inMemoryChampionshipRepository)
  })

  it('should be able to create a new championship by name', async () => {
    const result = await sut.execute({
      name: 'New Championship',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.championship.name).toEqual('New Championship')
      expect(result.value.championship.status).toEqual('WAITING')
      expect(inMemoryChampionshipRepository.items[0]).toEqual(
        result.value.championship,
      )
    }
  })

  it('should return ChampionshipAlreadyExistsError when trying to create a existing championship', async () => {
    const championshipAlreadyExists = makeChampionship()

    await inMemoryChampionshipRepository.create(championshipAlreadyExists)

    const result = await sut.execute({
      name: 'Campeonato Teste',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ChampionshipAlreadyExistsError)
  })
})
