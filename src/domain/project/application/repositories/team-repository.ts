import { Team } from './../../enterprise/entities/team'

export abstract class TeamRepository {
  abstract create(team: Team): Promise<Team>
  abstract findById(id: string): Promise<Team | null>
  abstract findByName(name: string): Promise<Team | null>
  abstract update(teamName: string, newTeamName: string): Promise<Team | null>
  abstract remove(teamName: string): Promise<void>
}
