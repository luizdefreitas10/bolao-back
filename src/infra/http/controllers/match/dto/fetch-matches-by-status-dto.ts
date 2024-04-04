import { ApiProperty } from '@nestjs/swagger'
import { MatchStatus } from '@prisma/client'

export class FetchMatchesByStatusDto {
  @ApiProperty({ enum: MatchStatus, enumName: 'MatchStatusEnum' })
  status!: MatchStatus
}
