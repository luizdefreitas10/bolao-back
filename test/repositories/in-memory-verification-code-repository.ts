import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvents } from '@/core/events/domain-events'
import { VerificationCodeRepository } from '@/domain/project/application/repositories/verification-code-repository'
import { VerificationCode } from '@/domain/project/enterprise/entities/verificationCode'

export class InMemoryVerificationCodeRepository
  implements VerificationCodeRepository
{
  public items: VerificationCode[] = []

  async findByUser(userId: string): Promise<VerificationCode[]> {
    const verificationCode = this.items.filter(
      (item) => item.userId === new UniqueEntityID(userId),
    )

    return verificationCode
  }

  async findByUserAndCode(
    userId: string,
    code: string,
  ): Promise<VerificationCode | null> {
    const verificationCode = this.items.filter(
      (item) =>
        item.userId === new UniqueEntityID(userId) && item.code === code,
    )
    if (!verificationCode) {
      return null
    }

    return verificationCode[0]
  }

  async findByUserAndPermissionTimeResend(
    userId: string,
    time: Date,
  ): Promise<VerificationCode | null> {
    const verificationCode = this.items.filter(
      (item) =>
        item.userId === new UniqueEntityID(userId) && item.createdAt >= time,
    )
    if (!verificationCode) {
      return null
    }

    return verificationCode[0]
  }

  async create(verificationCode: VerificationCode) {
    this.items.push(verificationCode)

    DomainEvents.dispatchEventsForAggregate(verificationCode.id)
    return verificationCode
  }
}
