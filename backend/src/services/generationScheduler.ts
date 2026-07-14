import { auditLog } from './auditLog';
import { getAdminSettings } from './adminSettings';
import { pickRandomCoverImage } from './mediaStore';
import { generateArticlesWithOpenRouter } from './openrouter';
import { makeSlug, upsertPost } from './postStore';

let timer: NodeJS.Timeout | undefined;
let lastRunKey = '';
const generationTimezone = process.env.GENERATION_TIMEZONE || 'Europe/Sofia';

function getScheduleClock(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: generationTimezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    hourCycle: 'h23',
  }).formatToParts(now);

  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value || '';
  const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  return {
    date: `${part('year')}-${part('month')}-${part('day')}`,
    hhmm: `${part('hour')}:${part('minute')}`,
    day: dayMap[part('weekday')] ?? now.getDay(),
  };
}

export async function generateAndStoreArticles(actor?: { id?: string; email?: string }, count = 3) {
  await auditLog('generation_trigger', actor || null);
  const inputs = await generateArticlesWithOpenRouter(count);
  const now = Date.now();
  return Promise.all(
    inputs.map((input, index) => {
      input.slug = `${makeSlug(input.slug || input.title)}-${now}-${index + 1}`;
      if (!input.coverImage) {
        return pickRandomCoverImage().then((coverImage) => upsertPost({ ...input, coverImage: coverImage || undefined }, 'ai'));
      }
      return upsertPost(input, 'ai');
    }),
  );
}

export function startGenerationScheduler() {
  if (timer) clearInterval(timer);
  const tick = async () => {
    try {
      const settings = await getAdminSettings();
      if (!settings.autoGenerationEnabled) return;
      const { date, hhmm, day } = getScheduleClock();
      const times = settings.generationTimes.slice(0, settings.generationCount);
      const shouldRunToday = settings.generationMode === 'daily' || settings.generationWeekdays.includes(day);
      const key = `${date}-${hhmm}`;
      if (shouldRunToday && times.includes(hhmm) && key !== lastRunKey) {
        lastRunKey = key;
        await generateAndStoreArticles();
      }
    } catch (error) {
      console.error('Generation scheduler failed', error);
    }
  };

  void tick();
  timer = setInterval(tick, 60 * 1000);
}
