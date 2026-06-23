function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

export const siteConfig = {
  siteUrl: trimTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://e-cashengine.com'),
  apiUrl: trimTrailingSlash(process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || ''),
  serverApiUrl: trimTrailingSlash(process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || ''),
};

export function apiUrl(path: string, server = false) {
  const baseUrl = server ? siteConfig.serverApiUrl : siteConfig.apiUrl;
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export function siteUrl(path: string) {
  return `${siteConfig.siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
