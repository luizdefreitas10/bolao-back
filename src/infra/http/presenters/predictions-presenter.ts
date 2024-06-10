import { Prediction } from '@/domain/project/enterprise/entities/prediction'

export class PredictionsPresenter {
  static toHTTP(prediction: Prediction) {
    return {
      predictionAway: prediction.predictionAway,
      predictionHome: prediction.predictionHome,
      match: prediction.match,
      teamHomeName: prediction.match?.teamHome.name,
      teamAwayName: prediction.match?.teamAway.name,
    }
  }
}
