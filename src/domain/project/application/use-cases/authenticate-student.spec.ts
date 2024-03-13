
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { AuthenticateUserUseCase } from './authenticate-user'
import { makeUser, signUserAsVerified } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

let inMemoryUserRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter

let sut: AuthenticateUserUseCase

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()

    sut = new AuthenticateUserUseCase(
      inMemoryUserRepository,
      fakeHasher,
      encrypter,
    )
  })

  it('should be able to authenticate a verified user', async () => {
    const user = makeUser({
      userName: 'johndoe',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryUserRepository.items.push(user)

    signUserAsVerified(user)
    // await inMemoryUserRepository.updateVerified(user.id.toString())

    const result = await sut.execute({
      userName: 'johndoe',
      password: '123456',
    })

    // console.log(result.value)

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
