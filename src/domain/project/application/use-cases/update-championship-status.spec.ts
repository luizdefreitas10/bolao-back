import { InMemoryChampionshipRepository } from 'test/repositories/in-memory-championship-repository'
import { makeChampionship } from 'test/factories/make-championship'
import { UpdateChampionshipStatusUseCase } from './update-championship-status'
import { ChampionshipDoesNotExistYetError } from './errors/championship-doesnt-exist-yet-error'

let inMemoryChampionshipRepository: InMemoryChampionshipRepository

let sut: UpdateChampionshipStatusUseCase

describe('Update championship status', () => {
  beforeEach(() => {
    inMemoryChampionshipRepository = new InMemoryChampionshipRepository()
    sut = new UpdateChampionshipStatusUseCase(inMemoryChampionshipRepository)
  })

  it('should be able to update championship status', async () => {
    const championshipAlreadyExists = makeChampionship()

    inMemoryChampionshipRepository.items.push(championshipAlreadyExists)

    const result = await sut.execute({
      championshipName: 'Campeonato Teste',
      status: 'IN_PROGRESS',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.championship.status).toEqual('IN_PROGRESS')
    }
  })

  it('should throw ChampionshipDoesNotExistYetError when trying to update a championship that does not exist.', async () => {
    const result = await sut.execute({
      championshipName: 'Campeonato Teste',
      status: 'IN_PROGRESS',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ChampionshipDoesNotExistYetError)
  })
})
