import { ApiProperty } from '@nestjs/swagger'

export class CreateRoundDto {
  @ApiProperty()
  name!: string

  @ApiProperty()
  championshipId!: string
}
