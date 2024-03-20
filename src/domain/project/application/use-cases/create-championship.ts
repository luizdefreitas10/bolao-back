import { ChampionshipStatus } from '@prisma/client'
import { Round } from '../../enterprise/entities/round'
import { Either, left, right } from '@/core/either'
import { Championship } from '../../enterprise/entities/championship'
import { ChampionshipAlreadyExistsError } from './errors/championship-already-exists-error'
import { Injectable } from '@nestjs/common'
import { ChampionshipRepository } from '../repositories/championship-repository'

interface CreateChampionshipUseCaseRequest {
  name: string
}

type CreateChampionshipUseCaseResponse = Either<
  ChampionshipAlreadyExistsError,
  {
    championship: Championship
  }
>

@Injectable()
export class CreateChampionshipUseCase {
  constructor(private championshipRepository: ChampionshipRepository) {}

  async execute({
    name,
  }: CreateChampionshipUseCaseRequest): Promise<CreateChampionshipUseCaseResponse> {
    const championshipAlreadyExists =
      await this.championshipRepository.findByName(name)

    if (championshipAlreadyExists) {
      return left(new ChampionshipAlreadyExistsError())
    }

    const championship = Championship.create({
      name,
      status: 'WAITING',
      createdAt: new Date(),
    })

    const createdChampionship =
      await this.championshipRepository.create(championship)

    return right({
      championship: createdChampionship,
    })
  }
}
