import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { TeamStatus } from '@prisma/client'

export interface TeamProps {
  name: string
  logoUrl?: string | null
  createdAt: Date
  updatedAt?: Date | null
  status: TeamStatus
}

export class Team extends Entity<TeamProps> {
  get name() {
    return this.props.name
  }

  set name(name) {
    this.props.name = name
  }

  get logoUrl() {
    return this.props.logoUrl
  }

  set logoUrl(logoUrl) {
    this.props.logoUrl = logoUrl
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get status() {
    return this.props.status
  }

  set status(status) {
    this.props.status = status
  }

  static create(props: Optional<TeamProps, 'createdAt'>, id?: UniqueEntityID) {
    const team = new Team(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return team
  }
}
