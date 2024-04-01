import { InMemoryChampionshipRepository } from 'test/repositories/in-memory-championship-repository'
import { RemoveChampionshipUseCase } from './remove-championship'
import { makeChampionship } from 'test/factories/make-championship'
import { ChampionshipDoesNotExistYetError } from './errors/championship-doesnt-exist-yet-error'

let inMemoryChampionshipRepository: InMemoryChampionshipRepository
let sut: RemoveChampionshipUseCase

describe('Remove Championship', () => {
  beforeEach(() => {
    inMemoryChampionshipRepository = new InMemoryChampionshipRepository()
    sut = new RemoveChampionshipUseCase(inMemoryChampionshipRepository)
  })

  it('should be able to remove a existing championship by name', async () => {
    const championshipAlreadyExists = makeChampionship()

    inMemoryChampionshipRepository.items.push(championshipAlreadyExists)

    const result = await sut.execute({
      championshipName: 'Campeonato Teste',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeNull()
    expect(inMemoryChampionshipRepository.items[0].status).toEqual('INACTIVE')
  })

  it('should throw ChampionshipDoesNotExistYetError when trying to remove a championship that does not exist.', async () => {
    const result = await sut.execute({
      championshipName: 'Campeonato Teste',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ChampionshipDoesNotExistYetError)
  })
})
