export type Conditional<B extends boolean, T> = B extends true ? T : T | null
