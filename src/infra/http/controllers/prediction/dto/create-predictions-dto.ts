import { ApiProperty } from '@nestjs/swagger'
import { PredictionType } from '@prisma/client'

export class CreatePredictionsDto {
  @ApiProperty()
  matchId!: string

  @ApiProperty()
  predictionHome!: number

  @ApiProperty()
  predictionAway!: number

  @ApiProperty()
  playerId!: string
}
