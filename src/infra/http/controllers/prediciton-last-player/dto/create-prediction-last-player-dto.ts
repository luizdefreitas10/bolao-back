import { ApiProperty } from '@nestjs/swagger'

export class CreatePredictionLastPlayerDto {
  @ApiProperty()
  playerId!: string

  @ApiProperty()
  roundId!: string

  @ApiProperty()
  teamId!: string
}
