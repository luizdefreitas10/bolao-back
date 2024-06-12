import { ApiProperty } from '@nestjs/swagger'

export class CreatePlayerDto {
  @ApiProperty()
  name!: string

  @ApiProperty()
  roundId!: string

  @ApiProperty()
  teamId!: string
}
