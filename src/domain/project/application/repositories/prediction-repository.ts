import { Prediction } from './../../enterprise/entities/prediction'

export abstract class PredictionRepository {
  abstract create(prediction: Prediction): Promise<Prediction>
  abstract findById(id: string): Promise<Prediction | null>
}
