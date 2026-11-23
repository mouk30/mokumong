import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface RouterContextValue {
  pathname: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextValue>({
  pathname: '/',
  navigate: () => {},
});

interface RouterProviderProps {
  ssrPath?: string;
  children: React.ReactNode;
}

function normalizePath(raw: string): string {
  const withoutOrigin = raw.replace(/^https?:\/\/[^/]+/, '');
  const [pathOnly] = withoutOrigin.split(/[?#]/);
  if (!pathOnly || pathOnly === '/') return '/';
  return pathOnly.replace(/\/+$/, '') || '/';
}

export function RouterProvider({ ssrPath, children }: RouterProviderProps) {
  const [pathname, setPathname] = useState<string>(() => {
    if (ssrPath) return normalizePath(ssrPath);
    if (typeof window !== 'undefined') return normalizePath(window.location.pathname);
    return '/';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onPopState = () => {
      setPathname(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((to: string) => {
    if (typeof window === 'undefined') return;

    const [pathPart, hashPart] = to.split('#');
    const targetPath = normalizePath(pathPart || '/');
    const currentPath = normalizePath(window.location.pathname);

    if (targetPath !== currentPath) {
      window.history.pushState({}, '', to);
      setPathname(targetPath);
      if (!hashPart) {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    } else if (hashPart) {
      window.history.replaceState({}, '', to);
    }

    if (hashPart) {
      requestAnimationFrame(() => {
        const el = document.getElementById(hashPart);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }, []);

  return (
    <RouterContext.Provider value={{ pathname, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}

interface AppLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export function AppLink({ href, onClick, children, ...rest }: AppLinkProps) {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      href.startsWith('http') ||
      href.startsWith('mailto:') ||
      rest.target === '_blank'
    ) {
      return;
    }
    e.preventDefault();
    navigate(href);
  };

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
