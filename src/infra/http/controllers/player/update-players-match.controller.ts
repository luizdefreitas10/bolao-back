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
import { Roles } from '@/infra/auth/roles.decorator'
import { UpdatePlayersMatchUseCase } from '@/domain/project/application/use-cases/update-players-match'
import { MatchNotFoundError } from '@/domain/project/application/use-cases/errors/match-not-found-error'

const updatePlayersMatchBodySchema = z.object({
  matchId: z.string(),
  lastPlayerTeamId: z.string(),
  players: z.array(z.string()),
})

const bodyValidationPipe = new ZodValidationPipe(updatePlayersMatchBodySchema)

@ApiTags('player')
@Controller('/player')
export class UpdatePlayersMatchController {
  constructor(private updatePlayersMatch: UpdatePlayersMatchUseCase) {}

  @Put()
  @HttpCode(200)
  @Roles(['ADMIN'])
  async handle(@Body(bodyValidationPipe) body: z.infer<typeof updatePlayersMatchBodySchema>) {
    const { matchId, lastPlayerTeamId, players } = body

    const result = await this.updatePlayersMatch.execute({
      matchId,
      lastPlayerTeamId,
      players,
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

    return { players: result.value.players }
  }
}
