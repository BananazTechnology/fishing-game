export class Fish {
  private id: number;
  private species: string;
  private catchChance: number;
  private reward: number;

  constructor (id: number, species: string, catchChance: number, reward: number) {
    this.id = id
    this.species = species
    this.catchChance = catchChance
    this.reward = reward
  }
}
