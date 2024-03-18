import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { MatchStatus } from '@prisma/client'

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

  set status(status: MatchStatus) {
    this.props.status = status
  }

  set date(dateMatch: Date) {
    this.props.date = dateMatch
  }

  get date() {
    return this.props.date
  }

  set scoreHome(score: number) {
    this.props.scoreHome = score
  }

  get scoreHome() {
    return this.props.scoreHome
  }

  set scoreAway(score: number) {
    this.props.scoreAway = score
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
