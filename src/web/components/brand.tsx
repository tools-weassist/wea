import { WeaMarkShapes } from './wea-mark';

export function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand-glyph ${small ? 'brand-glyph-small' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none">
        <WeaMarkShapes r={14} />
      </svg>
    </span>
  );
}
