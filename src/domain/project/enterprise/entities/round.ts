import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { RoundStatus } from '@prisma/client'
import { Match } from './match'

export type TeamPropsMatch = {
  name: string
  logoUrl?: string | null
}

type MatchProps = {
  scoreAway: number
  scoreHome: number
  teamHome: TeamPropsMatch
  teamAway: TeamPropsMatch
  date: Date
  status: RoundStatus
}
export interface RoundProps {
  status: RoundStatus
  name: string
  createdAt: Date
  updatedAt?: Date | null
  championshipId: UniqueEntityID
  matchs?: Match[] | MatchProps[] | null
}

export class Round extends Entity<RoundProps> {
  set championshipId(championshipId: UniqueEntityID) {
    this.props.championshipId = championshipId
  }

  get championshipId() {
    return this.props.championshipId
  }

  set name(name: string) {
    this.props.name = name
  }

  get name() {
    return this.props.name
  }

  get matchs() {
    return this.props.matchs
  }

  get status() {
    return this.props.status
  }

  set status(status: RoundStatus) {
    this.props.status = status
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.createdAt
  }

  static create(props: Optional<RoundProps, 'createdAt'>, id?: UniqueEntityID) {
    const round = new Round(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return round
  }
}
