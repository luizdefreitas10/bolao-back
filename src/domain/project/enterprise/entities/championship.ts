import { ChampionshipStatus } from '@prisma/client'
import { Round } from './round'
import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/types/optional'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ChampionshipProps {
  name: string
  status: ChampionshipStatus
  createdAt: Date
  updatedAt?: Date | null
  rounds: Round[]
}

export class Championship extends Entity<ChampionshipProps> {
  get name() {
    return this.props.name
  }

  get status() {
    return this.props.status
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get rounds() {
    return this.props.rounds
  }

  static create(
    props: Optional<ChampionshipProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const championship = new Championship(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return championship
  }
}
