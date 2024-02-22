import { ApiProperty } from '@nestjs/swagger'

export class CreateMatchDto {
  @ApiProperty()
  teamIdHome!: string

  @ApiProperty()
  teamIdAway!: string

  @ApiProperty()
  roundId!: string

  @ApiProperty()
  date!: Date
}
