const caseTypeInput = document.querySelector("#caseType");
const locationInput = document.querySelector("#locationInput");
const audienceSelect = document.querySelector("#audienceSelect");
const durationInput = document.querySelector("#durationInput");
const styleSelect = document.querySelector("#styleSelect");
const extraInput = document.querySelector("#extraInput");
const preview = document.querySelector("#preview");
const resultText = document.querySelector("#resultText");
const copyState = document.querySelector("#copyState");

const audienceLabel = {
  frontline: "一线作业人员",
  manager: "班组长与管理人员",
  mixed: "企业全员",
};

const styleTone = {
  serious: {
    opener: "真实事故往往只在几秒内发生",
    ending: "事故可防可控，违章就是最大的风险源。",
  },
  story: {
    opener: "这是一个在钢厂里经常被忽视的瞬间",
    ending: "记住流程，守住底线，人人都能平安回家。",
  },
  warm: {
    opener: "安全不是口号，而是每一步都被认真执行",
    ending: "把规范变成习惯，安全就会一直在身边。",
  },
};

const caseLibrary = {
  高空坠落: {
    hazards: ["未系安全带", "临边无防护", "雨后平台湿滑"],
    rules: ["高处作业全程双挂点", "作业前确认防护栏与踢脚板", "恶劣天气暂停高处作业"],
  },
  机械卷入: {
    hazards: ["设备未停机检修", "宽松衣物接触旋转部位", "联锁装置被短接"],
    rules: ["严格执行停机上锁挂牌", "检修时穿戴紧身防护用品", "不得擅自拆除安全联锁"],
  },
  煤气中毒: {
    hazards: ["有限空间通风不足", "检测仪未校准", "单人进入危险区域"],
    rules: ["进入前完成气体检测和记录", "全程保持强制通风", "落实双人监护和应急联络"],
  },
};

function pickCaseData(caseType) {
  const direct = caseLibrary[caseType];
  if (direct) return direct;

  return {
    hazards: ["作业前风险识别不足", "现场防护措施不到位", "人员安全意识松懈"],
    rules: ["执行岗位标准化作业", "落实班前风险预控", "发现违章立即制止并复盘"],
  };
}

function splitDuration(duration) {
  const part = Math.max(6, Math.round(duration / 5));
  return [part, part, part, part, duration - part * 4];
}

function buildStoryboard(caseType, location, duration, style, audience, extra) {
  const data = pickCaseData(caseType);
  const [s1, s2, s3, s4, s5] = splitDuration(duration);

  const lines = [
    `【视频主题】钢铁企业安全警示：${caseType}`,
    `【建议时长】${duration}秒`,
    `【目标人群】${audienceLabel[audience]}`,
    `【应用场景】${location}`,
    "",
    "【分镜脚本】",
    `1）开场警示（${s1}秒）`,
    `- 画面：厂区晨会与作业现场切换，字幕“${caseType}风险提示”。`,
    `- 旁白：${styleTone[style].opener}。`,
    "",
    `2）事故经过（${s2}秒）`,
    `- 画面：${location}内，员工准备作业但忽略${data.hazards[0]}，随后出现险情慢动作。`,
    `- 旁白：一次看似熟练的操作，因为${data.hazards[0]}，危险瞬间升级。`,
    "",
    `3）风险点拆解（${s3}秒）`,
    `- 画面：红框标出违规细节：${data.hazards.join("、")}。`,
    `- 旁白：请注意，这些都是${caseType}常见诱因。`,
    "",
    `4）正确做法（${s4}秒）`,
    `- 画面：同一岗位演示规范流程，逐条打勾显示。`,
    `- 旁白：标准动作应为：${data.rules.join("；")}。`,
    "",
    `5）收尾强化（${s5}秒）`,
    "- 画面：班组列队确认“零违章”承诺，叠加企业安全口号。",
    `- 旁白：${styleTone[style].ending}`,
    "",
    "【制作提示】",
    "- 建议加入报警音效和红色闪烁边框强化警示。",
    "- 所有违规演示镜头请标记“危险动作，请勿模仿”。",
  ];

  if (extra.trim()) {
    lines.push(`- 额外要求：${extra.trim()}`);
  }

  return lines.join("\n");
}

function generateVideoScript() {
  const caseType = caseTypeInput.value.trim();
  const location = locationInput.value.trim() || "钢厂作业现场";
  const duration = Number(durationInput.value) || 60;
  const style = styleSelect.value;
  const audience = audienceSelect.value;
  const extra = extraInput.value;

  if (!caseType) {
    preview.textContent = "请先输入安全案例类型（例如：高空坠落）。";
    resultText.value = "";
    return;
  }

  const script = buildStoryboard(caseType, location, duration, style, audience, extra);
  preview.textContent = script;
  resultText.value = script;
  copyState.textContent = "";
}

async function copyResult() {
  if (!resultText.value) {
    copyState.textContent = "暂无可复制内容，请先生成脚本。";
    return;
  }

  try {
    await navigator.clipboard.writeText(resultText.value);
    copyState.textContent = "脚本已复制 ✅";
  } catch {
    resultText.select();
    document.execCommand("copy");
    copyState.textContent = "已使用兼容模式复制 ✅";
  }
}

document.querySelector("#generateBtn").addEventListener("click", generateVideoScript);
document.querySelector("#copyBtn").addEventListener("click", copyResult);

caseTypeInput.value = "高空坠落";
locationInput.value = "连铸平台检修区";
extraInput.value = "结尾增加“作业前先确认，安全后再操作”字幕。";
generateVideoScript();
