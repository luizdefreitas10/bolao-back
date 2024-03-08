import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface TeamProps {
  name: string
  createdAt: Date
  updatedAt?: Date | null
  status: string
}

export class Team extends Entity<TeamProps> {
  get name() {
    return this.props.name
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
