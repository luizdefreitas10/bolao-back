import { ApiProperty } from '@nestjs/swagger'

export class UpdateMatchDateDto {
  @ApiProperty()
  matchId!: string

  @ApiProperty()
  date!: Date
}
