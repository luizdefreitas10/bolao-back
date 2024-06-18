import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { TeamPropsMatch } from './round'
import { MatchStatus, PredictionType } from '@prisma/client'

export type PlayerProps = {
  name: string
  team: { name: string }
}
export type RoundMatchProps = {
  name: string
}

type MatchProps = {
  scoreAway: number
  scoreHome: number
  teamHome: TeamPropsMatch
  teamAway: TeamPropsMatch
  date: Date
  status: MatchStatus
  round: RoundMatchProps
  roundId: string
  lastPlayerId?: string | null
  lastPlayer?: { name?: string | null } | null
}

export interface PredictionProps {
  predictionHome?: number | null
  predictionAway?: number | null
  userId: UniqueEntityID
  matchId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date | null
  match?: MatchProps | null
  lastPlayer?: PlayerProps | null
  lastPlayerId?: UniqueEntityID | null
  predictionType: PredictionType
}

export class Prediction extends Entity<PredictionProps> {
  get predictionType() {
    return this.props.predictionType
  }

  get match() {
    return this.props.match
  }

  get predictionHome() {
    return this.props.predictionHome ?? null
  }

  set predictionHome(predictionHome: number | null) {
    this.props.predictionHome = predictionHome ?? null
  }

  get predictionAway() {
    return this.props.predictionAway ?? null
  }

  set predictionAway(predictionAway: number | null) {
    this.props.predictionAway = predictionAway ?? null
  }

  get lastPlayer() {
    return this.props.lastPlayer
  }

  get lastPlayerId() {
    return this.props.lastPlayerId ?? null
  }

  set lastPlayerId(lastPlayerId: UniqueEntityID | null) {
    this.props.lastPlayerId = lastPlayerId ?? null
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
