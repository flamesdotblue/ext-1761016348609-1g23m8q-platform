import { ListChecks, MousePointerClick, Download } from 'lucide-react';

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
          <div className="h-10 w-10 rounded-lg bg-white text-black flex items-center justify-center">
            <Download className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-lg font-medium">Paste description</h3>
          <p className="mt-1 text-sm text-zinc-400">Copy the full description text from YouTube, TikTok, Vimeo, or any platform and paste it in.</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
          <div className="h-10 w-10 rounded-lg bg-white text-black flex items-center justify-center">
            <MousePointerClick className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-lg font-medium">Scan links</h3>
          <p className="mt-1 text-sm text-zinc-400">We extract all URLs and fetch them through a CORS-compatible reader to verify status and redirects.</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
          <div className="h-10 w-10 rounded-lg bg-white text-black flex items-center justify-center">
            <ListChecks className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-lg font-medium">Review results</h3>
          <p className="mt-1 text-sm text-zinc-400">See which links are OK, redirected, or broken, along with HTTP codes and the final destination.</p>
        </div>
      </div>
    </section>
  );
}
