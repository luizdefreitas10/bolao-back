import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FetchChampionshipsWithWaitingRoundsUseCase } from '@/domain/project/application/use-cases/fetch-championships-with-waiting-rounds'
import { ChampionshipWithWaitingRoundsPresenter } from '../../presenters/list-presenters'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@ApiTags('championship')
@Controller('/championship/waiting-rounds')
export class FetchChampionshipsWithWaitingRoundsController {
  constructor(
    private fetchChampionshipsWithWaitingRounds: FetchChampionshipsWithWaitingRoundsUseCase,
  ) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.fetchChampionshipsWithWaitingRounds.execute(
      user.sub,
    )

    if (result.isLeft()) {
      return { championships: [] }
    }

    const championships = result.value.championships.map(
      ChampionshipWithWaitingRoundsPresenter.toHTTP,
    )

    return { championships }
  }
}
