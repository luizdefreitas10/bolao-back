import { InMemoryChampionshipRepository } from 'test/repositories/in-memory-championship-repository'
import { UpdateChampionshipNameUseCase } from './update-championship-name'
import { makeChampionship } from 'test/factories/make-championship'
import { ChampionshipDoesNotExistYetError } from './errors/championship-doesnt-exist-yet-error'
import { ChampionshipAlreadyExistsError } from './errors/championship-already-exists-error'

let inMemoryChampionshipRepository: InMemoryChampionshipRepository

let sut: UpdateChampionshipNameUseCase

describe('Update championship name', () => {
  beforeEach(() => {
    inMemoryChampionshipRepository = new InMemoryChampionshipRepository()
    sut = new UpdateChampionshipNameUseCase(inMemoryChampionshipRepository)
  })

  it('should be able to update championship name', async () => {
    const championshipAlreadyExists = makeChampionship()

    inMemoryChampionshipRepository.items.push(championshipAlreadyExists)

    const result = await sut.execute({
      championshipName: 'Campeonato Teste',
      newChampionshipName: 'Novo Campeonato',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.championship.name).toEqual('Novo Campeonato')
    }
  })

  it('should throw ChampionshipDoesNotExistYetError when trying to update a championship that does not exist.', async () => {
    const result = await sut.execute({
      championshipName: 'Campeonato Teste',
      newChampionshipName: 'Novo Campeonato',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ChampionshipDoesNotExistYetError)
  })

  it('should throw ChampionshipAlreadyExistsError when trying to update a championship that already exists.', async () => {
    const championship = makeChampionship()
    const championshipAlreadyExists = makeChampionship({
      name: 'Novo Campeonato',
    })

    inMemoryChampionshipRepository.items.push(
      championship,
      championshipAlreadyExists,
    )

    const result = await sut.execute({
      championshipName: 'Campeonato Teste',
      newChampionshipName: 'Novo Campeonato',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ChampionshipAlreadyExistsError)
  })
})
