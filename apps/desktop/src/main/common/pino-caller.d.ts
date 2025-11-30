declare module 'pino-caller' {
  import type { Logger } from 'pino'

  interface PinoCallerOptions {
    relativeTo?: string
    stackAdjustment?: number
  }

  function pinoCaller<T extends Logger>(logger: T, options?: PinoCallerOptions): T

  export = pinoCaller
}
