import { Either, left, right } from "@/core/either"
import { Championship } from "../../enterprise/entities/championship"
import { Injectable } from "@nestjs/common"
import { ChampionshipRepository } from "../repositories/championship-repository"
import { ChampionshipDoesNotExistYetError } from "./errors/championship-doesnt-exist-yet-error"
import { ChampionshipAlreadyExistsError } from "./errors/championship-already-exists-error"

interface UpdateChampionshipNameUseCaseRequest {
  championshipName: string
  newChampionshipName: string
}

type UpdateChampionshipNameUseCaseResponse = Either<
  ChampionshipDoesNotExistYetError | ChampionshipAlreadyExistsError,
  {
    championship: Championship
  }
>

@Injectable()
export class UpdateChampionshipNameUseCase {
  constructor(private championshipRepository: ChampionshipRepository) {}

  async execute({
    championshipName,
    newChampionshipName,
  }: UpdateChampionshipNameUseCaseRequest): Promise<UpdateChampionshipNameUseCaseResponse> {

    const championship = await this.championshipRepository.findByName(championshipName)

    if (!championship) {
      return left(new ChampionshipDoesNotExistYetError())
    }
    
    const newChampionshipNameAlreadyExists = await this.championshipRepository.findByName(newChampionshipName)

    if (newChampionshipNameAlreadyExists) {
      return left(new ChampionshipAlreadyExistsError())
    }

    const updatedChampionship = await this.championshipRepository.updateChampionshipName(championship, newChampionshipName)

    return right({
      championship: updatedChampionship,
    })
  }
}