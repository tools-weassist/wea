import { useEffect, useState } from 'react';
import { weaSupportDefault, type SupportLink } from '../../shared/support';
import { api } from '../lib/api';

let cached: Promise<SupportLink> | undefined;

/** Wea pilot: the configured support link, with the default until the server answers. */
export function useSupportLink() {
  const [link, setLink] = useState<SupportLink>(weaSupportDefault);
  useEffect(() => {
    let active = true;
    cached ??= api<SupportLink>('/api/support').catch(() => {
      cached = undefined;
      return weaSupportDefault;
    });
    void cached.then((value) => {
      if (active && value?.url && value.label) setLink(value);
    });
    return () => {
      active = false;
    };
  }, []);
  return link;
}
