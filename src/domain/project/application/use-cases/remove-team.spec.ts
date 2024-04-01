import { InMemoryTeamRepository } from 'test/repositories/in-memory-team-repository'
import { RemoveTeamUseCase } from './remove-team'
import { Team } from '../../enterprise/entities/team'

let inMemoryTeamRepository: InMemoryTeamRepository
let sut: RemoveTeamUseCase

describe('Remove team', () => {
  beforeEach(() => {
    inMemoryTeamRepository = new InMemoryTeamRepository()

    sut = new RemoveTeamUseCase(inMemoryTeamRepository)
  })

  it('should change status to inactive when removing an active team', async () => {
    const teamName = 'Test Team'

    const activeTeam = Team.create({
      name: teamName,
      createdAt: new Date(),
      status: 'ACTIVE',
    })

    await inMemoryTeamRepository.create(activeTeam)

    const result = await sut.execute({
      teamName,
    })

    // console.log(inMemoryTeamRepository.items[0])

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeNull()
    expect(inMemoryTeamRepository.items[0].status).toBe('INACTIVE')
  })
})
