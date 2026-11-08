import React from "react";

interface ProductDescriptionProps {
  content?: string | null;
  className?: string;
}

interface TableRow {
  key: string;
  value: string;
}

export function ProductDescription({ content, className = "" }: ProductDescriptionProps) {
  if (!content || !content.trim()) {
    return (
      <p className="text-muted-foreground font-light text-sm leading-relaxed">
        No product specifications available.
      </p>
    );
  }

  // Parse lines to detect Markdown tables, bullet points, horizontal rules, and paragraphs
  const rawLines = content.split("\n");
  const blocks: Array<
    | { type: "table"; rows: TableRow[] }
    | { type: "hr" }
    | { type: "bullets"; items: string[] }
    | { type: "paragraph"; text: string }
  > = [];

  let currentTableRows: TableRow[] = [];
  let currentBullets: string[] = [];
  let currentParagraphLines: string[] = [];

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      const text = currentParagraphLines.join(" ").trim();
      if (text) {
        blocks.push({ type: "paragraph", text });
      }
      currentParagraphLines = [];
    }
  };

  const flushTable = () => {
    if (currentTableRows.length > 0) {
      blocks.push({ type: "table", rows: [...currentTableRows] });
      currentTableRows = [];
    }
  };

  const flushBullets = () => {
    if (currentBullets.length > 0) {
      blocks.push({ type: "bullets", items: [...currentBullets] });
      currentBullets = [];
    }
  };

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();

    if (!line) {
      flushParagraph();
      flushTable();
      flushBullets();
      continue;
    }

    // Markdown Table Row: | Col1 | Col2 |
    if (line.startsWith("|") && line.endsWith("|")) {
      flushParagraph();
      flushBullets();

      // Check if it is a separator line like |---|---|
      if (/^\|(\s*[-:]+\s*\|)+$/.test(line)) {
        continue; // skip markdown header divider
      }

      const cells = line
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());

      if (cells.length >= 2) {
        currentTableRows.push({
          key: cells[0],
          value: cells.slice(1).join(" | "),
        });
      }
      continue;
    }

    // Horizontal Rule: --- or *** or ___
    if (/^([-*_]){3,}$/.test(line)) {
      flushParagraph();
      flushTable();
      flushBullets();
      blocks.push({ type: "hr" });
      continue;
    }

    // Bullet Point: starts with - , * , • or +
    if (/^[-*•+]\s+/.test(line)) {
      flushParagraph();
      flushTable();
      currentBullets.push(line.replace(/^[-*•+]\s+/, "").trim());
      continue;
    }

    // Key: Value pair table row fallback (e.g. "Color: Wenge")
    const keyValueMatch = line.match(/^([A-Za-z0-9\s()/-]{2,28})\s*:\s*(.+)$/);
    if (keyValueMatch && !line.includes("http://") && !line.includes("https://") && keyValueMatch[1].length < 30) {
      // If we are currently collecting bullets or long paragraphs, treat carefully
      if (line.length < 120 && !currentParagraphLines.length) {
        flushBullets();
        currentTableRows.push({
          key: keyValueMatch[1].trim(),
          value: keyValueMatch[2].trim(),
        });
        continue;
      }
    }

    // Regular text line
    flushTable();
    flushBullets();
    currentParagraphLines.push(line);
  }

  flushParagraph();
  flushTable();
  flushBullets();

  return (
    <div className={`space-y-6 ${className}`}>
      {blocks.map((block, idx) => {
        if (block.type === "table") {
          return (
            <div
              key={idx}
              className="w-full overflow-hidden rounded-md border border-neutral-300 dark:border-neutral-700 bg-background"
            >
              <table className="w-full text-left text-sm border-collapse">
                <tbody>
                  {block.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="border-b border-neutral-300 dark:border-neutral-700 last:border-b-0 transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30"
                    >
                      <td className="w-[35%] sm:w-[32%] py-3 px-4 font-normal text-neutral-600 dark:text-neutral-400 border-r border-neutral-300 dark:border-neutral-700 text-[13.5px] sm:text-sm bg-neutral-50/40 dark:bg-neutral-900/20">
                        {row.key}
                      </td>
                      <td className="py-3 px-4 font-normal text-neutral-900 dark:text-neutral-100 text-[13.5px] sm:text-sm">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === "hr") {
          return (
            <div
              key={idx}
              className="my-6 border-t border-neutral-200 dark:border-neutral-800"
            />
          );
        }

        if (block.type === "bullets") {
          return (
            <ul key={idx} className="space-y-3.5 my-4">
              {block.items.map((item, bIdx) => {
                // If item has "Title: Description", make the title bold like in the reference image
                const colonIdx = item.indexOf(":");
                if (colonIdx > 0 && colonIdx < 35) {
                  const title = item.substring(0, colonIdx);
                  const rest = item.substring(colonIdx + 1);
                  return (
                    <li key={bIdx} className="flex items-start gap-2.5 text-[14px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-neutral-700 dark:bg-neutral-400 mt-2 shrink-0" />
                      <span>
                        <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {title}:
                        </strong>
                        {rest}
                      </span>
                    </li>
                  );
                }

                return (
                  <li key={bIdx} className="flex items-start gap-2.5 text-[14px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-neutral-700 dark:bg-neutral-400 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        if (block.type === "paragraph") {
          return (
            <p
              key={idx}
              className="text-[14px] text-neutral-600 dark:text-neutral-300 font-light leading-relaxed"
            >
              {block.text}
            </p>
          );
        }

        return null;
      })}
    </div>
  );
}

// Utility to get a clean short text preview (stripping table pipes)
export function getProductSummary(content?: string | null, maxLength = 160): string {
  if (!content) return "";
  const lines = content.split("\n");
  const textLines = lines.filter((l) => {
    const t = l.trim();
    return t && !t.startsWith("|") && !/^([-*_]){3,}$/.test(t) && !t.startsWith("#");
  });
  const plain = textLines.join(" ").replace(/[-*•+]\s+/g, "").trim();
  if (!plain) return content.slice(0, maxLength);
  return plain.length > maxLength ? `${plain.slice(0, maxLength)}...` : plain;
}

