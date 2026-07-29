(() => {
  "use strict";

  const Astro = window.ThaiAstro;
  const pairRows = window.PAIR_MEANINGS || [];
  const byPair = new Map(pairRows.map((row) => [row.pair, row]));
  const pairWeights = [10, 10, 10, 15, 15, 15, 25];
  let currentNatal = null;
  let lastTransitRange = null;
  let visibleSamples = 16;

  const typeNames = {
    INTJ: "นักวางกลยุทธ์", INTP: "นักคิดวิเคราะห์", ENTJ: "ผู้นำเชิงกลยุทธ์", ENTP: "นักสร้างโอกาส",
    INFJ: "ผู้มองการณ์ไกล", INFP: "นักอุดมคติ", ENFJ: "ผู้นำเชื่อมผู้คน", ENFP: "นักสร้างแรงบันดาลใจ",
    ISTJ: "ผู้รับผิดชอบ", ISFJ: "ผู้ดูแลอย่างมีระบบ", ESTJ: "ผู้จัดการเป้าหมาย", ESFJ: "ผู้ประสานสัมพันธ์",
    ISTP: "นักแก้ปัญหา", ISFP: "ผู้สร้างสรรค์อ่อนโยน", ESTP: "นักลงมือทำ", ESFP: "ผู้สร้างสีสัน"
  };

  const typeDescriptions = {
    INTJ: "คิดเป็นระบบ มองระยะยาว และต้องการอิสระในการตัดสินใจ",
    INTP: "ชอบวิเคราะห์แนวคิด ตั้งคำถาม และหาคำอธิบายที่สมเหตุผล",
    ENTJ: "มองเป้าหมายใหญ่ กล้าตัดสินใจ และขับเคลื่อนคนกับทรัพยากร",
    ENTP: "หัวไว ชอบความเป็นไปได้ใหม่ และสนุกกับการแก้โจทย์ซับซ้อน",
    INFJ: "เข้าใจความหมายเบื้องลึก มองอนาคต และใส่ใจผลกระทบต่อผู้คน",
    INFP: "ยึดถือคุณค่าภายใน มีจินตนาการ และต้องการความจริงใจ",
    ENFJ: "อ่านบรรยากาศเก่ง ช่วยให้คนร่วมมือ และสื่อสารด้วยความเข้าใจ",
    ENFP: "กระตือรือร้น เปิดรับผู้คน และเปลี่ยนไอเดียเป็นแรงบันดาลใจ",
    ISTJ: "ละเอียด รับผิดชอบ และให้ความสำคัญกับมาตรฐานที่เชื่อถือได้",
    ISFJ: "รอบคอบ ดูแลคนใกล้ตัว และสร้างความมั่นคงจากสิ่งที่ทำสม่ำเสมอ",
    ESTJ: "จัดระบบเก่ง พูดตรง และต้องการให้เป้าหมายเดินหน้าอย่างชัดเจน",
    ESFJ: "เป็นมิตร ใส่ใจความร่วมมือ และสร้างความสบายใจให้คนรอบตัว",
    ISTP: "แก้ปัญหาเฉพาะหน้าเก่ง ชอบทดลอง และเรียนรู้จากการลงมือจริง",
    ISFP: "อ่อนโยน รักอิสระ และแสดงตัวตนผ่านการกระทำหรือความสร้างสรรค์",
    ESTP: "ตัดสินใจไว กล้าเผชิญสถานการณ์ และมองเห็นโอกาสตรงหน้า",
    ESFP: "เข้าถึงง่าย มีพลังกับผู้คน และชอบสร้างประสบการณ์ที่มีชีวิตชีวา"
  };

  const personalityAxes = [
    {
      title: "แหล่งพลัง",
      left: { code: "E", name: "เปิดรับโลกภายนอก", themes: ["การสื่อสาร", "เครือข่าย", "เสน่ห์", "ชื่อเสียง", "ผู้นำ", "การลงมือทำ", "ธุรกิจ"] },
      right: { code: "I", name: "ไตร่ตรองภายใน", themes: ["ปัญญา", "สติ", "สัญชาตญาณ", "จิตใจ", "ความลับ", "ความเครียด", "ความรับผิดชอบ"] }
    },
    {
      title: "วิธีรับข้อมูล",
      left: { code: "S", name: "ยึดข้อเท็จจริง", themes: ["การเงิน", "การงาน", "ความมั่นคง", "ความรับผิดชอบ", "การวางแผน", "ธุรกิจ"] },
      right: { code: "N", name: "มองความเป็นไปได้", themes: ["ความคิดสร้างสรรค์", "สัญชาตญาณ", "เทคโนโลยี", "โอกาส", "จิตใจ", "การเปลี่ยนแปลง"] }
    },
    {
      title: "วิธีตัดสินใจ",
      left: { code: "T", name: "ใช้เหตุผลและระบบ", themes: ["ปัญญา", "การวางแผน", "ธุรกิจ", "การตัดสินใจ", "อำนาจ", "การเงิน"] },
      right: { code: "F", name: "คำนึงถึงความรู้สึก", themes: ["ความรัก", "ความสัมพันธ์", "เสน่ห์", "อารมณ์", "สติ", "ผู้ใหญ่สนับสนุน"] }
    },
    {
      title: "รูปแบบการใช้ชีวิต",
      left: { code: "J", name: "เป็นระบบและมีแผน", themes: ["การวางแผน", "ความมั่นคง", "การงาน", "ความรับผิดชอบ", "สติ"] },
      right: { code: "P", name: "ยืดหยุ่นและเปิดโอกาส", themes: ["โอกาส", "การเปลี่ยนแปลง", "ความคิดสร้างสรรค์", "การลงมือทำ", "การแข่งขัน", "เทคโนโลยี"] }
    }
  ];

  const relationshipAxisText = [
    {
      same: "จังหวะการเข้าสังคมใกล้กัน จึงเข้าใจเวลาที่อีกฝ่ายอยากพูดคุยหรือพักได้ง่าย",
      different: "คนหนึ่งช่วยเปิดโลกภายนอก อีกคนช่วยกลั่นกรองก่อนตัดสินใจ",
      riskSame: "อาจเร่งบรรยากาศพร้อมกันหรือเงียบพร้อมกันจนไม่มีใครเป็นฝ่ายเริ่ม",
      riskDifferent: "คนชอบสังคมอาจรู้สึกถูกปฏิเสธ ส่วนคนรักพื้นที่ส่วนตัวอาจรู้สึกถูกเร่ง",
      manage: "ตกลงเวลาพบปะและเวลาส่วนตัวล่วงหน้า"
    },
    {
      same: "มองข้อมูลในระดับใกล้กัน จึงคุยเรื่องรายละเอียดหรือแนวคิดได้ลื่น",
      different: "คนหนึ่งตรวจข้อเท็จจริง อีกคนช่วยมองความเป็นไปได้และภาพใหญ่",
      riskSame: "มีโอกาสติดอยู่กับรายละเอียดหรือไอเดียด้านเดียวกัน",
      riskDifferent: "คนเน้นข้อเท็จจริงอาจมองอีกฝ่ายว่าลอย ส่วนคนมองภาพใหญ่อาจรู้สึกถูกจำกัด",
      manage: "แยกช่วงระดมไอเดียออกจากช่วงตรวจข้อเท็จจริง"
    },
    {
      same: "ใช้เกณฑ์ตัดสินใจคล้ายกัน จึงเข้าใจเหตุผลหรือความรู้สึกของกันได้เร็ว",
      different: "คนหนึ่งคุมความสมเหตุผล อีกคนช่วยมองผลกระทบต่อความรู้สึก",
      riskSame: "อาจแข็งเกินไปหรือเกรงใจกันเกินไปโดยไม่มีมุมทักท้วง",
      riskDifferent: "คำพูดตรงอาจทำร้ายใจ หรือความเกรงใจอาจทำให้ปัญหาไม่ถูกพูด",
      manage: "บอกก่อนว่าต้องการคำตอบเชิงเหตุผลหรือการรับฟังความรู้สึก"
    },
    {
      same: "จังหวะการวางแผนใกล้กัน ทำให้แบ่งงานและกำหนดเวลาได้ง่าย",
      different: "คนหนึ่งช่วยคุมแผน อีกคนช่วยให้ปรับตัวเมื่อสถานการณ์เปลี่ยน",
      riskSame: "อาจควบคุมรายละเอียดมากไปหรือเลื่อนการตัดสินใจพร้อมกัน",
      riskDifferent: "คนวางแผนอาจมองอีกฝ่ายว่าไม่แน่นอน ส่วนคนยืดหยุ่นอาจรู้สึกถูกควบคุม",
      manage: "กำหนดเฉพาะเส้นตายและผลลัพธ์ ส่วนวิธีทำให้มีพื้นที่ยืดหยุ่น"
    }
  ];

  const $ = (selector) => document.querySelector(selector);
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;"
  })[char]);
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const normalizePair = (pair) => pair[0] <= pair[1] ? pair : pair[1] + pair[0];
  const formatThaiDate = (dateOrText, options = { dateStyle: "medium" }) => {
    const date = typeof dateOrText === "string" ? new Date(`${dateOrText}T12:00:00+07:00`) : dateOrText;
    return new Intl.DateTimeFormat("th-TH", options).format(date);
  };

  const analyzePhone = (phone) => {
    const digits = phone.slice(-8);
    const grouped = new Map();
    const themes = new Map();
    let weightedScore = 0;
    let totalWeight = 0;
    for (let index = 0; index < 7; index += 1) {
      const visiblePair = digits.slice(index, index + 2);
      const meaning = byPair.get(normalizePair(visiblePair));
      if (!meaning) continue;
      const weight = pairWeights[index];
      weightedScore += meaning.score * weight;
      totalWeight += weight;
      const existing = grouped.get(meaning.pair);
      if (existing) {
        existing.weight += weight;
        existing.count += 1;
      } else {
        grouped.set(meaning.pair, { ...meaning, visiblePair, weight, count: 1 });
      }
      meaning.themes.split(",").forEach((theme) => themes.set(theme, (themes.get(theme) || 0) + weight));
    }
    const raw = totalWeight ? weightedScore / totalWeight : 0;
    const score = clamp(Math.round((raw + 100) / 2), 0, 100);
    const items = [...grouped.values()].sort((a, b) => b.weight - a.weight);
    const topThemes = [...themes.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([theme]) => theme);
    return { score, items, topThemes, profile: buildPhonePersonality(items) };
  };

  const calculatePhoneAxis = (items, axis) => {
    const sideScore = (side) => items.map((item) => {
      const matched = item.themes.split(",").some((theme) => side.themes.includes(theme));
      return matched ? item.weight * (0.75 + (item.score + 100) / 200) : 0;
    }).reduce((sum, value) => sum + value, 0);
    const leftValue = sideScore(axis.left);
    const rightValue = sideScore(axis.right);
    const leftPercent = Math.round(leftValue / (leftValue + rightValue || 1) * 100);
    return {
      ...axis, leftPercent,
      dominant: leftPercent >= 50 ? axis.left : axis.right,
      dominantPercent: leftPercent >= 50 ? leftPercent : 100 - leftPercent
    };
  };

  const buildPhonePersonality = (items) => {
    const axes = personalityAxes.map((axis) => calculatePhoneAxis(items, axis));
    const code = axes.map((axis) => axis.dominant.code).join("");
    return { code, name: typeNames[code], axes };
  };

  const renderAxisCard = (axis) => {
    const rightPercent = 100 - axis.leftPercent;
    return `<article class="axis-card">
      <header><span>${axis.left.code} ↔ ${axis.right.code}</span><strong>${axis.dominant.code} ${axis.dominantPercent}%</strong></header>
      <h4>${escapeHtml(axis.title)}: ${escapeHtml(axis.dominant.name)}</h4>
      <div class="axis-bar"><i style="width:${axis.leftPercent}%"></i></div>
      <div class="axis-scale"><span>${axis.left.code} ${axis.leftPercent}%</span><span>${axis.right.code} ${rightPercent}%</span></div>
    </article>`;
  };

  const renderPhone = (analysis) => {
    const verdict = analysis.score >= 75 ? "พลังโดยรวมโดดเด่น" : analysis.score >= 60 ? "ภาพรวมค่อนข้างดี" : analysis.score >= 45 ? "พลังผสม ต้องบริหารให้ดี" : "ควรเลือกใช้อย่างมีสติ";
    $("#phone-summary").innerHTML = `<section class="summary-card">
      <div class="score-circle" style="--score:${analysis.score}"><strong>${analysis.score}</strong><small>/100</small></div>
      <div><span class="result-kicker">พลังของเบอร์</span><h2>${verdict}</h2>
      <p>วิเคราะห์คู่เลข 8 หลักท้าย โดยให้น้ำหนักคู่ท้ายมากที่สุด</p>
      <div class="theme-row">${analysis.topThemes.map((theme) => `<span>#${escapeHtml(theme)}</span>`).join("")}</div></div>
    </section>`;
    const profile = analysis.profile;
    $("#phone-personality").innerHTML = `<section class="content-card">
      <div class="type-banner"><span>16 Personality จากเบอร์</span><h2>${profile.code} · ${escapeHtml(profile.name)}</h2><p>${escapeHtml(typeDescriptions[profile.code])}</p></div>
      <div class="axis-grid">${profile.axes.map(renderAxisCard).join("")}</div>
      <p class="method-note">เป็นการเทียบกรอบ 4 มิติจากธีมคู่เลข ไม่ใช่ผลทดสอบ MBTI ทางจิตวิทยา</p>
    </section>`;
    $("#pair-list").innerHTML = analysis.items.map((item) => `<article class="pair-card polarity-${item.polarity}">
      <div class="pair-top"><span>${escapeHtml(item.visiblePair)}</span><small>น้ำหนัก ${item.weight}%${item.count > 1 ? ` · พบ ${item.count} ครั้ง` : ""}</small></div>
      <h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary)}</p>
      <p class="pair-advice"><b>คำแนะนำ:</b> ${escapeHtml(item.advice)}</p>
    </article>`).join("");
  };

  const polar = (cx, cy, radius, angle) => {
    const radians = (angle - 90) * Math.PI / 180;
    return { x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) };
  };

  const wheelPath = (index) => {
    const start = index * 30;
    const end = start + 30;
    const a = polar(220, 220, 198, start);
    const b = polar(220, 220, 198, end);
    const c = polar(220, 220, 88, end);
    const d = polar(220, 220, 88, start);
    return `M${a.x},${a.y} A198,198 0 0 1 ${b.x},${b.y} L${c.x},${c.y} A88,88 0 0 0 ${d.x},${d.y} Z`;
  };

  const renderWheel = (natal) => {
    const houses = natal.houses.map((house, index) => {
      const labelPoint = polar(220, 220, 133, index * 30 + 15);
      const planetPoint = polar(220, 220, 166, index * 30 + 15);
      const planetText = house.planets.map((planet) => `${planet.number}${planet.retrograde ? "R" : ""}`).join(" ");
      return `<path class="wheel-house" d="${wheelPath(index)}"></path>
        <text class="wheel-label" x="${labelPoint.x}" y="${labelPoint.y}" text-anchor="middle">${house.number} ${house.name}</text>
        <text class="wheel-planet" x="${planetPoint.x}" y="${planetPoint.y}" text-anchor="middle">${planetText}</text>`;
    }).join("");
    return `<svg class="astro-wheel" viewBox="0 0 440 440" role="img" aria-label="ผังราศีจักร 12 ภพ">
      ${houses}<circle class="wheel-center" cx="220" cy="220" r="75"></circle>
      <text class="wheel-center-main" x="220" y="210" text-anchor="middle">ลัคนา ${natal.ascSign + 1}</text>
      <text class="wheel-center-main" x="220" y="235" text-anchor="middle">${Astro.signs[natal.ascSign].name}</text>
      <text class="wheel-center-sub" x="220" y="255" text-anchor="middle">${Astro.formatDegree(natal.ascDegree)}</text>
    </svg>`;
  };

  const natalNarrative = (natal) => {
    const strong = natal.positions.filter((planet) => ["อุจจ์", "เกษตร"].includes(planet.dignity));
    const watch = natal.positions.filter((planet) => planet.dignity === "นิจ");
    const career = natal.houses[9].planets.map((planet) => planet.thai);
    const relationship = natal.houses[6].planets.map((planet) => planet.thai);
    return {
      strengths: strong.length ? `ดาวเด่น ${strong.map((planet) => `${planet.thai}(${planet.dignity})`).join(", ")} ช่วยให้คุณใช้ศักยภาพของดาวนั้นได้ชัด` : "พื้นดวงเน้นการพัฒนาจากประสบการณ์ ไม่มีดาวใดครองน้ำหนักทั้งหมด",
      watch: watch.length ? `ดาวนิจ ${watch.map((planet) => planet.thai).join(", ")} ควรบริหารด้านที่เกี่ยวข้องอย่างมีสติ` : "ไม่พบดาวนิจในกลุ่มดาวหลัก แต่ยังควรดูภพและกระแสดาวร่วมกัน",
      career: career.length ? `ภพกัมมะมีดาว ${career.join(", ")} ทำให้งานและบทบาทสังคมเป็นพื้นที่พัฒนาสำคัญ` : "ภพกัมมะว่าง ต้องอ่านเจ้าเรือนและดาวจรประกอบ จึงไม่ควรสรุปอาชีพจากภพเดียว",
      relationship: relationship.length ? `ภพปัตนิมีดาว ${relationship.join(", ")} ความสัมพันธ์จึงมีบทเรียนและพลังของดาวเหล่านี้ชัด` : "ภพปัตนิว่างไม่ได้แปลว่าไม่มีคู่ ต้องพิจารณาเจ้าเรือนและดาวจรประกอบ"
    };
  };

  const renderNatal = (natal) => {
    const moon = natal.positions.find((planet) => planet.key === "Moon");
    const story = natalNarrative(natal);
    $("#natal-summary").innerHTML = `<section class="natal-hero">
      <div class="natal-head"><div><small>พื้นดวงโหราศาสตร์ไทย · นิรายนะ</small>
      <h2>ลัคนาราศี${Astro.signs[natal.ascSign].name}</h2>
      <p>${formatThaiDate(natal.date, { dateStyle: "long" })} · ${escapeHtml(natal.timeText)} · ${escapeHtml(natal.location.label)}</p></div>
      <div class="asc-badge"><span>องศาลัคนา</span><strong>${Astro.formatDegree(natal.ascDegree)}</strong></div></div>
      <div class="natal-facts">
        <div><span>ดาวประจำวัน</span><b>${natal.weekdayPlanet.symbol} ${natal.weekdayPlanet.thai}</b></div>
        <div><span>ฤกษ์กำเนิด</span><b>${natal.nakshatra} บาท ${natal.nakshatraPada}</b></div>
        <div><span>จันทร์สถิตราศี</span><b>${moon.signName} ${Astro.formatDegree(moon.degree)}</b></div>
        <div><span>บุคลิกจากพื้นดวง</span><b>${natal.personality.code} · ${typeNames[natal.personality.code]}</b></div>
      </div>
    </section>`;
    $("#natal-chart").innerHTML = `<section class="content-card chart-card">
      <div class="section-title"><div><h2>ผังราศีจักร 12 ภพ</h2><p>เลขดาวอยู่ในภพที่คำนวณจากลัคนา</p></div></div>
      ${renderWheel(natal)}
      <div class="highlight-grid">
        <div class="highlight-box good"><h3>จุดแข็งพื้นดวง</h3><p>${escapeHtml(story.strengths)}</p><p>${escapeHtml(story.career)}</p></div>
        <div class="highlight-box watch"><h3>จุดที่ต้องบริหาร</h3><p>${escapeHtml(story.watch)}</p><p>${escapeHtml(story.relationship)}</p></div>
      </div>
      <p class="method-note">พิกัด: ${natal.location.latitude.toFixed(4)}, ${natal.location.longitude.toFixed(4)} (${escapeHtml(natal.location.quality)}) · อายนางศะลาหิรีประมาณ ${natal.ayanamsha.toFixed(3)}°</p>
    </section>`;

    const planetRows = natal.positions.map((planet) => `<tr>
      <td>${planet.symbol} ${planet.number} ${planet.thai}${planet.retrograde ? " R" : ""}</td>
      <td>${planet.signName} ${Astro.formatDegree(planet.degree)}</td><td>ภพ ${planet.house} ${Astro.houseNames[planet.house - 1][0]}</td>
      <td>${planet.navamsaName}</td><td><span class="dignity ${planet.dignity}">${planet.dignity}</span></td>
    </tr>`).join("");
    const thaksa = natal.thaksa.map((item) => `<div class="thaksa-item ${item.role === "กาลกิณี" ? "bad" : ""}"><span>${item.role}</span><b>${item.number} · ${item.planet}</b></div>`).join("");
    const aspects = natal.aspects.length
      ? natal.aspects.slice(0, 28).map((aspect) => `<div class="aspect-item">${escapeHtml(aspect.text)}</div>`).join("")
      : `<div class="aspect-item">ไม่พบโยคเกณฑ์ดาวไทยแบบราศีสัมพันธ์ในตำแหน่งหลัก</div>`;
    $("#natal-details").innerHTML = `<section class="content-card chart-card">
      <div class="section-title"><div><h2>รายละเอียดพื้นดวง</h2><p>ตำแหน่งดาว นวางค์ มหาทักษา และโยคเกณฑ์</p></div></div>
      <div class="detail-tabs" role="tablist" aria-label="รายละเอียดพื้นดวง">
        <button class="detail-chip active" type="button" data-detail="planets">ตำแหน่งดาว</button>
        <button class="detail-chip" type="button" data-detail="thaksa">มหาทักษา</button>
        <button class="detail-chip" type="button" data-detail="aspects">โยคเกณฑ์</button>
      </div>
      <div class="detail-panel" data-panel="planets"><div class="table-wrap"><table class="planet-table">
        <thead><tr><th>ดาว</th><th>ราศีและองศา</th><th>ภพ</th><th>นวางค์</th><th>มาตรฐานดาว</th></tr></thead><tbody>${planetRows}</tbody>
      </table></div></div>
      <div class="detail-panel" data-panel="thaksa" hidden><div class="thaksa-grid">${thaksa}</div></div>
      <div class="detail-panel" data-panel="aspects" hidden><div class="aspect-list">${aspects}</div></div>
      <p class="method-note">“เต็มรูปแบบ” ในเว็บนี้หมายถึงชุดคำนวณราศีจักรหลัก ไม่รวมทักษาจรเฉพาะสำนัก ฤกษ์พิธี หรือลายมือโหรที่ต้องใช้ดุลยพินิจ</p>
    </section>`;
    ["#natal-summary", "#natal-chart", "#natal-details"].forEach((selector) => $(selector).hidden = false);
  };

  const chartAxisForMatch = (natal, index) => ({
    leftPercent: natal.personality.axes[index].leftPercent,
    dominant: natal.personality.axes[index].code
  });

  const renderMatch = (phoneProfile, natal) => {
    const rows = phoneProfile.axes.map((axis, index) => {
      const chartAxis = chartAxisForMatch(natal, index);
      const same = axis.dominant.code === chartAxis.dominant;
      return {
        title: axis.title, phone: axis.dominant.code, natal: chartAxis.dominant,
        same, similarity: 100 - Math.abs(axis.leftPercent - chartAxis.leftPercent)
      };
    });
    const score = Math.round(rows.reduce((sum, row) => sum + row.similarity, 0) / rows.length);
    const label = score >= 85 ? "สอดคล้องสูงมาก" : score >= 72 ? "สอดคล้องค่อนข้างดี" : score >= 58 ? "ช่วยเสริมมุมที่ต่าง" : "มีแรงผลักคนละทิศ";
    $("#match-result").innerHTML = `<section class="content-card match-card">
      <div class="match-score"><span>เบอร์ Match กับพื้นดวง</span><strong>${score}%</strong><b>${label}</b></div>
      <div class="match-grid">${rows.map((row) => `<div class="match-row"><span>${escapeHtml(row.title)}</span><b class="${row.same ? "same" : "different"}">${row.phone} ${row.same ? "=" : "↔"} ${row.natal}</b></div>`).join("")}</div>
      <p>${score >= 72 ? "เบอร์ขยายบุคลิกที่มีอยู่เดิมได้ค่อนข้างเป็นธรรมชาติ" : "เบอร์กระตุ้นให้แสดงพฤติกรรมบางด้านต่างจากพื้นดวง จึงอาจช่วยพัฒนาได้แต่ต้องสังเกตความฝืนของตน"}</p>
    </section>`;
    $("#match-result").hidden = false;
  };

  const updateNatalStatus = () => {
    const status = $("#transit-natal-status");
    const submit = $("#transit-submit");
    if (!currentNatal) {
      status.className = "status-card warning";
      status.innerHTML = `<span>ยังไม่มีพื้นดวง</span><p>กลับไปแท็บ “เบอร์และพื้นดวง” แล้วใส่วันเกิดก่อนดูดวงจร</p><button id="go-profile" class="secondary-button" type="button">ไปกรอกข้อมูลเกิด</button>`;
      submit.disabled = true;
      $("#go-profile").addEventListener("click", () => switchTab("profile"));
    } else {
      status.className = "status-card ready";
      status.innerHTML = `<span>พร้อมคำนวณจากลัคนา${Astro.signs[currentNatal.ascSign].name}</span>
        <p>${formatThaiDate(currentNatal.date, { dateStyle: "long" })} · ${escapeHtml(currentNatal.location.label)} · ${escapeHtml(currentNatal.location.quality)}</p>`;
      submit.disabled = false;
    }
  };

  const renderTimeline = (range) => {
    const samples = range.samples;
    const width = 820;
    const height = 230;
    const left = 38;
    const right = 18;
    const top = 20;
    const bottom = 42;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;
    const x = (index) => left + (samples.length === 1 ? plotWidth / 2 : index / (samples.length - 1) * plotWidth);
    const y = (score) => top + (100 - score) / 80 * plotHeight;
    const points = samples.map((sample, index) => `${x(index).toFixed(1)},${y(sample.score).toFixed(1)}`).join(" ");
    const area = `${left},${top + plotHeight} ${points} ${left + plotWidth},${top + plotHeight}`;
    const grid = [40, 60, 80].map((score) => `<line class="timeline-grid" x1="${left}" y1="${y(score)}" x2="${left + plotWidth}" y2="${y(score)}"></line><text class="timeline-score" x="4" y="${y(score) + 3}">${score}</text>`).join("");
    const labelIndexes = [...new Set([0, Math.floor((samples.length - 1) / 4), Math.floor((samples.length - 1) / 2), Math.floor((samples.length - 1) * 3 / 4), samples.length - 1])];
    const labels = labelIndexes.map((index) => `<text class="timeline-label" x="${x(index)}" y="${height - 12}" text-anchor="middle">${formatThaiDate(samples[index].dateText, { day: "numeric", month: "short", year: "2-digit" })}</text>`).join("");
    const dotStep = Math.max(1, Math.ceil(samples.length / 24));
    const dots = samples.filter((_, index) => index % dotStep === 0 || index === samples.length - 1).map((sample) => {
      const index = samples.indexOf(sample);
      return `<circle class="timeline-dot" cx="${x(index)}" cy="${y(sample.score)}" r="4"><title>${formatThaiDate(sample.dateText)} คะแนน ${sample.score}</title></circle>`;
    }).join("");
    return `<section class="content-card timeline-card"><div class="section-title"><div><h2>เส้นจังหวะดวงจร</h2><p>คะแนนเปรียบเทียบภพจรและมุมสัมพันธ์กับดาวกำเนิด</p></div></div>
      <svg class="timeline-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="กราฟคะแนนดวงจรจาก ${range.start} ถึง ${range.end}">
        <defs><linearGradient id="timelineGradient" x1="0" x2="1"><stop stop-color="#6840df"/><stop offset="1" stop-color="#e85fa7"/></linearGradient></defs>
        ${grid}<polygon class="timeline-area" points="${area}"></polygon><polyline class="timeline-line" points="${points}"></polyline>${dots}${labels}
      </svg></section>`;
  };

  const renderTransitSamples = () => {
    if (!lastTransitRange) return;
    const shown = lastTransitRange.samples.slice(0, visibleSamples);
    $("#transit-samples").innerHTML = `<section class="content-card samples-card">
      <div class="section-title"><div><h2>จุดคำนวณในช่วง</h2><p>แสดง ${shown.length} จาก ${lastTransitRange.samples.length} จุด</p></div></div>
      <div class="sample-list">${shown.map((sample) => `<article class="sample-row">
        <time>${formatThaiDate(sample.dateText)}</time><strong>${sample.score}</strong>
        <div class="sample-notes">${(sample.notes.length ? sample.notes.slice(0, 4) : [{ tone: "", text: "จังหวะค่อนข้างเป็นกลาง" }]).map((note) => `<span class="${note.tone}">${escapeHtml(note.text)}</span>`).join("")}</div>
      </article>`).join("")}</div>
      ${shown.length < lastTransitRange.samples.length ? `<button id="load-more-samples" class="load-more" type="button">แสดงเพิ่มอีก 16 จุด</button>` : ""}
    </section>`;
    $("#load-more-samples")?.addEventListener("click", () => {
      visibleSamples += 16;
      renderTransitSamples();
    });
  };

  const renderTransitRange = (range) => {
    lastTransitRange = range;
    visibleSamples = 16;
    const label = range.average >= 75 ? "ช่วงที่มีแรงหนุนเด่น" : range.average >= 62 ? "ภาพรวมเดินหน้าได้" : range.average >= 50 ? "มีทั้งจังหวะหนุนและจังหวะทบทวน" : "ควรวางแผนอย่างระมัดระวัง";
    $("#transit-overview").innerHTML = `<section class="transit-overview-card">
      <div class="period-head"><div><span class="result-kicker">ดวงจรทั้งช่วง</span><h2>${label}</h2>
      <p>${formatThaiDate(range.start, { dateStyle: "long" })} – ${formatThaiDate(range.end, { dateStyle: "long" })}</p></div>
      <div class="period-score"><strong>${range.average}</strong><span>คะแนนเฉลี่ย /100</span></div></div>
      <div class="period-meta"><span>${range.spanDays + 1} วัน</span><span>${range.samples.length} จุดคำนวณ</span><span>ทุก ${range.stepDays} วัน</span><span>เวลา ${range.timeText}</span></div>
      ${range.adjusted ? `<p class="range-note">ระบบเพิ่มระยะห่างจากค่าที่เลือกเพื่อป้องกันอุปกรณ์ค้าง แต่ยังครอบคลุมวันเริ่มและวันสิ้นสุดครบ</p>` : ""}
    </section>`;
    $("#transit-timeline").innerHTML = renderTimeline(range);
    const dateList = (items) => items.map((sample) => `<div class="date-score"><span>${formatThaiDate(sample.dateText)}</span><b>${sample.score}</b></div>`).join("");
    $("#transit-highlights").innerHTML = `<section class="highlight-grid">
      <div class="highlight-box good"><h3>ช่วงคะแนนเด่น</h3><div class="date-score-list">${dateList(range.best)}</div></div>
      <div class="highlight-box watch"><h3>ช่วงที่ควรระวัง</h3><div class="date-score-list">${dateList(range.watch)}</div></div>
      <div class="recurring-list"><h3>ประเด็นที่เกิดซ้ำในช่วงนี้</h3>
        <ul>${(range.recurring.length ? range.recurring : [{ text: "ภาพรวมไม่มีแรงกระทบเด่นซ้ำหลายช่วง", count: 1 }]).map((item) => `<li>${escapeHtml(item.text)}${item.count > 1 ? ` · พบ ${item.count} จุด` : ""}</li>`).join("")}</ul>
      </div>
    </section>`;
    renderTransitSamples();
    $("#transit-result").hidden = false;
    $("#transit-result").scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const populateTypes = () => {
    const options = Object.entries(typeNames).map(([code, name]) => `<option value="${code}">${code} — ${name}</option>`).join("");
    $("#type-a").innerHTML = options;
    $("#type-b").innerHTML = options;
    $("#type-a").value = "INTJ";
    $("#type-b").value = "INTP";
  };

  const compareTypes = (typeA, typeB) => {
    const advantages = [];
    const risks = [];
    const management = [];
    let score = 52;
    for (let index = 0; index < 4; index += 1) {
      const same = typeA[index] === typeB[index];
      const text = relationshipAxisText[index];
      advantages.push(same ? text.same : text.different);
      risks.push(same ? text.riskSame : text.riskDifferent);
      management.push(text.manage);
      score += same ? [7, 6, 5, 8][index] : [5, 9, 8, 6][index];
    }
    return {
      score: clamp(score, 55, 92),
      label: score >= 82 ? "เข้าใจกันได้ค่อนข้างง่าย" : score >= 74 ? "ไปด้วยกันได้เมื่อสื่อสารชัด" : "ต่างกันแต่ช่วยเติมมุมที่ขาด",
      advantages, risks, management
    };
  };

  const renderComparison = (typeA, typeB) => {
    const result = compareTypes(typeA, typeB);
    const list = (items) => items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    $("#compare-result").innerHTML = `<section class="relationship-hero">
      <div><span>A</span><b>${typeA}</b><small>${escapeHtml(typeNames[typeA])}</small></div>
      <div class="relationship-score"><strong>${result.score}%</strong><span>${result.label}</span></div>
      <div><span>B</span><b>${typeB}</b><small>${escapeHtml(typeNames[typeB])}</small></div>
    </section>
    <section class="relationship-intro"><p><b>${typeA}</b> ${escapeHtml(typeDescriptions[typeA])}</p><p><b>${typeB}</b> ${escapeHtml(typeDescriptions[typeB])}</p></section>
    <div class="relationship-grid">
      <section class="relationship-box good"><h3>ข้อดีเมื่อมาเจอกัน</h3><ul>${list(result.advantages)}</ul></section>
      <section class="relationship-box risk"><h3>ข้อเสียและจุดเสี่ยง</h3><ul>${list(result.risks)}</ul></section>
      <section class="relationship-box manage"><h3>วิธีบริหารความสัมพันธ์</h3><ul>${list(result.management)}</ul></section>
      <section class="relationship-box caution"><h3>สิ่งที่ต้องระวังที่สุด</h3><p>อย่าใช้รหัสบุคลิกเป็นข้ออ้างแทนการรับฟังกัน ให้พูดถึงเหตุการณ์ ความต้องการ และข้อตกลงที่ทำได้จริง</p></section>
    </div>
    <p class="method-note">คะแนนเป็นแนวทางสนทนาจาก 4 มิติ ไม่ใช่คะแนนตัดสินความสัมพันธ์จริง</p>`;
    $("#compare-result").hidden = false;
    $("#compare-result").scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const switchTab = (target) => {
    ["profile", "transit", "compare"].forEach((name) => {
      const active = name === target;
      $(`#tab-${name}`).classList.toggle("active", active);
      $(`#tab-${name}`).setAttribute("aria-selected", String(active));
      $(`#panel-${name}`).hidden = !active;
      $(`#panel-${name}`).classList.toggle("active", active);
    });
    if (target === "transit") updateNatalStatus();
    window.scrollTo({ top: Math.max(0, $(".app-tabs").offsetTop - 8), behavior: "smooth" });
  };

  const resetTransitDates = () => {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    const start = local.toISOString().slice(0, 10);
    const end = new Date(local.getTime() + 30 * 86400000).toISOString().slice(0, 10);
    $("#transit-start").value = start;
    $("#transit-end").value = end;
    $("#transit-time").value = "12:00";
    $("#transit-precision").value = "auto";
    $("#transit-error").textContent = "";
    $("#transit-result").hidden = true;
    lastTransitRange = null;
  };

  $("#profile-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const phone = $("#phone").value.replace(/\D/g, "");
    if (!/^0\d{9}$/.test(phone)) {
      $("#profile-error").textContent = "กรุณากรอกเบอร์มือถือไทย 10 หลัก โดยขึ้นต้นด้วย 0";
      $("#phone").focus();
      return;
    }
    const phoneAnalysis = analyzePhone(phone);
    renderPhone(phoneAnalysis);
    ["#natal-summary", "#natal-chart", "#natal-details", "#match-result"].forEach((selector) => $(selector).hidden = true);
    const birthDate = $("#birth-date").value;
    if (birthDate) {
      try {
        currentNatal = Astro.createNatalChart({
          dateText: birthDate,
          timeText: $("#birth-time").value || "12:00",
          place: $("#birth-place").value.trim(),
          latitude: $("#birth-latitude").value,
          longitude: $("#birth-longitude").value
        });
        renderNatal(currentNatal);
        renderMatch(phoneAnalysis.profile, currentNatal);
      } catch (error) {
        currentNatal = null;
        $("#profile-error").textContent = `คำนวณพื้นดวงไม่ได้: ${error?.message || error}`;
      }
    } else {
      currentNatal = null;
    }
    updateNatalStatus();
    $("#profile-error").textContent ||= "";
    $("#profile-result").hidden = false;
    $("#profile-result").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("#transit-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!currentNatal) {
      $("#transit-error").textContent = "กรุณาผูกพื้นดวงจากวันเกิดก่อน";
      return;
    }
    const startText = $("#transit-start").value;
    const endText = $("#transit-end").value;
    if (!startText || !endText) {
      $("#transit-error").textContent = "กรุณาเลือกวันเริ่มต้นและวันสิ้นสุด";
      return;
    }
    const button = $("#transit-submit");
    button.disabled = true;
    button.textContent = "กำลังคำนวณดวงจร…";
    $("#transit-error").textContent = "";
    window.setTimeout(() => {
      try {
        const range = Astro.createTransitRange(currentNatal, {
          startText,
          endText,
          timeText: $("#transit-time").value,
          precision: $("#transit-precision").value
        });
        renderTransitRange(range);
      } catch (error) {
        $("#transit-error").textContent = `คำนวณช่วงดวงจรไม่ได้: ${error?.message || error}`;
      } finally {
        button.disabled = false;
        button.textContent = "วิเคราะห์ดวงจรทั้งช่วง";
      }
    }, 30);
  });

  $("#compare-form").addEventListener("submit", (event) => {
    event.preventDefault();
    renderComparison($("#type-a").value, $("#type-b").value);
  });

  $("#phone").addEventListener("input", () => {
    $("#phone").value = $("#phone").value.replace(/\D/g, "").slice(0, 10);
    $("#profile-error").textContent = "";
  });

  document.addEventListener("click", (event) => {
    const detailButton = event.target.closest("[data-detail]");
    if (!detailButton) return;
    const target = detailButton.dataset.detail;
    document.querySelectorAll("[data-detail]").forEach((button) => button.classList.toggle("active", button === detailButton));
    document.querySelectorAll("[data-panel]").forEach((panel) => panel.hidden = panel.dataset.panel !== target);
  });

  $("#tab-profile").addEventListener("click", () => switchTab("profile"));
  $("#tab-transit").addEventListener("click", () => switchTab("transit"));
  $("#tab-compare").addEventListener("click", () => switchTab("compare"));
  $("#back-to-form").addEventListener("click", () => $("#profile-form").scrollIntoView({ behavior: "smooth", block: "start" }));
  $("#reset-profile").addEventListener("click", () => {
    $("#profile-form").reset();
    $("#profile-error").textContent = "";
    $("#profile-result").hidden = true;
    currentNatal = null;
    updateNatalStatus();
    $("#phone").focus();
  });
  $("#reset-transit").addEventListener("click", resetTransitDates);
  $("#reset-compare").addEventListener("click", () => {
    $("#type-a").value = "INTJ";
    $("#type-b").value = "INTP";
    $("#compare-result").hidden = true;
  });

  $("#thai-place-list").innerHTML = [...new Set(Object.keys(Astro.knownPlaces))].sort((a, b) => a.localeCompare(b, "th")).map((place) => `<option value="${escapeHtml(place)}"></option>`).join("");
  populateTypes();
  resetTransitDates();
  updateNatalStatus();
})();
