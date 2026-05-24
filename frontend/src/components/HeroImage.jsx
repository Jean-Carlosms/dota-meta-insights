import { useState } from 'react';

function getInitials(name) {
  if (!name) {
    return '?';
  }

  return name
    .split(/[\s-]+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function HeroImage({ hero, variant = 'icon', className = '' }) {
  const [failed, setFailed] = useState(false);
  const src = variant === 'image' ? hero?.imageUrl || hero?.iconUrl : hero?.iconUrl || hero?.imageUrl;
  const fallback = <span className={`hero-image-fallback ${className}`}>{getInitials(hero?.localizedName)}</span>;

  if (!src || failed) {
    return fallback;
  }

  return (
    <img
      className={className}
      src={src}
      alt={hero?.localizedName ? `${hero.localizedName} hero art` : 'Hero art'}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
