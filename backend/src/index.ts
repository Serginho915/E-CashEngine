import './env';
import express from 'express';
import cors from 'cors';
import {
  assignReusableArticleImages,
  authors,
  generateDailyArticles,
  getGeneratedImagesDir,
  readGenerationState,
  readArticles,
  startDailyArticleScheduler,
} from './articleGenerator';
import { startCoverSync } from './coverSync';
import { readSubscribers, subscribeEmail } from './newsletter';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/generated', express.static(getGeneratedImagesDir()));

app.get('/api/articles', async (req, res, next) => {
  try {
    const articles = await readArticles();
    res.json({ data: articles });
  } catch (error) {
    next(error);
  }
});

app.get('/api/articles/:slug', async (req, res, next) => {
  try {
    const articles = await readArticles();
    const found = articles.find((a) => a.slug === req.params.slug);

    if (!found) return res.status(404).json({ error: 'Not found' });

    res.json({ data: found });
  } catch (error) {
    next(error);
  }
});

app.get('/api/authors', (req, res) => res.json({ data: authors }));

app.post('/api/newsletter/subscribe', async (req, res, next) => {
  try {
    const result = await subscribeEmail(String(req.body?.email || ''));
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/subscribers', async (req, res, next) => {
  try {
    const secret = process.env.AI_GENERATION_SECRET;

    if (secret && req.header('x-generation-secret') !== secret) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const subscribers = await readSubscribers();
    res.json({ data: { count: subscribers.length, subscribers } });
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/generation-status', async (req, res, next) => {
  try {
    const [articles, state] = await Promise.all([readArticles(), readGenerationState()]);
    const latest = articles[0];
    const generatedImageCount = articles.filter((article) => article.cover?.startsWith('/generated/')).length;
    const todayInSofia = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Sofia',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());

    res.json({
      data: {
        articleCount: articles.length,
        lastGeneratedDate: state.lastGeneratedDate || null,
        latestArticle: latest
          ? {
              title: latest.title,
              slug: latest.slug,
              createdAt: latest.createdAt,
            }
          : null,
        autoGenerateEnabled: process.env.AUTO_GENERATE_ARTICLES === 'true',
        model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct',
        generatedImageCount,
        scheduleTimeZone: 'Europe/Sofia',
        scheduleSlots: ['07:00', '13:00', '20:00'],
        generatedSlotsToday: state.generatedSlots?.[todayInSofia] || [],
      },
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/generate-daily-articles', async (req, res, next) => {
  try {
    const secret = process.env.AI_GENERATION_SECRET;

    if (secret && req.header('x-generation-secret') !== secret) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const generated = await generateDailyArticles();
    res.json({ data: generated });
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/generate-missing-images', async (req, res, next) => {
  try {
    const secret = process.env.AI_GENERATION_SECRET;

    if (secret && req.header('x-generation-secret') !== secret) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const articles = await assignReusableArticleImages();
    res.json({ data: articles });
  } catch (error) {
    next(error);
  }
});

app.use((error: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  res.status(500).json({ error: error.message || 'Internal server error' });
});

startDailyArticleScheduler();
startCoverSync(getGeneratedImagesDir());

app.listen(4000, () => {
  console.log('API listening on http://localhost:4000');
  console.log('Daily article generation:', process.env.AUTO_GENERATE_ARTICLES === 'true' ? 'enabled' : 'disabled');
});
