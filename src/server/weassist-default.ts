import { agentModels } from '../shared/model-defaults.ts';

/** Wea pilot: low default spending caps while the WeAssist-hosted key pays for usage. */
export const weassistDefaultMonthlyUsd = 25;
export const weassistDefaultTaskUsd = 2;

function usdSetting(value: string | undefined, fallback: number) {
  const parsed = Number(value?.trim());
  return value?.trim() && Number.isFinite(parsed) && parsed >= 1 ? parsed : fallback;
}

/**
 * Wea pilot: reads the WeAssist-hosted OpenRouter test connection from the server environment.
 * The key stays server-side; it is never sent to the browser, saved, or logged.
 * A deployment-wide OPENROUTER_API_KEY takes precedence, and nothing changes without the key.
 */
export function weassistDefault(env: Record<string, string | undefined>) {
  const key = env.WEA_DEFAULT_OPENROUTER_API_KEY?.trim();
  if (!key || env.OPENROUTER_API_KEY?.trim()) return undefined;
  return {
    key,
    model: env.WEA_DEFAULT_MODEL?.trim() || agentModels.openrouter,
    monthlyUsd: usdSetting(env.WEA_DEFAULT_MONTHLY_LIMIT_USD, weassistDefaultMonthlyUsd),
    taskUsd: usdSetting(env.WEA_DEFAULT_TASK_LIMIT_USD, weassistDefaultTaskUsd),
  };
}

/** Wea pilot: starting caps for a new owner while the hosted key is active, without the key. */
export function weassistLimits(env: Record<string, string | undefined>) {
  const hosted = weassistDefault(env);
  return hosted && { monthlyUsd: hosted.monthlyUsd, taskUsd: hosted.taskUsd };
}
