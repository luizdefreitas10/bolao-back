import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  VerificationCode,
  VerificationCodeProps,
} from '@/domain/project/enterprise/entities/verificationCode'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { addMinutes } from 'date-fns'
import { PrismaVerificationCodeMapper } from '@/infra/database/prisma/mappers/prisma-verification-code-mapper'

export function makeVerificationCode(
  override: Partial<VerificationCodeProps> = {},
  id?: UniqueEntityID,
) {
  const verificationCode = VerificationCode.create(
    {
      code: Math.floor(1000 + Math.random() * 9000).toString(), // Gera código de quatro números aleatórios
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: new UniqueEntityID(),
      expiresIn: addMinutes(new Date(), 5),
      ...override,
    },
    id,
  )

  return verificationCode
}

@Injectable()
export class VerificationCodeFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaVerificationCode(
    data: Partial<VerificationCodeProps> = {},
  ): Promise<VerificationCode> {
    const verificationCode = makeVerificationCode(data)

    await this.prisma.verificationCode.create({
      data: PrismaVerificationCodeMapper.toPrisma(verificationCode),
    })

    return verificationCode
  }
}
