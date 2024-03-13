import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { RoundRepository } from '../repositories/round-repository'
import { RoundNotFoundError } from './errors/round-not-found-error'

interface UpdateRoundNameUseCaseRequest {
  roundId: string
  name: string
}

type UpdateRoundNameUseCaseResponse = Either<RoundNotFoundError, null>

@Injectable()
export class UpdateRoundNameUseCase {
  constructor(private roundRepository: RoundRepository) {}

  async execute({
    roundId,
    name,
  }: UpdateRoundNameUseCaseRequest): Promise<UpdateRoundNameUseCaseResponse> {
    const roundAlreadyExist = await this.roundRepository.findById(roundId)

    if (!roundAlreadyExist) {
      return left(new RoundNotFoundError())
    }

    await this.roundRepository.updateRoundName(roundId, name)

    return right(null)
  }
}
