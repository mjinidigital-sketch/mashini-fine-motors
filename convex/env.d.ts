import type { Env } from "./_generated/server";

declare module "./_generated/server" {
  interface Env {
    CLERK_WEBHOOK_SECRET: string;
  }
}
