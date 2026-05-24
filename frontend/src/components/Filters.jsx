const tiers = ['all', 'S', 'A', 'B', 'C', 'D'];
const attributes = ['all', 'str', 'agi', 'int'];
const attackTypes = ['all', 'Melee', 'Ranged'];
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
          <h2>Controle do meta</h2>
          <p>Filtre por funcao, tier e estatisticas para comparar herois com mais contexto.</p>
        </div>
      </div>

      <div className="filters">
        <label className="search-filter">
          Busca
          <input
            type="search"
            placeholder="Buscar heroi"
            value={filters.search}
            onChange={(event) => updateFilter('search', event.target.value)}
          />
        </label>

        <label>
          Posicao
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
          Atributo
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
          Ataque
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
          Ordenar por
          <select value={filters.sortBy} onChange={(event) => updateFilter('sortBy', event.target.value)}>
            <option value="metaScore">Meta Score</option>
            <option value="winRate">Win Rate</option>
            <option value="pickRate">Pick Rate</option>
            <option value="matches">Matches</option>
          </select>
        </label>
      </div>
    </section>
  );
}
