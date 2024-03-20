import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Round } from '../../enterprise/entities/round'
import { RoundRepository } from '../repositories/round-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ChampionshipRepository } from '../repositories/championship-repository'
import { ChampionshipDoesNotExistYetError } from './errors/championship-doesnt-exist-yet-error'

interface CreateRoundUseCaseRequest {
  name: string
  championshipId: string
}

type CreateRoundUseCaseResponse = Either<
  ChampionshipDoesNotExistYetError,
  {
    round: Round
  }
>

@Injectable()
export class CreateRoundUseCase {
  constructor(
    private roundRepository: RoundRepository,
    private championshipRepository: ChampionshipRepository,
  ) {}

  async execute({
    name,
    championshipId,
  }: CreateRoundUseCaseRequest): Promise<CreateRoundUseCaseResponse> {
    const isAlreadyExistChampionship =
      await this.championshipRepository.findById(championshipId)

    if (!isAlreadyExistChampionship) {
      return left(new ChampionshipDoesNotExistYetError())
    }

    const round = Round.create({
      name,
      status: 'WAITING',
      championshipId: new UniqueEntityID(championshipId),
    })

    const roundCreated = await this.roundRepository.create(round)

    return right({
      round: roundCreated,
    })
  }
}
