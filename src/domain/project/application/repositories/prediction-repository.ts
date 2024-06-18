import { PredictionType } from '@prisma/client'
import { Prediction } from './../../enterprise/entities/prediction'

export abstract class PredictionRepository {
  abstract create(prediction: Prediction): Promise<Prediction>
  abstract findById(id: string): Promise<Prediction | null>
  abstract findByUserAndMatch(
    userId: string,
    matchId: string,
  ): Promise<Prediction | null>

  abstract updatePlayer(
    predicitonId: string,
    playerId: string,
  ): Promise<Prediction | null>

  abstract updateScore(
    predicitonId: string,
    predictionHome: number,
    predictionAway: number,
  ): Promise<Prediction | null>

  abstract findByUserAndMatchAndType(
    userId: string,
    matchId: string,
    type: PredictionType,
  ): Promise<Prediction | null>

  abstract findByUser(userId: string): Promise<Prediction[]>
}
