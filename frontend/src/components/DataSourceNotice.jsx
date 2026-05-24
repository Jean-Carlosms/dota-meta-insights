export default function DataSourceNotice({ mode }) {
  const isCompetitivePreview = mode === 'competitive_preview';

  return (
    <section className={`data-source-notice ${isCompetitivePreview ? 'preview' : 'general'}`}>
      <div>
        <strong>{isCompetitivePreview ? 'Competitive Meta Preview' : 'General Meta'}</strong>
        {isCompetitivePreview ? (
          <p>
            Planned mode for high MMR/pro style analytics. Intended future source: STRATZ
            GraphQL or another reliable high-MMR/pro data source. No scraping from
            Dota2ProTracker is used, and no competitive data is invented.
          </p>
        ) : (
          <p>
            Based on OpenDota public hero statistics. Good for general analytics and portfolio
            demonstration, but not restricted to 7000+ MMR/pro matches. Positions are inferred from
            hero roles.
          </p>
        )}
      </div>
    </section>
  );
}
