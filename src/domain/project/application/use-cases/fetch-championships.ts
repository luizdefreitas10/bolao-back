import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ChampionshipRepository } from '../repositories/championship-repository'
import { Championship } from '../../enterprise/entities/championship'

type FetchChampionshipsUseCaseResponse = Either<
  null,
  {
    championships: Championship[]
  }
>

@Injectable()
export class FetchChampionshipsUseCase {
  constructor(private championshipRepository: ChampionshipRepository) {}

  async execute(): Promise<FetchChampionshipsUseCaseResponse> {
    const championships = await this.championshipRepository.findMany()

    return right({ championships })
  }
}
