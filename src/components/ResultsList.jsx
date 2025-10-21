import { useMemo } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ExternalLink, Loader2, Link as LinkIcon } from 'lucide-react';

function StatusBadge({ status }) {
  const map = {
    ok: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    broken: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    redirected: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    unknown: 'text-zinc-300 border-zinc-600/40 bg-zinc-700/20',
  };
  const label = {
    ok: 'OK',
    broken: 'Broken',
    redirected: 'Redirected',
    unknown: 'Unknown',
  };
  const Icon = {
    ok: CheckCircle2,
    broken: XCircle,
    redirected: AlertTriangle,
    unknown: LinkIcon,
  }[status || 'unknown'];
  const IconCmp = Icon;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${map[status] || map.unknown}`}>
      <IconCmp className="h-3.5 w-3.5" /> {label[status] || label.unknown}
    </span>
  );
}

export default function ResultsList({ results, total, scanning, progress }) {
  const sorted = useMemo(() => {
    const order = { broken: 0, redirected: 1, ok: 2, unknown: 3 };
    return [...results].sort((a, b) => (order[a.status] ?? 99) - (order[b.status] ?? 99));
  }, [results]);

  return (
    <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 md:p-5 h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-zinc-200">Scan Results</h3>
        <div className="text-xs text-zinc-400">
          {scanning ? (
            <span className="inline-flex items-center gap-1"><Loader2 className="h-3.5 w-3.5 animate-spin" /> {progress.done}/{progress.total}</span>
          ) : (
            <span>{results.length ? `${results.length}/${total}` : `0/${total}`}</span>
          )}
        </div>
      </div>

      {!results.length && !scanning && (
        <div className="text-sm text-zinc-400">Your report will appear here after scanning.</div>
      )}

      <ul className="space-y-3 max-h-[360px] overflow-y-auto pr-1 custom-scroll">
        {sorted.map((r) => (
          <li key={r.url} className="flex items-start gap-3 rounded-lg border border-zinc-800 p-3 bg-zinc-900/40">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <a
                  href={r.directUrl || r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-sm text-zinc-100 hover:underline"
                  title={r.url}
                >
                  {r.url}
                </a>
                <StatusBadge status={r.status} />
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs text-zinc-400">
                {typeof r.httpStatus === 'number' && <span>HTTP {r.httpStatus}</span>}
                {r.finalUrl && r.finalUrl !== r.url && (
                  <span className="truncate"><span className="text-zinc-500">→</span> {r.finalUrl}</span>
                )}
                {r.reason && <span className="truncate">{r.reason}</span>}
              </div>
            </div>
            <a
              href={r.directUrl || r.url}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 inline-flex items-center gap-1 text-xs text-zinc-300 hover:text-white"
              title="Open link"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
