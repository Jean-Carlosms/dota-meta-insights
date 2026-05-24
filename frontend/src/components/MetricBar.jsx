export default function MetricBar({ value = 0, max = 100, label, variant = 'neutral', children }) {
  const numericValue = Number(value) || 0;
  const numericMax = Number(max) || 1;
  const width = Math.max(0, Math.min((numericValue / numericMax) * 100, 100));

  return (
    <div className={`metric-bar metric-bar-${variant}`} title={label}>
      <div className="metric-bar-value">{children || label}</div>
      <div className="metric-bar-track" aria-hidden="true">
        <span style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
