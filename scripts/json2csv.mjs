#!/usr/bin/env node
/**
 * 将单词 JSON（多个 JSON 对象直接拼接的文本）转换为 CSV
 *
 * 用法：
 *   node scripts/json2csv.mjs [输入json路径]
 *
 * 说明：
 *   - 默认输入为 danci-admin/temp/PEPXiaoXue3_1.json
 *   - 输出保存到输入文件同级目录，文件名相同、扩展名为 .csv
 *   - CSV 列为：wordRank、headWord、content、bookId，其中 content 以 JSON 字符串保存
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// 默认输入：danci-admin/temp/PEPXiaoXue3_1.json
const DEFAULT_INPUT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../danci-admin/temp/PEPXiaoXue6_2.json"
);

const inputPath = resolve(process.argv[2] ?? DEFAULT_INPUT);

/**
 * 解析"多个 JSON 对象依次拼接"的文本。
 * 通过扫描括号深度拆分出每个顶层对象，再逐个 JSON.parse。
 */
function splitTopLevelObjects(text) {
  const objects = [];
  let depth = 0;
  let inString = false;
  let escaped = false;
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0) {
        objects.push(JSON.parse(text.slice(start, i + 1)));
      }
    }
  }
  return objects;
}

/** 对象转单行 JSON 字符串（保留内容中的换行为 \n 文本，保证 CSV 单行） */
function toSingleLineJson(obj) {
  return JSON.stringify(obj).replace(/\r\n|\r|\n/g, "\\n");
}

/** CSV 字段转义：含逗号、双引号、换行的字段用双引号包裹，内部引号翻倍 */
function csvField(value) {
  const str = value == null ? "" : String(value);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function main() {
  const text = readFileSync(inputPath, "utf8");
  const items = splitTopLevelObjects(text);
  if (items.length === 0) {
    console.error("未解析到任何对象，请检查输入文件格式");
    process.exit(1);
  }

  console.log(`解析到 ${items.length} 条单词记录`);

  const header = ["wordRank", "headWord", "content", "bookId"];
  const rows = items.map((item) => [
    item.wordRank,
    item.headWord,
    toSingleLineJson(item.content),
    item.bookId,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map(csvField).join(","))
    .join("\r\n");

  const outputPath = join(dirname(inputPath), `${basename(inputPath, ".json")}.csv`);
  // 添加 BOM，便于 Excel 直接识别 UTF-8 编码
  writeFileSync(outputPath, `\uFEFF${csv}`, "utf8");
  console.log("已写入:", outputPath);
}

main();
