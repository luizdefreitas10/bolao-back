import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UserRepository } from '../repositories/user-repository'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { Round } from '../../enterprise/entities/round'
import { RoundRepository } from '../repositories/round-repository-'

interface CreateRoundUseCaseRequest {
  name: string
  date: Date
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
    date,
  }: CreateRoundUseCaseRequest): Promise<CreateRoundUseCaseResponse> {
    const round = Round.create({
      name,
      date,
      status: 'WAITING',
    })

    const roundCreated = await this.roundRepository.create(round)

    return right({
      round: roundCreated,
    })
  }
}
