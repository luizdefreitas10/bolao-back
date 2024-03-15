import { Round } from "@/domain/project/enterprise/entities/round";
import { ApiProperty } from "@nestjs/swagger";
import { ChampionshipStatus } from "@prisma/client";

export class CreateChampionshipDto {
  @ApiProperty()
  name!: string;

}
