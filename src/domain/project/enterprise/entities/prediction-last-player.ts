import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { PredictionLastPlayerStatus } from '@prisma/client'

export type TeamPlayerPredictionProps = {
  name: string
}

export type PlayerPredictionProps = {
  name: string
  team: TeamPlayerPredictionProps
}
export interface PredictionLastPlayerProps {
  createdAt: Date
  updatedAt?: Date | null
  teamId: UniqueEntityID
  roundId: UniqueEntityID
  userId: UniqueEntityID
  playerId: UniqueEntityID
  status: PredictionLastPlayerStatus
  player?: PlayerPredictionProps | null
}

export class PredictionLastPlayer extends Entity<PredictionLastPlayerProps> {
  get player() {
    return this.props.player
  }

  get playerId() {
    return this.props.playerId
  }

  set playerId(playerId: UniqueEntityID) {
    this.props.playerId = playerId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get teamId() {
    return this.props.teamId
  }

  get roundId() {
    return this.props.roundId
  }

  get userId() {
    return this.props.userId
  }

  get status() {
    return this.props.status
  }

  set status(status: PredictionLastPlayerStatus) {
    this.props.status = status
  }

  static create(
    props: Optional<PredictionLastPlayerProps, 'createdAt' | 'status'>,
    id?: UniqueEntityID,
  ) {
    const predictionLastPlayer = new PredictionLastPlayer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        status: props.status ?? 'ACTIVE',
      },
      id,
    )

    return predictionLastPlayer
  }
}
