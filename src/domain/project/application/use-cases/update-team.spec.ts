import { InMemoryTeamRepository } from 'test/repositories/in-memory-team-repository'
import { UpdateTeamUseCase } from './update-team'
import { Team } from '../../enterprise/entities/team'

let inMemoryTeamRepository: InMemoryTeamRepository
let sut: UpdateTeamUseCase

describe('Update team', () => {
  beforeEach(() => {
    inMemoryTeamRepository = new InMemoryTeamRepository()

    sut = new UpdateTeamUseCase(inMemoryTeamRepository)
  })

  it('should be able to edit a team', async () => {
    const originalTeamName = 'Original Team Name'
    const newTeamName = 'New Team Name'

    const team = Team.create({
      name: originalTeamName,
      createdAt: new Date(),
      status: 'ACTIVE',
    })

    await inMemoryTeamRepository.create(team)

    const result = await sut.execute({
      teamName: originalTeamName,
      newTeamName,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.team.name).toEqual(newTeamName)
    }
  })
})
