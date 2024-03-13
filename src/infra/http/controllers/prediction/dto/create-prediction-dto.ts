import { ApiProperty } from '@nestjs/swagger'

export class CreatePredictionDto {
  @ApiProperty()
  matchId!: string

  @ApiProperty()
  predictionHome!: number

  @ApiProperty()
  predictionAway!: number
}
