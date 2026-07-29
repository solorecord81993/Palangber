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
    const sequence = [];
    let weightedScore = 0;
    let totalWeight = 0;
    for (let index = 0; index < 7; index += 1) {
      const visiblePair = digits.slice(index, index + 2);
      const meaning = byPair.get(normalizePair(visiblePair));
      if (!meaning) continue;
      const weight = pairWeights[index];
      sequence.push({ ...meaning, visiblePair, weight, position: index + 1 });
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
    return { score, items, sequence, topThemes, profile: buildPhonePersonality(items) };
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

  const phoneDomains = [
    {
      key: "character", title: "นิสัยและวิธีคิด", icon: "◉",
      themes: ["ผู้นำ", "ปัญญา", "สติ", "ความคิดสร้างสรรค์", "การตัดสินใจ", "อารมณ์", "สัญชาตญาณ", "ความรับผิดชอบ"],
      good: "เบอร์ส่งเสริมให้คิดเป็นระบบ รู้จังหวะตัดสินใจ และแสดงจุดยืนได้ชัด เมื่อมีเป้าหมายจะเรียนรู้เร็วและพาตัวเองออกจากปัญหาได้ดี",
      mixed: "นิสัยที่แสดงผ่านเบอร์มีทั้งความเด็ดขาดและความลังเลสลับกัน บางช่วงคิดไวมาก แต่เมื่อข้อมูลหรือความรู้สึกขัดกันอาจใช้เวลาตัดสินใจนาน",
      watch: "พลังเลขทำให้รับแรงกดดันทางความคิดง่าย มีโอกาสคิดซ้ำ ยึดความคิดเดิม หรือรีบตัดสินใจเมื่ออารมณ์ขึ้น",
      advice: "กำหนดเกณฑ์ตัดสินใจไว้ล่วงหน้า และเว้นจังหวะก่อนตอบเรื่องสำคัญ"
    },
    {
      key: "work", title: "การงานและบทบาท", icon: "▣",
      themes: ["การงาน", "ธุรกิจ", "ผู้ใหญ่สนับสนุน", "ชื่อเสียง", "การแข่งขัน", "การวางแผน", "การสื่อสาร", "เทคโนโลยี", "ผู้นำ"],
      good: "เหมาะกับงานที่ต้องรับผิดชอบ ตัดสินใจ ประสานงาน หรือใช้ความรู้เฉพาะทาง มีแนวโน้มสร้างความน่าเชื่อถือจากผลงานและได้รับโอกาสจากผู้ใหญ่หรือเครือข่าย",
      mixed: "งานเติบโตได้จากความสามารถจริง แต่จะมีจังหวะที่ต้องรับหลายเรื่องพร้อมกันหรือเข้าไปแก้ปัญหาแทนคนอื่น ความก้าวหน้าจึงขึ้นกับการเลือกงานให้ตรงบทบาท",
      watch: "เสี่ยงแบกภาระเกินขอบเขต ขัดแย้งจากคำพูดตรง หรือเปลี่ยนทิศทางงานเร็วเมื่อรู้สึกว่างานไม่เดิน",
      advice: "จัดลำดับงานที่สร้างผลลัพธ์สูงและตกลงขอบเขตความรับผิดชอบให้ชัด"
    },
    {
      key: "money", title: "การเงินและทรัพย์สิน", icon: "฿",
      themes: ["การเงิน", "โอกาส", "ความมั่นคง", "ธุรกิจ", "ความรับผิดชอบ", "ความสุข", "โชคลาภ"],
      good: "มีพลังหาเงินจากความรู้ โอกาสใหม่ หรือการทำงานร่วมกับคนอื่น หากรักษาวินัยจะต่อยอดรายได้และสะสมทรัพย์ได้ดี",
      mixed: "หาโอกาสทางการเงินได้ แต่เงินอาจหมุนออกตามภาระ ความสบาย หรือการช่วยคนใกล้ตัว จึงต้องแยกเงินเติบโตออกจากเงินใช้จ่าย",
      watch: "ควรระวังการตัดสินใจทางเงินตามอารมณ์ การรับภาระของคนอื่น หรือคาดหวังผลตอบแทนเร็วเกินไป",
      advice: "แบ่งเงินเป็นก้อนสำรอง ก้อนลงทุน และก้อนใช้จ่าย พร้อมกำหนดเพดานช่วยเหลือผู้อื่น"
    },
    {
      key: "love", title: "ความรักและความสัมพันธ์", icon: "♡",
      themes: ["ความรัก", "ความสัมพันธ์", "เสน่ห์", "อารมณ์", "ครอบครัว", "ผู้ใหญ่สนับสนุน"],
      good: "มีเสน่ห์จากความจริงใจและความใส่ใจ เมื่อมั่นใจในความสัมพันธ์จะดูแลคนรักและพร้อมสร้างความมั่นคงร่วมกัน",
      mixed: "ต้องการทั้งความใกล้ชิดและพื้นที่ส่วนตัว จึงอาจดูนิ่งในช่วงที่กำลังคิด แต่คาดหวังให้อีกฝ่ายเข้าใจความรู้สึกอยู่ลึก ๆ",
      watch: "มีโอกาสเก็บความไม่พอใจ คาดหวังสูง หรือใช้อารมณ์ตัดสินความสัมพันธ์เมื่อรู้สึกไม่มั่นคง",
      advice: "พูดความต้องการและขอบเขตตรง ๆ โดยไม่ให้อีกฝ่ายต้องเดาความรู้สึก"
    },
    {
      key: "communication", title: "การสื่อสารและสังคม", icon: "✦",
      themes: ["การสื่อสาร", "เครือข่าย", "เสน่ห์", "ผู้นำ", "ปัญญา", "ชื่อเสียง", "ความขัดแย้ง"],
      good: "อธิบายเรื่องยากให้เข้าใจง่าย สร้างความน่าเชื่อถือ และเชื่อมคนหรือข้อมูลหลายฝ่ายเข้าหากันได้ดี",
      mixed: "สื่อสารได้ดีเมื่อมีข้อมูลพร้อม แต่ในเรื่องละเอียดอ่อนอาจพูดสั้นเกินไปหรือใช้เหตุผลมากกว่าความรู้สึก",
      watch: "คำพูดตรง เร็ว หรือแรงในช่วงกดดันอาจทำให้คนอื่นตีความว่าตำหนิหรือควบคุม",
      advice: "แยกข้อเท็จจริง ความเห็น และความต้องการออกจากกันก่อนพูด"
    },
    {
      key: "pressure", title: "พลังใจและแรงกดดัน", icon: "◇",
      themes: ["ความเครียด", "สติ", "อารมณ์", "ความลับ", "ความรับผิดชอบ", "การเปลี่ยนแปลง"],
      good: "รับมือสถานการณ์ยากได้ดีเมื่อมีเป้าหมายชัด และมักกลับมาตั้งหลักได้จากการวางแผนหรือทบทวนคนเดียว",
      mixed: "ภายนอกดูควบคุมสถานการณ์ได้ แต่ภายในอาจคิดหลายชั้นและใช้พลังมากกว่าที่คนอื่นเห็น",
      watch: "มีแนวโน้มแบกความรับผิดชอบ คิดวน หรือพักไม่เต็มที่เมื่อเรื่องยังไม่จบ",
      advice: "กำหนดเวลาหยุดคิดเรื่องงานและระบายภาระเป็นรายการที่จัดการได้ทีละข้อ"
    }
  ];

  const analyzePhoneDomain = (analysis, domain) => {
    const matches = analysis.sequence.filter((item) => item.themes.split(",").some((theme) => domain.themes.includes(theme)));
    const evidence = matches.length ? matches : analysis.sequence;
    const totalWeight = evidence.reduce((sum, item) => sum + item.weight, 0) || 1;
    const raw = evidence.reduce((sum, item) => sum + item.score * item.weight, 0) / totalWeight;
    const score = clamp(Math.round((raw + 100) / 2), 0, 100);
    const level = score >= 68 ? "เด่น" : score >= 45 ? "ผสม" : "ต้องบริหาร";
    const text = score >= 68 ? domain.good : score >= 45 ? domain.mixed : domain.watch;
    const pairs = [...new Map(evidence.map((item) => [item.visiblePair, item])).values()].slice(0, 3);
    return { ...domain, score, level, text, pairs };
  };

  const segmentReading = (items, title, meaning) => {
    const total = items.reduce((sum, item) => sum + item.weight, 0) || 1;
    const raw = items.reduce((sum, item) => sum + item.score * item.weight, 0) / total;
    const tone = raw >= 35 ? "หนุน" : raw >= -20 ? "ผสม" : "ควรระวัง";
    return {
      title, meaning, tone,
      pairs: items.map((item) => item.visiblePair).join(" · "),
      text: raw >= 35
        ? "ช่วงนี้ของเบอร์ส่งแรงสนับสนุนค่อนข้างชัด ใช้เป็นจุดตั้งต้นในการแสดงความสามารถได้"
        : raw >= -20
          ? "มีทั้งแรงส่งและแรงต้าน ต้องเลือกใช้จุดแข็งพร้อมควบคุมพฤติกรรมที่เกิดเร็วเกินไป"
          : "มีคู่เลขที่กระตุ้นความกดดันหรือความขัดแย้ง ควรใช้สติและระบบช่วยก่อนตัดสินใจ"
    };
  };

  const renderPhoneReading = (analysis) => {
    const domains = phoneDomains.map((domain) => analyzePhoneDomain(analysis, domain));
    const positives = analysis.sequence.filter((item) => item.score >= 40).sort((a, b) => b.weight - a.weight);
    const cautions = analysis.sequence.filter((item) => item.score < 0).sort((a, b) => b.weight - a.weight);
    const segments = [
      segmentReading(analysis.sequence.slice(0, 3), "ช่วงต้น", "ภาพลักษณ์ วิธีเริ่มต้น และการรับสิ่งใหม่"),
      segmentReading(analysis.sequence.slice(3, 6), "ช่วงกลาง", "พฤติกรรมในชีวิตประจำวัน งาน และความสัมพันธ์"),
      segmentReading(analysis.sequence.slice(6), "คู่ท้าย", "แรงตัดสินใจ ผลลัพธ์ และพฤติกรรมที่แสดงชัดที่สุด")
    ];
    $("#phone-reading").innerHTML = `<section class="content-card deep-reading-card">
      <div class="section-title"><div><span class="result-kicker">บทอ่านเชิงลึก</span><h2>คำทำนายเบอร์แบบละเอียด</h2>
      <p>แยกจากธีม คะแนน และตำแหน่งจริงของคู่เลขในเบอร์นี้</p></div></div>
      <div class="reading-intro">
        <p><b>ภาพรวม:</b> เบอร์นี้มีแรงส่งเด่นจาก ${positives.length ? positives.slice(0, 3).map((item) => `${item.visiblePair} ${item.title}`).join(", ") : "การผสมกันของคู่เลขหลายตำแหน่ง"}.</p>
        <p><b>จุดที่ต้องรู้ทัน:</b> ${cautions.length ? cautions.slice(0, 3).map((item) => `${item.visiblePair} ${item.title}`).join(", ") : "ไม่พบคู่ลบเด่น แต่ยังควรใช้จุดแข็งอย่างมีสติ"}.</p>
      </div>
      <div class="position-reading-grid">${segments.map((segment) => `<article class="position-reading">
        <header><span>${segment.title}</span><b>${segment.tone}</b></header><small>${segment.meaning}</small>
        <strong>${segment.pairs || "—"}</strong><p>${segment.text}</p>
      </article>`).join("")}</div>
      <div class="domain-reading-grid">${domains.map((domain) => `<article class="domain-reading">
        <div class="domain-head"><span>${domain.icon}</span><div><h3>${domain.title}</h3><small>${domain.level}</small></div><b>${domain.score}</b></div>
        <div class="domain-bar"><i style="width:${domain.score}%"></i></div>
        <p>${domain.text}</p>
        <p class="domain-evidence"><b>คู่เลขที่เกี่ยวข้อง:</b> ${domain.pairs.map((item) => `${item.visiblePair} ${item.title}`).join(" · ")}</p>
        <p class="domain-advice"><b>แนวทางใช้พลัง:</b> ${domain.advice}</p>
      </article>`).join("")}</div>
    </section>`;
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
    renderPhoneReading(analysis);
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

  const ascendantReadings = {
    เมษ: "มีแรงเริ่มต้นสูง กล้าตัดสินใจ และต้องการเห็นความคืบหน้าเร็ว จุดพัฒนาคือการชะลอเพื่อฟังข้อมูลและความรู้สึกของคนอื่น",
    พฤษภ: "ต้องการความมั่นคง จัดการทรัพยากรได้ดี และค่อย ๆ สร้างผลลัพธ์ที่ยั่งยืน จุดพัฒนาคือการยอมเปลี่ยนเมื่อเงื่อนไขเดิมไม่ตอบโจทย์",
    เมถุน: "เรียนรู้ไว เชื่อมโยงข้อมูลเก่ง และปรับภาษาเข้ากับผู้คนได้หลายแบบ จุดพัฒนาคือการเลือกเรื่องสำคัญและทำให้จบ",
    กรกฎ: "รับรู้บรรยากาศและความรู้สึกเก่ง ให้คุณค่ากับครอบครัวและความปลอดภัย จุดพัฒนาคือการแยกความกังวลออกจากข้อเท็จจริง",
    สิงห์: "ต้องการสร้างผลงานที่มีความหมาย มีความภูมิใจและภาวะผู้นำ จุดพัฒนาคือการเปิดพื้นที่ให้คนอื่นมีบทบาทโดยไม่รู้สึกว่าสูญเสียคุณค่า",
    กันย์: "ละเอียด ชอบปรับปรุงระบบ และมองเห็นสิ่งที่ควรแก้ก่อนคนอื่น จุดพัฒนาคือการไม่ใช้มาตรฐานสูงกดดันตนเองหรือคนรอบตัว",
    ตุล: "มองเห็นหลายฝ่าย รักความยุติธรรม และมีทักษะประสานความร่วมมือ จุดพัฒนาคือการตัดสินใจให้ชัดเมื่อไม่สามารถรักษาสมดุลทุกฝ่ายได้",
    พิจิก: "มองลึก อ่านแรงจูงใจเก่ง และผ่านภาวะกดดันได้ดี จุดพัฒนาคือการลดการระแวงและบอกความต้องการก่อนสะสมความไม่พอใจ",
    ธนู: "มองภาพใหญ่ รักการเรียนรู้ และต้องการอิสระในการเติบโต จุดพัฒนาคือการเปลี่ยนวิสัยทัศน์ให้เป็นแผนที่วัดผลและติดตามได้",
    มังกร: "จริงจัง รับผิดชอบ และวางเป้าหมายระยะยาวได้ดี จุดพัฒนาคือการยอมพักและไม่ประเมินคุณค่าตนเองจากผลงานเพียงอย่างเดียว",
    กุมภ์: "คิดต่าง สนใจระบบและอนาคต และต้องการทำสิ่งที่มีประโยชน์ต่อคนหมู่มาก จุดพัฒนาคือการเชื่อมแนวคิดกับความต้องการของคนจริง ๆ",
    มีน: "มีจินตนาการ สัญชาตญาณ และเข้าใจอารมณ์ที่ละเอียด จุดพัฒนาคือการกำหนดขอบเขตและแปลงความรู้สึกเป็นการตัดสินใจที่ชัด"
  };

  const planetRoles = {
    Sun: "ตัวตน ศักดิ์ศรี ภาวะผู้นำ และความต้องการเป็นที่ยอมรับ",
    Moon: "อารมณ์ ความเคยชิน ความปลอดภัยภายใน และการตอบสนองต่อผู้คน",
    Mars: "แรงผลักดัน การแข่งขัน ความกล้า และวิธีจัดการความขัดแย้ง",
    Mercury: "ความคิด การเรียนรู้ การสื่อสาร เอกสาร และการเจรจา",
    Jupiter: "ปัญญา หลักการ โอกาส ผู้ใหญ่ และการขยายตัว",
    Venus: "ความรัก ความสัมพันธ์ รสนิยม ความสุข และการประนีประนอม",
    Saturn: "ความรับผิดชอบ ข้อจำกัด วินัย เวลา และบทเรียนระยะยาว",
    Rahu: "ความทะเยอทะยาน สิ่งใหม่ ความไม่แน่นอน และความต้องการที่ขยายตัว",
    Ketu: "สัญชาตญาณ การตัดสิ่งเก่า ความสนใจเฉพาะทาง และเรื่องที่อธิบายยาก"
  };

  const planetsAtHouses = (natal, houses) => natal.positions.filter((planet) => houses.includes(planet.house));

  const scoreNatalDomain = (natal, houses, focusKeys = []) => {
    let score = 58;
    planetsAtHouses(natal, houses).forEach((planet) => {
      score += (planet.nature || 0) * 4;
      if (planet.dignity === "อุจจ์") score += 7;
      if (planet.dignity === "เกษตร") score += 5;
      if (planet.dignity === "นิจ") score -= 8;
    });
    natal.positions.filter((planet) => focusKeys.includes(planet.key)).forEach((planet) => {
      score += (planet.nature || 0) * 3;
      if (planet.dignity === "อุจจ์") score += 5;
      if (planet.dignity === "นิจ") score -= 6;
    });
    return clamp(Math.round(score), 28, 92);
  };

  const houseEvidence = (natal, houses) => {
    const planets = planetsAtHouses(natal, houses);
    return planets.length
      ? planets.map((planet) => `${planet.thai}อยู่ภพ ${planet.house}${planet.dignity !== "ปกติ" ? ` (${planet.dignity})` : ""}`).join(" · ")
      : `ภพ ${houses.join(", ")} ไม่มีดาวสถิต ต้องอ่านเจ้าเรือนและดาวจรประกอบ`;
  };

  const buildNatalDomains = (natal) => {
    const ascName = Astro.signs[natal.ascSign].name;
    const sun = natal.positions.find((planet) => planet.key === "Sun");
    const moon = natal.positions.find((planet) => planet.key === "Moon");
    const venus = natal.positions.find((planet) => planet.key === "Venus");
    const jupiter = natal.positions.find((planet) => planet.key === "Jupiter");
    return [
      {
        title: "ตัวตนและนิสัยพื้นฐาน", icon: "ลั",
        score: scoreNatalDomain(natal, [1, 3], ["Sun", "Moon"]),
        text: `ลัคนา${ascName}ทำให้${ascendantReadings[ascName]} อาทิตย์อยู่ภพ ${sun.house} เน้น${Astro.houseNames[sun.house - 1][1]} ขณะที่จันทร์อยู่ภพ ${moon.house} ทำให้อารมณ์ต้องการความมั่นคงผ่าน${Astro.houseNames[moon.house - 1][1]}.`,
        evidence: `อาทิตย์ ${sun.signName} · จันทร์ ${moon.signName} · ธาตุเด่น ${Object.entries(natal.personality.elementTotals).sort((a, b) => b[1] - a[1])[0][0]}`,
        advice: "ใช้ลัคนาเป็นวิธีลงมือ ใช้อาทิตย์เป็นเป้าหมาย และใช้จันทร์เป็นสัญญาณว่าต้องพักหรือปรับสภาพแวดล้อมเมื่อใด"
      },
      {
        title: "การงานและความก้าวหน้า", icon: "งาน",
        score: scoreNatalDomain(natal, [6, 10, 11], ["Sun", "Mercury", "Saturn"]),
        text: `ภพกัมมะบอกวิธีสร้างชื่อเสียง ภพอริบอกงานประจำและโจทย์ที่ต้องแก้ ส่วนภพลาภะบอกผลตอบแทนและเครือข่าย ดวงนี้จึงก้าวหน้าได้เมื่อเชื่อมความรับผิดชอบเข้ากับงานที่วัดผลได้ และไม่รับทุกปัญหามาเป็นหน้าที่ของตน.`,
        evidence: houseEvidence(natal, [6, 10, 11]),
        advice: "เลือกบทบาทที่ให้อำนาจตัดสินใจสอดคล้องกับความรับผิดชอบ พร้อมเก็บหลักฐานผลงานและสร้างผู้สนับสนุนระยะยาว"
      },
      {
        title: "การเงินและทรัพย์สิน", icon: "฿",
        score: scoreNatalDomain(natal, [2, 8, 11], ["Jupiter", "Venus"]),
        text: `ภพกดุมภะสะท้อนรายรับและการเก็บทรัพย์ ภพมรณะเกี่ยวกับเงินร่วม ภาระ และความผันผวน ส่วนภพลาภะคือผลกำไร ดวงนี้ควรแยกเงินที่ควบคุมเองออกจากภาระร่วม และใช้ความรู้มากกว่าความเร่งรีบในการตัดสินใจเรื่องเงิน.`,
        evidence: houseEvidence(natal, [2, 8, 11]),
        advice: "ทำบัญชีแยกเงินสำรอง เงินลงทุน และภาระร่วม ตรวจเงื่อนไขที่ย้อนกลับยากก่อนตกลงทุกครั้ง"
      },
      {
        title: "ความรักและคู่สัมพันธ์", icon: "♡",
        score: scoreNatalDomain(natal, [5, 7, 8], ["Venus", "Moon"]),
        text: `ภพปุตตะบอกการแสดงความรัก ภพปัตนิบอกคู่และหุ้นส่วน และภพมรณะบอกความไว้ใจเชิงลึก ศุกร์อยู่ภพ ${venus.house} ราศี${venus.signName}${venus.dignity !== "ปกติ" ? `ในสถานะ${venus.dignity}` : ""} จึงต้องการความสัมพันธ์ที่ให้ทั้งความเข้าใจและคุณค่าที่จับต้องได้.`,
        evidence: houseEvidence(natal, [5, 7, 8]),
        advice: "ตกลงเรื่องเวลา เงิน ขอบเขต และวิธีแก้ความขัดแย้งให้ชัดก่อนความรู้สึกสะสม"
      },
      {
        title: "สุขภาพและการรับแรงกดดัน", icon: "＋",
        score: scoreNatalDomain(natal, [1, 6, 8, 12], ["Mars", "Saturn"]),
        text: "ภพตนุ อริ มรณะ และวินาศใช้ดูรูปแบบพลังชีวิต ภาระ และการพักฟื้นในเชิงโหราศาสตร์ เมื่อดาวหนักกระทบภพเหล่านี้ เจ้าชะตามักพยายามควบคุมสถานการณ์จนลืมสังเกตความเหนื่อยของตน.",
        evidence: houseEvidence(natal, [1, 6, 8, 12]),
        advice: "รักษาตารางนอน การพัก และขอบเขตงานให้สม่ำเสมอ หากมีอาการผิดปกติควรใช้ข้อมูลทางการแพทย์ ไม่ใช้คำทำนายแทนการตรวจรักษา"
      },
      {
        title: "โชค โอกาส และการเติบโต", icon: "✦",
        score: scoreNatalDomain(natal, [5, 9, 11], ["Jupiter"]),
        text: `พฤหัสอยู่ภพ ${jupiter.house} ราศี${jupiter.signName}${jupiter.dignity !== "ปกติ" ? `ในสถานะ${jupiter.dignity}` : ""} โอกาสจึงมาจาก${Astro.houseNames[jupiter.house - 1][1]} มากกว่าการรอจังหวะสุ่ม ภพศุภะและลาภะชี้ว่าการเรียนรู้ ผู้ใหญ่ และเครือข่ายเป็นตัวขยายผล.`,
        evidence: houseEvidence(natal, [5, 9, 11]),
        advice: "ลงทุนในความรู้ที่ต่อยอดได้จริง และรักษาความสัมพันธ์กับคนที่มองเห็นศักยภาพระยะยาว"
      }
    ];
  };

  const renderNatalReading = (natal) => {
    const domains = buildNatalDomains(natal);
    const fallen = natal.positions.filter((planet) => planet.dignity === "นิจ");
    const strong = natal.positions.filter((planet) => ["อุจจ์", "เกษตร"].includes(planet.dignity));
    const kalakini = natal.thaksa.find((item) => item.role === "กาลกิณี");
    const houses = natal.houses.map((house) => {
      const planets = house.planets;
      return `<article class="house-reading">
        <header><span>${house.number}</span><div><h3>${house.name}</h3><small>${house.meaning}</small></div></header>
        <p>${planets.length
          ? `มีดาว ${planets.map((planet) => `${planet.thai}${planet.dignity !== "ปกติ" ? `(${planet.dignity})` : ""}`).join(", ")} ทำให้เรื่องของภพนี้แสดงออกผ่าน${planets.map((planet) => planetRoles[planet.key]).join(" และ ")}`
          : "ไม่มีดาวสถิตโดยตรง ไม่ได้แปลว่าเรื่องนี้ไม่มีความสำคัญ แต่ผลจะเปิดชัดเมื่อเจ้าเรือนหรือดาวจรเข้ามากระตุ้น"}</p>
      </article>`;
    }).join("");
    $("#natal-reading").innerHTML = `<section class="content-card deep-reading-card">
      <div class="section-title"><div><span class="result-kicker">บทอ่านพื้นดวง</span><h2>คำทำนายดวงแบบละเอียด</h2>
      <p>สังเคราะห์ลัคนา ดาวกำเนิด ภพ นวางค์ มาตรฐานดาว และมหาทักษา</p></div></div>
      <div class="reading-intro">
        <p><b>แกนชีวิต:</b> ลัคนา${Astro.signs[natal.ascSign].name}ทำให้${ascendantReadings[Astro.signs[natal.ascSign].name]}</p>
        <p><b>ดาวที่ช่วยส่งกำลัง:</b> ${strong.length ? strong.map((planet) => `${planet.thai} ${planet.dignity}`).join(" · ") : "ไม่มีดาวอุจจ์หรือเกษตรเด่น ต้องใช้การบริหารดาวร่วมกัน"}.</p>
        <p><b>บทเรียนสำคัญ:</b> ${fallen.length ? `${fallen.map((planet) => `${planet.thai}นิจ`).join(" · ")} ต้องพัฒนาผ่านวินัยและประสบการณ์` : "ไม่พบดาวนิจในกลุ่มหลัก"} · กาลกิณีมหาทักษาคือ ${kalakini?.planet || "ไม่ระบุ"} จึงควรระวังการใช้พลังของดาวนี้แบบสุดโต่ง.</p>
      </div>
      <div class="domain-reading-grid natal-domain-grid">${domains.map((domain) => `<article class="domain-reading">
        <div class="domain-head"><span>${domain.icon}</span><div><h3>${domain.title}</h3><small>${domain.score >= 70 ? "แรงส่งดี" : domain.score >= 52 ? "ต้องบริหารสมดุล" : "เป็นบทเรียนสำคัญ"}</small></div><b>${domain.score}</b></div>
        <div class="domain-bar"><i style="width:${domain.score}%"></i></div><p>${domain.text}</p>
        <p class="domain-evidence"><b>หลักฐานในดวง:</b> ${domain.evidence}</p>
        <p class="domain-advice"><b>แนวทาง:</b> ${domain.advice}</p>
      </article>`).join("")}</div>
      <details class="house-reading-details">
        <summary>อ่านคำทำนายครบทั้ง 12 ภพ</summary>
        <div class="house-reading-grid">${houses}</div>
      </details>
    </section>`;
    $("#natal-reading").hidden = false;
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
    renderNatalReading(natal);
    ["#natal-summary", "#natal-chart", "#natal-details", "#natal-reading"].forEach((selector) => $(selector).hidden = false);
  };

  const chartAxisForMatch = (natal, index) => ({
    leftPercent: natal.personality.axes[index].leftPercent,
    dominant: natal.personality.axes[index].code
  });

  const renderMatch = (phoneProfile, natal) => {
    const codeMeanings = {
      E: "ใช้พลังจากการลงมือและปฏิสัมพันธ์กับคน", I: "ใช้พลังจากการคิดทบทวนและพื้นที่ส่วนตัว",
      S: "เชื่อข้อมูลที่จับต้องได้และประสบการณ์จริง", N: "มองความเป็นไปได้ ความหมาย และภาพอนาคต",
      T: "ตัดสินใจจากเหตุผล หลักเกณฑ์ และผลลัพธ์", F: "ตัดสินใจโดยคำนึงถึงคุณค่าและผลกระทบต่อความรู้สึก",
      J: "ต้องการโครงสร้าง แผน และความชัดเจน", P: "ต้องการพื้นที่ทดลองและปรับตามสถานการณ์"
    };
    const axisAdvice = [
      "จัดสมดุลระหว่างเวลาพบผู้คนกับเวลาทบทวนคนเดียว",
      "เริ่มจากภาพใหญ่แล้วตรวจด้วยข้อเท็จจริงก่อนตัดสินใจ",
      "แยกการวิเคราะห์เหตุผลออกจากการรับฟังความรู้สึก",
      "กำหนดเป้าหมายและเส้นตาย แต่เว้นวิธีทำให้ปรับได้"
    ];
    const rows = phoneProfile.axes.map((axis, index) => {
      const chartAxis = chartAxisForMatch(natal, index);
      const same = axis.dominant.code === chartAxis.dominant;
      return {
        title: axis.title, phone: axis.dominant.code, natal: chartAxis.dominant,
        same, similarity: 100 - Math.abs(axis.leftPercent - chartAxis.leftPercent),
        explanation: same
          ? `พื้นดวงและเบอร์ไปทาง ${axis.dominant.code} เหมือนกัน จึงย้ำลักษณะ “${codeMeanings[axis.dominant.code]}” ให้แสดงออกง่ายและต่อเนื่อง`
          : `พื้นดวงเอนทาง ${chartAxis.dominant} (${codeMeanings[chartAxis.dominant]}) แต่เบอร์ผลักไปทาง ${axis.dominant.code} (${codeMeanings[axis.dominant.code]}) จึงช่วยเติมมุมที่ขาดแต่ใช้พลังมากขึ้น`,
        advice: axisAdvice[index]
      };
    });
    const score = Math.round(rows.reduce((sum, row) => sum + row.similarity, 0) / rows.length);
    const label = score >= 85 ? "สอดคล้องสูงมาก" : score >= 72 ? "สอดคล้องค่อนข้างดี" : score >= 58 ? "ช่วยเสริมมุมที่ต่าง" : "มีแรงผลักคนละทิศ";
    const strongest = [...rows].sort((a, b) => b.similarity - a.similarity)[0];
    const mostDifferent = [...rows].sort((a, b) => a.similarity - b.similarity)[0];
    $("#match-result").innerHTML = `<section class="content-card match-card">
      <div class="match-score"><span>เบอร์ Match กับพื้นดวง</span><strong>${score}%</strong><b>${label}</b></div>
      <div class="match-grid">${rows.map((row) => `<div class="match-row"><span>${escapeHtml(row.title)}</span><b class="${row.same ? "same" : "different"}">${row.phone} ${row.same ? "=" : "↔"} ${row.natal}</b></div>`).join("")}</div>
      <p>${score >= 72 ? "เบอร์ขยายบุคลิกที่มีอยู่เดิมได้ค่อนข้างเป็นธรรมชาติ" : "เบอร์กระตุ้นให้แสดงพฤติกรรมบางด้านต่างจากพื้นดวง จึงอาจช่วยพัฒนาได้แต่ต้องสังเกตความฝืนของตน"}</p>
      <div class="match-reading">
        <h3>คำอธิบายความเข้ากันแบบรายด้าน</h3>
        ${rows.map((row) => `<article><header><b>${row.title}</b><span>${Math.round(row.similarity)}% สอดคล้อง</span></header>
          <p>${row.explanation}</p><small><b>วิธีบริหาร:</b> ${row.advice}</small></article>`).join("")}
        <div class="match-conclusion">
          <p><b>จุดที่เบอร์ส่งเสริมดีที่สุด:</b> ${strongest.title} — ความสอดคล้อง ${Math.round(strongest.similarity)}%</p>
          <p><b>จุดที่ต้องสังเกตตัวเองมากที่สุด:</b> ${mostDifferent.title} — ${mostDifferent.same ? "แม้ไปทางเดียวกัน แต่อาจขยายลักษณะนี้มากเกินสมดุล" : "เบอร์และพื้นดวงดึงคนละทาง ควรเลือกใช้ให้เหมาะกับสถานการณ์"}</p>
        </div>
      </div>
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

  const buildTransitDomainReadings = (range) => {
    const definitions = [
      { title: "งานและชื่อเสียง", keywords: ["งาน", "ชื่อเสียง", "สื่อสาร", "เครือข่าย"], good: "เหมาะกับการขยับบทบาท ผลักดันงาน และสร้างการยอมรับ โดยต้องเลือกช่วงคะแนนเด่นเพื่อเริ่มเรื่องสำคัญ", watch: "งานมีจังหวะกดดันหรือเปลี่ยนทิศ ควรเผื่อเวลา ตรวจขอบเขต และหลีกเลี่ยงการรับปากเพราะแรงเร่ง" },
      { title: "การเงิน", keywords: ["การเงิน", "รายได้", "รายจ่าย", "ทรัพย์"], good: "มีช่วงที่ต่อยอดรายได้หรือวางแผนทรัพย์สินได้ดี เหมาะกับการตัดสินใจบนข้อมูลและเป้าหมายระยะยาว", watch: "ควรระวังรายจ่าย ภาระร่วม หรือการตัดสินใจจากความคาดหวังเร็วเกินไป" },
      { title: "ความรักและหุ้นส่วน", keywords: ["ความสัมพันธ์", "ครอบครัว"], good: "ช่วงที่คะแนนดีเหมาะกับการคุยข้อตกลง วางแผนร่วม และสร้างความไว้ใจจากการกระทำที่สม่ำเสมอ", watch: "เมื่อคะแนนลดให้ระวังการตีความแทนกัน ความเงียบ และการนำความกดดันเรื่องอื่นมาปะปนกับความสัมพันธ์" },
      { title: "พลังใจและสุขภาพ", keywords: ["สุขภาพ", "ตัวตน", "เปลี่ยนแปลง", "เบื้องหลัง"], good: "จังหวะหนุนเหมาะกับการปรับกิจวัตรและสร้างวินัยที่ทำต่อเนื่องได้", watch: "ช่วงแรงกดดันควรลดงานที่ไม่จำเป็น รักษาการพัก และไม่ใช้คำทำนายแทนข้อมูลทางการแพทย์" }
    ];
    const allNotes = range.samples.flatMap((sample) => sample.notes.map((note) => ({ ...note, dateText: sample.dateText })));
    return definitions.map((definition) => {
      const notes = allNotes.filter((note) => definition.keywords.some((keyword) => note.text.includes(keyword)));
      const goodCount = notes.filter((note) => note.tone === "good").length;
      const watchCount = notes.filter((note) => note.tone === "watch").length;
      const balance = notes.length ? (goodCount - watchCount) / notes.length : 0;
      const score = clamp(Math.round(range.average + balance * 18), 28, 92);
      const evidence = [...new Map(notes.map((note) => [note.text, note])).values()].slice(0, 3);
      return {
        ...definition, score,
        text: score >= 60 ? definition.good : definition.watch,
        evidence
      };
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
    const domainReadings = buildTransitDomainReadings(range);
    $("#transit-highlights").innerHTML = `<section class="highlight-grid">
      <div class="highlight-box good"><h3>ช่วงคะแนนเด่น</h3><div class="date-score-list">${dateList(range.best)}</div></div>
      <div class="highlight-box watch"><h3>ช่วงที่ควรระวัง</h3><div class="date-score-list">${dateList(range.watch)}</div></div>
      <div class="recurring-list"><h3>ประเด็นที่เกิดซ้ำในช่วงนี้</h3>
        <ul>${(range.recurring.length ? range.recurring : [{ text: "ภาพรวมไม่มีแรงกระทบเด่นซ้ำหลายช่วง", count: 1 }]).map((item) => `<li>${escapeHtml(item.text)}${item.count > 1 ? ` · พบ ${item.count} จุด` : ""}</li>`).join("")}</ul>
      </div>
    </section>
    <section class="content-card deep-reading-card transit-deep-reading">
      <div class="section-title"><div><span class="result-kicker">คำทำนายดวงจรเชิงลึก</span><h2>อ่านผลกระทบรายด้านตลอดช่วง</h2>
      <p>สังเคราะห์ทุกจุดคำนวณ ไม่ได้ตัดสินจากวันเดียว</p></div></div>
      <div class="domain-reading-grid">${domainReadings.map((domain) => `<article class="domain-reading">
        <div class="domain-head"><span>◷</span><div><h3>${domain.title}</h3><small>${domain.score >= 68 ? "แรงหนุนมากกว่าแรงต้าน" : domain.score >= 50 ? "มีทั้งจังหวะหนุนและระวัง" : "ควรวางแผนเผื่อความเสี่ยง"}</small></div><b>${domain.score}</b></div>
        <div class="domain-bar"><i style="width:${domain.score}%"></i></div><p>${domain.text}</p>
        <p class="domain-evidence"><b>กระแสดาวที่พบ:</b> ${domain.evidence.length ? domain.evidence.map((note) => note.text).join(" · ") : "ไม่มีสัญญาณซ้ำเด่นในช่วงตัวอย่าง"}</p>
      </article>`).join("")}</div>
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
    ["#natal-summary", "#natal-chart", "#natal-details", "#natal-reading", "#match-result"].forEach((selector) => $(selector).hidden = true);
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
