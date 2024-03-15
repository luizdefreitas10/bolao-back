import { ApiProperty } from "@nestjs/swagger";

export class UpdateChampionshipNameDto {
  @ApiProperty()
  championshipName!: string;

  @ApiProperty()
  newChampionshipName!: string;
}


