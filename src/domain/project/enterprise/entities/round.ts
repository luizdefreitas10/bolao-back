import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { RoundStatus } from '@prisma/client'

export interface RoundProps {
  date: Date
  status: RoundStatus
  name: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Round extends Entity<RoundProps> {
  get name() {
    return this.props.name
  }

  get date() {
    return this.props.date
  }

  get status() {
    return this.props.status
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
