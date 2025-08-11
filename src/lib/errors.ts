import { Data } from 'effect'

export class FetchError extends Data.TaggedError('FetchError')<{ message: string }> { }
export class ScriptUrlNotFoundError extends Data.TaggedError('ScriptUrlNotFoundError')<{ message: string }> { }
export class ClientIdNotFoundError extends Data.TaggedError('ClientIdNotFoundError')<{ message: string }> { }
