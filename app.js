(() => {
  "use strict";

  const pairRows = window.PAIR_MEANINGS || [];
  const byPair = new Map(pairRows.map((row) => [row.pair, row]));
  const pairWeights = [10, 10, 10, 15, 15, 15, 25];

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

  const planetProfiles = {
    "อาทิตย์": {
      symbol: "☀️", title: "ผู้นำที่ต้องการความชัดเจน", element: "ไฟ",
      strengths: "มั่นใจ กล้ารับผิดชอบ รักษาศักดิ์ศรี และพร้อมยืนเป็นหลักเมื่อเกิดปัญหา",
      watch: "อาจยึดความคิดตัวเองหรือกดดันตัวเองให้ต้องดูเข้มแข็งตลอดเวลา",
      advice: "เปิดพื้นที่ให้คนอื่นเสนอทางเลือก และแยกความมั่นใจออกจากการต้องชนะทุกครั้ง",
      axes: [68, 58, 64, 62]
    },
    "จันทร์": {
      symbol: "🌙", title: "ผู้รับรู้ความรู้สึกและบรรยากาศ", element: "น้ำ",
      strengths: "อ่อนโยน ปรับตัวเก่ง เข้าใจความต้องการของคน และจดจำรายละเอียดทางอารมณ์ได้ดี",
      watch: "กังวลง่าย รับอารมณ์คนอื่นมาคิด และเปลี่ยนใจตามบรรยากาศรอบตัว",
      advice: "กำหนดขอบเขตทางอารมณ์และให้เวลาตัวเองตัดสินใจก่อนตอบรับเรื่องสำคัญ",
      axes: [40, 46, 30, 48]
    },
    "อังคาร": {
      symbol: "🔥", title: "นักลงมือทำและนักต่อสู้", element: "ไฟ",
      strengths: "เด็ดขาด กล้าเผชิญหน้า มีพลังแข่งขัน และรับมือสถานการณ์เร่งด่วนได้ดี",
      watch: "ใจร้อน พูดตรงเกินไป หรือเริ่มลงมือก่อนตรวจความเสี่ยงให้ครบ",
      advice: "เว้นจังหวะก่อนตอบโต้และใช้พลังกับเป้าหมายที่วัดผลได้",
      axes: [70, 62, 72, 42]
    },
    "พุธ": {
      symbol: "☿️", title: "นักสื่อสารและผู้เรียนรู้ไว", element: "ลม",
      strengths: "หัวไว เชื่อมโยงข้อมูลเก่ง ปรับภาษาให้เข้ากับคน และมองเห็นทางเลือกหลายแบบ",
      watch: "คิดหลายเรื่องพร้อมกัน เปลี่ยนแผนเร็ว หรือให้ความสำคัญกับข้อมูลจนลงมือช้า",
      advice: "สรุปทางเลือกให้เหลือน้อยและกำหนดเส้นตายในการตัดสินใจ",
      axes: [56, 38, 58, 40]
    },
    "พฤหัส": {
      symbol: "🪷", title: "ผู้ให้คำปรึกษาและรักความถูกต้อง", element: "ดิน",
      strengths: "มีเหตุผล รักการเรียนรู้ มองภาพใหญ่ และสร้างความน่าเชื่อถือจากหลักการ",
      watch: "คาดหวังมาตรฐานสูง ยึดสิ่งที่เชื่อ หรือรับบทดูแลปัญหาของคนอื่นมากเกินไป",
      advice: "ใช้หลักการอย่างยืดหยุ่นและยอมรับว่าวิธีที่ต่างกันอาจนำไปสู่ผลลัพธ์ที่ดีได้",
      axes: [46, 48, 54, 72]
    },
    "ศุกร์": {
      symbol: "🌸", title: "ผู้สร้างความกลมกลืนและความงาม", element: "น้ำ",
      strengths: "มีเสน่ห์ รสนิยมดี เจรจานุ่มนวล และให้คุณค่ากับความสัมพันธ์ที่อบอุ่น",
      watch: "เกรงใจ ใช้จ่ายตามความรู้สึก หรือหลีกเลี่ยงบทสนทนาที่ยากเพื่อรักษาบรรยากาศ",
      advice: "พูดความต้องการให้ชัดและแยกความสุขระยะสั้นออกจากเป้าหมายระยะยาว",
      axes: [64, 42, 24, 38]
    },
    "เสาร์": {
      symbol: "🪨", title: "ผู้สร้างความมั่นคงจากความอดทน", element: "ดิน",
      strengths: "รับผิดชอบ วางแผนระยะยาว อดทน และทำสิ่งยากต่อเนื่องจนสำเร็จ",
      watch: "คิดมาก แบกภาระ ไม่ขอความช่วยเหลือ หรือมองความเสี่ยงมากจนพลาดโอกาส",
      advice: "แบ่งภาระเป็นช่วง ตรวจความคืบหน้า และให้การพักเป็นส่วนหนึ่งของแผน",
      axes: [28, 70, 64, 82]
    },
    "ราหู": {
      symbol: "🌑", title: "นักสังเกตผู้มองสิ่งที่ซ่อนอยู่", element: "ลม",
      strengths: "อ่านเกมคนเก่ง สนใจเรื่องซับซ้อน กล้าคิดต่าง และปรับตัวในสถานการณ์ไม่แน่นอนได้",
      watch: "ระแวง หมกมุ่นกับสิ่งควบคุมไม่ได้ หรือเลือกทางลัดเมื่ออยากเห็นผลเร็ว",
      advice: "ใช้สัญชาตญาณคู่กับหลักฐานและกำหนดขอบเขตความเสี่ยงก่อนตัดสินใจ",
      axes: [48, 28, 60, 34]
    }
  };

  const relationshipAxisText = [
    {
      same: "จังหวะการเข้าสังคมใกล้กัน จึงเข้าใจเวลาที่อีกฝ่ายอยากพูดคุยหรือพักได้ง่าย",
      different: "คนหนึ่งช่วยเปิดโลกภายนอก อีกคนช่วยให้ได้ทบทวนลึกขึ้น",
      riskSame: "อาจเร่งบรรยากาศพร้อมกันหรือเงียบพร้อมกันจนไม่มีใครเป็นฝ่ายเริ่ม",
      riskDifferent: "อาจตีความความต้องการพื้นที่ส่วนตัวว่าเป็นการถอยห่าง",
      manage: "ตกลงเวลาพบปะและเวลาส่วนตัวล่วงหน้า"
    },
    {
      same: "มองข้อมูลในระดับใกล้กัน จึงคุยเรื่องรายละเอียดหรือแนวคิดได้ลื่น",
      different: "คนหนึ่งเห็นข้อเท็จจริง อีกคนเห็นความเป็นไปได้ ทำให้แผนครบทั้งปัจจุบันและอนาคต",
      riskSame: "มีโอกาสติดอยู่กับรายละเอียดหรือไอเดียด้านเดียวกัน",
      riskDifferent: "อาจขัดกันระหว่างคำว่า “ทำได้จริงตอนนี้” กับ “น่าจะเป็นไปได้”",
      manage: "แยกช่วงระดมไอเดียออกจากช่วงตรวจข้อเท็จจริง"
    },
    {
      same: "ใช้เกณฑ์ตัดสินใจคล้ายกัน จึงเข้าใจเหตุผลหรือความรู้สึกของกันได้เร็ว",
      different: "เหตุผลและความเข้าใจคนช่วยตรวจสมดุลซึ่งกันและกัน",
      riskSame: "อาจแข็งเกินไปหรือเกรงใจกันเกินไปโดยไม่มีมุมทักท้วง",
      riskDifferent: "คำพูดตรงอาจถูกมองว่าไม่ใส่ใจ ขณะที่การพูดอ้อมอาจถูกมองว่าไม่ชัด",
      manage: "บอกก่อนว่าต้องการคำตอบเชิงเหตุผลหรือการรับฟังความรู้สึก"
    },
    {
      same: "จังหวะวางแผนและลงมือใกล้กัน จึงกำหนดเวลาได้ง่าย",
      different: "คนหนึ่งช่วยคุมแผน อีกคนช่วยให้ปรับตัวเมื่อสถานการณ์เปลี่ยน",
      riskSame: "อาจยึดแผนพร้อมกันหรือผัดเรื่องสำคัญพร้อมกัน",
      riskDifferent: "คนวางแผนอาจมองอีกฝ่ายว่าไม่แน่นอน ส่วนคนยืดหยุ่นอาจรู้สึกถูกควบคุม",
      manage: "กำหนดเฉพาะเส้นตายและผลลัพธ์ ส่วนวิธีทำให้มีพื้นที่ยืดหยุ่น"
    }
  ];

  const form = document.querySelector("#profile-form");
  const phoneInput = document.querySelector("#phone");
  const birthDateInput = document.querySelector("#birth-date");
  const birthTimeInput = document.querySelector("#birth-time");
  const birthPlaceInput = document.querySelector("#birth-place");
  const transitDateInput = document.querySelector("#transit-date");
  const transitTimeInput = document.querySelector("#transit-time");
  const errorBox = document.querySelector("#profile-error");
  const resultSection = document.querySelector("#profile-result");
  const compareForm = document.querySelector("#compare-form");
  const compareResult = document.querySelector("#compare-result");

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;"
  })[char]);

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const positiveMod = (value, divisor) => ((value % divisor) + divisor) % divisor;
  const normalizePair = (pair) => pair[0] <= pair[1] ? pair : pair[1] + pair[0];
  const localDate = (dateText) => {
    const [year, month, day] = dateText.split("-").map(Number);
    return new Date(year, month - 1, day, 12, 0, 0);
  };
  const formatThaiDate = (date) => new Intl.DateTimeFormat("th-TH", {
    dateStyle: "long"
  }).format(date);
  const thaiNumber = (value) => new Intl.NumberFormat("th-TH").format(value);

  const setDefaultTransit = () => {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    transitDateInput.value = local.toISOString().slice(0, 10);
    transitTimeInput.value = local.toISOString().slice(11, 16);
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
        existing.positions.push(index + 1);
      } else {
        grouped.set(meaning.pair, {
          ...meaning,
          visiblePair,
          weight,
          count: 1,
          positions: [index + 1]
        });
      }
      meaning.themes.split(",").forEach((theme) => {
        themes.set(theme, (themes.get(theme) || 0) + weight);
      });
    }

    const raw = totalWeight ? weightedScore / totalWeight : 0;
    const score = clamp(Math.round((raw + 100) / 2), 0, 100);
    const items = [...grouped.values()].sort((a, b) => b.weight - a.weight);
    const topThemes = [...themes.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([theme]) => theme);
    return { phone, score, raw, items, topThemes, profile: buildPhonePersonality(items) };
  };

  const calculatePhoneAxis = (items, axis) => {
    const sideScore = (side) => items.map((item) => {
      const matched = item.themes.split(",").some((theme) => side.themes.includes(theme));
      return matched ? item.weight * (0.75 + (item.score + 100) / 200) : 0;
    }).reduce((sum, value) => sum + value, 0);

    const leftValue = sideScore(axis.left);
    const rightValue = sideScore(axis.right);
    const total = leftValue + rightValue || 1;
    const leftPercent = Math.round(leftValue / total * 100);
    const dominant = leftPercent >= 50 ? axis.left : axis.right;
    return {
      ...axis,
      leftPercent,
      dominant,
      dominantPercent: leftPercent >= 50 ? leftPercent : 100 - leftPercent
    };
  };

  const buildPhonePersonality = (items) => {
    const axes = personalityAxes.map((axis) => calculatePhoneAxis(items, axis));
    const code = axes.map((axis) => axis.dominant.code).join("");
    return { code, name: typeNames[code], axes };
  };

  const weekdayPlanet = (date, timeText, useRahu = true) => {
    const weekday = date.getDay();
    const hour = Number((timeText || "12:00").split(":")[0]);
    if (useRahu && weekday === 3 && hour >= 18) return "ราหู";
    return ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์"][weekday];
  };

  const yearAnimal = (year) => {
    const animals = ["ชวด", "ฉลู", "ขาล", "เถาะ", "มะโรง", "มะเส็ง", "มะเมีย", "มะแม", "วอก", "ระกา", "จอ", "กุน"];
    return animals[positiveMod(year - 2020, 12)];
  };

  const dateRoot = (dateText) => {
    let sum = dateText.replace(/\D/g, "").split("").reduce((total, digit) => total + Number(digit), 0);
    while (sum > 9) sum = String(sum).split("").reduce((total, digit) => total + Number(digit), 0);
    return sum || 1;
  };

  const buildAstroProfile = (dateText, timeText, place) => {
    const date = localDate(dateText);
    const planetKey = weekdayPlanet(date, timeText, true);
    const planet = planetProfiles[planetKey];
    const root = dateRoot(dateText);
    const axes = personalityAxes.map((axis, index) => {
      const base = planet.axes[index];
      const adjustment = ((root * (index + 3)) % 9) - 4;
      const leftPercent = clamp(base + adjustment, 18, 82);
      return {
        ...axis,
        leftPercent,
        dominant: leftPercent >= 50 ? axis.left : axis.right,
        dominantPercent: leftPercent >= 50 ? leftPercent : 100 - leftPercent
      };
    });
    const code = axes.map((axis) => axis.dominant.code).join("");
    return {
      date, timeText, place, planetKey, planet, root,
      animal: yearAnimal(date.getFullYear()),
      code, name: typeNames[code], axes
    };
  };

  const matchProfiles = (phoneProfile, astroProfile) => {
    const similarities = phoneProfile.axes.map((axis, index) => {
      const astroAxis = astroProfile.axes[index];
      return 100 - Math.abs(axis.leftPercent - astroAxis.leftPercent);
    });
    const score = Math.round(similarities.reduce((sum, value) => sum + value, 0) / similarities.length);
    const label = score >= 85 ? "สอดคล้องสูงมาก" : score >= 72 ? "สอดคล้องค่อนข้างดี" : score >= 58 ? "เสริมกันแบบมีความต่าง" : "มีแรงดึงคนละทิศทาง";
    const advice = score >= 72
      ? "เบอร์มีแนวโน้มช่วยขยายลักษณะที่มีอยู่เดิม จึงควรใช้จุดแข็งอย่างมีสติและไม่เร่งตัวเองเกินไป"
      : "เบอร์อาจผลักให้แสดงพฤติกรรมต่างจากพื้นนิสัย ข้อดีคือช่วยพัฒนามุมใหม่ แต่ควรสังเกตความเหนื่อยหรือความฝืนของตน";
    return { score, label, advice, similarities };
  };

  const planetaryHour = (date, timeText) => {
    const order = ["เสาร์", "พฤหัส", "อังคาร", "อาทิตย์", "ศุกร์", "พุธ", "จันทร์"];
    const dayLord = weekdayPlanet(date, "12:00", false);
    const start = order.indexOf(dayLord);
    const [hour, minute] = (timeText || "12:00").split(":").map(Number);
    const elapsed = positiveMod(Math.floor(hour + minute / 60 - 6), 24);
    return order[positiveMod(start + elapsed, order.length)];
  };

  const buildTransit = (astro, transitDateText, transitTimeText) => {
    const date = localDate(transitDateText);
    const dayPlanet = weekdayPlanet(date, transitTimeText, true);
    const hourPlanet = planetaryHour(date, transitTimeText);
    const friendPairs = new Set(["อาทิตย์|พฤหัส", "จันทร์|พุธ", "อังคาร|ศุกร์", "ราหู|เสาร์"]);
    const isFriend = (a, b) => friendPairs.has(`${a}|${b}`) || friendPairs.has(`${b}|${a}`);
    let score = 58;
    if (astro.planetKey === dayPlanet) score += 12;
    if (isFriend(astro.planetKey, dayPlanet)) score += 18;
    if (astro.planetKey === hourPlanet) score += 8;
    if (isFriend(astro.planetKey, hourPlanet)) score += 8;
    score = clamp(score, 42, 92);
    const label = score >= 80 ? "จังหวะหนุนดี" : score >= 68 ? "เดินหน้าได้" : score >= 55 ? "จังหวะกลาง ๆ" : "ควรชะลอและตรวจซ้ำ";
    const dayInfo = planetProfiles[dayPlanet];
    const hourInfo = planetProfiles[hourPlanet];
    return {
      date, dayPlanet, hourPlanet, dayInfo, hourInfo, score, label,
      advice: score >= 68
        ? "เหมาะกับการเดินหน้าเรื่องสำคัญโดยกำหนดเป้าหมายให้ชัด และใช้พลังของวันร่วมกับความรอบคอบ"
        : "เหมาะกับการทบทวน เตรียมข้อมูล และหลีกเลี่ยงการตัดสินใจที่ย้อนกลับยากในช่วงอารมณ์เร่ง"
    };
  };

  const axisCard = (axis) => {
    const rightPercent = 100 - axis.leftPercent;
    return `<article class="axis-card">
      <header><span>${axis.left.code} ↔ ${axis.right.code}</span><strong>${axis.dominant.code} ${axis.dominantPercent}%</strong></header>
      <h4>${escapeHtml(axis.title)}: ${escapeHtml(axis.dominant.name)}</h4>
      <div class="axis-bar"><i style="width:${axis.leftPercent}%"></i></div>
      <div class="axis-scale"><span>${axis.left.code} ${axis.leftPercent}%</span><span>${axis.right.code} ${rightPercent}%</span></div>
    </article>`;
  };

  const renderPhoneSummary = (analysis) => {
    const verdict = analysis.score >= 75 ? "พลังโดยรวมโดดเด่น" : analysis.score >= 60 ? "ภาพรวมค่อนข้างดี" : analysis.score >= 45 ? "พลังผสม ต้องบริหารให้ดี" : "ควรเลือกใช้อย่างมีสติ";
    const themes = analysis.topThemes.map((theme) => `<span>#${escapeHtml(theme)}</span>`).join("");
    document.querySelector("#phone-summary").innerHTML = `
      <section class="summary-card">
        <div class="score-circle" style="--score:${analysis.score}"><strong>${analysis.score}</strong><small>/100</small></div>
        <div><span class="result-kicker">พลังของเบอร์</span><h2>${verdict}</h2>
        <p>วิเคราะห์จากคู่เลข 8 หลักท้าย โดยให้น้ำหนักคู่สุดท้ายมากที่สุด</p><div class="theme-row">${themes}</div></div>
      </section>`;
  };

  const renderPhonePersonality = (profile) => {
    document.querySelector("#phone-personality").innerHTML = `
      <section class="content-card personality-card">
        <div class="type-banner"><span>16 Personality จากเบอร์</span><h2>${profile.code} · ${escapeHtml(profile.name)}</h2>
        <p>${escapeHtml(typeDescriptions[profile.code])}</p></div>
        <div class="axis-grid">${profile.axes.map(axisCard).join("")}</div>
        <p class="method-note">เป็นการเทียบกรอบบุคลิก 4 มิติจากธีมของคู่เลข ไม่ใช่ผลทดสอบ MBTI ทางจิตวิทยา</p>
      </section>`;
  };

  const renderAstro = (astro) => {
    const placeText = astro.place ? ` · ${escapeHtml(astro.place)}` : "";
    document.querySelector("#astro-result").innerHTML = `
      <section class="content-card astro-card">
        <div class="card-heading"><span>${astro.planet.symbol}</span><div><small>โหราศาสตร์ไทยพื้นฐาน</small>
        <h2>คนเกิดวัน${astro.planetKey} · ${escapeHtml(astro.planet.title)}</h2>
        <p>${formatThaiDate(astro.date)}${placeText}</p></div></div>
        <div class="astro-facts">
          <div><span>ดาวประจำวัน</span><b>${astro.planetKey}</b></div>
          <div><span>ธาตุพลัง</span><b>${astro.planet.element}</b></div>
          <div><span>เลขวันเกิด</span><b>${astro.root}</b></div>
          <div><span>ปีนักษัตร</span><b>${astro.animal}</b></div>
        </div>
        <div class="good-watch-grid">
          <div class="good-box"><b>ลักษณะเด่น</b><p>${escapeHtml(astro.planet.strengths)}</p></div>
          <div class="watch-box"><b>สิ่งที่ต้องระวัง</b><p>${escapeHtml(astro.planet.watch)}</p></div>
        </div>
        <p class="astro-advice"><b>แนวทางปรับใช้:</b> ${escapeHtml(astro.planet.advice)}</p>
        <div class="subtype"><span>บุคลิก 16 แบบจากพื้นดวง</span><strong>${astro.code} · ${escapeHtml(astro.name)}</strong></div>
        <p class="method-note">คำนวณจากดาวประจำวันเกิด วันพุธกลางคืน เลขผลรวมวันเกิด และปีนักษัตร ยังไม่ใช่ผูกดวงลัคนาหรือดาวเต็มระบบ</p>
      </section>`;
    document.querySelector("#astro-result").hidden = false;
  };

  const renderMatch = (match, phoneProfile, astroProfile) => {
    const rows = phoneProfile.axes.map((axis, index) => {
      const astroAxis = astroProfile.axes[index];
      const same = axis.dominant.code === astroAxis.dominant.code;
      return `<div class="match-row"><span>${escapeHtml(axis.title)}</span><b class="${same ? "same" : "different"}">${axis.dominant.code} ${same ? "=" : "↔"} ${astroAxis.dominant.code}</b></div>`;
    }).join("");
    document.querySelector("#match-result").innerHTML = `
      <section class="content-card match-card">
        <div class="match-score"><span>เบอร์ Match กับพื้นนิสัย</span><strong>${match.score}%</strong><b>${match.label}</b></div>
        <div class="match-grid">${rows}</div>
        <p>${escapeHtml(match.advice)}</p>
      </section>`;
    document.querySelector("#match-result").hidden = false;
  };

  const renderTransit = (transit, timeText) => {
    document.querySelector("#transit-result").innerHTML = `
      <section class="content-card transit-card">
        <div class="card-heading"><span>⏱️</span><div><small>ดวงวันและเวลาจร</small>
        <h2>${formatThaiDate(transit.date)} เวลา ${escapeHtml(timeText)}</h2></div></div>
        <div class="transit-score"><strong>${transit.score}</strong><span>/100 · ${transit.label}</span></div>
        <div class="transit-planets">
          <div><span>พลังประจำวัน</span><b>${transit.dayInfo.symbol} ${transit.dayPlanet}</b><p>${escapeHtml(transit.dayInfo.strengths)}</p></div>
          <div><span>พลังประจำช่วงเวลา</span><b>${transit.hourInfo.symbol} ${transit.hourPlanet}</b><p>${escapeHtml(transit.hourInfo.strengths)}</p></div>
        </div>
        <p class="transit-advice"><b>คำแนะนำของจังหวะนี้:</b> ${escapeHtml(transit.advice)}</p>
        <p class="method-note">เวลาจรใช้ยามดาวโดยประมาณจากเวลา 06:00 น. จึงควรใช้เพื่อวางแผนทั่วไป ไม่ใช่เลือกฤกษ์สำคัญแทนนักโหราศาสตร์</p>
      </section>`;
    document.querySelector("#transit-result").hidden = false;
  };

  const renderPairs = (items) => {
    document.querySelector("#pair-list").innerHTML = items.map((item) => `
      <article class="pair-card polarity-${item.polarity}">
        <div class="pair-top"><span>${escapeHtml(item.visiblePair)}</span><small>น้ำหนัก ${item.weight}%${item.count > 1 ? ` · พบ ${item.count} ครั้ง` : ""}</small></div>
        <h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary)}</p>
        <p class="pair-advice"><b>คำแนะนำ:</b> ${escapeHtml(item.advice)}</p>
      </article>`).join("");
  };

  const populateTypes = () => {
    const options = Object.entries(typeNames).map(([code, name]) => `<option value="${code}">${code} — ${name}</option>`).join("");
    document.querySelector("#type-a").innerHTML = options;
    document.querySelector("#type-b").innerHTML = options;
    document.querySelector("#type-a").value = "INTJ";
    document.querySelector("#type-b").value = "INTP";
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
    score = clamp(score, 55, 92);
    const label = score >= 82 ? "เข้าใจกันได้ค่อนข้างง่าย" : score >= 74 ? "ไปด้วยกันได้เมื่อสื่อสารชัด" : "ต่างกันแต่ช่วยเติมมุมที่ขาด";
    return { score, label, advantages, risks, management };
  };

  const renderComparison = (typeA, typeB) => {
    const comparison = compareTypes(typeA, typeB);
    const list = (items) => items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    compareResult.innerHTML = `
      <section class="relationship-hero">
        <div><span>A</span><b>${typeA}</b><small>${escapeHtml(typeNames[typeA])}</small></div>
        <div class="relationship-score"><strong>${comparison.score}%</strong><span>${comparison.label}</span></div>
        <div><span>B</span><b>${typeB}</b><small>${escapeHtml(typeNames[typeB])}</small></div>
      </section>
      <section class="relationship-intro"><p><b>${typeA}</b> ${escapeHtml(typeDescriptions[typeA])}</p>
      <p><b>${typeB}</b> ${escapeHtml(typeDescriptions[typeB])}</p></section>
      <div class="relationship-grid">
        <section class="relationship-box good"><h3>ข้อดีเมื่อมาเจอกัน</h3><ul>${list(comparison.advantages)}</ul></section>
        <section class="relationship-box risk"><h3>ข้อเสียและจุดเสี่ยง</h3><ul>${list(comparison.risks)}</ul></section>
        <section class="relationship-box manage"><h3>วิธีบริหารความสัมพันธ์</h3><ul>${list(comparison.management)}</ul></section>
        <section class="relationship-box caution"><h3>สิ่งที่ต้องระวังที่สุด</h3>
          <p>อย่าใช้รหัสบุคลิกเป็นข้ออ้างแทนการรับฟังกัน เมื่อเกิดความขัดแย้งให้พูดถึงเหตุการณ์ ความต้องการ และข้อตกลงที่ทำได้จริง แทนการตัดสินว่า “อีกฝ่ายเป็นคนแบบนี้เสมอ”</p>
        </section>
      </div>
      <p class="method-note">คะแนนนี้เป็นแนวทางสนทนาเบื้องต้นจากความเหมือนและความต่างของ 4 มิติ ไม่ใช่คะแนนตัดสินความสัมพันธ์จริง</p>`;
    compareResult.hidden = false;
    compareResult.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const switchTab = (target) => {
    const selfActive = target === "self";
    document.querySelector("#tab-self").classList.toggle("active", selfActive);
    document.querySelector("#tab-compare").classList.toggle("active", !selfActive);
    document.querySelector("#tab-self").setAttribute("aria-selected", String(selfActive));
    document.querySelector("#tab-compare").setAttribute("aria-selected", String(!selfActive));
    document.querySelector("#panel-self").hidden = !selfActive;
    document.querySelector("#panel-compare").hidden = selfActive;
    document.querySelector("#panel-self").classList.toggle("active", selfActive);
    document.querySelector("#panel-compare").classList.toggle("active", !selfActive);
  };

  phoneInput.addEventListener("input", () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
    errorBox.textContent = "";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const phone = phoneInput.value.replace(/\D/g, "");
    if (!/^0\d{9}$/.test(phone)) {
      errorBox.textContent = "กรุณากรอกเบอร์มือถือไทย 10 หลัก โดยขึ้นต้นด้วย 0";
      phoneInput.focus();
      return;
    }

    const phoneAnalysis = analyzePhone(phone);
    renderPhoneSummary(phoneAnalysis);
    renderPhonePersonality(phoneAnalysis.profile);
    renderPairs(phoneAnalysis.items);

    document.querySelector("#astro-result").hidden = true;
    document.querySelector("#match-result").hidden = true;
    document.querySelector("#transit-result").hidden = true;

    if (birthDateInput.value) {
      const astro = buildAstroProfile(birthDateInput.value, birthTimeInput.value, birthPlaceInput.value.trim());
      const match = matchProfiles(phoneAnalysis.profile, astro);
      const transit = buildTransit(astro, transitDateInput.value, transitTimeInput.value);
      renderAstro(astro);
      renderMatch(match, phoneAnalysis.profile, astro);
      renderTransit(transit, transitTimeInput.value);
    }

    errorBox.textContent = "";
    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  compareForm.addEventListener("submit", (event) => {
    event.preventDefault();
    renderComparison(document.querySelector("#type-a").value, document.querySelector("#type-b").value);
  });

  document.querySelector("#tab-self").addEventListener("click", () => switchTab("self"));
  document.querySelector("#tab-compare").addEventListener("click", () => switchTab("compare"));
  document.querySelector("#back-to-form").addEventListener("click", () => form.scrollIntoView({ behavior: "smooth", block: "start" }));

  document.querySelector("#reset-profile").addEventListener("click", () => {
    form.reset();
    setDefaultTransit();
    errorBox.textContent = "";
    resultSection.hidden = true;
    phoneInput.focus();
  });

  document.querySelector("#reset-compare").addEventListener("click", () => {
    document.querySelector("#type-a").value = "INTJ";
    document.querySelector("#type-b").value = "INTP";
    compareResult.hidden = true;
  });

  populateTypes();
  setDefaultTransit();
})();
