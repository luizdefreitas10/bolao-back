import { makeTeam } from 'test/factories/make-team'
import { CreateTeamUseCase } from './create-team'
import { InMemoryTeamRepository } from 'test/repositories/in-memory-team-repository'

let inMemoryTeamRepository: InMemoryTeamRepository
let sut: CreateTeamUseCase

describe('Create new team', () => {
  beforeEach(() => {
    inMemoryTeamRepository = new InMemoryTeamRepository()
    sut = new CreateTeamUseCase(inMemoryTeamRepository)
  })

  it('should be able to register a new team', async () => {
    const result = await sut.execute({
      name: 'Time Teste',
    })

    expect(result.isRight()).toBe(true)
  })
  it('should not be able to register a new team with an already existing name', async () => {
    const teamName = 'Time Teste'
    const team = makeTeam({ name: teamName })
    await inMemoryTeamRepository.create(team)

    const resultNewTeam = await sut.execute({
      name: teamName,
    })
    expect(resultNewTeam.isLeft()).toBe(true)
  })
})
