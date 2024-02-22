import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface VerificationCodeProps {
  code: string
  expiresIn: Date
  userId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date | null
}

export class VerificationCode extends Entity<VerificationCodeProps> {
  get code() {
    return this.props.code
  }

  get expiresIn() {
    return this.props.expiresIn
  }

  get userId() {
    return this.props.userId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: VerificationCodeProps, id?: UniqueEntityID) {
    const verificationCode = new VerificationCode(props, id)

    return verificationCode
  }
}
