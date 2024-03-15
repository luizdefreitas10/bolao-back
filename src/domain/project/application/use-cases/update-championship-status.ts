import { Either, left, right } from "@/core/either"
import { Championship } from "../../enterprise/entities/championship"
import { Injectable } from "@nestjs/common"
import { ChampionshipRepository } from "../repositories/championship-repository"
import { ChampionshipDoesNotExistYetError } from "./errors/championship-doesnt-exist-yet-error"
import { ChampionshipStatus } from "@prisma/client"

interface UpdateChampionshipStatusUseCaseRequest {
  championshipName: string
  status: ChampionshipStatus
}

type UpdateChampionshipStatusUseCaseResponse = Either<
  ChampionshipDoesNotExistYetError,
  {
    championship: Championship
  }
>

@Injectable()
export class UpdateChampionshipStatusUseCase {
  constructor(private championshipRepository: ChampionshipRepository) {}

  async execute({
    championshipName,
    status,
  }: UpdateChampionshipStatusUseCaseRequest): Promise<UpdateChampionshipStatusUseCaseResponse> {

    const championship = await this.championshipRepository.findByName(championshipName)

    if (!championship) {
      return left(new ChampionshipDoesNotExistYetError())
    }

    const updatedChampionship = await this.championshipRepository.updateChampionshipStatus(championship, status)

    return right({
      championship: updatedChampionship,
    })
  }
}