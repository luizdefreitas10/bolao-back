import { Round } from '@/domain/project/enterprise/entities/round'

export class RoundsPresenter {
  static toHTTP(round: Round) {
    return {
      name: round.name,
      status: round.status,
      matchs: round.matchs,
    }
  }
}
