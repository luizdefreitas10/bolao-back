import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Team } from '../../enterprise/entities/team'
import { TeamRepository } from '../repositories/team-repository'
import { ExistTeamError } from './errors/exist-team-error'

interface CreateTeamUseCaseRequest {
  name: string
}

type CreateTeamUseCaseResponse = Either<
  ExistTeamError,
  {
    team: Team
  }
>

@Injectable()
export class CreateTeamUseCase {
  constructor(private teamRepository: TeamRepository) {}

  async execute({
    name,
  }: CreateTeamUseCaseRequest): Promise<CreateTeamUseCaseResponse> {
    const existTeam = await this.teamRepository.findByName(name)

    if (existTeam) {
      return left(new ExistTeamError())
    }
    const team = Team.create({
      name,
      status: 'ACTIVE',
    })

    const teamCreated = await this.teamRepository.create(team)

    return right({
      team: teamCreated,
    })
  }
}
