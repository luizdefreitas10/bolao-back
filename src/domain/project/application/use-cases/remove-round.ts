import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { RoundRepository } from '../repositories/round-repository'
import { RoundNotFoundError } from './errors/round-not-found-error'
import { RoundForbiddenRemoveError } from './errors/round-forbidden-remove'

interface RemoveRoundUseCaseRequest {
  roundId: string
}

type RemoveRoundUseCaseResponse = Either<
  RoundNotFoundError | RoundForbiddenRemoveError,
  null
>

@Injectable()
export class RemoveRoundUseCase {
  constructor(private roundRepository: RoundRepository) {}

  async execute({
    roundId,
  }: RemoveRoundUseCaseRequest): Promise<RemoveRoundUseCaseResponse> {
    const round = await this.roundRepository.findById(roundId)

    if (!round) {
      return left(new RoundNotFoundError())
    }
    if (round.status !== 'WAITING') {
      return left(new RoundForbiddenRemoveError())
    }

    await this.roundRepository.updateRoundStatus(roundId, 'INACTIVE')

    return right(null)
  }
}
