const tiers = ['all', 'S', 'A', 'B', 'C', 'D'];
const attributes = ['all', 'str', 'agi', 'int'];
const attackTypes = ['all', 'Melee', 'Ranged'];
const minimumMatchesOptions = ['0', '500', '1000', '5000', '10000'];
const positions = [
  ['all', 'Todas as posicoes'],
  ['carry', 'Carry'],
  ['mid', 'Mid'],
  ['offlane', 'Offlane'],
  ['soft_support', 'Soft Support'],
  ['hard_support', 'Hard Support']
];

export default function Filters({ filters, onChange, positionFilter, onPositionChange }) {
  function updateFilter(key, value) {
    onChange({
      ...filters,
      [key]: value
    });
  }

  return (
    <section className="filters-panel" aria-label="Filtros de herois">
      <div className="filters-heading">
        <div>
          <h2>Analytics filters</h2>
          <p>Compact controls for hero, position, tier, role traits and sample size.</p>
        </div>
      </div>

      <div className="filters">
        <label className="search-filter">
          Search hero
          <input
            type="search"
            placeholder="Search hero"
            value={filters.search}
            onChange={(event) => updateFilter('search', event.target.value)}
          />
        </label>

        <label>
          Position
          <select value={positionFilter} onChange={(event) => onPositionChange(event.target.value)}>
            {positions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Tier
          <select value={filters.tier} onChange={(event) => updateFilter('tier', event.target.value)}>
            {tiers.map((tier) => (
              <option key={tier} value={tier}>
                {tier === 'all' ? 'Todos' : tier}
              </option>
            ))}
          </select>
        </label>

        <label>
          Primary Attribute
          <select
            value={filters.primaryAttr}
            onChange={(event) => updateFilter('primaryAttr', event.target.value)}
          >
            {attributes.map((attr) => (
              <option key={attr} value={attr}>
                {attr === 'all' ? 'Todos' : attr.toUpperCase()}
              </option>
            ))}
          </select>
        </label>

        <label>
          Attack Type
          <select
            value={filters.attackType}
            onChange={(event) => updateFilter('attackType', event.target.value)}
          >
            {attackTypes.map((type) => (
              <option key={type} value={type}>
                {type === 'all' ? 'Todos' : type}
              </option>
            ))}
          </select>
        </label>

        <label>
          Sort By
          <select value={filters.sortBy} onChange={(event) => updateFilter('sortBy', event.target.value)}>
            <option value="metaScore">Meta Score</option>
            <option value="winRate">Win Rate</option>
            <option value="pickRate">Pick Rate</option>
            <option value="matches">Matches</option>
            <option value="confidenceScore">Confidence</option>
            <option value="ratingScore">DotaMeta Rating</option>
          </select>
        </label>

        <label>
          Minimum Matches
          <select
            value={filters.minimumMatches}
            onChange={(event) => updateFilter('minimumMatches', event.target.value)}
          >
            {minimumMatchesOptions.map((value) => (
              <option key={value} value={value}>
                {new Intl.NumberFormat('pt-BR').format(Number(value))}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
