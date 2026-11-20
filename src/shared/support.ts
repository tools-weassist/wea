/** Wea pilot: where users get help, shown instead of the upstream community links. */
export type SupportLink = { url: string; label: string };

export const weaSupportDefault: SupportLink = {
  url: 'mailto:tools@weassist.io',
  label: 'WeAssist pilot support',
};

/** Accepts only https and mailto addresses; anything else falls back to the default. */
export function supportLink(url?: string, label?: string): SupportLink {
  const name = label?.trim().slice(0, 60) || weaSupportDefault.label;
  const value = url?.trim();
  if (!value) return { url: weaSupportDefault.url, label: name };
  try {
    const parsed = new URL(value);
    if (parsed.protocol === 'https:' || (parsed.protocol === 'mailto:' && parsed.pathname))
      return { url: parsed.href, label: name };
  } catch {}
  return { url: weaSupportDefault.url, label: name };
}

/** Mail links open the mail app; web links open in a new tab. */
export function supportLinkTarget(link: SupportLink) {
  return link.url.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noreferrer' };
}
