import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { RoundRepository } from '../repositories/round-repository'
import { RoundStatus } from '@prisma/client'
import { RoundNotFoundError } from './errors/round-not-found-error'

interface UpdateRoundStatusUseCaseRequest {
  roundId: string
  status: RoundStatus
}

type UpdateRoundStatusUseCaseResponse = Either<RoundNotFoundError, null>

@Injectable()
export class UpdateRoundStatusUseCase {
  constructor(private roundRepository: RoundRepository) {}

  async execute({
    roundId,
    status,
  }: UpdateRoundStatusUseCaseRequest): Promise<UpdateRoundStatusUseCaseResponse> {
    const roundAlreadyExist = await this.roundRepository.findById(roundId)

    if (!roundAlreadyExist) {
      return left(new RoundNotFoundError())
    }

    await this.roundRepository.updateRoundStatus(roundId, status)

    return right(null)
  }
}
