import { useEffect, type CSSProperties } from 'react';
import { DataSharing } from '../../../components/data-sharing';
import { LockKeyhole, MousePointerClick, ShieldCheck, Sparkles } from '../../../components/icons';
import { Button } from '../../../components/ui';
import { appPages } from '../../../../shared/app-links';
import { desktopRuntimeAvailable } from '../../../lib/desktop';
import { legalLinks } from '../../../../shared/onboarding';
import type { StepProps } from '..';

function differentiators(local: boolean) {
  return [
    {
      icon: MousePointerClick,
      title: 'Gets tasks done',
      text: 'Wea uses your apps and its own browser to complete tasks.',
    },
    {
      icon: Sparkles,
      title: 'Works proactively',
      text: `Turn on automatic preparation in ${appPages['/settings/notifications']} to get useful work from app changes, within a monthly allowance.`,
    },
    {
      icon: LockKeyhole,
      title: `Runs on your ${local ? 'computer' : 'server'}`,
      text: 'Wea works in a private workspace. Sign in with your AI provider or use your own key.',
    },
    {
      icon: ShieldCheck,
      title: 'Keeps you in control',
      text: 'Wea asks you before taking potentially dangerous actions.',
    },
  ];
}

export function Welcome({
  onNext,
  usageShared,
  traces,
  actionLabel = 'Get started',
  local = desktopRuntimeAvailable() ||
    ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname),
  note = true,
}: StepProps & { actionLabel?: string; local?: boolean; note?: boolean }) {
  useEffect(() => {
    const press = (event: KeyboardEvent) => {
      const surface =
        event.target === document.body || event.target === document.querySelector('.ob-main');
      if (event.key !== 'Enter' || !surface || event.repeat) return;
      onNext();
    };
    window.addEventListener('keydown', press);
    return () => window.removeEventListener('keydown', press);
  }, [onNext]);

  return (
    <section className="ob-step ob-welcome">
      <div className="ob-welcome-content">
        <h1 className="ob-welcome-wordmark" aria-label="Wea">
          <img className="wea-lockup wea-lockup-light" src="/brand/wea-lockup-light.svg" alt="" />
          <img className="wea-lockup wea-lockup-dark" src="/brand/wea-lockup-dark.svg" alt="" />
        </h1>
        <p className="ob-welcome-copy ob-welcome-tagline">Breathe, the busywork is handled.</p>
        <ul className="ob-welcome-points">
          {differentiators(local).map(({ icon: Icon, title, text }, index) => (
            <li
              key={title}
              className="ob-welcome-point"
              style={{ '--point-delay': `${200 + index * 90}ms` } as CSSProperties}
            >
              <span className="ob-welcome-point-icon" aria-hidden="true">
                <Icon size={18} />
              </span>
              <span>
                <strong>{title}</strong>
                <span>{text}</span>
              </span>
            </li>
          ))}
        </ul>
        {usageShared && (
          <p className="ob-welcome-usage">
            Please keep usage data on so the Wea team can see where I get stuck.
            <br />
            <DataSharing className="ob-link" usage traces={traces?.enabled} />
          </p>
        )}
        <Button onClick={onNext}>{actionLabel}</Button>
      </div>
      {note && <WelcomeNote />}
    </section>
  );
}

export function WelcomeNote() {
  return (
    <p className="ob-welcome-note">
      Wea is a WeAssist internal pilot
      <br />
      <a className="ob-link" href={legalLinks.terms} target="_blank" rel="noreferrer">
        Terms of Use
      </a>
      {' · '}
      <a className="ob-link" href={legalLinks.privacy} target="_blank" rel="noreferrer">
        Privacy policy
      </a>
    </p>
  );
}
