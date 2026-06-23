import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FetchPlayersByTeamUseCase } from '@/domain/project/application/use-cases/fetch-players-by-team'
import { PlayerPresenter } from '../../presenters/players-presenter'
import { Roles } from '@/infra/auth/roles.decorator'

@ApiTags('player')
@Controller('/player/team/:teamId')
export class FetchPlayersByTeamController {
  constructor(private fetchPlayersByTeam: FetchPlayersByTeamUseCase) {}

  @Get()
  @Roles(['ADMIN'])
  async handle(@Param('teamId') teamId: string) {
    const result = await this.fetchPlayersByTeam.execute({ teamId })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const players = result.value.players.map(PlayerPresenter.toHTTP)

    return { players }
  }
}
