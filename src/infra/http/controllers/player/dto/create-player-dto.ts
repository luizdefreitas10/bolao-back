import { ApiProperty } from '@nestjs/swagger'

export class CreatePlayerDto {
  @ApiProperty()
  name!: string

  @ApiProperty({ required: false })
  roundId?: string

  @ApiProperty({ required: false })
  matchId?: string

  @ApiProperty()
  teamId!: string
}
