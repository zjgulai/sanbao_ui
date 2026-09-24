import type { CSSProperties } from 'react';

export type BrandMarkVariant = 'full' | 'symbol';
export type BrandMarkTone = 'light' | 'dark';

export type BrandMarkProps = {
  /** `full` uses the lockup; `symbol` uses only the app mark. */
  variant?: BrandMarkVariant;
  /** Use `light` on light surfaces and `dark` on dark surfaces. */
  tone?: BrandMarkTone;
  /** Optional visible label, intended for the compact symbol variant. */
  text?: string;
  /** Mark height; number values are interpreted as pixels. */
  size?: number | string;
  className?: string;
  imageClassName?: string;
  alt?: string;
};

const assetName = (variant: BrandMarkVariant, tone: BrandMarkTone) => `A_StarSail_Product${variant === 'symbol' ? '_symbol' : ''}_${tone}.svg`;

export function BrandMark({
  variant = 'symbol',
  tone = 'light',
  text,
  size = 24,
  className,
  imageClassName,
  alt = 'SanBao',
}: BrandMarkProps) {
  const visibleText = variant === 'symbol' ? text : undefined;
  const style: CSSProperties = {
    alignItems: 'center',
    display: 'inline-flex',
    gap: '0.5em',
    lineHeight: 1,
    verticalAlign: 'middle',
  };
  const imageStyle: CSSProperties = {
    display: 'block',
    flex: '0 0 auto',
    height: size,
    maxWidth: '100%',
    width: variant === 'symbol' ? size : 'auto',
  };
  const source = new URL(`./assets/brand/${assetName(variant, tone)}`, document.baseURI).href;

  return (
    <span className={['sanbao-brand-mark', className].filter(Boolean).join(' ')} style={style}>
      <img
        alt={visibleText ? '' : alt}
        aria-hidden={visibleText ? true : undefined}
        className={imageClassName}
        decoding="async"
        draggable={false}
        src={source}
        style={imageStyle}
      />
      {visibleText ? <span className="sanbao-brand-mark-text">{visibleText}</span> : null}
    </span>
  );
}
