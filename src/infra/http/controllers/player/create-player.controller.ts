import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
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
import { MatchRepository } from '@/domain/project/application/repositories/match-repository'

const createPlayerBodySchema = z
  .object({
    name: z.string(),
    teamId: z.string(),
    roundId: z.string().optional(),
    matchId: z.string().optional(),
  })
  .refine((data) => data.roundId || data.matchId, {
    message: 'roundId ou matchId é obrigatório.',
  })

const bodyValidationPipe = new ZodValidationPipe(createPlayerBodySchema)

@ApiTags('player')
@Controller('/player')
export class CreatePlayerController {
  constructor(
    private createPlayer: CreatePlayerUseCase,
    private matchRepository: MatchRepository,
  ) {}

  @Post()
  @HttpCode(201)
  @Roles(['ADMIN'])
  async handle(@Body(bodyValidationPipe) body: CreatePlayerDto) {
    const { name, teamId, roundId, matchId } = body

    let resolvedRoundId = roundId

    if (!resolvedRoundId && matchId) {
      const match = await this.matchRepository.findById(matchId)

      if (!match) {
        throw new NotFoundException('Partida não encontrada.')
      }

      resolvedRoundId = match.roundId.toString()
    }

    const result = await this.createPlayer.execute({
      name,
      teamId,
      roundId: resolvedRoundId!,
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
