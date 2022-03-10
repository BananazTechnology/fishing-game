export class Fish {
  private id: number;
  private species: string;
  private catchChance: number;

  constructor (id: number, species: string, catchChance: number) {
    this.id = id
    this.species = species
    this.catchChance = catchChance
  }
}
