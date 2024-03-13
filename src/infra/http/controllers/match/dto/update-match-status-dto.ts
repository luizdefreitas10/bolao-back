import { ApiProperty } from '@nestjs/swagger'
import { MatchStatus } from '@prisma/client'

export class UpdateMatchStatusDto {
  @ApiProperty()
  matchId!: string

  @ApiProperty({ enum: MatchStatus, enumName: 'MatchStatusEnum' })
  status!: MatchStatus
}
