import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

type MatchStatus = 'WAITING' | 'IN_PROGRESS' | 'DONE' | 'CANCELED'

export interface MatchProps {
  scoreHome: number
  scoreAway: number
  teamIdHome: UniqueEntityID
  teamIdAway: UniqueEntityID
  roundId: UniqueEntityID
  status: MatchStatus
  date: Date
  createdAt: Date
  updatedAt?: Date | null
}

export class Match extends Entity<MatchProps> {
  get status() {
    return this.props.status
  }

  get date() {
    return this.props.date
  }

  get scoreHome() {
    return this.props.scoreHome
  }

  get scoreAway() {
    return this.props.scoreAway
  }

  get teamIdHome() {
    return this.props.teamIdHome
  }

  get teamIdAway() {
    return this.props.teamIdAway
  }

  get roundId() {
    return this.props.roundId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<MatchProps, 'createdAt' | 'status'>,
    id?: UniqueEntityID,
  ) {
    const match = new Match(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        status: props.status ?? 'WAITING',
      },
      id,
    )

    return match
  }
}
