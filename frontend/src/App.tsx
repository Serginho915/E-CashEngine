import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Clock, Eye, FilePlus, Menu, RefreshCw, Save, Search, Trash2, Wand2, X } from 'lucide-react';
import { getPost, getPosts, request, subscribe } from './api';
import type { AdminSettings, Article, Post } from './domain';

const covers = ['/covers/cover1.png', '/covers/cover2.png', '/covers/cover3.png', '/covers/cover4.png'];
const weekdays = [
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
  { value: 0, label: 'Sun' },
];

type DraftPost = {
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  status: 'draft' | 'published';
  tags: string;
};

const emptyDraft: DraftPost = { title: '', slug: '', excerpt: '', contentHtml: '<h2>Introduction</h2><p></p>', status: 'published', tags: '' };

function toArticle(post: Post, index = 0): Article {
  const tag = post.tags[0] || (post.source === 'ai' ? 'AI Side Hustles' : 'Online Income');
  return {
    ...post,
    cover: covers[index % covers.length],
    category: tag.replace(/\b\w/g, (letter) => letter.toUpperCase()),
    readingTime: Math.max(5, Math.ceil(post.contentHtml.replace(/<[^>]+>/g, '').split(/\s+/).length / 180)),
    views: 2400 + index * 420,
  };
}

function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('app:navigate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: '/', label: 'Home' },
    { href: '/articles', label: 'All articles' },
  ];
  return (
    <header className="site-header">
      <button className="logo-button" onClick={() => navigate('/')} aria-label="e-CashEngine home">
        <img src="/logo.png" alt="e-CashEngine" />
      </button>
      <div className="search-pill">
        <Search size={17} />
        <span>Affiliate marketing, AI side hustles, freelancing...</span>
      </div>
      <nav className="desktop-nav">
        {links.map((link) => (
          <button key={link.href} onClick={() => navigate(link.href)}>{link.label}</button>
        ))}
      </nav>
      <button className="icon-button mobile-only" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        {open ? <X /> : <Menu />}
      </button>
      {open && (
        <div className="mobile-menu">
          {links.map((link) => (
            <button key={link.href} onClick={() => { setOpen(false); navigate(link.href); }}>{link.label}</button>
          ))}
        </div>
      )}
    </header>
  );
}

function ArticleCover({ article }: { article: Article }) {
  return (
    <div className="article-cover">
      <img src={article.cover} alt="" />
      <div>
        <span>{article.category}</span>
        <strong>{article.title}</strong>
      </div>
    </div>
  );
}

function Hero({ article }: { article: Article }) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">Daily income guide</p>
        <h1>{article.title}</h1>
        <p>{article.excerpt}</p>
        <button className="primary-action" onClick={() => navigate(`/articles/${article.slug}`)}>
          Read the income plan <ArrowRight size={20} />
        </button>
        <div className="hero-stats">
          <span><strong>{article.readingTime}</strong> min read</span>
          <span><strong>{article.views.toLocaleString()}</strong> readers</span>
        </div>
      </div>
      <div className="hero-card">
        <ArticleCover article={article} />
        <div className="hero-card-body">
          <span>{article.category}</span>
          <h2>{article.title}</h2>
          <p>{article.excerpt}</p>
          <small><BookOpen size={16} /> Written by Irina Vovk for ethical online earners</small>
        </div>
      </div>
    </section>
  );
}

function ArticleGrid({ articles }: { articles: Article[] }) {
  return (
    <div className="article-grid">
      {articles.map((article) => (
        <article className="article-card" key={article.id} onClick={() => navigate(`/articles/${article.slug}`)}>
          <ArticleCover article={article} />
          <div className="article-card-body">
            <span className="category-pill">{article.category}</span>
            <h3>{article.title}</h3>
            <p>{article.excerpt}</p>
            <footer>
              <span><Clock size={14} /> {article.readingTime} min</span>
              <span><Eye size={14} /> {article.views.toLocaleString()}</span>
            </footer>
          </div>
        </article>
      ))}
    </div>
  );
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      await subscribe(email);
      setEmail('');
      setMessage('You are subscribed. Fresh income guides are on the way.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not subscribe right now.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="newsletter-panel" onSubmit={submit}>
      <div>
        <p className="eyebrow">Newsletter</p>
        <h2>Get practical online income guides</h2>
      </div>
      <label>
        <span>Email</span>
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="you@example.com" required />
      </label>
      <button disabled={busy}>{busy ? 'Subscribing...' : 'Subscribe'}</button>
      {message && <p className="form-message">{message}</p>}
    </form>
  );
}

function HomePage({ articles }: { articles: Article[] }) {
  const featured = articles[0];
  return (
    <main className="page-shell">
      {featured && <Hero article={featured} />}
      <section className="section-head">
        <p className="eyebrow">Latest strategies</p>
        <h2>Build useful, ethical online income streams</h2>
        <p>No overnight-rich promises. Just focused guides for affiliate content, AI services, freelancing, ecommerce, and digital products.</p>
      </section>
      <ArticleGrid articles={articles.slice(0, 6)} />
      <Newsletter />
    </main>
  );
}

function ArticlesPage({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return articles;
    return articles.filter((article) => [article.title, article.excerpt, article.category, ...article.tags].join(' ').toLowerCase().includes(q));
  }, [articles, query]);

  return (
    <main className="page-shell">
      <section className="section-head">
        <p className="eyebrow">All articles</p>
        <h1>Online income library</h1>
        <p>Browse practical playbooks for building skills, assets, and reader trust online.</p>
      </section>
      <label className="wide-search">
        <Search size={18} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search affiliate, AI, freelancing..." />
      </label>
      <ArticleGrid articles={filtered} />
    </main>
  );
}

function ArticlePage({ article }: { article?: Article }) {
  if (!article) {
    return (
      <main className="page-shell">
        <section className="section-head"><h1>Article not found</h1><p>The guide you requested is not available.</p></section>
      </main>
    );
  }
  return (
    <main className="article-page">
      <p className="eyebrow">{article.category}</p>
      <h1>{article.title}</h1>
      <p className="article-lead">{article.excerpt}</p>
      <ArticleCover article={article} />
      <div className="article-content" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
      <button className="secondary-action" onClick={() => navigate('/articles')}>Back to all articles</button>
    </main>
  );
}

function AdminPanel() {
  const [email, setEmail] = useState('admin@ecashengine.local');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [editingSlug, setEditingSlug] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [generatingCount, setGeneratingCount] = useState<1 | 3 | null>(null);

  async function load(nextToken = token) {
    const [loadedPosts, loadedSettings] = await Promise.all([
      request<Post[]>('/api/admin/posts', {}, nextToken),
      request<AdminSettings>('/api/admin/settings', {}, nextToken),
    ]);
    setPosts(loadedPosts);
    setSettings(loadedSettings);
  }

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const data = await request<{ accessToken: string; csrfToken: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(data.accessToken);
      setCsrfToken(data.csrfToken);
      await load(data.accessToken);
      setMessage('Signed in.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Login failed.');
    } finally {
      setBusy(false);
    }
  }

  async function savePost(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const body = {
        ...draft,
        tags: draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      };
      await request<Post>(editingSlug ? `/api/admin/posts/${editingSlug}` : '/api/admin/posts', {
        method: editingSlug ? 'PUT' : 'POST',
        body: JSON.stringify(body),
      }, token);
      setDraft(emptyDraft);
      setEditingSlug('');
      await load();
      setMessage('Article saved.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save article.');
    } finally {
      setBusy(false);
    }
  }

  async function removePost(slug: string) {
    await request(`/api/admin/posts/${slug}`, { method: 'DELETE' }, token);
    await load();
  }

  async function generateNow(count: 1 | 3) {
    setBusy(true);
    setGeneratingCount(count);
    setMessage(`Generating ${count} article${count === 1 ? '' : 's'} with OpenRouter. This can take 20-90 seconds...`);
    try {
      let nextToken = token;
      if (csrfToken) {
        try {
          const refreshed = await request<{ accessToken: string }>('/api/auth/refresh', { method: 'POST' }, undefined, csrfToken);
          nextToken = refreshed.accessToken;
          setToken(refreshed.accessToken);
        } catch {
          nextToken = token;
        }
      }
      const generated = await request<Post[]>('/api/ai/generate-article', { method: 'POST', body: JSON.stringify({ count }) }, nextToken);
      await load();
      setMessage(`${generated.length || 0} generated article${generated.length === 1 ? '' : 's'} saved.`);
    } catch (error) {
      const text = error instanceof Error ? error.message : 'Generation failed.';
      if (text.toLowerCase().includes('session') || text.toLowerCase().includes('admin session')) {
        setToken('');
        setMessage('Session expired. Please sign in again.');
      } else {
        setMessage(text);
      }
    } finally {
      setBusy(false);
      setGeneratingCount(null);
    }
  }

  async function refreshSession() {
    const data = await request<{ accessToken: string }>('/api/auth/refresh', { method: 'POST' }, undefined, csrfToken);
    setToken(data.accessToken);
    await load(data.accessToken);
  }

  async function saveSettings() {
    if (!settings) return;
    await request<AdminSettings>('/api/admin/settings', { method: 'PUT', body: JSON.stringify(settings) }, token);
    setMessage('Settings saved.');
  }

  function updateGenerationCount(count: number) {
    if (!settings) return;
    const safeCount = Math.min(12, Math.max(1, count || 1));
    const currentTimes = settings.generationTimes?.length ? settings.generationTimes : [settings.generationTime || '08:00'];
    const nextTimes = Array.from({ length: safeCount }, (_, index) => currentTimes[index] || currentTimes[currentTimes.length - 1] || '08:00');
    setSettings({
      ...settings,
      generationCount: safeCount,
      generationTimes: nextTimes,
      generationTime: nextTimes[0],
    });
  }

  function updateGenerationTime(index: number, value: string) {
    if (!settings) return;
    const nextTimes = [...(settings.generationTimes?.length ? settings.generationTimes : [settings.generationTime || '08:00'])];
    nextTimes[index] = value;
    setSettings({
      ...settings,
      generationTimes: nextTimes,
      generationTime: nextTimes[0],
      generationCount: nextTimes.length,
    });
  }

  function toggleWeekday(day: number) {
    if (!settings) return;
    const current = settings.generationWeekdays || [];
    const next = current.includes(day) ? current.filter((value) => value !== day) : [...current, day];
    setSettings({ ...settings, generationWeekdays: next.length ? next.sort() : [1] });
  }

  if (!token) {
    return (
      <main className="admin-page">
        <form className="admin-login" onSubmit={signIn}>
          <h1>Admin sign in</h1>
          <label><span>Email</span><input value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label><span>Password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <button disabled={busy}>Sign in</button>
          {message && <p className="form-message">{message}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-toolbar">
        <h1>Publishing admin</h1>
        <button onClick={refreshSession}><RefreshCw size={16} /> Refresh</button>
        <button onClick={() => generateNow(1)} disabled={busy}><Wand2 size={16} /> {generatingCount === 1 ? 'Generating 1...' : 'Generate 1 now'}</button>
        <button onClick={() => generateNow(3)} disabled={busy}><Wand2 size={16} /> {generatingCount === 3 ? 'Generating 3...' : 'Generate 3 now'}</button>
      </header>
      {message && <p className="form-message">{message}</p>}
      <section className="admin-grid">
        <form className="editor-panel" onSubmit={savePost}>
          <h2>{editingSlug ? 'Edit article' : 'Create article'}</h2>
          <label><span>Title</span><input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required /></label>
          <label><span>Slug</span><input value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} /></label>
          <label><span>Excerpt</span><textarea value={draft.excerpt} onChange={(event) => setDraft({ ...draft, excerpt: event.target.value })} required /></label>
          <label><span>HTML content</span><textarea rows={10} value={draft.contentHtml} onChange={(event) => setDraft({ ...draft, contentHtml: event.target.value })} required /></label>
          <label><span>Tags</span><input value={draft.tags} onChange={(event) => setDraft({ ...draft, tags: event.target.value })} placeholder="affiliate marketing, AI side hustles" /></label>
          <button disabled={busy}><Save size={16} /> Save article</button>
        </form>
        <section className="admin-list">
          <h2>Articles</h2>
          {posts.map((post) => (
            <article key={post.id}>
              <div><strong>{post.title}</strong><small>{post.slug}</small></div>
              <button onClick={() => {
                setEditingSlug(post.slug);
                setDraft({ title: post.title, slug: post.slug, excerpt: post.excerpt, contentHtml: post.contentHtml, status: post.status, tags: post.tags.join(', ') });
              }}><FilePlus size={16} /> Edit</button>
              <button onClick={() => removePost(post.slug)}><Trash2 size={16} /> Delete</button>
            </article>
          ))}
        </section>
      </section>
      {settings && (
        <section className="settings-panel">
          <h2>AI generation settings</h2>
          <label><span>Master prompt</span><textarea rows={7} value={settings.masterPrompt} onChange={(event) => setSettings({ ...settings, masterPrompt: event.target.value })} /></label>
          <div className="settings-row">
            <label>
              <span>Schedule mode</span>
              <select value={settings.generationMode || settings.generationFrequency} onChange={(event) => setSettings({ ...settings, generationMode: event.target.value as 'daily' | 'weekly', generationFrequency: event.target.value as 'daily' | 'weekly' })}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </label>
            <label>
              <span>How many times</span>
              <input type="number" min={1} max={12} value={settings.generationCount || 1} onChange={(event) => updateGenerationCount(Number(event.target.value))} />
            </label>
          </div>
          <div>
            <span className="field-title">Generation times</span>
            <div className="time-grid">
              {(settings.generationTimes?.length ? settings.generationTimes : [settings.generationTime || '08:00']).slice(0, settings.generationCount || 1).map((time, index) => (
                <label key={`${index}-${time}`}>
                  <span>Run {index + 1}</span>
                  <input type="time" value={time} onChange={(event) => updateGenerationTime(index, event.target.value)} />
                </label>
              ))}
            </div>
          </div>
          {(settings.generationMode || settings.generationFrequency) === 'weekly' && (
            <div>
              <span className="field-title">Weekdays</span>
              <div className="weekday-grid">
                {weekdays.map((day) => (
                  <label key={day.value} className="weekday-option">
                    <input type="checkbox" checked={(settings.generationWeekdays || [1]).includes(day.value)} onChange={() => toggleWeekday(day.value)} />
                    {day.label}
                  </label>
                ))}
              </div>
            </div>
          )}
          <label className="checkbox"><input type="checkbox" checked={settings.autoGenerationEnabled} onChange={(event) => setSettings({ ...settings, autoGenerationEnabled: event.target.checked })} /> Auto generation enabled</label>
          <button onClick={saveSettings}><Save size={16} /> Save settings</button>
        </section>
      )}
    </main>
  );
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const syncPath = () => setPath(window.location.pathname);
    window.addEventListener('popstate', syncPath);
    window.addEventListener('app:navigate', syncPath);
    return () => {
      window.removeEventListener('popstate', syncPath);
      window.removeEventListener('app:navigate', syncPath);
    };
  }, []);

  useEffect(() => {
    getPosts().then(setPosts).catch((err) => setError(err instanceof Error ? err.message : 'Could not load articles.'));
  }, []);

  const articles = posts.map(toArticle);
  const slug = path.startsWith('/articles/') ? decodeURIComponent(path.replace('/articles/', '')) : '';
  const article = slug ? articles.find((item) => item.slug === slug) : undefined;

  useEffect(() => {
    if (!slug || article || posts.length === 0) return;
    getPost(slug).then((post) => setPosts((current) => current.some((item) => item.slug === post.slug) ? current : [post, ...current])).catch(() => undefined);
  }, [slug, article, posts.length]);

  return (
    <>
      <Header />
      {error && <div className="load-error">{error}</div>}
      {path === '/admin' ? <AdminPanel /> : path === '/articles' ? <ArticlesPage articles={articles} /> : slug ? <ArticlePage article={article} /> : <HomePage articles={articles} />}
    </>
  );
}
