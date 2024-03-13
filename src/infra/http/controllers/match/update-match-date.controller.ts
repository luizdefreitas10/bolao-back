import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import { UpdateMatchDateDto } from './dto/update-match-date-dto'
import { Roles } from '@/infra/auth/roles.decorator'
import { MatchNotFoundError } from '@/domain/project/application/use-cases/errors/match-not-found-error'
import { UpdateMatchDateUseCase } from '@/domain/project/application/use-cases/update-match-date'

const updateMatchDateBodySchema = z.object({
  matchId: z.string(),
  date: z.coerce.date(),
})

const bodyValidationPipe = new ZodValidationPipe(updateMatchDateBodySchema)

@ApiTags('match')
@Controller('/match/update-date')
export class UpdateMatchDateController {
  constructor(private updateMatchDate: UpdateMatchDateUseCase) {}

  @Put()
  @HttpCode(201)
  @Roles(['ADMIN'])
  async handle(@Body(bodyValidationPipe) body: UpdateMatchDateDto) {
    const { matchId, date } = body

    const result = await this.updateMatchDate.execute({
      matchId,
      date,
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
