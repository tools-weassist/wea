import type { FastifyInstance } from 'fastify';
import { supportLink } from '../shared/support.ts';

/** Wea pilot: serves the support link set by WEA_SUPPORT_URL and WEA_SUPPORT_LABEL. */
export function registerSupportLink(
  app: FastifyInstance,
  env: Record<string, string | undefined> = process.env,
) {
  const link = supportLink(env.WEA_SUPPORT_URL, env.WEA_SUPPORT_LABEL);
  app.get('/api/support', async () => link);
  return link;
}
