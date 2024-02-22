import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface UserProps {
  fullName: string
  password?: string | null
  userName?: string | null
  phone: string
  createdAt: Date
  updatedAt?: Date | null
  isVerified: boolean
  lastPasswordModification?: Date | null
  email?: string | null
  isEmailVerified?: boolean | null
  instagram?: string | null
}

export class User extends Entity<UserProps> {
  get instagram() {
    return this.props.instagram
  }

  get isVerified() {
    return this.props.isVerified
  }

  get isEmailVerified() {
    return this.props.isEmailVerified
  }

  get lastPasswordModification() {
    return this.props.lastPasswordModification
  }

  get email() {
    return this.props.email
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  get password() {
    return this.props.password
  }

  get fullName() {
    return this.props.fullName
  }

  get userName() {
    return this.props.userName
  }

  get phone() {
    return this.props.phone
  }

  static create(
    props: Optional<UserProps, 'createdAt' | 'isVerified'>,
    id?: UniqueEntityID,
  ) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        isVerified: props.isVerified ?? false,
      },
      id,
    )

    return user
  }
}
