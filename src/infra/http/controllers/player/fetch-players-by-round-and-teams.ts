import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FetchPlayerByTeamAndRoundUseCase } from '@/domain/project/application/use-cases/fetch-players-by-round-and-team'
import { PlayerPresenter } from '../../presenters/players-presenter'

@ApiTags('player')
@Controller('/player/round/:roundId/team/:teamId')
export class FetchPlayersController {
  constructor(
    private fetchPlayerByTeamAndRoundUseCase: FetchPlayerByTeamAndRoundUseCase,
  ) {}

  @Get()
  async handle(
    @Param('roundId') roundId: string,
    @Param('teamId') teamId: string,
  ) {
    const result = await this.fetchPlayerByTeamAndRoundUseCase.execute({
      teamId,
      roundId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const players = result.value.players
    const presenter = players.map(PlayerPresenter.toHTTP)
    return { players: presenter }
  }
}
