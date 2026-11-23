import { renderToString } from 'react-dom/server';
import App from './App';
import { getMetaForPath, type PageMeta } from './utils/seo';

export interface SsrRenderResult {
  html: string;
  meta: PageMeta;
}

export function renderRoute(urlPath: string): SsrRenderResult {
  const html = renderToString(<App ssrPath={urlPath} />);
  const meta = getMetaForPath(urlPath);
  return { html, meta };
}
