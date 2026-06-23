import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FetchTeamsUseCase } from '@/domain/project/application/use-cases/fetch-teams'
import { TeamListPresenter } from '../../presenters/list-presenters'
import { Roles } from '@/infra/auth/roles.decorator'

@ApiTags('team')
@Controller('/team')
export class FetchTeamsController {
  constructor(private fetchTeams: FetchTeamsUseCase) {}

  @Get()
  @Roles(['ADMIN'])
  async handle() {
    const result = await this.fetchTeams.execute()

    if (result.isLeft()) {
      return { teams: [] }
    }

    const teams = result.value.teams.map(TeamListPresenter.toHTTP)

    return { teams }
  }
}
