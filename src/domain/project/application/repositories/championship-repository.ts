import { Championship } from "../../enterprise/entities/championship";

export abstract class ChampionshipRepository {
  abstract create(championship: Championship): Promise<void>;
  abstract findById(id: string): Promise<Championship | null>;
  abstract updateChampionship(championship: Championship): Promise<void>;
  abstract removeChampionship(championship: Championship): Promise<void>;
}
