import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { PlayerStatus } from '@prisma/client'

export interface PlayerProps {
  name: string
  createdAt: Date
  updatedAt?: Date | null
  teamId: UniqueEntityID
  roundId: UniqueEntityID
  status: PlayerStatus
}

export class Player extends Entity<PlayerProps> {
  get name() {
    return this.props.name
  }

  set name(name) {
    this.props.name = name
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

  get status() {
    return this.props.status
  }

  set status(status: PlayerStatus) {
    this.props.status = status
  }

  static create(
    props: Optional<PlayerProps, 'createdAt' | 'status'>,
    id?: UniqueEntityID,
  ) {
    const player = new Player(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        status: props.status ?? 'ACTIVE',
      },
      id,
    )

    return player
  }
}
