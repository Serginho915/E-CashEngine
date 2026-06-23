import { Article, Author } from '../types';
import { siteConfig } from './siteConfig';

const now = new Date().toISOString();

export function getMockData(): { featured: Article; trending: Article[]; latest: Article[]; authors: Author[] } {
  const authors: Author[] = [
    {
      id: 'irina-vovk',
      name: 'Irina Vovk',
      bio: 'Digital entrepreneur and online income researcher helping readers build practical, ethical, and scalable income streams.',
      avatar: '/avatars/ava.svg',
      followers: 18600,
      links: { website: siteConfig.siteUrl },
    },
  ];

  const articleCopy = [
    {
      title: 'How to Start Affiliate Marketing in 2026',
      slug: 'start-affiliate-marketing-2026',
      excerpt: 'A realistic beginner roadmap for choosing a niche, publishing helpful content, joining affiliate programs, and earning ethical commissions.',
      content: `
        <h2>Introduction</h2>
        <p>If your income feels too dependent on one paycheck, affiliate marketing can be a practical way to build a second revenue stream without creating your own product first.</p>
        <h2>What Is Affiliate Marketing?</h2>
        <p>Affiliate marketing is a performance-based business model where you recommend useful products and earn a commission when someone buys through your link.</p>
        <h2>Why This Opportunity Matters in 2026</h2>
        <p>Search-driven content, creator newsletters, YouTube reviews, and AI-assisted research make it easier for focused beginners to publish helpful comparisons and tutorials.</p>
        <h2>Step-by-Step Guide</h2>
        <ul><li>Choose one narrow niche with buyer intent.</li><li>Research 20 problems your audience already searches for.</li><li>Join reputable affiliate programs.</li><li>Publish tutorials, reviews, and comparison guides.</li><li>Track clicks, conversions, and content updates monthly.</li></ul>
        <h2>Common Mistakes to Avoid</h2>
        <p>Avoid promoting products you have not researched, chasing every niche, and writing generic reviews that do not help readers make decisions.</p>
        <h2>Realistic Income Expectations</h2>
        <p>Most beginners earn little in the first 90 days. A focused site or channel can reach $100-$1,000 per month in 6-12 months with consistent publishing.</p>
        <h2>Best Tools and Resources</h2>
        <p>Use Google Search Console, Ahrefs or Semrush, WordPress, ConvertKit, and product affiliate dashboards.</p>
        <h2>Success Story</h2>
        <p>A beginner who publishes 40 detailed tutorials in one software niche can build trust, rank for long-tail keywords, and convert readers into recurring commissions.</p>
        <h2>Frequently Asked Questions</h2>
        <h3>Is affiliate marketing still profitable?</h3><p>Yes, but only when your content is specific, trustworthy, and focused on real reader problems.</p>
        <h3>Do I need a website?</h3><p>A website helps, but YouTube, newsletters, and social platforms can also work.</p>
        <h2>Final Thoughts</h2>
        <p>Affiliate marketing rewards patience, honesty, and useful content. Start small, publish consistently, and improve every article with real experience.</p>
        <h2>About the Author</h2>
        <p>Irina Vovk is a digital entrepreneur and online income researcher who helps readers discover practical, ethical, and scalable ways to earn money online through the latest digital opportunities.</p>
      `,
      category: 'Affiliate Marketing',
      readingTime: 12,
      views: 4200,
      cover: '/covers/cover1.png',
      imagePrompt: 'Premium editorial cover for affiliate marketing in 2026, refined online business dashboard, conversion paths, warm gold and navy palette, no text, no logos.',
      tags: ['affiliate marketing', 'passive income', 'SEO', 'online business'],
    },
    {
      title: 'AI Side Hustles Beginners Can Start This Month',
      slug: 'ai-side-hustles-for-beginners',
      excerpt: 'Practical AI-powered services beginners can package, sell, and deliver ethically without promising overnight riches.',
      content: `
        <h2>Introduction</h2>
        <p>AI will not magically make anyone rich, but it can help motivated beginners deliver faster research, content, operations, and marketing services.</p>
        <h2>What Are AI Side Hustles?</h2>
        <p>AI side hustles use tools like ChatGPT, Canva, automation platforms, and research assistants to deliver valuable services to real customers.</p>
        <h2>Why This Opportunity Matters in 2026</h2>
        <p>Small businesses need practical AI help, but many owners do not have time to test tools or build repeatable workflows.</p>
        <h2>Step-by-Step Guide</h2>
        <ul><li>Pick one service: blog briefs, social repurposing, lead research, or workflow setup.</li><li>Create a simple before-and-after sample.</li><li>Package the offer with clear deliverables.</li><li>Pitch 20 niche businesses per week.</li><li>Use feedback to refine your process.</li></ul>
        <h2>Common Mistakes to Avoid</h2>
        <p>Do not sell AI output without editing, fact-checking, or strategy. Clients pay for judgment, not raw prompts.</p>
        <h2>Realistic Income Expectations</h2>
        <p>A beginner can charge $150-$500 for small projects and grow toward $1,000-$3,000 per month with repeat clients.</p>
        <h2>Best Tools and Resources</h2>
        <p>ChatGPT, Claude, Perplexity, Canva, Zapier, Notion, Google Sheets, and Loom are enough to start.</p>
        <h2>Success Story</h2>
        <p>A freelancer can help local coaches turn one webinar into email sequences, short posts, and article drafts, saving hours every month.</p>
        <h2>Frequently Asked Questions</h2>
        <h3>Do I need technical skills?</h3><p>No, but you need process discipline, clear communication, and careful quality control.</p>
        <h3>Is it ethical to use AI for client work?</h3><p>Yes, when you are transparent where needed and deliver accurate, edited, useful work.</p>
        <h2>Final Thoughts</h2>
        <p>The best AI side hustles combine automation with human responsibility. Start with one narrow service and become excellent at it.</p>
        <h2>About the Author</h2>
        <p>Irina Vovk is a digital entrepreneur and online income researcher who helps readers discover practical, ethical, and scalable ways to earn money online through the latest digital opportunities.</p>
      `,
      category: 'AI Side Hustles',
      readingTime: 10,
      views: 5100,
      cover: '/covers/cover2.png',
      imagePrompt: 'Premium editorial cover for AI side hustles, clean workflow automation interface, modern teal and charcoal palette, no text, no logos.',
      tags: ['AI side hustles', 'freelancing', 'online income', 'digital services'],
    },
    {
      title: 'Freelance Copywriting: A Practical Income Plan',
      slug: 'freelance-copywriting-income-plan',
      excerpt: 'Learn how to build a simple copywriting offer, find first clients, create samples, and grow a sustainable freelance income.',
      content: `
        <h2>Introduction</h2>
        <p>Freelance copywriting is one of the most accessible online income paths because every business needs clearer words that help customers take action.</p>
        <h2>What Is Freelance Copywriting?</h2>
        <p>Copywriting means writing persuasive emails, landing pages, ads, product pages, and website copy that supports business goals.</p>
        <h2>Why This Opportunity Matters in 2026</h2>
        <p>More businesses sell online, and many need writers who understand positioning, customer pain points, and conversion-focused messaging.</p>
        <h2>Step-by-Step Guide</h2>
        <ul><li>Choose one niche such as SaaS, coaches, ecommerce, or local services.</li><li>Create three portfolio samples.</li><li>Build a one-page service page.</li><li>Send personalized outreach to businesses with obvious copy gaps.</li><li>Ask every client for a testimonial and referral.</li></ul>
        <h2>Common Mistakes to Avoid</h2>
        <p>Do not call yourself a general writer for everyone. Specific offers are easier to buy and easier to price.</p>
        <h2>Realistic Income Expectations</h2>
        <p>New writers may start at $100-$300 per project. With proof and specialization, $1,500-$5,000 monthly retainers become realistic.</p>
        <h2>Best Tools and Resources</h2>
        <p>Use Google Docs, Grammarly, Hemingway, swipe files, customer reviews, and call recordings to improve copy quality.</p>
        <h2>Success Story</h2>
        <p>A writer who specializes in welcome email sequences for online course creators can turn one clear offer into repeat monthly work.</p>
        <h2>Frequently Asked Questions</h2>
        <h3>Can beginners get copywriting clients?</h3><p>Yes, if they show relevant samples and solve a specific business problem.</p>
        <h3>Do I need certification?</h3><p>No. Proof, clear thinking, and client results matter more.</p>
        <h2>Final Thoughts</h2>
        <p>Copywriting rewards practice and empathy. Study customers, write daily, and build proof one project at a time.</p>
        <h2>About the Author</h2>
        <p>Irina Vovk is a digital entrepreneur and online income researcher who helps readers discover practical, ethical, and scalable ways to earn money online through the latest digital opportunities.</p>
      `,
      category: 'Freelancing',
      readingTime: 11,
      views: 3600,
      cover: '/covers/cover3.png',
      imagePrompt: 'Premium editorial cover for freelance copywriting, elegant writing desk and conversion strategy boards, amber and stone palette, no text, no logos.',
      tags: ['copywriting', 'freelancing', 'remote work', 'client acquisition'],
    },
    {
      title: 'Digital Products That Can Become Passive Income',
      slug: 'digital-products-passive-income',
      excerpt: 'A grounded guide to creating templates, mini-courses, ebooks, and toolkits that solve specific problems and sell repeatedly.',
      content: '<h2>Introduction</h2><p>Digital products can create leverage when they solve a painful, specific problem for a defined audience.</p><h2>What Are Digital Products?</h2><p>Digital products include templates, ebooks, spreadsheets, prompts, courses, and toolkits customers can download or access online.</p><h2>Step-by-Step Guide</h2><ul><li>Find one repeated problem.</li><li>Create a small solution.</li><li>Test it with 10 people.</li><li>Launch with clear examples.</li><li>Improve based on buyer feedback.</li></ul><h2>Final Thoughts</h2><p>Passive income is rarely passive at the start. Build something useful, improve it, and let trust compound.</p><h2>About the Author</h2><p>Irina Vovk is a digital entrepreneur and online income researcher who helps readers discover practical, ethical, and scalable ways to earn money online through the latest digital opportunities.</p>',
      category: 'Digital Products',
      readingTime: 9,
      views: 2900,
      cover: '/covers/cover4.png',
      imagePrompt: 'Premium editorial cover for digital products and passive income, polished product templates and analytics, deep slate and gold palette, no text, no logos.',
      tags: ['digital products', 'passive income', 'online courses'],
    },
  ];

  const make = (i: number): Article => {
    const source = articleCopy[i % articleCopy.length];

    return {
      id: `art-${i}`,
      title: source.title,
      slug: source.slug,
      excerpt: source.excerpt,
      content: source.content,
      cover: source.cover,
      authorId: authors[0].id,
      readingTime: source.readingTime + Math.floor(i / articleCopy.length),
      category: source.category,
      createdAt: now,
      views: source.views + 260 * i,
      tags: source.tags,
    };
  };

  const latest = Array.from({ length: 8 }).map((_, i) => make(i));
  const trending = latest.slice(0, 4);
  const featured = latest[0];

  return { featured, trending, latest, authors };
}
