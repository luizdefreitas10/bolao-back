import { PredictionResponse } from '@/domain/project/application/use-cases/fetch-predictions-by-user'

export class PredictionsPresenter {
  static toHTTP(prediction: PredictionResponse) {
    console.log(prediction.predictionPlayer?.status)
    return {
      round: {
        id: prediction.round?.id,
        name: prediction.round?.name,
      },
      match: {
        teamHome: prediction.match?.teamHome,
        teamAway: prediction.match?.teamAway,
        scoreHome: prediction.match?.scoreHome,
        scoreAway: prediction.match?.scoreHome,
        date: prediction.match?.date,
        status: prediction.match?.status,
        lastPlayer: prediction.match?.lastPlayer?.name,
      },
      predictionScore: {
        predictionHome: prediction.predictionScore?.predictionHome,
        predictionAway: prediction.predictionScore?.predictionAway,
        status: prediction.predictionScore?.status,
      },
      predictionPlayer: {
        player: prediction.predictionPlayer?.player,
        team: prediction.predictionPlayer?.team,
        status: prediction.predictionPlayer?.status,
      },
    }
  }
}
