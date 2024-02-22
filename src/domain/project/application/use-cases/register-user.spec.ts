import { RegisterUserUseCase } from './register-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryVerificationCodeRepository } from 'test/repositories/in-memory-verification-code-repository'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let inMemoryVerificationCodeRepository: InMemoryVerificationCodeRepository
let sut: RegisterUserUseCase

describe('Register user', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    inMemoryVerificationCodeRepository =
      new InMemoryVerificationCodeRepository()

    sut = new RegisterUserUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      inMemoryVerificationCodeRepository,
    )
  })

  it('should be able to register a new user', async () => {
    const result = await sut.execute({
      fullName: 'John Doe',
      userName: 'john',
      phone: '81996778865',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    // expect(result.value).toEqual({
    //   user: inMemoryUsersRepository.items[0],
    // })
  })

  it('should hash user password upon registration', async () => {
    const result = await sut.execute({
      fullName: 'John Doe',
      userName: 'john',
      phone: '81996778865',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword)
  })
})
