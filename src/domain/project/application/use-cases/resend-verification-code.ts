import { UserRepository } from '@/domain/project/application/repositories/user-repository'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { addMinutes, subMinutes } from 'date-fns'
import { VerificationCodeRepository } from '../repositories/verification-code-repository'
import { VerificationCode } from '../../enterprise/entities/verificationCode'
import { HashGenerator } from '../cryptography/hash-generator'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { FileResendNotAllowedInTimeError } from './errors/code-limit-error'
import { UserAlreadyVerifiedError } from './errors/user-already-verified-error'

interface ResendVerificationCodeUseCaseRequest {
  userId: string
}

type ResendVerificationCodeUseCaseResponse = Either<
  | FileResendNotAllowedInTimeError
  | WrongCredentialsError
  | UserAlreadyVerifiedError,
  {
    code: string
    phone: string
  }
>

@Injectable()
export class ResendVerificationCodeUseCase {
  constructor(
    private hashGenerator: HashGenerator,
    private verificationCodeRepository: VerificationCodeRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    userId,
  }: ResendVerificationCodeUseCaseRequest): Promise<ResendVerificationCodeUseCaseResponse> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      return left(new WrongCredentialsError())
    }
    // console.log(user)
    // if (user.isVerified) {
    //   return left(new UserAlreadyVerifiedError())
    // }

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
      code: hashedVerificationCode, // Gera código de quatro números aleatórios
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: new UniqueEntityID(userId),
      expiresIn: addMinutes(new Date(), 5),
    })

    await this.verificationCodeRepository.create(verificationCode)
    return right({ code: randomCode, phone: user.phone })
  }
}
