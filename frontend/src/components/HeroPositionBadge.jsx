const POSITION_LABELS = {
  carry: 'Carry',
  mid: 'Mid',
  offlane: 'Offlane',
  soft_support: 'Soft Support',
  hard_support: 'Hard Support',
  unknown: 'Unknown'
};

export function getPositionLabel(position) {
  return POSITION_LABELS[position] || POSITION_LABELS.unknown;
}

export default function HeroPositionBadge({ position, compact = false }) {
  const normalizedPosition = position || 'unknown';

  return (
    <span className={`position-badge position-${normalizedPosition} ${compact ? 'compact' : ''}`}>
      {getPositionLabel(normalizedPosition)}
    </span>
  );
}
