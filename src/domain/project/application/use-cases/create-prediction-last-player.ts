import { Either, left, right } from '@/core/either'
import { UnprocessableEntityException, Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PredictionLastPlayer } from '../../enterprise/entities/prediction-last-player'
import { PredictionLastPlayerRepository } from '../repositories/prediction-last-player-repository'

interface CreatePredictionLastPlayerUseCaseRequest {
  userId: string
  roundId: string
  teamId: string
  playerId: string
}

type CreatePredictionLastPlayerUseCaseResponse = Either<
  UnprocessableEntityException,
  {
    prediction: PredictionLastPlayer
  }
>

@Injectable()
export class CreatePredictionLastPlayerUseCase {
  constructor(
    private predictionLastPlayerRepository: PredictionLastPlayerRepository,
  ) {}

  async execute({
    teamId,
    roundId,
    playerId,
    userId,
  }: CreatePredictionLastPlayerUseCaseRequest): Promise<CreatePredictionLastPlayerUseCaseResponse> {
    const existPredictionLastPlayer =
      await this.predictionLastPlayerRepository.findByRoundAndTeamAndUser(
        teamId,
        roundId,
        userId,
      )

    if (existPredictionLastPlayer) {
      const prediction = await this.predictionLastPlayerRepository.update(
        existPredictionLastPlayer.id.toString(),
        playerId,
      )
      if (!prediction) {
        return left(new UnprocessableEntityException())
      }

      return right({ prediction })
    }
    const predictionLastPlayer = PredictionLastPlayer.create({
      userId: new UniqueEntityID(userId),
      playerId: new UniqueEntityID(playerId),
      teamId: new UniqueEntityID(teamId),
      roundId: new UniqueEntityID(roundId),
    })

    const predictionLastPlayerCreated =
      await this.predictionLastPlayerRepository.create(predictionLastPlayer)
    return right({
      prediction: predictionLastPlayerCreated,
    })
  }
}
