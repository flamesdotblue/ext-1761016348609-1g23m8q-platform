import Spline from '@splinetool/react-spline';

export default function HeroSplineCover() {
  return (
    <section className="relative w-full h-[76vh] md:h-[86vh] overflow-hidden">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/EQgEIs2r5cMbWroZ/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black pointer-events-none" />

      <div className="relative z-10 h-full flex items-center">
        <div className="mx-auto max-w-6xl px-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-300 backdrop-blur">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            Live 3D cover · Iridescent links
          </div>
          <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight">
            Find and fix broken links in your video descriptions
          </h1>
          <p className="mt-4 max-w-2xl text-zinc-300 text-base md:text-lg">
            Paste a YouTube, TikTok, or Vimeo description and scan all outbound links. Instantly identify broken, redirected, or unreachable URLs.
          </p>
        </div>
      </div>
    </section>
  );
}
