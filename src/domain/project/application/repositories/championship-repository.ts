import { ChampionshipStatus } from "@prisma/client";
import { Championship } from "../../enterprise/entities/championship";

export abstract class ChampionshipRepository {
  abstract create(championship: Championship): Promise<Championship>;
  abstract findById(id: string): Promise<Championship | null>;
  abstract findByName(championshipName: string): Promise<Championship | null>;
  abstract updateChampionshipName(championship: Championship, newChampionshipName: string): Promise<Championship>;
  abstract updateChampionshipStatus(championship: Championship, status: ChampionshipStatus): Promise<Championship>;
  abstract removeChampionship(championship: Championship): Promise<void>;
}
