import { ApiProperty } from '@nestjs/swagger'

export class CreateUserSuccessResponseDto {
  @ApiProperty()
  userId!: string
}
