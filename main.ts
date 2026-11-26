// One-Liner Laughs — u-coral-404-one-liner-laughs-aa872d41
// Entry: a single funny line (gate: 1-200 UTF-8 characters, one line, non-blank).
// The joke: an AI assistant answers a dating question with the oldest IT-support
// line there is. Setup in the first half, payoff in the last beat.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The joke, built from named parts so the setup and the payoff stay distinct.
const PARTS = {
  setup: "I asked my AI assistant for dating advice and it said: ",
  punchline: "'Have you tried turning yourself off and on again?'",
};

function buildEntry(): string {
  return PARTS.setup + PARTS.punchline;
}

interface GateReport {
  ok: boolean;
  chars: number;
  lines: number;
  blank: boolean;
}

function validateEntry(entry: string): GateReport {
  const chars = [...entry].length;
  const lines = entry.split("\n").length;
  const blank = entry.trim().length === 0;
  return { ok: chars >= 1 && chars <= 200 && lines === 1 && !blank, chars, lines, blank };
}

function verifyWritten(target: string, expected: string): string {
  const written = readFileSync(target, "utf8");
  if (written !== expected) throw new Error("read-back mismatch");
  return createHash("sha256").update(written, "utf8").digest("hex");
}

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const entry = buildEntry();
  const report = validateEntry(entry);
  if (!report.ok) {
    throw new Error(
      `gate failed: ${report.chars} chars, ${report.lines} lines, blank=${report.blank}`,
    );
  }
  const target = join(outDir, "entry.txt");
  writeFileSync(target, entry, "utf8");
  const sha = verifyWritten(target, entry);
  console.log(`gate passes: ${report.chars} characters, ${report.lines} line, sha256 ${sha}`);
  console.log(`verified: ${JSON.stringify(entry)}`);
}

main();
