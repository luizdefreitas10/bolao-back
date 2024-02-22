import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { User } from '../../enterprise/entities/user'
import { UserRepository } from '../repositories/user-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { VerificationCode } from '../../enterprise/entities/verificationCode'
import { addMinutes } from 'date-fns'
import { VerificationCodeRepository } from '../repositories/verification-code-repository'
import { UserPhoneAlreadyExistsError } from './errors/user-phone-already-exists-error'
import { FormatUsernameNotValidError } from './errors/format-username-not-valid'

interface RegisterUserUseCaseRequest {
  fullName: string
  userName: string
  phone: string
  password: string
  email?: string
}

type RegisterUserUseCaseResponse = Either<
  | UserAlreadyExistsError
  | UserPhoneAlreadyExistsError
  | FormatUsernameNotValidError,
  {
    verificationCode: string
    user: User
  }
>

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private usersRepository: UserRepository,
    private hashGenerator: HashGenerator,
    private verificationCodeRepository: VerificationCodeRepository,
  ) {}

  async execute({
    fullName,
    userName,
    phone,
    password,
    email,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userNameRegex = /^[a-z0-9_.]+$/
    if (!userNameRegex.test(userName)) {
      return left(new FormatUsernameNotValidError())
    }
    const userWithSameUser = await this.usersRepository.findByUsername(userName)

    if (userWithSameUser) {
      return left(new UserAlreadyExistsError(userName))
    }
    const userWithSamePhone = await this.usersRepository.findByPhone(phone)

    if (userWithSamePhone) {
      return left(new UserPhoneAlreadyExistsError(phone))
    }

    const hashedPassword = await this.hashGenerator.hash(password)
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString()
    const hashedVerificationCode = await this.hashGenerator.hash(randomCode)

    const user = User.create({
      fullName,
      userName,
      phone,
      password: hashedPassword,
      email,
    })

    await this.usersRepository.create(user)

    const verificationCode = VerificationCode.create({
      code: hashedVerificationCode, // Gera código de quatro números aleatórios
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.id,
      expiresIn: addMinutes(new Date(), 5),
    })

    await this.verificationCodeRepository.create(verificationCode)

    return right({
      user,
      verificationCode: randomCode,
    })
  }
}
