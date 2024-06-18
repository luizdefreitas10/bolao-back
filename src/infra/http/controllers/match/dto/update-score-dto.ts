import { ApiProperty } from '@nestjs/swagger'

export class UpdateScoreDto {
  @ApiProperty()
  matchId!: string

  @ApiProperty()
  scoreHome!: number

  @ApiProperty()
  scoreAway!: number

  @ApiProperty()
  lastPlayerId!: string
}
