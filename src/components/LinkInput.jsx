import { useId } from 'react';
import { Link as LinkIcon, ScanLine, Loader2 } from 'lucide-react';

export default function LinkInput({ value, onChange, onScan, scanning, linkCount }) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-zinc-300 mb-2">
        Paste video description text
      </label>
      <div className="relative">
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Paste the full description from YouTube, TikTok, Vimeo, etc.\nWe'll extract and check each link.`}
          className="w-full min-h-[220px] md:min-h-[260px] rounded-xl bg-zinc-950 border border-zinc-800 focus:border-zinc-600 outline-none p-4 pr-12 text-sm text-zinc-200 placeholder-zinc-500"
        />
        <LinkIcon className="absolute right-4 top-4 h-5 w-5 text-zinc-500" />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-zinc-400">
          {linkCount ? `${linkCount} link${linkCount === 1 ? '' : 's'} detected` : 'No links detected yet'}
        </p>
        <button
          onClick={onScan}
          disabled={!linkCount || scanning}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition
            ${scanning ? 'bg-zinc-800 text-zinc-300' : linkCount ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}
        >
          {scanning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Scanning...
            </>
          ) : (
            <>
              <ScanLine className="h-4 w-4" /> Scan Links
            </>
          )}
        </button>
      </div>
    </div>
  );
}
