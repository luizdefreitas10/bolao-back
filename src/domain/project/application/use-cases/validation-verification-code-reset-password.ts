import { UserRepository } from '@/domain/project/application/repositories/user-repository'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { isBefore } from 'date-fns'
import { VerificationCodeRepository } from '../repositories/verification-code-repository'
import { CodeExpiredError } from './errors/code-expired-error'
import { Encrypter } from '../cryptography/encrypter'
import { CodeNotRegistredError } from './errors/code-not-found-error'
import { HashComparer } from '../cryptography/hash-comparer'
import { VerificationCode } from '../../enterprise/entities/verificationCode'
import { HashGenerator } from '../cryptography/hash-generator'
import { UserModificatedPasswordTodayError } from './errors/user-moficated-password-today-error'

interface VerificationCodeResetPasswordUseCaseRequest {
  code: string
  userId: string
  newPassword: string
}

type VerificationCodeResetPasswordUseCaseResponse = Either<
  CodeExpiredError | CodeNotRegistredError | UserModificatedPasswordTodayError,
  null
>

@Injectable()
export class VerificationCodeResetPasswordUseCase {
  constructor(
    private hashComparer: HashComparer,
    private verificationCodeRepository: VerificationCodeRepository,
    private userRepository: UserRepository,
    private encrypter: Encrypter,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    code,
    userId,
    newPassword,
  }: VerificationCodeResetPasswordUseCaseRequest): Promise<VerificationCodeResetPasswordUseCaseResponse> {
    const verificationCodesByUser =
      await this.verificationCodeRepository.findByUser(userId)

    if (!verificationCodesByUser || verificationCodesByUser.length === 0) {
      return left(new CodeNotRegistredError())
    }
    let verificationCodeValid: VerificationCode | null = null
    for (const item of verificationCodesByUser) {
      const isCodeValid = await this.hashComparer.compare(code, item.code)
      if (isCodeValid) {
        verificationCodeValid = item
      }
    }

    if (!verificationCodeValid) {
      return left(new CodeNotRegistredError())
    }

    if (verificationCodeValid) {
      if (isBefore(verificationCodeValid.expiresIn, new Date())) {
        return left(new CodeExpiredError())
      }
    }

    const existUserResetPasswordToday =
      await this.userRepository.findByUserAndlastPasswordModification(
        userId,
        new Date(),
      )

    if (existUserResetPasswordToday) {
      return left(new UserModificatedPasswordTodayError())
    }

    const hashedPassword = await this.hashGenerator.hash(newPassword)
    await this.userRepository.updatePassword(userId, hashedPassword)

    return right(null)
  }
}
