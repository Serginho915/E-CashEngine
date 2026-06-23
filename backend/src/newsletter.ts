import fs from 'fs/promises';
import path from 'path';
import nodemailer from 'nodemailer';
import { Article } from './articleGenerator';

type Subscriber = {
  email: string;
  createdAt: string;
};

const dataDir = process.env.ARTICLES_DATA_DIR || path.join(process.cwd(), 'data');
const subscribersFile = path.join(dataDir, 'subscribers.json');

async function ensureDataDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function readSubscribers(): Promise<Subscriber[]> {
  try {
    const raw = await fs.readFile(subscribersFile, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

async function writeSubscribers(subscribers: Subscriber[]) {
  await ensureDataDir();
  await fs.writeFile(subscribersFile, JSON.stringify(subscribers, null, 2));
}

export async function subscribeEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);

  if (!isValidEmail(normalizedEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  const subscribers = await readSubscribers();
  const exists = subscribers.some((subscriber) => subscriber.email === normalizedEmail);

  if (exists) {
    return { email: normalizedEmail, alreadySubscribed: true };
  }

  subscribers.push({
    email: normalizedEmail,
    createdAt: new Date().toISOString(),
  });

  await writeSubscribers(subscribers);

  return { email: normalizedEmail, alreadySubscribed: false };
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

function articleUrl(article: Article) {
  const siteUrl = (process.env.SITE_URL || 'https://e-cashengine.com').replace(/\/+$/, '');
  return `${siteUrl}/articles/${article.slug}`;
}

export async function sendArticleNewsletter(article: Article) {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn('SMTP is not configured. Skipping newsletter send.');
    return { sent: 0, skipped: true };
  }

  const subscribers = await readSubscribers();

  if (subscribers.length === 0) {
    return { sent: 0, skipped: false };
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const url = articleUrl(article);

  await Promise.all(
    subscribers.map((subscriber) =>
      transporter.sendMail({
        from,
        to: subscriber.email,
        subject: article.title,
        text: `${article.title}\n\n${article.excerpt}\n\nRead the guide: ${url}`,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1c1917;max-width:640px;margin:0 auto;">
            <p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#92400e;font-weight:700;">e-CashEngine</p>
            <h1 style="font-size:28px;line-height:1.15;margin:0 0 16px;">${article.title}</h1>
            <p style="font-size:16px;color:#57534e;margin:0 0 24px;">${article.excerpt}</p>
            <a href="${url}" style="display:inline-block;background:#1c1917;color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700;">Read the guide</a>
            <p style="font-size:12px;color:#78716c;margin-top:32px;">You subscribed to e-CashEngine updates.</p>
          </div>
        `,
      }),
    ),
  );

  return { sent: subscribers.length, skipped: false };
}
