(() => {
  "use strict";

  const A = window.Astronomy;
  if (!A) throw new Error("Astronomy Engine is required before astro-thai.js");

  const mod = (value, base = 360) => ((value % base) + base) % base;
  const signedAngle = (value) => mod(value + 180) - 180;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const signs = [
    { name: "เมษ", element: "ไฟ", mode: "จรราศี" },
    { name: "พฤษภ", element: "ดิน", mode: "สถิรราศี" },
    { name: "เมถุน", element: "ลม", mode: "อุภยราศี" },
    { name: "กรกฎ", element: "น้ำ", mode: "จรราศี" },
    { name: "สิงห์", element: "ไฟ", mode: "สถิรราศี" },
    { name: "กันย์", element: "ดิน", mode: "อุภยราศี" },
    { name: "ตุล", element: "ลม", mode: "จรราศี" },
    { name: "พิจิก", element: "น้ำ", mode: "สถิรราศี" },
    { name: "ธนู", element: "ไฟ", mode: "อุภยราศี" },
    { name: "มังกร", element: "ดิน", mode: "จรราศี" },
    { name: "กุมภ์", element: "ลม", mode: "สถิรราศี" },
    { name: "มีน", element: "น้ำ", mode: "อุภยราศี" }
  ];

  const planets = [
    { key: "Sun", thai: "อาทิตย์", number: 1, symbol: "☉", nature: 1 },
    { key: "Moon", thai: "จันทร์", number: 2, symbol: "☽", nature: 1 },
    { key: "Mars", thai: "อังคาร", number: 3, symbol: "♂", nature: -1 },
    { key: "Mercury", thai: "พุธ", number: 4, symbol: "☿", nature: 0.5 },
    { key: "Jupiter", thai: "พฤหัส", number: 5, symbol: "♃", nature: 1.5 },
    { key: "Venus", thai: "ศุกร์", number: 6, symbol: "♀", nature: 1.2 },
    { key: "Saturn", thai: "เสาร์", number: 7, symbol: "♄", nature: -1.4 },
    { key: "Rahu", thai: "ราหู", number: 8, symbol: "☊", nature: -1 },
    { key: "Ketu", thai: "เกตุ", number: 9, symbol: "☋", nature: -0.6 }
  ];

  const planetByKey = Object.fromEntries(planets.map((planet) => [planet.key, planet]));
  const houseNames = [
    ["ตนุ", "ตัวตน สุขภาพ การเริ่มต้น"],
    ["กดุมภะ", "การเงิน ทรัพย์สิน คำพูด"],
    ["สหัชชะ", "การสื่อสาร ความกล้า พี่น้อง"],
    ["พันธุ", "บ้าน ครอบครัว ความมั่นคง"],
    ["ปุตตะ", "ความคิดสร้างสรรค์ บุตร การเสี่ยง"],
    ["อริ", "งานประจำ สุขภาพ หนี้ คู่แข่ง"],
    ["ปัตนิ", "คู่ครอง หุ้นส่วน ความสัมพันธ์"],
    ["มรณะ", "การเปลี่ยนแปลง วิกฤต ทรัพย์ร่วม"],
    ["ศุภะ", "โชค การศึกษา การเดินทางไกล"],
    ["กัมมะ", "งาน อาชีพ ชื่อเสียง หน้าที่"],
    ["ลาภะ", "รายได้ ผลสำเร็จ เครือข่าย"],
    ["วินาศ", "รายจ่าย เบื้องหลัง ต่างประเทศ"]
  ];

  const nakshatras = [
    "อัศวินี", "ภรณี", "กฤติกา", "โรหิณี", "มฤคศิระ", "อารทรา", "ปุนรวสุ",
    "ปุษยะ", "อาศเลษะ", "มฆา", "บุรพผลคุณี", "อุตตรผลคุณี", "หัสตะ", "จิตรา",
    "สวาติ", "วิสาขา", "อนุราธา", "เชษฐา", "มูละ", "บุรพาษาฒ", "อุตตราษาฒ",
    "ศรวณะ", "ธนิษฐา", "ศตภิษัช", "บุรพภัทรบท", "อุตตรภัทรบท", "เรวดี"
  ];

  const rulers = {
    Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5],
    Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10], Rahu: [10], Ketu: []
  };
  const exalted = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6, Rahu: 1, Ketu: 7 };
  const fallen = Object.fromEntries(Object.entries(exalted).map(([key, sign]) => [key, mod(sign + 6, 12)]));

  const aspectOffsets = {
    Sun: [6], Moon: [6], Mercury: [6], Venus: [6],
    Mars: [3, 6, 7], Jupiter: [4, 6, 8], Saturn: [2, 6, 9],
    Rahu: [4, 6, 8], Ketu: [4, 6, 8]
  };

  const weekdayPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const thaksaOrder = {
    Sun: [1, 2, 3, 4, 7, 5, 8, 6],
    Moon: [2, 3, 4, 7, 5, 8, 6, 1],
    Mars: [3, 4, 7, 5, 8, 6, 1, 2],
    Mercury: [4, 7, 5, 8, 6, 1, 2, 3],
    Jupiter: [5, 8, 6, 1, 2, 3, 4, 7],
    Venus: [6, 1, 2, 3, 4, 7, 5, 8],
    Saturn: [7, 5, 8, 6, 1, 2, 3, 4],
    Rahu: [8, 6, 1, 2, 3, 4, 7, 5]
  };
  const thaksaRoles = ["บริวาร", "อายุ", "เดช", "ศรี", "มูละ", "อุตสาหะ", "มนตรี", "กาลกิณี"];

  const knownPlaces = {
    "กรุงเทพ": [13.7563, 100.5018], "กรุงเทพมหานคร": [13.7563, 100.5018],
    "นนทบุรี": [13.8621, 100.5144], "ปทุมธานี": [14.0208, 100.5250],
    "สมุทรปราการ": [13.5991, 100.5998], "สมุทรสาคร": [13.5475, 100.2744],
    "สมุทรสงคราม": [13.4098, 100.0023], "นครปฐม": [13.8199, 100.0622],
    "อยุธยา": [14.3532, 100.5689], "พระนครศรีอยุธยา": [14.3532, 100.5689],
    "ชลบุรี": [13.3611, 100.9847], "ระยอง": [12.6814, 101.2816],
    "จันทบุรี": [12.6113, 102.1038], "ตราด": [12.2428, 102.5175],
    "ฉะเชิงเทรา": [13.6904, 101.0779], "ปราจีนบุรี": [14.0509, 101.3723],
    "นครนายก": [14.2069, 101.2131], "สระแก้ว": [13.8240, 102.0646],
    "เชียงใหม่": [18.7883, 98.9853], "เชียงราย": [19.9105, 99.8406],
    "ลำพูน": [18.5745, 99.0087], "ลำปาง": [18.2888, 99.4909],
    "แม่ฮ่องสอน": [19.3020, 97.9654], "น่าน": [18.7756, 100.7730],
    "พะเยา": [19.1665, 99.9019], "แพร่": [18.1446, 100.1403],
    "อุตรดิตถ์": [17.6201, 100.0993], "พิษณุโลก": [16.8211, 100.2659],
    "สุโขทัย": [17.0056, 99.8264], "ตาก": [16.8839, 99.1258],
    "กำแพงเพชร": [16.4828, 99.5227], "นครสวรรค์": [15.7047, 100.1372],
    "เพชรบูรณ์": [16.4189, 101.1606], "อุทัยธานี": [15.3835, 100.0246],
    "ขอนแก่น": [16.4322, 102.8236], "นครราชสีมา": [14.9799, 102.0978],
    "โคราช": [14.9799, 102.0978], "อุดรธานี": [17.4138, 102.7870],
    "อุบลราชธานี": [15.2448, 104.8473], "หนองคาย": [17.8783, 102.7413],
    "เลย": [17.4860, 101.7223], "สกลนคร": [17.1664, 104.1486],
    "นครพนม": [17.3920, 104.7696], "มุกดาหาร": [16.5424, 104.7209],
    "กาฬสินธุ์": [16.4314, 103.5059], "มหาสารคาม": [16.1851, 103.3007],
    "ร้อยเอ็ด": [16.0538, 103.6520], "บุรีรัมย์": [14.9951, 103.1116],
    "สุรินทร์": [14.8829, 103.4937], "ศรีสะเกษ": [15.1186, 104.3220],
    "ยโสธร": [15.7926, 104.1453], "ชัยภูมิ": [15.8068, 102.0315],
    "กรุงเทพฯ": [13.7563, 100.5018], "หัวหิน": [12.5684, 99.9577],
    "ประจวบคีรีขันธ์": [11.8124, 99.7973], "เพชรบุรี": [13.1119, 99.9391],
    "ราชบุรี": [13.5283, 99.8134], "กาญจนบุรี": [14.0228, 99.5328],
    "สุพรรณบุรี": [14.4745, 100.1177], "ลพบุรี": [14.7995, 100.6534],
    "สระบุรี": [14.5289, 100.9101], "ชัยนาท": [15.1852, 100.1251],
    "สิงห์บุรี": [14.8936, 100.3967], "อ่างทอง": [14.5896, 100.4551],
    "นครศรีธรรมราช": [8.4304, 99.9631], "สุราษฎร์ธานี": [9.1382, 99.3215],
    "ภูเก็ต": [7.8804, 98.3923], "สงขลา": [7.1898, 100.5954],
    "หาดใหญ่": [7.0084, 100.4747], "กระบี่": [8.0863, 98.9063],
    "พังงา": [8.4501, 98.5255], "ชุมพร": [10.4930, 99.1800],
    "ระนอง": [9.9529, 98.6085], "ตรัง": [7.5594, 99.6114],
    "พัทลุง": [7.6167, 100.0740], "สตูล": [6.6238, 100.0674],
    "ปัตตานี": [6.8695, 101.2505], "ยะลา": [6.5411, 101.2804],
    "นราธิวาส": [6.4255, 101.8253]
  };

  const makeUtcDate = (dateText, timeText = "12:00") => {
    const [year, month, day] = dateText.split("-").map(Number);
    const [hour, minute] = (timeText || "12:00").split(":").map(Number);
    const date = new Date(0);
    date.setUTCFullYear(year, month - 1, day);
    date.setUTCHours(hour - 7, minute || 0, 0, 0);
    return date;
  };

  const resolveLocation = (place, latitude, longitude) => {
    const lat = Number(latitude);
    const lon = Number(longitude);
    if (Number.isFinite(lat) && Number.isFinite(lon) && latitude !== "" && longitude !== "") {
      return { latitude: clamp(lat, -90, 90), longitude: mod(lon + 180) - 180, label: place || "พิกัดที่ระบุ", quality: "พิกัดที่ระบุ" };
    }
    const normalized = String(place || "").trim().replace(/^จังหวัด/, "");
    const exact = knownPlaces[normalized];
    if (exact) return { latitude: exact[0], longitude: exact[1], label: normalized, quality: "พิกัดกลางจังหวัด/เมือง" };
    const partial = Object.entries(knownPlaces).find(([name]) => normalized.includes(name) || name.includes(normalized));
    if (normalized && partial) return { latitude: partial[1][0], longitude: partial[1][1], label: partial[0], quality: "พิกัดกลางจังหวัด/เมือง" };
    return { latitude: 13.7563, longitude: 100.5018, label: normalized || "กรุงเทพมหานคร (ค่าเริ่มต้น)", quality: "พิกัดประมาณ" };
  };

  const fractionalYear = (date) => {
    const year = date.getUTCFullYear();
    const start = Date.UTC(year, 0, 1);
    const end = Date.UTC(year + 1, 0, 1);
    return year + (date.getTime() - start) / (end - start);
  };

  const ayanamsha = (date) => 23.85675 + 0.01396875 * (fractionalYear(date) - 2000);

  const meanNodeTropical = (date) => {
    const jd = date.getTime() / 86400000 + 2440587.5;
    const t = (jd - 2451545) / 36525;
    return mod(125.04452 - 1934.136261 * t + 0.0020708 * t * t + t * t * t / 450000);
  };

  const tropicalLongitude = (body, date) => {
    const vector = A.GeoVector(A.Body[body], date, true);
    return A.Ecliptic(vector).elon;
  };

  const longitudeAt = (key, date) => {
    if (key === "Rahu") return mod(meanNodeTropical(date) - ayanamsha(date));
    if (key === "Ketu") return mod(meanNodeTropical(date) + 180 - ayanamsha(date));
    return mod(tropicalLongitude(key, date) - ayanamsha(date));
  };

  const ascendantAt = (date, location) => {
    const theta = mod(A.SiderealTime(date) * 15 + location.longitude) * Math.PI / 180;
    const phi = location.latitude * Math.PI / 180;
    const centuries = (date.getTime() / 86400000 + 2440587.5 - 2451545) / 36525;
    const epsilon = (23.439291 - 0.0130042 * centuries) * Math.PI / 180;
    const westernHorizon = mod(Math.atan2(-Math.cos(theta), Math.sin(theta) * Math.cos(epsilon) + Math.tan(phi) * Math.sin(epsilon)) * 180 / Math.PI);
    const tropical = mod(westernHorizon + 180);
    return mod(tropical - ayanamsha(date));
  };

  const navamsaSign = (longitude) => Math.floor(mod(longitude) / (10 / 3)) % 12;
  const signIndex = (longitude) => Math.floor(mod(longitude) / 30);
  const houseFrom = (longitude, ascLongitude) => mod(signIndex(longitude) - signIndex(ascLongitude), 12) + 1;

  const dignityOf = (key, sign) => {
    if (exalted[key] === sign) return "อุจจ์";
    if (fallen[key] === sign) return "นิจ";
    if ((rulers[key] || []).includes(sign)) return "เกษตร";
    return "ปกติ";
  };

  const positionFor = (planet, date, asc) => {
    const longitude = longitudeAt(planet.key, date);
    const tomorrow = new Date(date.getTime() + 86400000);
    const speed = signedAngle(longitudeAt(planet.key, tomorrow) - longitude);
    const sign = signIndex(longitude);
    return {
      ...planet,
      longitude,
      sign,
      signName: signs[sign].name,
      degree: mod(longitude, 30),
      house: houseFrom(longitude, asc),
      navamsa: navamsaSign(longitude),
      navamsaName: signs[navamsaSign(longitude)].name,
      dignity: dignityOf(planet.key, sign),
      retrograde: !["Sun", "Moon"].includes(planet.key) && speed < -0.01,
      speed
    };
  };

  const formatDegree = (degree) => {
    const whole = Math.floor(degree);
    const minutes = Math.floor((degree - whole) * 60);
    return `${whole}° ${String(minutes).padStart(2, "0")}′`;
  };

  const thaiAspects = (positions) => {
    const rows = [];
    positions.forEach((source) => {
      (aspectOffsets[source.key] || []).forEach((offset) => {
        const targetSign = mod(source.sign + offset, 12);
        positions.filter((target) => target.key !== source.key && target.sign === targetSign).forEach((target) => {
          rows.push({
            source: source.key,
            target: target.key,
            sourceName: source.thai,
            targetName: target.thai,
            offset: offset + 1,
            text: `${source.thai}ส่งกระแสถึง${target.thai} (${offset + 1} ราศี)`
          });
        });
      });
    });
    return rows;
  };

  const exactAspects = (moving, natal) => {
    const definitions = [
      { angle: 0, name: "กุม", weight: 1 }, { angle: 60, name: "โยค 60°", weight: 0.6 },
      { angle: 90, name: "ฉาก", weight: -0.9 }, { angle: 120, name: "ตรีโกณ", weight: 0.9 },
      { angle: 180, name: "เล็ง", weight: -0.7 }
    ];
    const events = [];
    moving.forEach((transit) => natal.positions.forEach((birth) => {
      const separation = Math.abs(signedAngle(transit.longitude - birth.longitude));
      definitions.forEach((definition) => {
        const orb = Math.abs(separation - definition.angle);
        if (orb <= (definition.angle === 0 ? 5 : 4)) {
          events.push({
            transit, birth, name: definition.name, angle: definition.angle, orb,
            impact: definition.weight * (transit.nature || 0) * (1 - orb / 8)
          });
        }
      });
    }));
    return events.sort((a, b) => a.orb - b.orb);
  };

  const personalityFromChart = (chart) => {
    const elementTotals = { ไฟ: 0, ดิน: 0, ลม: 0, น้ำ: 0 };
    const modeTotals = { จรราศี: 0, สถิรราศี: 0, อุภยราศี: 0 };
    chart.positions.forEach((position) => {
      const weight = ["Sun", "Moon"].includes(position.key) ? 2 : 1;
      elementTotals[signs[position.sign].element] += weight;
      modeTotals[signs[position.sign].mode] += weight;
    });
    const e = elementTotals.ไฟ + elementTotals.ลม;
    const i = elementTotals.ดิน + elementTotals.น้ำ;
    const s = elementTotals.ดิน + elementTotals.น้ำ * 0.55;
    const n = elementTotals.ลม + elementTotals.ไฟ * 0.65;
    const t = elementTotals.ลม + elementTotals.ดิน * 0.7;
    const f = elementTotals.น้ำ + elementTotals.ไฟ * 0.35;
    const j = modeTotals.สถิรราศี + modeTotals.จรราศี * 0.7;
    const p = modeTotals.อุภยราศี + modeTotals.จรราศี * 0.3;
    const axis = (left, right, leftCode, rightCode) => {
      const leftPercent = Math.round(left / (left + right || 1) * 100);
      return { leftPercent, code: leftPercent >= 50 ? leftCode : rightCode };
    };
    const axes = [axis(e, i, "E", "I"), axis(s, n, "S", "N"), axis(t, f, "T", "F"), axis(j, p, "J", "P")];
    return { code: axes.map((item) => item.code).join(""), axes, elementTotals, modeTotals };
  };

  const createNatalChart = ({ dateText, timeText, place, latitude, longitude }) => {
    const date = makeUtcDate(dateText, timeText || "12:00");
    const location = resolveLocation(place, latitude, longitude);
    const asc = ascendantAt(date, location);
    const positions = planets.map((planet) => positionFor(planet, date, asc));
    const moon = positions.find((position) => position.key === "Moon");
    const localDate = new Date(date.getTime() + 7 * 3600000);
    let weekdayKey = weekdayPlanets[localDate.getUTCDay()];
    if (weekdayKey === "Mercury" && localDate.getUTCHours() >= 18) weekdayKey = "Rahu";
    const thaksa = thaksaRoles.map((role, index) => {
      const number = thaksaOrder[weekdayKey][index];
      const planet = planets.find((item) => item.number === number);
      return { role, number, planet: planet?.thai || `เลข ${number}`, key: planet?.key };
    });
    const chart = {
      date, dateText, timeText: timeText || "ไม่ระบุ (ใช้ 12:00)", location, asc,
      ascSign: signIndex(asc), ascDegree: mod(asc, 30), positions,
      houses: houseNames.map(([name, meaning], index) => ({
        number: index + 1,
        name,
        meaning,
        sign: mod(signIndex(asc) + index, 12),
        planets: positions.filter((position) => position.house === index + 1)
      })),
      nakshatra: nakshatras[Math.floor(moon.longitude / (360 / 27)) % 27],
      nakshatraPada: Math.floor(mod(moon.longitude, 360 / 27) / (360 / 108)) + 1,
      weekdayKey,
      weekdayPlanet: planetByKey[weekdayKey],
      thaksa,
      aspects: thaiAspects(positions),
      ayanamsha: ayanamsha(date)
    };
    chart.personality = personalityFromChart(chart);
    return chart;
  };

  const houseEffect = {
    Jupiter: { good: [2, 5, 9, 11], hard: [6, 8, 12] },
    Venus: { good: [1, 4, 5, 7, 11], hard: [6, 8] },
    Mercury: { good: [2, 3, 6, 10, 11], hard: [8, 12] },
    Saturn: { good: [3, 6, 10, 11], hard: [1, 4, 5, 7, 8, 12] },
    Mars: { good: [3, 6, 10, 11], hard: [1, 4, 7, 8, 12] },
    Rahu: { good: [3, 6, 10, 11], hard: [1, 5, 7, 8, 12] },
    Ketu: { good: [3, 9, 12], hard: [1, 4, 7, 8] },
    Sun: { good: [3, 6, 10, 11], hard: [4, 7, 8, 12] },
    Moon: { good: [1, 4, 5, 7, 9, 11], hard: [6, 8, 12] }
  };

  const themeForHouse = (house) => ({
    1: "ตัวตนและสุขภาพ", 2: "การเงิน", 3: "การสื่อสารและเดินทาง", 4: "บ้านและครอบครัว",
    5: "ความคิดสร้างสรรค์", 6: "งานประจำและสุขภาพ", 7: "ความสัมพันธ์", 8: "การเปลี่ยนแปลง",
    9: "โชคและการเรียนรู้", 10: "งานและชื่อเสียง", 11: "รายได้และเครือข่าย", 12: "รายจ่ายและเบื้องหลัง"
  })[house];

  const transitSnapshot = (natal, dateText, timeText) => {
    const date = makeUtcDate(dateText, timeText || "12:00");
    const positions = planets.map((planet) => positionFor(planet, date, natal.asc));
    const aspects = exactAspects(positions, natal);
    let score = 60;
    const notes = [];
    positions.forEach((position) => {
      const rule = houseEffect[position.key];
      if (rule?.good.includes(position.house)) {
        const delta = Math.abs(position.nature || 0) * 2.5 + 1;
        score += delta;
        if (Math.abs(position.nature) >= 1) notes.push({ tone: "good", text: `${position.thai}จรภพ ${position.house} หนุน${themeForHouse(position.house)}` });
      }
      if (rule?.hard.includes(position.house)) {
        const delta = Math.abs(position.nature || 0) * 2.3 + 1;
        score -= delta;
        if (Math.abs(position.nature) >= 1) notes.push({ tone: "watch", text: `${position.thai}จรภพ ${position.house} ให้ระวัง${themeForHouse(position.house)}` });
      }
    });
    aspects.slice(0, 8).forEach((event) => {
      score += event.impact * 4;
      if (Math.abs(event.impact) > 0.35) notes.push({
        tone: event.impact >= 0 ? "good" : "watch",
        text: `${event.transit.thai}จร${event.name}${event.birth.thai}เดิม (คลาด ${event.orb.toFixed(1)}°)`
      });
    });
    score = clamp(Math.round(score), 28, 92);
    return { date, dateText, timeText, positions, aspects, score, notes: notes.slice(0, 8) };
  };

  const addDaysText = (dateText, days) => {
    const [year, month, day] = dateText.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day + days));
    return date.toISOString().slice(0, 10);
  };

  const daysBetween = (startText, endText) => {
    const start = new Date(`${startText}T00:00:00Z`);
    const end = new Date(`${endText}T00:00:00Z`);
    return Math.floor((end - start) / 86400000);
  };

  const createTransitRange = (natal, { startText, endText, timeText = "12:00", precision = "auto" }) => {
    let start = startText;
    let end = endText;
    if (daysBetween(start, end) < 0) [start, end] = [end, start];
    const spanDays = daysBetween(start, end);
    const requested = { day: 1, week: 7, month: 30, quarter: 91, year: 365 }[precision];
    let stepDays = requested || Math.max(1, Math.ceil((spanDays + 1) / 180));
    const originalStep = stepDays;
    if (Math.ceil((spanDays + 1) / stepDays) > 1200) stepDays = Math.ceil((spanDays + 1) / 1200);
    const samples = [];
    for (let offset = 0; offset <= spanDays; offset += stepDays) {
      samples.push(transitSnapshot(natal, addDaysText(start, offset), timeText));
    }
    if (!samples.length || samples[samples.length - 1].dateText !== end) samples.push(transitSnapshot(natal, end, timeText));
    const scores = samples.map((sample) => sample.score);
    const average = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    const sorted = [...samples].sort((a, b) => b.score - a.score);
    const best = sorted.slice(0, Math.min(5, sorted.length));
    const watch = sorted.slice(-Math.min(5, sorted.length)).reverse();
    const themes = new Map();
    samples.forEach((sample) => sample.notes.forEach((note) => {
      const key = `${note.tone}|${note.text}`;
      themes.set(key, (themes.get(key) || 0) + 1);
    }));
    const recurring = [...themes.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([key, count]) => {
      const [tone, text] = key.split("|");
      return { tone, text, count };
    });
    return {
      start, end, spanDays, timeText, precision, stepDays, originalStep, samples,
      average, best, watch, recurring,
      adjusted: Boolean(requested && stepDays !== originalStep)
    };
  };

  window.ThaiAstro = {
    signs, planets, houseNames, knownPlaces, formatDegree,
    createNatalChart, transitSnapshot, createTransitRange, resolveLocation
  };
})();
