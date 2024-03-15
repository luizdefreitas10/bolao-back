import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Championship } from "@/domain/project/enterprise/entities/championship";
import { Prisma, Championship as PrismaChampionship } from "@prisma/client";

export class PrismaChampionshipMapper {
  static toDomain(rawChampionship: PrismaChampionship): Championship {
    return Championship.create(
      {
        name: rawChampionship.name,
        status: rawChampionship.status,
        createdAt: rawChampionship.createdAt,
        updatedAt: rawChampionship.updatedAt,
      },
      new UniqueEntityID(rawChampionship.id)
    );
  }

  static toPrisma(
    championship: Championship
  ): Prisma.ChampionshipUncheckedCreateInput {
    return {
      id: championship.id.toString(),
      name: championship.name,
      status: championship.status,
      createdAt: championship.createdAt,
      updatedAt: championship.updatedAt,
    };
  }
}
