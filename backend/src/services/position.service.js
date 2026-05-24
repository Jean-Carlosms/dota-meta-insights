const POSITION_LABELS = {
  carry: 'Carry',
  mid: 'Mid',
  offlane: 'Offlane',
  soft_support: 'Soft Support',
  hard_support: 'Hard Support',
  unknown: 'Unknown'
};

const POSITION_PRIORITY = ['carry', 'mid', 'offlane', 'soft_support', 'hard_support', 'unknown'];

function getRoles(hero) {
  return Array.isArray(hero?.roles) ? hero.roles : [];
}

function hasRole(hero, role) {
  return getRoles(hero).includes(role);
}

function addPosition(positions, position) {
  if (!positions.includes(position)) {
    positions.push(position);
  }
}

export function getPositionLabels() {
  return POSITION_LABELS;
}

export function inferHeroPositions(hero) {
  const positions = [];
  const hasSupport = hasRole(hero, 'Support');
  const hasCarry = hasRole(hero, 'Carry');
  const hasNuker = hasRole(hero, 'Nuker');
  const hasEscape = hasRole(hero, 'Escape');
  const hasInitiator = hasRole(hero, 'Initiator');
  const hasDurable = hasRole(hero, 'Durable');
  const hasDisabler = hasRole(hero, 'Disabler');

  // MVP heuristic: OpenDota roles describe hero tendencies, not real match lane/position data.
  // Future STRATZ GraphQL integration can replace this with position data observed per match.
  if (hasCarry) {
    addPosition(positions, 'carry');
  }

  if ((hasNuker || hasEscape) && !hasSupport) {
    addPosition(positions, 'mid');
  }

  if (hasInitiator || hasDurable || hasDisabler) {
    addPosition(positions, 'offlane');
  }

  if (hasSupport || hasDisabler || hasNuker) {
    addPosition(positions, 'soft_support');
  }

  if (hasSupport) {
    addPosition(positions, 'hard_support');
  }

  if (!positions.length) {
    addPosition(positions, 'unknown');
  }

  return positions;
}

export function getPrimaryPosition(hero) {
  const positions = inferHeroPositions(hero);

  return POSITION_PRIORITY.find((position) => positions.includes(position)) || 'unknown';
}
