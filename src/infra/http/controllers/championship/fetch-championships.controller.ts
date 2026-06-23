import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FetchChampionshipsUseCase } from '@/domain/project/application/use-cases/fetch-championships'
import { ChampionshipListPresenter } from '../../presenters/list-presenters'
import { Roles } from '@/infra/auth/roles.decorator'

@ApiTags('championship')
@Controller('/championship')
export class FetchChampionshipsController {
  constructor(private fetchChampionships: FetchChampionshipsUseCase) {}

  @Get()
  @Roles(['ADMIN'])
  async handle() {
    const result = await this.fetchChampionships.execute()

    if (result.isLeft()) {
      return { championships: [] }
    }

    const championships = result.value.championships.map(
      ChampionshipListPresenter.toHTTP,
    )

    return { championships }
  }
}
