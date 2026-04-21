'use client';

/**
 * Simple markdown-to-HTML renderer for guide content.
 * Handles: headings, paragraphs, bold, links, tables, lists, code.
 * No external dependency needed for our basic guide content.
 */
export function Markdown({ content }: { content: string }) {
  const html = markdownToHtml(content.trim());

  return (
    <div
      className="prose prose-sm sm:prose-base max-w-none
        prose-headings:font-bold prose-headings:text-foreground
        prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
        prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
        prose-p:text-muted-foreground prose-p:leading-relaxed
        prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80
        prose-strong:text-foreground prose-strong:font-semibold
        prose-li:text-muted-foreground
        prose-table:text-sm
        prose-th:text-left prose-th:font-medium prose-th:text-muted-foreground prose-th:pb-2 prose-th:border-b
        prose-td:py-1.5 prose-td:pr-4 prose-td:font-mono prose-td:text-sm
        prose-tr:border-b prose-tr:border-border/30
        prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function markdownToHtml(md: string): string {
  let html = md;

  // Tables
  html = html.replace(/^(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)+)/gm, (_, header, _sep, body) => {
    const headerCells = header.split('|').filter((c: string) => c.trim()).map((c: string) => `<th>${c.trim()}</th>`).join('');
    const rows = body.trim().split('\n').map((row: string) => {
      const cells = row.split('|').filter((c: string) => c.trim()).map((c: string) => `<td>${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<table><thead><tr>${headerCells}</tr></thead><tbody>${rows}</tbody></table>`;
  });

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Ordered lists
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>');
  html = html.replace(/((?:<li>.+<\/li>\n?)+)/g, '<ol>$1</ol>');

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>.+<\/li>\n?)+)/g, (match) => {
    if (match.includes('<ol>')) return match;
    return `<ul>${match}</ul>`;
  });

  // Paragraphs (lines not already wrapped in tags)
  html = html.replace(/^(?!<[a-z])((?!^\s*$).+)$/gm, (match) => {
    if (match.startsWith('<')) return match;
    return `<p>${match}</p>`;
  });

  // Clean up empty lines
  html = html.replace(/\n{2,}/g, '\n');

  return html;
}
