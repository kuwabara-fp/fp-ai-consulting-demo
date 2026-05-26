// くわばらFPオフィス｜AI相談準備 デモ
// LINE公式URL・予約URLが決まったら、下の2行だけ差し替えてください。
const CONFIG = {
  lineUrl: "https://lin.ee/Wf1NplO",
  reserveUrl: "https://app.spirinc.com/t/i51z4D0myb7D1Fd-R63M6/as/he_EM0oRj1WhJec_xsWiC/confirm"
};

const state = {
  screen: 1,
  selectedThemes: new Set(),
  form: {},
  result: null
};

const titles = {
  1: ["トップ", "トップ画面"],
  2: ["テーマ選択", "相談テーマ選択"],
  3: ["情報入力", "家族・家計状況入力"],
  4: ["AI整理中", "AIが整理中"],
  5: ["整理結果", "整理結果の要約"],
  6: ["事前準備", "相談前チェックリスト"],
  7: ["相談へ進む", "相談方法選択"]
};

const themeMaster = {
  education: { label: "教育費の準備", detail: "進学時期・準備額・家計とのバランスを整理すると相談が進めやすくなります。" },
  mortgage: { label: "住宅ローン返済との両立", detail: "返済負担、金利変動、教育費との優先順位を確認する必要があります。" },
  budget: { label: "家計管理の見える化", detail: "毎月の収支と貯蓄余力を把握することで、改善ポイントが明確になります。" },
  nisa: { label: "NISA・資産形成の目的整理", detail: "投資商品ではなく、目的・期間・無理のない金額を整理することが先です。" },
  insurance: { label: "保険の過不足確認", detail: "保障内容と家族構成を照らし合わせ、見直しの必要性を確認します。" },
  retirement: { label: "老後資金の見通し", detail: "将来の生活費、年金、準備額のイメージを整理する相談が有効です。" }
};

const screens = [...document.querySelectorAll(".screen")];
const screenTitle = document.getElementById("screenTitle");
const stepText = document.getElementById("stepText");
const stepLabel = document.getElementById("stepLabel");
const progressBar = document.getElementById("progressBar");
const backButton = document.getElementById("backButton");
const resetButton = document.getElementById("resetButton");
const navItems = [...document.querySelectorAll(".nav-item")];
const toast = document.getElementById("toast");

document.getElementById("lineLink").href = CONFIG.lineUrl;
document.getElementById("reserveLink").href = CONFIG.reserveUrl;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function setScreen(nextScreen) {
  state.screen = Math.min(7, Math.max(1, Number(nextScreen)));
  screens.forEach(screen => {
    screen.classList.toggle("active", Number(screen.dataset.screen) === state.screen);
  });

  const [title, label] = titles[state.screen];
  screenTitle.textContent = title;
  stepText.textContent = `${state.screen} / 7`;
  stepLabel.textContent = label;
  progressBar.style.width = `${(state.screen / 7) * 100}%`;
  backButton.style.visibility = state.screen === 1 ? "hidden" : "visible";

  navItems.forEach(item => {
    const target = Number(item.dataset.jump);
    item.classList.toggle("active", target === state.screen);
  });

  if (state.screen === 4) startAnalysis();
  if (state.screen === 5) renderResult();
}

function validateThemeSelection() {
  const alert = document.getElementById("themeAlert");
  if (state.selectedThemes.size === 0) {
    alert.hidden = false;
    return false;
  }
  alert.hidden = true;
  return true;
}

function collectForm() {
  const data = new FormData(document.getElementById("prepForm"));
  state.form = Object.fromEntries(data.entries());
}

function createResult() {
  const themes = [...state.selectedThemes];
  const selected = themes.map(key => themeMaster[key]).filter(Boolean);

  let top = selected.slice(0, 3);
  if (top.length === 0) top = [themeMaster.education, themeMaster.mortgage, themeMaster.budget];

  const hasChildren = (state.form.children || "").trim().length > 0 || state.form.family === "夫婦＋子ども";
  const hasLoan = state.form.loan === "あり" || state.selectedThemes.has("mortgage");
  const savingUnknown = state.form.saving === "未把握";

  let focus = "家計全体の優先順位を整理すること";
  if (state.selectedThemes.has("education") && hasLoan) {
    focus = "教育費と住宅ローン返済のバランスを整理すること";
  } else if (state.selectedThemes.has("nisa") && savingUnknown) {
    focus = "資産形成の前に、毎月の貯蓄余力を確認すること";
  } else if (state.selectedThemes.has("insurance")) {
    focus = "現在の保障内容と家族構成の変化を照らし合わせること";
  }

  const worry = (state.form.worry || "").trim();
  const context = [state.form.age || "", state.form.family || "", hasChildren ? "子育て世帯" : "", hasLoan ? "住宅ローンあり" : ""].filter(Boolean).join("・");

  const summary = `現在の状況は「${context || "家計の見直しを検討中"}」として整理できます。相談では、まず${focus}が有効です。${
    worry ? "自由記述の内容も踏まえると、悩みを一度に解決しようとせず、優先順位を決めて確認する流れが適しています。" : "不安が漠然としている場合でも、収支・将来イベント・必要資料を一緒に確認すると整理しやすくなります。"
  }`;

  state.result = { top, summary };
  return state.result;
}

function renderResult() {
  collectForm();
  const result = createResult();
  const topThemes = document.getElementById("topThemes");
  topThemes.innerHTML = "";

  result.top.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${item.label}</strong><br><span>${item.detail}</span>`;
    topThemes.appendChild(li);
  });

  document.getElementById("summaryText").textContent = result.summary;
}

function startAnalysis() {
  const ring = document.querySelector(".analysis-ring");
  const percent = document.getElementById("analysisPercent");
  const next = document.getElementById("analysisNext");
  let value = 0;

  next.disabled = true;
  next.classList.remove("ready");
  percent.textContent = "0%";
  ring.style.setProperty("--p", "0deg");

  const timer = setInterval(() => {
    value += Math.floor(Math.random() * 12) + 8;
    if (value >= 100) {
      value = 100;
      clearInterval(timer);
      next.disabled = false;
      next.classList.add("ready");
      showToast("整理が完了しました");
    }
    percent.textContent = `${value}%`;
    ring.style.setProperty("--p", `${value * 3.6}deg`);
  }, 220);
}

document.querySelectorAll(".next").forEach(button => {
  button.addEventListener("click", () => {
    if (button.classList.contains("validate-themes") && !validateThemeSelection()) {
      showToast("相談テーマを1つ以上選んでください");
      return;
    }
    if (state.screen === 3) collectForm();
    setScreen(state.screen + 1);
  });
});

document.querySelectorAll("[data-jump]").forEach(button => {
  button.addEventListener("click", () => {
    const target = Number(button.dataset.jump);
    if (target === 5 && !state.result && state.screen < 4) {
      showToast("先にテーマと状況を入力すると結果が表示されます");
      return;
    }
    setScreen(target);
  });
});

document.querySelectorAll(".theme-tile").forEach(tile => {
  tile.addEventListener("click", () => {
    const theme = tile.dataset.theme;
    if (state.selectedThemes.has(theme)) {
      state.selectedThemes.delete(theme);
      tile.classList.remove("selected");
    } else {
      state.selectedThemes.add(theme);
      tile.classList.add("selected");
    }
    validateThemeSelection();
  });
});

backButton.addEventListener("click", () => setScreen(state.screen - 1));

resetButton.addEventListener("click", () => {
  state.screen = 1;
  state.selectedThemes.clear();
  state.form = {};
  state.result = null;
  document.querySelectorAll(".theme-tile").forEach(tile => tile.classList.remove("selected"));
  document.getElementById("prepForm").reset();
  setScreen(1);
  showToast("最初からやり直します");
});

document.getElementById("saveResult").addEventListener("click", async () => {
  collectForm();
  const result = state.result || createResult();
  const selectedLabels = [...state.selectedThemes].map(key => themeMaster[key]?.label).filter(Boolean);
  const text = [
    "【AI相談準備 整理結果】",
    `相談テーマ：${selectedLabels.join("、") || "未選択"}`,
    `年代：${state.form.age || ""}`,
    `家族構成：${state.form.family || ""}`,
    `子ども：${state.form.children || ""}`,
    `住宅ローン：${state.form.loan || ""}`,
    "",
    "■ 相談テーマTOP",
    ...result.top.map((item, index) => `${index + 1}. ${item.label}`),
    "",
    "■ 整理メモ",
    result.summary,
    "",
    "※これは相談前整理であり、特定の商品提案や投資判断ではありません。"
  ].join("\n");

  try {
    await navigator.clipboard.writeText(text);
    showToast("整理結果をコピーしました");
  } catch (error) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-consulting-prep-result.txt";
    a.click();
    URL.revokeObjectURL(url);
    showToast("整理結果を保存しました");
  }
});

document.getElementById("lineLink").addEventListener("click", (event) => {
  if (CONFIG.lineUrl.includes("REPLACE_ME")) {
    event.preventDefault();
    showToast("LINE公式URLを設定すると遷移できます");
  }
});

document.getElementById("reserveLink").addEventListener("click", (event) => {
  if (CONFIG.reserveUrl.includes("example.com")) {
    event.preventDefault();
    showToast("予約URLを設定すると遷移できます");
  }
});

setScreen(1);
