import {
  VerificationCode as PrismaVerificationCode,
  Prisma,
} from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { VerificationCode } from '@/domain/project/enterprise/entities/verificationCode'

export class PrismaVerificationCodeMapper {
  static toDomain(raw: PrismaVerificationCode): VerificationCode {
    return VerificationCode.create(
      {
        code: raw.code,
        expiresIn: raw.expireIn,
        userId: new UniqueEntityID(raw.userId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    verificationCode: VerificationCode,
  ): Prisma.VerificationCodeUncheckedCreateInput {
    return {
      id: verificationCode.id.toString(),
      code: verificationCode.code,
      expireIn: verificationCode.expiresIn,
      createdAt: verificationCode.createdAt,
      userId: verificationCode.userId.toString(),
      updatedAt: verificationCode.updatedAt,
    }
  }
}
