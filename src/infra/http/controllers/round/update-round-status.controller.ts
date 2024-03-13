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
import { UpdateRoundStatusUseCase } from '@/domain/project/application/use-cases/update-round-status'
import { UpdateRoundStatusDto } from './dto/update-round-status-dto'
import { RoundNotFoundError } from '@/domain/project/application/use-cases/errors/round-not-found-error'

const RoundStatusEnum = z.enum(['WAITING', 'IN_PROGRESS', 'DONE', 'CANCELED'])

const UpdateRoundStatusBodySchema = z.object({
  status: RoundStatusEnum,
  roundId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(UpdateRoundStatusBodySchema)

@ApiTags('round')
@Controller('/round/update-status')
export class UpdateRoundStatusController {
  constructor(private updateRoundStatusUseCase: UpdateRoundStatusUseCase) {}

  @Patch()
  @HttpCode(204)
  @Roles(['ADMIN'])
  async handle(@Body(bodyValidationPipe) body: UpdateRoundStatusDto) {
    const { status, roundId } = body

    const result = await this.updateRoundStatusUseCase.execute({
      status,
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
