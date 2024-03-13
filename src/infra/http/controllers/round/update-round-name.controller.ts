import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  ConflictException,
  Patch,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import { Roles } from '@/infra/auth/roles.decorator'
import { UpdateRoundNameUseCase } from '@/domain/project/application/use-cases/update-round-name'
import { UpdateRoundNameDto } from './dto/update-round-name-dto'
import { RoundNotFoundError } from '@/domain/project/application/use-cases/errors/round-not-found-error'

const UpdateRoundNameBodySchema = z.object({
  name: z.string(),
  roundId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(UpdateRoundNameBodySchema)

@ApiTags('round')
@Controller('/round/update-name')
export class UpdateRoundNameController {
  constructor(private updateRoundNameUseCase: UpdateRoundNameUseCase) {}

  @Patch()
  @HttpCode(204)
  @Roles(['ADMIN'])
  async handle(@Body(bodyValidationPipe) body: UpdateRoundNameDto) {
    const { name, roundId } = body

    const result = await this.updateRoundNameUseCase.execute({
      name,
      roundId,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case RoundNotFoundError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
