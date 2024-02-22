import { UserRepository } from '@/domain/project/application/repositories/user-repository'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { addMinutes, subMinutes } from 'date-fns'
import { VerificationCodeRepository } from '../repositories/verification-code-repository'
import { VerificationCode } from '../../enterprise/entities/verificationCode'
import { HashGenerator } from '../cryptography/hash-generator'
import { FileResendNotAllowedInTimeError } from './errors/code-limit-error'
import { UserNotFoundError } from './errors/user-not-found-error'
import { UserModificatedPasswordTodayError } from './errors/user-moficated-password-today-error'

interface SendVerificationCodeResetPasswordUseCaseRequest {
  phone: string
}

type SendVerificationCodeResetPasswordUseCaseResponse = Either<
  | FileResendNotAllowedInTimeError
  | UserNotFoundError
  | UserModificatedPasswordTodayError,
  {
    code: string
    userId: string
  }
>

@Injectable()
export class SendVerificationCodeResetPasswordUseCase {
  constructor(
    private hashGenerator: HashGenerator,
    private verificationCodeRepository: VerificationCodeRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    phone,
  }: SendVerificationCodeResetPasswordUseCaseRequest): Promise<SendVerificationCodeResetPasswordUseCaseResponse> {
    const user = await this.userRepository.findByPhone(phone)
    if (!user) {
      return left(new UserNotFoundError())
    }
    const existUserResetPasswordToday =
      await this.userRepository.findByUserAndlastPasswordModification(
        user.id.toString(),
        new Date(),
      )

    if (existUserResetPasswordToday) {
      return left(new UserModificatedPasswordTodayError())
    }

    const existVerificationCode =
      await this.verificationCodeRepository.findByUserAndPermissionTimeResend(
        user.id.toString(),
        subMinutes(new Date(), 1),
      )
    if (existVerificationCode) {
      return left(new FileResendNotAllowedInTimeError())
    }

    const randomCode = Math.floor(1000 + Math.random() * 9000).toString()
    const hashedVerificationCode = await this.hashGenerator.hash(randomCode)
    const verificationCode = VerificationCode.create({
      code: hashedVerificationCode,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.id,
      expiresIn: addMinutes(new Date(), 5),
    })

    await this.verificationCodeRepository.create(verificationCode)
    return right({ code: randomCode, userId: user.id.toString() })
  }
}
