import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  ConflictException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import { CreateMatchDto } from './dto/create-match-dto'
import { CreateMatchUseCase } from '@/domain/project/application/use-cases/create-match'
import { MatchPastError } from '@/domain/project/application/use-cases/errors/match-past-error'
import { MatchAlreadyExistError } from '@/domain/project/application/use-cases/errors/match-already-exists'
import { Roles } from '@/infra/auth/roles.decorator'
import { TeamNotFoundError } from '@/domain/project/application/use-cases/errors/team-not-found'
import { RoundNotFoundError } from '@/domain/project/application/use-cases/errors/round-not-found-error'

const createMatchBodySchema = z.object({
  teamIdHome: z.string(),
  teamIdAway: z.string(),
  roundId: z.string(),
  date: z.coerce.date(),
})

const bodyValidationPipe = new ZodValidationPipe(createMatchBodySchema)

@ApiTags('match')
@Controller('/match')
export class CreateMatchController {
  constructor(private createMatch: CreateMatchUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles(['ADMIN'])
  async handle(@Body(bodyValidationPipe) body: CreateMatchDto) {
    console.log(body)
    const { teamIdHome, teamIdAway, roundId, date } = body

    const result = await this.createMatch.execute({
      teamIdHome,
      teamIdAway,
      roundId,
      date,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case MatchPastError:
          throw new BadRequestException(error.message)
        case MatchAlreadyExistError:
          throw new ConflictException(error.message)
        case TeamNotFoundError:
          throw new BadRequestException(error.message)
        case RoundNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { match } = result.value

    return { matchId: match.id.toString() }
  }
}
