export function removeInlineAboutAuthor(content: string) {
  return content.replace(/<h2>\s*About the Author\s*<\/h2>\s*<p>[\s\S]*?<\/p>\s*$/i, '').trim();
}
