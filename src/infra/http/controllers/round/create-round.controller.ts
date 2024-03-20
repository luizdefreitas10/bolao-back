import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import { CreateRoundDto } from './dto/create-round-dto'
import { CreateRoundUseCase } from '@/domain/project/application/use-cases/create-round'
import { Roles } from '@/infra/auth/roles.decorator'
import { ChampionshipDoesNotExistYetError } from '@/domain/project/application/use-cases/errors/championship-doesnt-exist-yet-error'

const createRoundBodySchema = z.object({
  name: z.string(),
  championshipId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createRoundBodySchema)

@ApiTags('round')
@Controller('/round')
export class CreateRoundController {
  constructor(private createRound: CreateRoundUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles(['ADMIN'])
  async handle(@Body(bodyValidationPipe) body: CreateRoundDto) {
    const { championshipId, name } = body

    const result = await this.createRound.execute({
      name,
      championshipId,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ChampionshipDoesNotExistYetError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { round } = result.value

    return { roundId: round.id.toString() }
  }
}
