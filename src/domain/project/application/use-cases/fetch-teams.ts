import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { TeamRepository } from '../repositories/team-repository'
import { Team } from '../../enterprise/entities/team'

type FetchTeamsUseCaseResponse = Either<
  null,
  {
    teams: Team[]
  }
>

@Injectable()
export class FetchTeamsUseCase {
  constructor(private teamRepository: TeamRepository) {}

  async execute(): Promise<FetchTeamsUseCaseResponse> {
    const teams = await this.teamRepository.findMany()

    return right({ teams })
  }
}
