import { ApiProperty } from '@nestjs/swagger'

export class RemoveMatchDto {
  @ApiProperty()
  matchId!: string
}
