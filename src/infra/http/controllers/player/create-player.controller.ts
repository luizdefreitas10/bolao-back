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
import { Roles } from '@/infra/auth/roles.decorator'
import { CreatePlayerDto } from './dto/create-player-dto'
import { CreatePlayerUseCase } from '@/domain/project/application/use-cases/create-player'
import { PlayerAlreadyExistsError } from '@/domain/project/application/use-cases/errors/player-already-exist-error'

const createTeamBodySchema = z.object({
  name: z.string(),
  roundId: z.string(),
  teamId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createTeamBodySchema)

@ApiTags('player')
@Controller('/player')
export class CreatePlayerController {
  constructor(private createPlayer: CreatePlayerUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles(['ADMIN'])
  async handle(@Body(bodyValidationPipe) body: CreatePlayerDto) {
    const { name, roundId, teamId } = body

    const result = await this.createPlayer.execute({
      name,
      teamId,
      roundId,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case PlayerAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { player } = result.value

    return { playerId: player.id.toString() }
  }
}
