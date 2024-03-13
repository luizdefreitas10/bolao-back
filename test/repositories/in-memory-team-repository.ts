import { TeamRepository } from "@/domain/project/application/repositories/team-repository";
import { Team } from "@/domain/project/enterprise/entities/team";

export class InMemoryTeamRepository implements TeamRepository {
  public items: Team[] = [];

  async create(team: Team): Promise<Team> {
   this.items.push(team);
   return team
  }
  
  async findById(id: string): Promise<Team | null> {
    const team = this.items.find((item) => item.id.toString() === id)

    if (!team) {
      return null
    }

    return team
  }

  async findByName(name: string): Promise<Team | null> {
    const team = this.items.find((item) => item.name === name)

    if (!team) {
      return null
    }

    return team
  }

  async update(teamName: string, newTeamName: string): Promise<Team | null> {
    const teamIndex = this.items.findIndex((item) => item.name === teamName);

    if (teamIndex === -1) {
      return null; 
    }

    this.items[teamIndex].name = newTeamName

    return this.items[teamIndex];

  }

  async remove(teamName: string): Promise<void> {
    const team = this.items.find((item) => item.name === teamName);

    if (!team) {
      throw new Error("Team not found");
    }

    team.status = 'INACTIVE';
  }
}
