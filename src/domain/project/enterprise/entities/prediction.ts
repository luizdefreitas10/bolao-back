import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { TeamPropsMatch } from './round'
import { MatchStatus } from '@prisma/client'

type MatchProps = {
  scoreAway: number
  scoreHome: number
  teamHome: TeamPropsMatch
  teamAway: TeamPropsMatch
  date: Date
  status: MatchStatus
}

export interface PredictionProps {
  predictionHome: number
  predictionAway: number
  userId: UniqueEntityID
  matchId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date | null
  match?: MatchProps | null
}

export class Prediction extends Entity<PredictionProps> {
  get match() {
    return this.props.match
  }

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
