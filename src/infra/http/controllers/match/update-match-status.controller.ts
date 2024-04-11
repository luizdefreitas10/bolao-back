import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Patch,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import { UpdateMatchStatusDto } from './dto/update-match-status-dto'
import { Roles } from '@/infra/auth/roles.decorator'
import { MatchNotFoundError } from '@/domain/project/application/use-cases/errors/match-not-found-error'
import { UpdateMatchStatusUseCase } from '@/domain/project/application/use-cases/update-match-status'

const MatchStatusEnum = z.enum(['WAITING', 'IN_PROGRESS', 'DONE', 'CANCELED'])

const UpdateMatchStatusBodySchema = z.object({
  matchId: z.string(),
  status: MatchStatusEnum,
})

const bodyValidationPipe = new ZodValidationPipe(UpdateMatchStatusBodySchema)

@ApiTags('match')
@Controller('/match/update-status')
export class UpdateMatchStatusController {
  constructor(private UpdateMatchStatus: UpdateMatchStatusUseCase) {}

  @Patch()
  @HttpCode(201)
  @Roles(['ADMIN'])
  async handle(@Body(bodyValidationPipe) body: UpdateMatchStatusDto) {
    const { matchId, status } = body

    const result = await this.UpdateMatchStatus.execute({
      matchId,
      status,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case MatchNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
