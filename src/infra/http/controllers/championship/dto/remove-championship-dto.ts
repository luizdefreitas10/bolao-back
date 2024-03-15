import { ApiProperty } from "@nestjs/swagger";

export class RemoveChampionshipDto {
  @ApiProperty()
  championshipName!: string;
}


