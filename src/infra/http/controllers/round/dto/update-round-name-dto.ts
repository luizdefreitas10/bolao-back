import { ApiProperty } from '@nestjs/swagger'

export class UpdateRoundNameDto {
  @ApiProperty()
  name!: string

  @ApiProperty()
  roundId!: string
}
