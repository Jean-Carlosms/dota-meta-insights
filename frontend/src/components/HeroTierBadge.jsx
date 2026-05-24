export default function HeroTierBadge({ tier }) {
  return <span className={`tier-badge tier-${tier?.toLowerCase()}`}>{tier || '-'}</span>;
}
