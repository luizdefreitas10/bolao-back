import { ApiProperty } from '@nestjs/swagger'

export class RemoveRoundDto {
  @ApiProperty()
  roundId!: string
}
