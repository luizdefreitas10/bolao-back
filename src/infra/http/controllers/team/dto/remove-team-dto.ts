import { ApiProperty } from '@nestjs/swagger'

export class RemoveTeamDto {
  @ApiProperty()
  teamName!: string
}
