(() => {
  const form = document.querySelector("#phone-form");
  const input = document.querySelector("#phone");
  const error = document.querySelector("#form-error");
  const result = document.querySelector("#result");
  const rows = window.PAIR_MEANINGS || [];
  const byPair = new Map(rows.map((row) => [row.pair, row]));
  const weights = [10, 10, 10, 15, 15, 15, 25];

  const normalizePair = (pair) => pair[0] <= pair[1] ? pair : pair[1] + pair[0];
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);

  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "").slice(0, 10);
    error.textContent = "";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const phone = input.value.replace(/\D/g, "");

    if (!/^0\d{9}$/.test(phone)) {
      error.textContent = "กรุณากรอกเบอร์มือถือไทย 10 หลัก โดยขึ้นต้นด้วย 0";
      result.hidden = true;
      return;
    }

    if (new Set(phone.slice(2)).size === 1) {
      error.textContent = "กรุณาใช้เบอร์ที่มีตัวเลขหลากหลายเพื่อให้วิเคราะห์ได้";
      result.hidden = true;
      return;
    }

    const digits = phone.slice(-8);
    const grouped = new Map();
    let weightedTotal = 0;
    let weightTotal = 0;
    const themeScores = new Map();

    for (let i = 0; i < 7; i += 1) {
      const visiblePair = digits.slice(i, i + 2);
      const key = normalizePair(visiblePair);
      const meaning = byPair.get(key);
      if (!meaning) continue;

      const weight = weights[i];
      weightedTotal += meaning.score * weight;
      weightTotal += weight;

      const existing = grouped.get(key);
      if (existing) {
        existing.weight += weight;
        existing.count += 1;
        existing.positions.push(i + 1);
      } else {
        grouped.set(key, {
          ...meaning,
          visiblePair,
          weight,
          count: 1,
          positions: [i + 1]
        });
      }

      meaning.themes.split(",").forEach((theme) => {
        themeScores.set(theme, (themeScores.get(theme) || 0) + weight);
      });
    }

    const raw = weightTotal ? weightedTotal / weightTotal : 0;
    const score = Math.max(0, Math.min(100, Math.round((raw + 100) / 2)));
    let verdict = "ควรเลือกใช้อย่างมีสติ";
    let chip = "พลังที่ต้องดูแล";
    let overview = "มีคู่เลขที่ควรระวังค่อนข้างมาก ควรใช้จุดแข็งควบคู่กับการวางแผนและตรวจสอบการตัดสินใจ";
    let ring = "#c54557";

    if (score >= 75) {
      verdict = "พลังโดยรวมโดดเด่น";
      chip = "เบอร์ส่งเสริม";
      overview = "คู่เลขส่วนใหญ่ส่งเสริมโอกาส ความคิด และความสัมพันธ์ ใช้จุดแข็งเหล่านี้อย่างมีวินัยจะเห็นผลชัดขึ้น";
      ring = "#16845b";
    } else if (score >= 60) {
      verdict = "ภาพรวมค่อนข้างดี";
      chip = "สมดุลด้านบวก";
      overview = "มีพลังบวกมากกว่าจุดระวัง เหมาะกับการต่อยอดงาน การสื่อสาร และเป้าหมายส่วนตัว";
      ring = "#6d3df5";
    } else if (score >= 45) {
      verdict = "พลังผสม ต้องบริหารให้ดี";
      chip = "มีทั้งบวกและระวัง";
      overview = "มีทั้งคู่เลขที่สนับสนุนและคู่ที่สร้างแรงกดดัน ผลลัพธ์ขึ้นกับการตัดสินใจและการจัดสมดุล";
      ring = "#bd6a00";
    }

    document.querySelector("#score").textContent = score;
    document.querySelector(".score-ring").style.setProperty("--score", score);
    document.querySelector(".score-ring").style.setProperty("--ring", ring);
    document.querySelector("#verdict").textContent = verdict;
    document.querySelector("#verdict-chip").textContent = chip;
    document.querySelector("#overview").textContent = overview;

    const topThemes = [...themeScores.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
    document.querySelector("#themes").innerHTML = topThemes
      .map(([theme]) => '<span class="theme">#' + escapeHtml(theme) + "</span>")
      .join("");

    const pairCards = [...grouped.values()].sort((a, b) => b.weight - a.weight);
    document.querySelector("#pair-list").innerHTML = pairCards.map((item) => {
      const repeated = item.count > 1 ? " · พบ " + item.count + " ครั้ง" : "";
      return '<article class="pair-card polarity-' + item.polarity + '">' +
        '<div class="pair-top"><span class="pair-number">' + escapeHtml(item.visiblePair) + '</span>' +
        '<span class="pair-weight">น้ำหนัก ' + item.weight + '%' + repeated + '</span></div>' +
        '<h4>' + escapeHtml(item.title) + '</h4>' +
        '<p>' + escapeHtml(item.summary) + '</p>' +
        '<p class="advice"><b>คำแนะนำ:</b> ' + escapeHtml(item.advice) + '</p></article>';
    }).join("");

    error.textContent = "";
    result.hidden = false;
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();