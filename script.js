const titleInput = document.querySelector("#titleInput");
const contentInput = document.querySelector("#contentInput");
const chunkSizeInput = document.querySelector("#chunkSize");
const toneSelect = document.querySelector("#toneSelect");
const emojiLevelInput = document.querySelector("#emojiLevel");
const keywordsInput = document.querySelector("#keywordsInput");
const preview = document.querySelector("#preview");
const resultText = document.querySelector("#resultText");
const copyState = document.querySelector("#copyState");

const tonePrefixMap = {
  friendly: ["姐妹们", "今天来分享", "真心建议收藏"],
  pro: ["核心结论先说", "建议按步骤执行", "重点如下"],
  story: ["事情是这样的", "我当时的真实感受", "最后真的有变化"],
};

const emojiPool = ["✨", "📌", "💡", "📝", "🌟", "✅", "🔥", "🎯"];

function splitByLength(text, size) {
  const normalized = text.replace(/\n+/g, "\n").trim();
  if (!normalized) return [];

  const sentences = normalized
    .replace(/[。！？]/g, "$&\n")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const chunks = [];
  let current = "";

  sentences.forEach((sentence) => {
    if ((current + sentence).length <= size) {
      current += (current ? "" : "") + sentence;
    } else {
      if (current) chunks.push(current);
      current = sentence;
    }
  });

  if (current) chunks.push(current);
  return chunks;
}

function addEmoji(text, level, index) {
  if (level <= 0) return text;
  const emoji = emojiPool[index % emojiPool.length];
  if (level === 1) return `${emoji} ${text}`;
  if (level === 2) return `${emoji} ${text} ${emojiPool[(index + 2) % emojiPool.length]}`;
  return `${emoji} ${text} ${emojiPool[(index + 3) % emojiPool.length]} ${emojiPool[(index + 5) % emojiPool.length]}`;
}

function buildHashtags(rawKeywords, title) {
  const fromInput = rawKeywords
    .split(/[,，\s]+/)
    .map((k) => k.trim())
    .filter(Boolean);

  const titleWords = title
    .split(/[|｜\-\s]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 1)
    .slice(0, 2);

  return [...new Set([...fromInput, ...titleWords])]
    .slice(0, 8)
    .map((tag) => `#${tag}`)
    .join(" ");
}

function formatPost() {
  const title = titleInput.value.trim() || "无标题分享";
  const content = contentInput.value.trim();
  const chunkSize = Number(chunkSizeInput.value) || 48;
  const emojiLevel = Number(emojiLevelInput.value);
  const tone = toneSelect.value;

  if (!content) {
    preview.textContent = "请先输入正文草稿。";
    resultText.value = "";
    return;
  }

  const chunks = splitByLength(content, chunkSize);
  const intro = tonePrefixMap[tone][Math.floor(Math.random() * tonePrefixMap[tone].length)];
  const formattedParagraphs = chunks.map((chunk, index) => addEmoji(chunk, emojiLevel, index));
  const hashtags = buildHashtags(keywordsInput.value, title);

  const finalText = [`${title}`, "", `${intro}：`, ...formattedParagraphs, "", hashtags].join("\n");

  preview.textContent = finalText;
  resultText.value = finalText;
}

async function copyResult() {
  if (!resultText.value) {
    copyState.textContent = "还没有内容可复制。";
    return;
  }

  try {
    await navigator.clipboard.writeText(resultText.value);
    copyState.textContent = "已复制到剪贴板 ✅";
  } catch {
    resultText.select();
    document.execCommand("copy");
    copyState.textContent = "已使用兼容模式复制 ✅";
  }
}

document.querySelector("#formatBtn").addEventListener("click", formatPost);
document.querySelector("#copyBtn").addEventListener("click", copyResult);

contentInput.value = "最近把衣柜重新整理了一遍，发现通勤穿搭其实不需要买很多新衣服。重点是固定几件高频单品，再通过颜色和配饰做变化。早上赶时间的时候，也能在三分钟内搭好一套。";
titleInput.value = "通勤穿搭思路｜3分钟快速出门";
keywordsInput.value = "通勤穿搭,职场搭配,显高";
formatPost();
