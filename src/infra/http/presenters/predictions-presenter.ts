import { PredictionResponse } from '@/domain/project/application/use-cases/fetch-predictions-by-user'

export class PredictionsPresenter {
  static toHTTP(prediction: PredictionResponse) {
    return {
      matchId: prediction.matchId,
      round: {
        id: prediction.round?.id,
        name: prediction.round?.name,
      },
      match: {
        matchId: prediction.matchId,
        roundName: prediction.round?.name,
        teamHome: prediction.match?.teamHome,
        teamAway: prediction.match?.teamAway,
        scoreHome: prediction.match?.scoreHome,
        scoreAway: prediction.match?.scoreAway,
        date: prediction.match?.date,
        status: prediction.match?.status,
        lastPlayer: prediction.match?.lastPlayer?.name,
      },
      predictionScore: prediction.predictionScore
        ? {
            predictionHome: prediction.predictionScore.predictionHome,
            predictionAway: prediction.predictionScore.predictionAway,
            status: prediction.predictionScore.status,
          }
        : null,
      predictionPlayer: prediction.predictionPlayer
        ? {
            player: prediction.predictionPlayer.player,
            team: prediction.predictionPlayer.team,
            photoUrl: prediction.predictionPlayer.photoUrl,
            status: prediction.predictionPlayer.status,
          }
        : null,
    }
  }
}
