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


  const describeTheme = (theme) => {
    const descriptions = {
      "การงาน": "ด้านการงานจริงจังกับหน้าที่และต้องการเห็นผลลัพธ์ที่จับต้องได้ จะทำได้ดีเมื่อมีเป้าหมายและขอบเขตงานชัดเจน",
      "การเงิน": "ด้านการเงินมีแรงผลักดันให้สร้างความมั่นคงและมองหาโอกาสใหม่ แต่ควรแยกความต้องการออกจากความจำเป็นก่อนตัดสินใจ",
      "ธุรกิจ": "มีมุมคิดเชิงธุรกิจ กล้าเจรจาและมองผลประโยชน์หลายด้าน เหมาะกับงานที่ต้องตัดสินใจหรือบริหารทรัพยากร",
      "ความรัก": "เรื่องความรักให้ความสำคัญกับความรู้สึกและการดูแลกัน การสื่อสารความคาดหวังตรงไปตรงมาจะลดความเข้าใจผิดได้มาก",
      "ความสัมพันธ์": "รับรู้อารมณ์ของคนรอบตัวได้ดีและสร้างความร่วมมือเก่ง แต่ไม่ควรรับทุกปัญหามาเป็นภาระของตน",
      "การสื่อสาร": "มีพลังจากคำพูดและการนำเสนอ สามารถอธิบายหรือโน้มน้าวคนได้ดี โดยผลลัพธ์จะดีที่สุดเมื่อพูดชัดและรักษาคำพูด",
      "ผู้นำ": "มีความเป็นผู้นำและต้องการกำหนดทิศทางด้วยตนเอง ควรเปิดพื้นที่ให้ผู้อื่นเสนอความคิดเพื่อให้การตัดสินใจรอบด้าน",
      "ปัญญา": "ชอบเรียนรู้ วิเคราะห์ และเชื่อมโยงข้อมูล เหมาะกับเรื่องที่ต้องใช้ความรู้เฉพาะทางหรือเหตุผล",
      "โอกาส": "มักมองเห็นช่องทางที่คนอื่นมองข้าม หากเตรียมตัวและลงมือสม่ำเสมอ โอกาสเล็กสามารถพัฒนาเป็นผลลัพธ์ใหญ่",
      "สัญชาตญาณ": "รับรู้บรรยากาศและสิ่งที่ไม่ได้พูดออกมาตรง ๆ ได้ไว ควรใช้ความรู้สึกประกอบกับข้อมูลที่ตรวจสอบได้",
      "ความคิดสร้างสรรค์": "มีจินตนาการและมุมมองแตกต่าง สามารถสร้างผลงานมีเอกลักษณ์เมื่อเปลี่ยนไอเดียให้เป็นแผนปฏิบัติ",
      "ความเครียด": "มีแนวโน้มเก็บแรงกดดันและคิดเรื่องเดิมซ้ำ ควรกำหนดเวลาพักและแบ่งปัญหาใหญ่เป็นขั้นตอนเล็ก",
      "อารมณ์": "อารมณ์ตอบสนองค่อนข้างไว โดยเฉพาะเมื่อถูกเร่ง การเว้นจังหวะก่อนตอบโต้จะช่วยลดปัญหา",
      "ชื่อเสียง": "มีแรงผลักดันให้สร้างการยอมรับจากผลงาน และมีโอกาสเป็นที่รู้จักเมื่อรักษามาตรฐานอย่างต่อเนื่อง",
      "เสน่ห์": "มีแรงดึงดูดจากบุคลิกและวิธีสื่อสาร เข้ากับคนง่าย แต่ควรวางขอบเขตเพื่อไม่ให้ความเกรงใจกลายเป็นภาระ"
    };
    return descriptions[theme] || "พลังด้าน" + theme + "จะเด่นขึ้นเมื่อรู้จักใช้ให้เหมาะกับสถานการณ์และรักษาความสม่ำเสมอ";
  };

  const describePosition = (positions) => {
    if (positions.includes(7)) return "คู่นี้อยู่ตำแหน่งท้ายสุด จึงส่งผลต่อการตัดสินใจ ผลลัพธ์ และภาพที่ผู้อื่นสัมผัสจากเจ้าของเบอร์ค่อนข้างชัด";
    if (positions.some((position) => position >= 4)) return "คู่นี้อยู่ช่วงกลางถึงท้าย จึงสัมพันธ์กับวิธีลงมือทำ การจัดการชีวิตประจำวัน และผลที่แสดงออกภายนอก";
    return "คู่นี้อยู่ช่วงต้น จึงสะท้อนพื้นฐานความคิด แรงจูงใจ และวิธีเริ่มต้นรับมือกับสถานการณ์";
  };

  const describePolarity = (polarity) => {
    if (polarity === "positive") return "เป็นพลังส่งเสริมที่ยิ่งเห็นผลเมื่อใช้อย่างสม่ำเสมอและทำงานร่วมกับคู่เลขบวกอื่นในเบอร์";
    if (polarity === "mixed") return "ให้ผลได้ทั้งสองด้าน จุดแข็งจะเกิดเมื่อมีวินัย แต่หากรีบหรือใช้อารมณ์อาจเปลี่ยนเป็นแรงกดดัน";
    return "เป็นสัญญาณให้ระมัดระวัง ไม่ได้หมายถึงผลร้ายแน่นอน แต่ควรมีแผนสำรองและตรวจสอบการตัดสินใจสำคัญ";
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

  const personalityNames = {
    INTJ: "นักวางกลยุทธ์", INTP: "นักคิดวิเคราะห์", ENTJ: "ผู้นำเชิงกลยุทธ์", ENTP: "นักสร้างโอกาส",
    INFJ: "ผู้มองการณ์ไกล", INFP: "นักอุดมคติ", ENFJ: "ผู้นำเชื่อมผู้คน", ENFP: "นักสร้างแรงบันดาลใจ",
    ISTJ: "ผู้รับผิดชอบ", ISFJ: "ผู้ดูแลอย่างมีระบบ", ESTJ: "ผู้จัดการเป้าหมาย", ESFJ: "ผู้ประสานสัมพันธ์",
    ISTP: "นักแก้ปัญหา", ISFP: "ผู้สร้างสรรค์อ่อนโยน", ESTP: "นักลงมือทำ", ESFP: "ผู้สร้างสีสัน"
  };

  const calculateAxis = (items, axis) => {
    const scoreSide = (side) => items
      .map((item) => {
        const matches = item.themes.split(",").filter((theme) => side.themes.includes(theme));
        const value = matches.length ? item.weight * (0.75 + (item.score + 100) / 200) : 0;
        return { item, value };
      })
      .filter((entry) => entry.value > 0)
      .sort((a, b) => b.value - a.value);

    const leftEntries = scoreSide(axis.left);
    const rightEntries = scoreSide(axis.right);
    const leftValue = leftEntries.reduce((total, entry) => total + entry.value, 0);
    const rightValue = rightEntries.reduce((total, entry) => total + entry.value, 0);
    const total = leftValue + rightValue || 1;
    const leftPercent = Math.round((leftValue / total) * 100);
    const dominant = leftPercent >= 50 ? axis.left : axis.right;
    const other = leftPercent >= 50 ? axis.right : axis.left;
    const dominantEntries = leftPercent >= 50 ? leftEntries : rightEntries;
    const otherEntries = leftPercent >= 50 ? rightEntries : leftEntries;
    return {
      ...axis,
      dominant,
      other,
      dominantPercent: leftPercent >= 50 ? leftPercent : 100 - leftPercent,
      leftPercent,
      source: dominantEntries[0]?.item || items[0],
      balance: otherEntries[0]?.item || items[1] || items[0]
    };
  };

  const buildPersonalityProfile = (items) => {
    const axes = personalityAxes.map((axis) => calculateAxis(items, axis));
    const code = axes.map((axis) => axis.dominant.code).join("");
    return { code, name: personalityNames[code] || "บุคลิกผสมผสาน", axes };
  };

  const buildAxisCard = (axis) => {
    return '<article class="axis-card">' +
      '<header><span>' + axis.left.code + ' ↔ ' + axis.right.code + '</span><strong>' + axis.dominant.code + ' ' + axis.dominantPercent + '%</strong></header>' +
      '<h4>' + escapeHtml(axis.title) + ': ' + escapeHtml(axis.dominant.name) + '</h4>' +
      '<div class="axis-bar" aria-label="' + escapeHtml(axis.title) + '"><i style="width:' + axis.leftPercent + '%"></i></div>' +
      '<div class="axis-scale"><span>' + axis.left.code + ' ' + axis.leftPercent + '%</span><span>' + axis.right.code + ' ' + (100 - axis.leftPercent) + '%</span></div>' +
      '<p><b>คู่เลขที่หนุน:</b> ' + escapeHtml(axis.source.visiblePair) + ' ' + escapeHtml(axis.source.title) + ' — ' + escapeHtml(axis.source.summary) + '</p>' +
      '<p class="axis-balance"><b>มุมที่ควรบาลานซ์:</b> ' + escapeHtml(axis.balance.visiblePair) + ' ' + escapeHtml(axis.balance.title) + ' — ' + escapeHtml(axis.balance.advice) + '</p>' +
      '</article>';
  };

  const buildPersonalitySection = (profile) => {
    const [energy, information, decision, lifestyle] = profile.axes;
    return '<section class="personality-section personality16">' +
      '<div class="type-hero"><span>บุคลิกแบบ 4 มิติจากคู่เลข</span><h3>' + escapeHtml(profile.code) + ' · ' + escapeHtml(profile.name) + '</h3>' +
      '<p>รหัสนี้เกิดจากน้ำหนักของคู่เลขในเบอร์ที่กรอก โดยดู 4 มิติพร้อมกัน ไม่ใช่แบบทดสอบทางจิตวิทยาหรือการวินิจฉัยบุคลิกภาพ</p></div>' +
      '<div class="type-summary"><p><b>ภาพรวม:</b> มีแนวโน้ม ' + escapeHtml(energy.dominant.name) + ', ' + escapeHtml(information.dominant.name) + ', ' + escapeHtml(decision.dominant.name) + ' และ ' + escapeHtml(lifestyle.dominant.name) + ' การใช้จุดเด่นให้สมดุลกับอีกฝั่งของแต่ละมิติจะช่วยให้ตัดสินใจและสัมพันธ์กับคนอื่นได้รอบด้านขึ้น</p></div>' +
      '<div class="axis-grid">' + profile.axes.map(buildAxisCard).join("") + '</div></section>';
  };

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
    const mainThemes = topThemes.map(([theme]) => theme);
    document.querySelector("#themes").innerHTML = mainThemes
      .map((theme) => '<span class="theme">#' + escapeHtml(theme) + "</span>")
      .join("");

    const pairCards = [...grouped.values()].sort((a, b) => b.weight - a.weight);
    const strongest = pairCards[0];
    const second = pairCards[1];
    const caution = pairCards
      .filter((item) => item.polarity !== "positive")
      .sort((a, b) => a.score - b.score)[0];
    const personalityProfile = buildPersonalityProfile(pairCards);
    const workThemes = mainThemes.filter((theme) => ["การงาน", "ธุรกิจ", "ผู้นำ", "ปัญญา", "การสื่อสาร", "โอกาส"].includes(theme));
    const peopleThemes = mainThemes.filter((theme) => ["ความรัก", "ความสัมพันธ์", "อารมณ์", "เสน่ห์", "ความเครียด"].includes(theme));

    document.querySelector("#long-reading").innerHTML =
      '<section class="reading-section"><h3>ภาพรวมบุคลิกและพลังของเบอร์</h3>' +
      '<p>เบอร์นี้ได้คะแนนรวม <b>' + score + ' จาก 100</b> จัดเป็นพลัง' +
      (score >= 75 ? 'ส่งเสริมค่อนข้างชัด จุดแข็งหลายด้านช่วยสนับสนุนกัน' : score >= 60 ? 'บวกมากกว่าลบ สามารถต่อยอดได้ดีเมื่อมีเป้าหมาย' : score >= 45 ? 'แบบผสม มีทั้งแรงสนับสนุนและบททดสอบที่ต้องบริหาร' : 'ที่ต้องใช้ความรอบคอบและวางแผนก่อนตัดสินใจ') +
      ' ลักษณะที่เด่นที่สุดมาจากคู่ <b>' + escapeHtml(strongest.visiblePair) + ' ' + escapeHtml(strongest.title) + '</b>' +
      (second ? ' และมีคู่ <b>' + escapeHtml(second.visiblePair) + ' ' + escapeHtml(second.title) + '</b> เข้ามาเสริม' : '') + ' เจ้าของเบอร์จึงมักแสดงจุดเด่นหลายด้านพร้อมกัน แต่ต้องจัดลำดับให้ชัดเพื่อไม่ให้พลังแต่ละคู่ดึงกันคนละทิศทาง</p>' +
      '<p>ธีมสำคัญของเบอร์คือ <b>' + escapeHtml(mainThemes.join(" • ")) + '</b> เรื่องเหล่านี้มักเข้ามามีบทบาทในการเลือกงาน การใช้เงิน และการสร้างความสัมพันธ์ คำทำนายสะท้อนแนวโน้มของพฤติกรรม ไม่ได้กำหนดว่าเหตุการณ์ต้องเกิดขึ้นตายตัว จึงควรนำไปเทียบกับประสบการณ์จริงของเจ้าของเบอร์ด้วย</p></section>' +
      buildPersonalitySection(personalityProfile) +
      '<section class="reading-section"><h3>การงาน ความสำเร็จ และการเงิน</h3>' +
      '<p>' + (workThemes.length ? 'พลังด้าน <b>' + escapeHtml(workThemes.join(" และ ")) + '</b> ปรากฏเด่น จึงเหมาะกับงานที่ได้ใช้ความคิด การประสานงาน การตัดสินใจ หรือการพัฒนาสิ่งใหม่' : 'พลังด้านงานกระจายหลายเรื่อง จึงควรเลือกเส้นทางจากความถนัดจริงและสร้างระบบให้ทำต่อเนื่อง') + ' หากตั้งเป้าหมายเป็นช่วงและวัดผลจากสิ่งที่ทำได้ จะใช้พลังของเบอร์ได้ดีกว่าการรอจังหวะเพียงอย่างเดียว</p>' +
      '<p>ด้านการเงิน มีโอกาสสร้างรายได้จากความสามารถและเครือข่าย แต่ควรดูทั้งการหาเงินและการรักษาเงิน คู่เลขที่ให้โอกาสอาจทำให้กล้าลงทุน ขณะที่คู่กดดันอาจทำให้ตัดสินใจเร็ว ทางที่ดีควรกำหนดงบประมาณ เงินสำรอง และเพดานความเสี่ยงก่อนรับข้อเสนอสำคัญ</p></section>' +
      '<section class="reading-section"><h3>ความรัก ความสัมพันธ์ และการสื่อสาร</h3>' +
      '<p>' + (peopleThemes.length ? 'ธีม <b>' + escapeHtml(peopleThemes.join(" และ ")) + '</b> มีน้ำหนัก จึงรับรู้บรรยากาศและปฏิกิริยาของคนรอบตัวค่อนข้างไว' : 'ความสัมพันธ์ขึ้นกับวิธีสื่อสารและความสม่ำเสมอมากกว่าพลังเฉพาะด้าน') + ' ควรพูดความต้องการให้ชัดโดยไม่คาดหวังให้อีกฝ่ายเดาใจ และแยกความช่วยเหลือออกจากการรับภาระแทนผู้อื่นทั้งหมด</p>' +
      '<p>เสน่ห์และคำพูดอาจช่วยเปิดประตูให้รู้จักคนหรือสร้างความร่วมมือใหม่ แต่ความไว้ใจระยะยาวต้องอาศัยขอบเขตที่ชัด ความซื่อสัตย์ และการรักษาคำพูด เมื่อต้องตัดสินใจเรื่องคนควรดูการกระทำต่อเนื่องมากกว่าความรู้สึกช่วงสั้น</p></section>' +
      '<section class="reading-section caution-reading"><h3>จุดที่ควรระวังและแนวทางปรับใช้</h3>' +
      '<p>' + (caution ? 'คู่ที่ควรให้ความสำคัญเป็นพิเศษคือ <b>' + escapeHtml(caution.visiblePair) + ' ' + escapeHtml(caution.title) + '</b> — ' + escapeHtml(caution.summary) : 'ไม่พบคู่เตือนที่เด่นกว่าคู่อื่น แต่ยังควรรักษาสมดุลและไม่ประมาท') + ' จุดระวังไม่ใช่คำตัดสินว่าจะเกิดเรื่องไม่ดี เพียงบอกว่าด้านนี้ต้องใช้สติ แผนสำรอง และข้อมูลเพียงพอก่อนเลือก</p>' +
      '<p><b>คำแนะนำหลัก:</b> ' + escapeHtml(caution ? caution.advice : strongest.advice) + ' หากทำควบคู่กับจุดแข็งของคู่เลขเด่น จะช่วยลดด้านเสียและทำให้พลังของเบอร์แสดงออกอย่างสร้างสรรค์ขึ้น</p></section>';

    document.querySelector("#pair-list").innerHTML = pairCards.map((item) => {
      const repeated = item.count > 1 ? " · พบ " + item.count + " ครั้ง" : "";
      const details = item.themes.split(",").slice(0, 3).map(describeTheme);
      return '<article class="pair-card polarity-' + item.polarity + '">' +
        '<div class="pair-top"><span class="pair-number">' + escapeHtml(item.visiblePair) + '</span>' +
        '<span class="pair-weight">น้ำหนัก ' + item.weight + '%' + repeated + '</span></div>' +
        '<h4>' + escapeHtml(item.title) + '</h4>' +
        '<p><b>ความหมายหลัก:</b> ' + escapeHtml(item.summary) + '</p>' +
        '<p>' + escapeHtml(describePosition(item.positions)) + '</p>' +
        '<p>' + escapeHtml(describePolarity(item.polarity)) + '</p>' +
        details.map((detail) => '<p>' + escapeHtml(detail) + '</p>').join("") +
        '<p class="advice"><b>แนวทางปรับใช้:</b> ' + escapeHtml(item.advice) + '</p></article>';
    }).join("");

    error.textContent = "";
    result.hidden = false;
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();