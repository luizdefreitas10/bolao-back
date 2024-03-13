import { ApiProperty } from '@nestjs/swagger'
import { RoundStatus } from '@prisma/client'

export class UpdateRoundStatusDto {
  @ApiProperty()
  roundId!: string

  @ApiProperty({ enum: RoundStatus, enumName: 'RoundStatusEnum' })
  status!: RoundStatus
}
