/*
 * Wea build: the upstream phoneme processor (Spellophone and eSpeak NG, GPL-3.0-or-later)
 * is removed so this distribution stays Apache-2.0 only. Local (offline) Kokoro voices
 * for en-us, en-gb, es, fr-fr, hi and it are therefore unavailable. Brazilian
 * Portuguese still works through vozz (Apache-2.0), and cloud voices (TTS_MODEL) are
 * unaffected. To restore, re-add the upstream phonemizer-worker.ts and its dependency.
 */
export const localPhonemizerAvailable = false;

export function phonemizeSpeech(
  _text: string,
  _voice: 'en-us' | 'en-gb' | 'es' | 'fr-fr' | 'hi' | 'it',
): Promise<string> {
  return Promise.reject(new Error('phonemes'));
}
