// EdgeOne Edge Functions types
export interface EventContext {
  request: Request
  params: Record<string, string>
  env: Record<string, string>
  waitUntil: (promise: Promise<unknown>) => void
}
