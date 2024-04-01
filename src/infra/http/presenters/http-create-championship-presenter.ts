import { Championship } from '@/domain/project/enterprise/entities/championship'

export class CreateChampionshipPresenter {
  static toHTTP(championship: Championship) {
    return {
      id: championship.id.toString(),
      name: championship.name,
      status: championship.status,
      createdAt: championship.createdAt,
    }
  }
}
