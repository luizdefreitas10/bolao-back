import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { TeamRepository } from '../repositories/team-repository'
import { TeamNotFoundError } from './errors/team-not-found'
import { Team } from '../../enterprise/entities/team'

interface RemoveTeamUseCaseRequest {
  teamName: string
}

type RemoveTeamUseCaseResponse = Either<TeamNotFoundError, null>

@Injectable()
export class RemoveTeamUseCase {
  constructor(private teamRepository: TeamRepository) {}

  async execute({
    teamName,
  }: RemoveTeamUseCaseRequest): Promise<RemoveTeamUseCaseResponse> {
    const team = await this.teamRepository.findByName(teamName)

    if (!team) {
      return left(new TeamNotFoundError())
    }

    await this.teamRepository.remove(team.name)

    return right(null)
  }
}
