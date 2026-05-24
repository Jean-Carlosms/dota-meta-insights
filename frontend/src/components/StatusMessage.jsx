export default function StatusMessage({
  type = 'info',
  title,
  message,
  actionLabel,
  onAction
}) {
  return (
    <section className={`status-message status-${type}`}>
      <div>
        {title ? <strong>{title}</strong> : null}
        {message ? <p>{message}</p> : null}
      </div>
      {actionLabel && onAction ? (
        <button type="button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
}
