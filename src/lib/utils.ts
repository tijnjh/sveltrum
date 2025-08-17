import { newErr, ok } from 'dethrow'

export function safeParseNumber(input: any) {
  const res = Number(input)
  return Number.isNaN(res)
    ? newErr(`Failed to parse ${input} as number`)
    : ok(res)
}
