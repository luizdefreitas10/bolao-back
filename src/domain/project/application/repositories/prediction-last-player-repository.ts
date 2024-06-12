import { PredictionLastPlayer } from '../../enterprise/entities/prediction-last-player'

export abstract class PredictionLastPlayerRepository {
  abstract create(
    prediction: PredictionLastPlayer,
  ): Promise<PredictionLastPlayer>

  abstract update(
    predictionId: string,
    playerId: string,
  ): Promise<PredictionLastPlayer | null>

  abstract findById(id: string): Promise<PredictionLastPlayer | null>
  abstract remove(predictionId: string): Promise<void>
  abstract findByUser(userId: string): Promise<PredictionLastPlayer[]>
  abstract findByRoundAndTeamAndUser(
    roundId: string,
    teamId: string,
    userId: string,
  ): Promise<PredictionLastPlayer | null>
}
