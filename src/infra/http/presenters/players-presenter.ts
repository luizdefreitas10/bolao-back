import { Player } from '@/domain/project/enterprise/entities/player'

export class PlayerPresenter {
  static toHTTP(player: Player) {
    return {
      name: player.name,
    }
  }
}
