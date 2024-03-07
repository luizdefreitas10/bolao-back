import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { Round } from '../../enterprise/entities/round'
import { RoundRepository } from '../repositories/round-repository-'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CreateRoundUseCaseRequest {
  name: string
  championshipId: string
}

type CreateRoundUseCaseResponse = Either<
  WrongCredentialsError,
  {
    round: Round
  }
>

@Injectable()
export class CreateRoundUseCase {
  constructor(private roundRepository: RoundRepository) {}

  async execute({
    name,
    championshipId,
  }: CreateRoundUseCaseRequest): Promise<CreateRoundUseCaseResponse> {
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
