import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface PredictionProps {
  predictionHome: number
  predictionAway: number
  userId: UniqueEntityID
  matchId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date | null
}

export class Prediction extends Entity<PredictionProps> {
  get predictionHome() {
    return this.props.predictionHome
  }

  get predictionAway() {
    return this.props.predictionAway
  }

  get userId() {
    return this.props.userId
  }

  get matchId() {
    return this.props.matchId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<PredictionProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const prediction = new Prediction(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return prediction
  }
}
