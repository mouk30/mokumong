import { useCallback, useEffect } from 'react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { GAME_BY_ID } from './data/games';
import { INSIGHT_BY_SLUG, JOB_BY_SLUG } from './data/insights';
import { AboutPage } from './pages/AboutPage';
import { GameDetailPage } from './pages/GameDetailPage';
import { HomePage } from './pages/HomePage';
import { InsightDetailPage } from './pages/InsightDetailPage';
import { InsightsPage } from './pages/InsightsPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { LegalPage } from './pages/LegalPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RouterProvider, useRouter } from './router';
import { getMetaForPath } from './utils/seo';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function syncDocumentHead(pathname: string) {
  if (typeof document === 'undefined') return;
  const meta = getMetaForPath(pathname);
  document.title = meta.title;
  upsertMeta('name', 'description', meta.description);
  upsertMeta('name', 'robots', meta.robots);
  upsertCanonical(meta.canonical);

  upsertMeta('property', 'og:type', meta.ogType);
  upsertMeta('property', 'og:title', meta.title);
  upsertMeta('property', 'og:description', meta.description);
  upsertMeta('property', 'og:url', meta.canonical);
  upsertMeta('property', 'og:image', meta.ogImage);

  upsertMeta('name', 'twitter:title', meta.title);
  upsertMeta('name', 'twitter:description', meta.description);
  upsertMeta('name', 'twitter:image', meta.ogImage);

  const existingScripts = document.head.querySelectorAll('script[data-mokumong-ld]');
  existingScripts.forEach((node) => node.remove());

  for (const schema of meta.jsonLd) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-mokumong-ld', 'true');
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }
}

function AppShell() {
  const { pathname } = useRouter();

  useEffect(() => {
    syncDocumentHead(pathname);
  }, [pathname]);

  const handleFocusSearch = useCallback(() => {
    const input = document.getElementById('game-search-input') as HTMLInputElement | null;
    if (input) {
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      input.focus();
    }
  }, []);

  let page = <NotFoundPage />;

  if (pathname === '/') {
    page = <HomePage />;
  } else if (pathname === '/insights') {
    page = <InsightsPage />;
  } else if (pathname === '/about') {
    page = <AboutPage />;
  } else if (pathname === '/privacy') {
    page = <LegalPage mode="privacy" />;
  } else if (pathname === '/terms') {
    page = <LegalPage mode="terms" />;
  } else {
    const gameMatch = pathname.match(/^\/game\/(\d+)$/);
    if (gameMatch) {
      const game = GAME_BY_ID.get(Number(gameMatch[1]));
      if (game) {
        page = <GameDetailPage game={game} />;
      }
    } else {
      const insightMatch = pathname.match(/^\/insights\/([^/]+)$/);
      if (insightMatch) {
        const article = INSIGHT_BY_SLUG.get(insightMatch[1]);
        if (article) {
          page = <InsightDetailPage article={article} />;
        }
      } else {
        const jobMatch = pathname.match(/^\/job\/([^/]+)$/);
        if (jobMatch) {
          const job = JOB_BY_SLUG.get(jobMatch[1]);
          if (job) {
            page = <JobDetailPage job={job} />;
          }
        }
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#080D18] text-[#F5F7FF]">
      <Header onFocusSearch={handleFocusSearch} />
      <div className="flex-1">{page}</div>
      <Footer />
    </div>
  );
}

interface AppProps {
  ssrPath?: string;
}

export default function App({ ssrPath }: AppProps) {
  return (
    <RouterProvider ssrPath={ssrPath}>
      <AppShell />
    </RouterProvider>
  );
}
