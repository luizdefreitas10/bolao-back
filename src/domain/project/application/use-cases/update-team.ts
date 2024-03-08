import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { TeamRepository } from '../repositories/team-repository'
import { TeamNotFoundError } from './errors/team-not-found'
import { Team } from '../../enterprise/entities/team'

interface UpdateTeamUseCaseRequest {
  teamName: string
  newTeamName: string
}

type UpdateTeamUseCaseResponse = Either<
  TeamNotFoundError,
  {
    team: Team
  }
>

@Injectable()
export class UpdateTeamUseCase {
  constructor(private teamRepository: TeamRepository) {}

  async execute({
    teamName,
    newTeamName,
  }: UpdateTeamUseCaseRequest): Promise<UpdateTeamUseCaseResponse> {
    const team = await this.teamRepository.update(teamName, newTeamName)

    if (!team) {
      return left(new TeamNotFoundError())
    }

    return right({
      team,
    })
  }
}
