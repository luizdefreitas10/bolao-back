import { ApiProperty } from '@nestjs/swagger'

export class UpdateTeamDto {
  @ApiProperty()
  teamName!: string

  @ApiProperty()
  newTeamName!: string
}
