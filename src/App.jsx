import { useState, useMemo } from 'react';
import HeroSplineCover from './components/HeroSplineCover';
import LinkInput from './components/LinkInput';
import ResultsList from './components/ResultsList';
import HowItWorks from './components/HowItWorks';
import { extractLinks, checkLinks } from './utils/linkChecker';

export default function App() {
  const [text, setText] = useState('');
  const [links, setLinks] = useState([]);
  const [results, setResults] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const linkCount = useMemo(() => links.length, [links]);

  const handleTextChange = (val) => {
    setText(val);
    const extracted = extractLinks(val);
    setLinks(extracted);
    setResults([]);
    setProgress({ done: 0, total: extracted.length });
  };

  const handleScan = async () => {
    if (!links.length) return;
    setIsScanning(true);
    setResults([]);
    setProgress({ done: 0, total: links.length });

    const progressed = [];
    await checkLinks(links, (item) => {
      progressed.push(item);
      setResults([...progressed]);
      setProgress({ done: progressed.length, total: links.length });
    });

    setIsScanning(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <HeroSplineCover />
      <main className="mx-auto max-w-6xl px-4 -mt-16 relative z-10">
        <section className="bg-zinc-900/70 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <LinkInput
                value={text}
                onChange={handleTextChange}
                onScan={handleScan}
                scanning={isScanning}
                linkCount={linkCount}
              />
            </div>
            <div className="w-full lg:w-[46%]">
              <ResultsList
                results={results}
                total={links.length}
                scanning={isScanning}
                progress={progress}
              />
            </div>
          </div>
        </section>
        <HowItWorks />
      </main>
      <footer className="mx-auto max-w-6xl px-4 py-12 text-sm text-zinc-400">
        <div className="flex items-center justify-between">
          <p>© {new Date().getFullYear()} Link Sentinel</p>
          <p>Designed for scanning video descriptions across platforms</p>
        </div>
      </footer>
    </div>
  );
}
