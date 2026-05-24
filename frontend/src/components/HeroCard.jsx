export default function HeroCard({ label, value, detail }) {
  return (
    <article className="summary-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {detail ? <small>{detail}</small> : null}
    </article>
  );
}
