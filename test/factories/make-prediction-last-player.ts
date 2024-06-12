import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import {
  Player,
  PlayerProps,
} from '@/domain/project/enterprise/entities/player'
import { Championship } from '@/domain/project/enterprise/entities/championship'
import { Round } from '@/domain/project/enterprise/entities/round'
import { Team } from '@/domain/project/enterprise/entities/team'
import { PredictionLastPlayer } from '@/domain/project/enterprise/entities/prediction-last-player'
import { User } from '@/domain/project/enterprise/entities/user'
import { PrismaPredictionLastPlayerMapper } from '@/infra/database/prisma/mappers/prisma-prediction-last-player-mapper'

export function makePredictionLastPlayer(
  override: Partial<PlayerProps> = {},
  id?: UniqueEntityID,
) {
  const user = User.create({
    fullName: 'User',
    phone: '81282183',
  })

  const champ = Championship.create({
    name: 'champ',
    status: 'WAITING',
  })

  const round = Round.create({
    championshipId: champ.id,
    name: 'round',
    status: 'WAITING',
  })

  const team = Team.create({
    name: 'team',
    status: 'ACTIVE',
  })
  const player = Player.create(
    {
      name: 'Time 1',
      status: 'ACTIVE',
      teamId: team.id,
      roundId: round.id,
      ...override,
    },
    id,
  )

  const predictionLastPlayer = PredictionLastPlayer.create({
    playerId: player.id,
    roundId: round.id,
    teamId: team.id,
    userId: user.id,
  })

  return predictionLastPlayer
}

@Injectable()
export class PredictionLastPlayerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPredictionLastPlayer(
    data: Partial<PredictionLastPlayer> = {},
  ): Promise<PredictionLastPlayer> {
    const predictionLastPlayer = await this.makePrismaPredictionLastPlayer(data)

    await this.prisma.predictionLastPlayer.create({
      data: PrismaPredictionLastPlayerMapper.toPrisma(predictionLastPlayer),
    })

    return predictionLastPlayer
  }
}
