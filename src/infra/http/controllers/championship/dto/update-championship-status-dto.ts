import { ApiProperty } from "@nestjs/swagger";
import { ChampionshipStatus } from "@prisma/client";

export class UpdateChampionshipStatusDto {
  @ApiProperty()
  championshipName!: string;

  @ApiProperty({ enum: ChampionshipStatus, enumName: 'ChampionshipStatusEnum' })
  status!: ChampionshipStatus;
}


