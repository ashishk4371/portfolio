export interface Skill {
  readonly name: string;
  /** Rough self-assessed depth, 1–5. Drives the proficiency meter. */
  readonly level: 1 | 2 | 3 | 4 | 5;
}

export interface SkillGroup {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly skills: readonly Skill[];
}
