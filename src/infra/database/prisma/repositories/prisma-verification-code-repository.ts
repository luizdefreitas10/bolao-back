import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { VerificationCode } from '@/domain/project/enterprise/entities/verificationCode'
import { PrismaVerificationCodeMapper } from '../mappers/prisma-verification-code-mapper'
import { VerificationCodeRepository } from '@/domain/project/application/repositories/verification-code-repository'

@Injectable()
export class PrismaVerificationCodeRepository
  implements VerificationCodeRepository
{
  constructor(private prisma: PrismaService) {}
  async findByUser(userId: string): Promise<VerificationCode[]> {
    const verificationCode = await this.prisma.verificationCode.findMany({
      where: {
        userId,
      },
    })

    return verificationCode.map(PrismaVerificationCodeMapper.toDomain)
  }

  async findByUserAndCode(
    userId: string,
    code: string,
  ): Promise<VerificationCode | null> {
    const verificationCode = await this.prisma.verificationCode.findFirst({
      where: {
        userId,
        code,
      },
    })

    if (!verificationCode) return null

    return PrismaVerificationCodeMapper.toDomain(verificationCode)
  }

  async findByUserAndPermissionTimeResend(
    userId: string,
    time: Date,
  ): Promise<VerificationCode | null> {
    const verificationCode = await this.prisma.verificationCode.findFirst({
      where: {
        userId,
        createdAt: {
          gte: time,
        },
      },
    })

    if (!verificationCode) return null

    return PrismaVerificationCodeMapper.toDomain(verificationCode)
  }

  async create(verificationCode: VerificationCode): Promise<VerificationCode> {
    const data = PrismaVerificationCodeMapper.toPrisma(verificationCode)

    const newVerificationCode = await this.prisma.verificationCode.create({
      data,
    })
    return PrismaVerificationCodeMapper.toDomain(newVerificationCode)
  }
}
