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
import { UserAlreadyVerifiedError } from './errors/user-already-verified-error'

interface VerificationCodeUseCaseRequest {
  code: string
  userId: string
}

type VerificationCodeUseCaseResponse = Either<
  CodeExpiredError | CodeNotRegistredError | UserAlreadyVerifiedError,
  {
    accessToken: string
  }
>

@Injectable()
export class VerificationCodeUseCase {
  constructor(
    private hashComparer: HashComparer,
    private verificationCodeRepository: VerificationCodeRepository,
    private userRepository: UserRepository,
    private encrypter: Encrypter,
  ) {}

  async execute({
    code,
    userId,
  }: VerificationCodeUseCaseRequest): Promise<VerificationCodeUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (user && user.isVerified) {
      return left(new UserAlreadyVerifiedError())
    }

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

    const newUser = await this.userRepository.updateVerified(userId)

    const accessToken = await this.encrypter.encrypt({
      sub: newUser.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
