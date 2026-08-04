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

  const pairDetails = {
    "12": {
      trait: "เป็นคนรับข้อมูลไวและมองเห็นเหตุผลได้หลายด้าน จึงไม่ชอบตัดสินอะไรแบบขาว–ดำ ภายนอกอาจดูปรับตัวง่าย แต่ภายในมักมีบทสนทนากับตัวเองหลายรอบก่อนเลือก",
      strength: "เข้าใจความเห็นที่ต่างกัน ประนีประนอมเก่ง และเปลี่ยนมุมมองได้เมื่อพบข้อมูลใหม่ เหมาะกับเรื่องที่ต้องอ่านคนหรือพิจารณาหลายเงื่อนไข",
      weakness: "เมื่อกังวลอาจลังเล เปลี่ยนใจ หรือขอข้อมูลเพิ่มไม่จบ ทำให้เสียจังหวะและทำให้คนรอบตัวไม่แน่ใจว่าคุณต้องการอะไร",
      work: "ทำงานได้ดีเมื่อมีกรอบตัดสินใจและเวลาชัดเจน หากต้องตอบทันทีภายใต้แรงกดดัน ควรมีรายการเกณฑ์สำคัญไว้กันอารมณ์แกว่ง",
      relationship: "ต้องการคนที่รับฟังโดยไม่เร่ง แต่ก็ควรบอกข้อสรุปให้ชัด ไม่ปล่อยให้อีกฝ่ายตีความจากความเงียบหรือการเปลี่ยนท่าที",
      use: "ใช้ความสามารถในการเห็นหลายมุมกับงานวิเคราะห์ เจรจา หรือประสานงาน แล้วกำหนดเส้นตายให้ตัวเองก่อนตัดสินใจ"
    },
    "23": {
      trait: "มีเสน่ห์ทางอารมณ์ เข้าถึงความรู้สึกคนอื่นไว และต้องการความสัมพันธ์ที่มีชีวิตชีวา จึงตอบสนองต่อคำพูด บรรยากาศ และการเอาใจใส่ค่อนข้างมาก",
      strength: "สร้างความประทับใจ เก่งเรื่องศิลปะ รสนิยม และการเชื่อมความรู้สึก เหมาะกับงานหรือบทบาทที่ต้องดึงดูดความสนใจและเข้าใจผู้คน",
      weakness: "ความคาดหวังและอารมณ์อาจขึ้นลงเร็ว เมื่อไม่มั่นใจมีโอกาสคิดแทนอีกฝ่าย หึงหวง หรือให้ความสำคัญกับความรู้สึกชั่วขณะมากกว่าข้อเท็จจริง",
      work: "เด่นกับงานครีเอทีฟ บริการ สื่อ และการสร้างสัมพันธ์ แต่ควรแยกความชอบส่วนตัวออกจากเกณฑ์วัดผลงาน",
      relationship: "รักแล้วทุ่มเทและต้องการการตอบสนองที่ชัด ความสัมพันธ์จะดีเมื่อพูดสถานะ ขอบเขต และความคาดหวังตรงกันตั้งแต่ต้น",
      use: "ใช้เสน่ห์เพื่อสร้างความร่วมมือ ไม่ใช้เพื่อทดสอบความรู้สึก และพักการตัดสินใจเมื่ออารมณ์ยังแรง"
    },
    "34": {
      trait: "คิดเร็ว ตอบเร็ว และมักมองเห็นจุดที่ต้องแก้ก่อนคนอื่น มีพลังผลักดันสูง ไม่ชอบความคลุมเครือหรือการทำงานที่วนอยู่กับที่",
      strength: "เด็ดขาด กล้าชนปัญหา สื่อสารประเด็นสำคัญได้ตรง และทำงานในสถานการณ์เร่งด่วนหรือการแข่งขันได้ดี",
      weakness: "คำพูดอาจเร็ว ตรง หรือแรงกว่าที่ตั้งใจ โดยเฉพาะเมื่อเห็นข้อผิดพลาดชัด จึงเสี่ยงให้คนอื่นรู้สึกถูกตำหนิหรือไม่กล้าเสนอความเห็น",
      work: "เหมาะกับงานแก้ปัญหา ต่อรอง ควบคุมสถานการณ์ และงานที่ต้องการความเร็ว แต่ควรแยกคนออกจากปัญหาเวลาวิพากษ์",
      relationship: "ต้องการความตรงไปตรงมา แต่อีกฝ่ายอาจต้องการน้ำเสียงและเวลาประมวลผลมากกว่า ควรถามก่อนว่าเขาต้องการคำตอบหรือการรับฟัง",
      use: "เก็บความคมไว้ที่เนื้อหา ลดความแรงที่น้ำเสียง และเว้นจังหวะก่อนส่งข้อความสำคัญ"
    },
    "45": {
      trait: "เป็นคนรักเหตุผล ชอบเรียนรู้ให้เข้าใจจริง และต้องการสื่อสารบนข้อมูลที่เชื่อถือได้ มักถูกมองว่าเป็นที่ปรึกษาหรือคนที่ช่วยจัดระบบความคิด",
      strength: "วิเคราะห์ลึก อธิบายเรื่องยากให้เข้าใจง่าย มีความน่าเชื่อถือ และมองความเชื่อมโยงของข้อมูลได้ดี",
      weakness: "อาจยึดหลักการหรือมาตรฐานสูงจนดูจริงจังเกินไป และมีแนวโน้มอธิบายมากเมื่ออีกฝ่ายต้องการเพียงข้อสรุปสั้น ๆ",
      work: "เด่นกับงานวิเคราะห์ วางแผน สอน ให้คำปรึกษา กฎหมาย มาตรฐาน หรือบทบาทที่ต้องใช้ความรู้สร้างความไว้วางใจ",
      relationship: "แสดงความใส่ใจผ่านคำแนะนำและการแก้ปัญหา แต่ควรจำไว้ว่าบางครั้งคนใกล้ตัวต้องการการยอมรับความรู้สึกก่อนเหตุผล",
      use: "เปลี่ยนความรู้ให้เป็นผลงานที่ใช้ได้จริง และฝึกสรุปสารให้เหมาะกับเวลาหรือระดับความรู้ของผู้ฟัง"
    },
    "56": {
      trait: "มองเห็นโอกาสและคุณค่าของทรัพยากรได้ดี ชอบความมั่นคงที่มาพร้อมคุณภาพชีวิต และมักดึงดูดคนสนับสนุนจากความเป็นมิตรกับความน่าไว้วางใจ",
      strength: "หาโอกาสสร้างรายได้ ต่อรองผลประโยชน์ และเชื่อมความรู้กับการเติบโตได้ดี มีความสามารถทำให้เรื่องยากกลายเป็นผลลัพธ์ที่จับต้องได้",
      weakness: "เมื่อทุกอย่างไหลลื่นอาจใช้จ่ายตามความสบาย รับภาระเกินจำเป็น หรือเชื่อว่าโอกาสใหม่จะชดเชยการวางแผนที่ไม่รัดกุม",
      work: "เหมาะกับธุรกิจ การเงิน การขาย การบริหารทรัพยากร และงานที่ต้องสร้างความสัมพันธ์ระยะยาวกับผู้สนับสนุน",
      relationship: "ให้ความสำคัญกับการดูแลและความมั่นคง แต่อย่าปล่อยให้เรื่องเงิน ของขวัญ หรือความสะดวกกลายเป็นตัวแทนของการพูดความรู้สึก",
      use: "รักษาวินัยเงิน แยกเงินเติบโตออกจากเงินเพื่อความสุข และเลือกโอกาสจากคุณค่าระยะยาว"
    },
    "67": {
      trait: "มีความรับผิดชอบสูง อดทน และมักรับรู้ภาระของคนรอบตัวเร็วกว่าคนอื่น จึงเผลอเป็นคนแบกทั้งเรื่องงาน เงิน และความรู้สึก",
      strength: "รักษาคำพูด ดูแลเรื่องระยะยาว และยืนหยัดได้ในช่วงที่คนอื่นถอย เหมาะกับภารกิจที่ต้องการวินัยและความต่อเนื่อง",
      weakness: "เสี่ยงเหนื่อยสะสม รู้สึกว่าตัวเองให้มากกว่าได้รับ หรือยอมรับภาระเพราะกลัวความสัมพันธ์มีปัญหา",
      work: "ผู้คนไว้วางใจให้รับเรื่องยาก แต่ควรต่อรองทรัพยากร อำนาจ และเวลาให้เท่ากับความรับผิดชอบ ไม่แก้ทุกปัญหาแทนทุกคน",
      relationship: "รักด้วยการดูแลและรับผิดชอบ จึงต้องแยกความรักออกจากการยอมทุกอย่าง และพูดเพดานเรื่องเงินหรือหน้าที่ให้ชัด",
      use: "ตั้งขอบเขตก่อนช่วย ถามว่าเรื่องใดเป็นหน้าที่ของใคร และเก็บพลังไว้กับสิ่งที่สร้างผลระยะยาวจริง"
    },
    "78": {
      trait: "มีพลังทางสังคม ใจกว้าง และมองภาพรวมของผู้คนหรือเครือข่ายได้ดี ชอบทำสิ่งที่มีอิทธิพลหรือสร้างผลต่อคนจำนวนมาก",
      strength: "สร้างพันธมิตร เปิดประตูโอกาส และนำคนหลายแบบมาร่วมเป้าหมายเดียวกันได้ มีความกล้าและมองเกมความสัมพันธ์เป็น",
      weakness: "อาจเชื่อคนง่ายเพราะเห็นศักยภาพ ใช้พลังกับสังคมมากเกินไป หรือรับปากหลายเรื่องจนควบคุมคุณภาพไม่ได้",
      work: "เด่นกับงานบริหาร เครือข่าย ธุรกิจ การเจรจา และงานที่ต้องขยายผล แต่ต้องเลือกคนจากผลงานและคุณค่ามากกว่าความสนิท",
      relationship: "ต้องการคู่ที่เข้าใจบทบาททางสังคมและให้อิสระกัน ความชัดเจนเรื่องเวลาและลำดับความสำคัญจะลดความรู้สึกถูกละเลย",
      use: "ใช้เครือข่ายเพื่อสร้างผลลัพธ์ร่วม ไม่กระจายตัวเกินไป และตรวจความน่าเชื่อถือก่อนผูกพันผลประโยชน์"
    }
  };

  const digitArchetypes = {
    0: { drive: "รับรู้สิ่งละเอียดอ่อนและโลกภายใน", strength: "สังเกตบรรยากาศและความหมายที่คนอื่นมองข้าม", shadow: "เก็บตัว คิดวน หรือเชื่อความรู้สึกก่อนตรวจข้อเท็จจริง", work: "งานเบื้องหลัง งานค้นคว้า งานสร้างสรรค์ และเรื่องที่ต้องใช้สมาธิ", love: "ต้องการพื้นที่ปลอดภัยและคนที่ไม่เร่งให้เปิดใจ" },
    1: { drive: "ยืนด้วยตัวเองและผลักดันเป้าหมาย", strength: "กล้าตัดสินใจ รับผิดชอบ และเริ่มเรื่องใหม่", shadow: "ยึดความคิดตนเอง ใจร้อน หรือไม่ยอมขอความช่วยเหลือ", work: "บทบาทผู้นำ เจ้าของงาน และงานที่วัดผลชัด", love: "ต้องการการยอมรับและอิสระโดยไม่ถูกควบคุม" },
    2: { drive: "เชื่อมโยงความรู้สึกและรักษาความสัมพันธ์", strength: "เข้าใจคน ประนีประนอม และใส่ใจรายละเอียด", shadow: "ลังเล ไวต่อคำพูด หรือรับอารมณ์คนอื่นมามากเกินไป", work: "บริการ ประสานงาน ดูแลลูกค้า และงานที่ใช้รสนิยม", love: "ต้องการความสม่ำเสมอ น้ำเสียงที่อ่อนโยน และความชัดเจน" },
    3: { drive: "ลงมือ แข่งขัน และแก้ปัญหาตรงหน้า", strength: "รวดเร็ว กล้าเผชิญ และมีพลังผลักงาน", shadow: "หงุดหงิด ปะทะ หรือรีบจนมองข้ามความเสี่ยง", work: "งานเร่งด่วน ภาคสนาม การขาย การแข่งขัน และการแก้วิกฤต", love: "รักชัด ตรง และต้องระวังใช้อารมณ์แทนการอธิบาย" },
    4: { drive: "สื่อสาร เรียนรู้ และเชื่อมข้อมูล", strength: "หัวไว ปรับตัวเก่ง และมองทางเลือกใหม่", shadow: "ข้อมูลล้น เปลี่ยนเรื่องเร็ว หรือรับปากก่อนตรวจรายละเอียด", work: "สื่อ เทคโนโลยี เจรจา การตลาด และงานข้อมูล", love: "ต้องการคู่สนทนาที่คุยกันรู้เรื่องและเปิดรับไอเดีย" },
    5: { drive: "ค้นหาเหตุผล ความถูกต้อง และการเติบโต", strength: "วิเคราะห์ วางหลัก และให้คำแนะนำที่น่าเชื่อถือ", shadow: "มาตรฐานสูง สอนคนอื่นโดยไม่รู้ตัว หรือคิดนานเกินจังหวะ", work: "วิชาการ วางแผน ที่ปรึกษา กฎหมาย และการบริหารความรู้", love: "แสดงความหวังดีด้วยคำแนะนำ แต่ควรรับฟังความรู้สึกก่อนแก้ปัญหา" },
    6: { drive: "สร้างคุณค่า ความสุข และความมั่นคงทางใจ", strength: "มีเสน่ห์ รสนิยมดี และเปลี่ยนความสัมพันธ์เป็นโอกาส", shadow: "ใช้จ่ายตามอารมณ์ ติดความสบาย หรือเลี่ยงเรื่องที่ไม่น่าพอใจ", work: "การเงิน ศิลปะ ความงาม บริการ และงานสร้างประสบการณ์", love: "ต้องการความอบอุ่น การดูแล และคุณภาพชีวิตที่แบ่งปันกัน" },
    7: { drive: "สร้างความมั่นคงผ่านวินัยและความอดทน", strength: "รับผิดชอบ อึด และดูแลงานระยะยาว", shadow: "แบกภาระ เคร่งกับตัวเอง หรือคาดหวังผลช้าจนท้อ", work: "ระบบ โครงสร้าง ทรัพย์สิน งานระยะยาว และการควบคุมมาตรฐาน", love: "จริงจังและภักดี แต่ต้องแบ่งหน้าที่ให้เป็นธรรม" },
    8: { drive: "ขยายอำนาจ ทรัพยากร และเครือข่าย", strength: "ต่อรองเก่ง ใจใหญ่ และมองเกมผลประโยชน์ออก", shadow: "เสี่ยงเกินขอบเขต เชื่อมั่นมาก หรือผูกเรื่องเงินกับศักดิ์ศรี", work: "ธุรกิจ การลงทุน บริหารเครือข่าย และงานเป้าหมายใหญ่", love: "ต้องการคู่ที่เคารพเป้าหมายและพูดเรื่องเงินกับอำนาจอย่างตรงไปตรงมา" },
    9: { drive: "มองภาพไกล ความหมาย และสิ่งที่เป็นประโยชน์ต่อผู้อื่น", strength: "มีจินตนาการ สัญชาตญาณ และแรงบันดาลใจ", shadow: "คาดหวังสูง กระจายพลัง หรือหลุดจากรายละเอียดที่จำเป็น", work: "สร้างสรรค์ สังคม การสอน งานต่างถิ่น และโครงการที่มีความหมาย", love: "ต้องการความเข้าใจทางความคิดและพื้นที่ให้เติบโตร่วมกัน" }
  };

  const buildPairDetail = (item) => {
    const first = digitArchetypes[Number(item.visiblePair[0])] || digitArchetypes[0];
    const second = digitArchetypes[Number(item.visiblePair[1])] || digitArchetypes[0];
    const themes = item.themes || [];
    const themeText = themes.slice(0, 3).join(" การ") || "การตัดสินใจและชีวิตประจำวัน";
    const positive = item.polarity === "positive";
    const caution = item.polarity === "caution";
    const generated = {
      trait: `เลขตัวแรกสะท้อนแรงเริ่มต้นที่ต้องการ${first.drive} ส่วนเลขตัวหลังทำให้พฤติกรรมไปจบที่การ${second.drive} คนที่ใช้คู่นี้บ่อยจึงมักแสดงออกทั้งสองด้านพร้อมกัน โดยเฉพาะเรื่อง${themeText} เมื่ออยู่ในสภาพแวดล้อมที่เหมาะจะดูมีมิติและปรับบทบาทได้ดี แต่เมื่อเร่งรีบอาจสลับไปมาระหว่างสองแรงจนคนอื่นตามไม่ทัน`,
      strength: `${first.strength} ขณะเดียวกันก็${second.strength} จุดเด่นจึงไม่ใช่เพียงความสามารถด้านเดียว แต่เป็นการนำแรงของเลขทั้งสองมาช่วยกันแก้สถานการณ์ หากตั้งเป้าหมายชัด คู่นี้มีแนวโน้มทำให้เจ้าของเบอร์เป็นคนที่ผู้อื่นนึกถึงเมื่อมีเรื่องเกี่ยวกับ${themeText}`,
      weakness: `${first.shadow} และอาจ${second.shadow} ${caution ? "เมื่อถูกกดดันด้านลบจะออกเร็วและชัด จึงควรชะลอการตอบโต้ก่อนตัดสินใจสำคัญ" : positive ? "แม้เป็นคู่หนุน หากพึ่งจุดแข็งมากเกินไปก็อาจกลายเป็นความมั่นใจหรือความสบายจนละเลยรายละเอียด" : "พลังคู่นี้ขึ้นกับบริบทมาก จึงต้องกำหนดขอบเขตเรื่องเวลา เงิน และความสัมพันธ์ให้ชัด"}`,
      work: `เหมาะกับ${first.work} เมื่อต้องทำงานร่วมกับ${second.work} จะยิ่งเห็นศักยภาพชัด วิธีทำงานที่ได้ผลคือแบ่งช่วงคิด วางเกณฑ์ และลงมือให้เป็นขั้น ไม่รับหลายเรื่องพร้อมกันเพียงเพราะรู้สึกว่ายังจัดการได้`,
      money: `การเงินสัมพันธ์กับวิธีใช้ทรัพยากรเพื่อ${first.drive} แล้วนำไปสู่การ${second.drive} ${positive ? "มีโอกาสสร้างมูลค่าจากความสามารถและความสัมพันธ์ แต่ควรแยกเงินใช้ เงินสำรอง และเงินลงทุน" : caution ? "ควรระวังรายจ่ายจากอารมณ์ ภาระของคนอื่น หรือการตัดสินใจเร็ว ตั้งเพดานความเสี่ยงและตรวจเงื่อนไขก่อนผูกพัน" : "รายรับรายจ่ายอาจเป็นรอบตามโอกาส ควรใช้ตัวเลขจริงกำกับแทนความมั่นใจหรือความกังวล"}`,
      relationship: `${first.love} ขณะเดียวกัน${second.love} ความสัมพันธ์จะราบรื่นเมื่อพูดความต้องการ ขอบเขต เวลา และเรื่องเงินอย่างตรงไปตรงมา ไม่ทดสอบใจหรือหวังให้อีกฝ่ายเข้าใจจากความเงียบ`,
      pressure: `เมื่อเหนื่อยหรือถูกเร่ง มีแนวโน้มจะ${first.shadow} ก่อน แล้วจึง${second.shadow} สัญญาณเตือนคือคิดเรื่องเดิมซ้ำ น้ำเสียงเปลี่ยน รีบรับปาก หรือถอนตัวโดยไม่อธิบาย ควรพักการตัดสินใจ จัดลำดับสิ่งเร่งด่วน และขอข้อมูลเพิ่มก่อนสรุป`,
      use: `ใช้ความสามารถเรื่อง${themeText}กับเป้าหมายที่วัดผลได้ ทำข้อตกลงให้ชัด และทบทวนผลทุกระยะ จะช่วยให้จุดแข็งของเลขทั้งสองทำงานร่วมกันโดยไม่กลายเป็นนิสัยสุดโต่ง`,
      scenarios: [
        `มักถูกขอให้ช่วยคิด ตัดสินใจ หรือประสานเรื่องที่เกี่ยวกับ${themeText}`,
        `มีโอกาสเด่นเมื่อได้ใช้${first.strength}ร่วมกับการ${second.drive}`,
        `จุดขัดข้องมักเกิดเมื่อ${first.shadow}พร้อมกับการ${second.shadow}`
      ]
    };
    return { ...generated, ...(pairDetails[item.pair] || {}) };
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

  const pairPositionText = (position) => {
    if (position <= 3) return "ช่วงต้น: มีผลต่อภาพลักษณ์ วิธีเริ่มต้น และการรับเรื่องใหม่";
    if (position <= 6) return "ช่วงกลาง: มีผลต่อพฤติกรรมประจำวัน งาน และความสัมพันธ์";
    return "คู่ท้าย: มีน้ำหนักสูงสุดต่อการตัดสินใจและพฤติกรรมที่แสดงออกชัด";
  };

  const renderPairCard = (item, analysis) => {
    const detail = buildPairDetail(item);
    const occurrences = analysis.sequence.filter((row) => row.pair === item.pair);
    const positions = occurrences.map((row) => `<li><b>${escapeHtml(row.visiblePair)}</b> · ${pairPositionText(row.position)} · น้ำหนัก ${row.weight}%</li>`).join("");
    return `<article class="pair-card polarity-${item.polarity}">
      <div class="pair-top"><span>${escapeHtml(item.visiblePair)}</span><small>น้ำหนักรวม ${item.weight}%${item.count > 1 ? ` · พบ ${item.count} ครั้ง` : ""}</small></div>
      <h3>${escapeHtml(item.title)}</h3>
      <p class="pair-lead">${escapeHtml(item.summary)}</p>
      ${detail ? `<div class="pair-insight-grid">
        <section><span>ลักษณะนิสัย</span><p>${escapeHtml(detail.trait)}</p></section>
        <section class="strength"><span>จุดแข็ง</span><p>${escapeHtml(detail.strength)}</p></section>
        <section class="weakness"><span>จุดที่ต้องระวัง</span><p>${escapeHtml(detail.weakness)}</p></section>
        <section><span>การงาน</span><p>${escapeHtml(detail.work)}</p></section>
        <section><span>การเงินและการใช้ทรัพยากร</span><p>${escapeHtml(detail.money)}</p></section>
        <section><span>ความสัมพันธ์</span><p>${escapeHtml(detail.relationship)}</p></section>
        <section class="pressure"><span>เมื่อถูกกดดัน</span><p>${escapeHtml(detail.pressure)}</p></section>
        <section class="pair-scenarios"><span>สถานการณ์ที่มักพบ</span><ul>${detail.scenarios.map((scenario) => `<li>${escapeHtml(scenario)}</li>`).join("")}</ul></section>
        <section class="best-use"><span>ใช้พลังคู่นี้ให้ดีที่สุด</span><p>${escapeHtml(detail.use)}</p></section>
      </div>` : ""}
      <details class="pair-position-details">
        <summary>เหตุใดตำแหน่งของคู่นี้จึงสำคัญ</summary>
        <ul>${positions}</ul>
      </details>
      <p class="pair-advice"><b>คำแนะนำเฉพาะคู่:</b> ${escapeHtml(item.advice)}</p>
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
    $("#pair-list").innerHTML = analysis.items.length
      ? analysis.items.map((item) => renderPairCard(item, analysis)).join("")
      : `<div class="empty-reading">ยังไม่มีคำอธิบายคู่เลขที่ตรงกับฐานข้อมูลชุดนี้</div>`;
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

  const natalAxesForDisplay = (natal) => natal.personality.axes.map((result, index) => {
    const definition = personalityAxes[index];
    const dominant = result.code === definition.left.code ? definition.left : definition.right;
    return {
      ...definition,
      leftPercent: result.leftPercent,
      dominant,
      dominantPercent: result.code === definition.left.code ? result.leftPercent : 100 - result.leftPercent
    };
  });

  const birthPersonalityAreas = (natal, domains) => {
    const code = natal.personality.code;
    const is = (letter) => code.includes(letter);
    const element = Object.entries(natal.personality.elementTotals || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || "ธาตุเด่น";
    const mode = Object.entries(natal.personality.modeTotals || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || "รูปแบบเด่น";
    return [
      {
        icon: "ตัว", title: "ตัวตนที่คนอื่นมองเห็น", score: domains[0].score,
        text: `${ascendantReadings[Astro.signs[natal.ascSign].name]} ภายนอกจึงอาจดู${is("E") ? "เข้าถึงง่ายและพร้อมตอบสนองต่อสิ่งรอบตัว" : "สุขุมและเลือกเปิดเผยเฉพาะสิ่งที่ไว้ใจ"} แม้ตัวตนภายในจะซับซ้อนกว่าภาพแรกที่คนพบ`,
        balance: `เมื่อสมดุล คุณวางตัวเป็นธรรมชาติและรู้ว่าเวลาใดควรนำหรือควรถอยดูสถานการณ์ เมื่อเสียสมดุลอาจยึดภาพที่ต้องการให้คนเห็นจนไม่พูดความต้องการจริง`,
        advice: "สังเกตความต่างระหว่างสิ่งที่แสดงออกกับสิ่งที่รู้สึก และสื่อสารความต้องการก่อนเกิดความคาดหวังคลาดเคลื่อน"
      },
      {
        icon: "แรง", title: "แรงขับและความต้องการภายใน", score: domains[5].score,
        text: `ธาตุ${element}และพลังแบบ${mode}ทำให้คุณต้องการความก้าวหน้าที่รู้สึกว่ามีความหมาย ${is("I") ? "คุณเติมพลังจากเวลาคิดและการได้ควบคุมจังหวะของตนเอง" : "คุณเติมพลังจากการเคลื่อนไหว ผู้คน และการเห็นการตอบสนองตรงหน้า"}`,
        balance: `เมื่อสมดุล แรงขับกลายเป็นความสม่ำเสมอและแรงบันดาลใจ เมื่อเสียสมดุลอาจเร่งตัวเอง กระจายพลัง หรือหมดแรงเพราะพยายามตอบทุกความคาดหวัง`,
        advice: "เลือกเป้าหมายหลักหนึ่งถึงสองเรื่อง และแยกสิ่งที่ต้องการจริงออกจากสิ่งที่ทำเพื่อการยอมรับ"
      },
      {
        icon: "คิด", title: "วิธีคิดและตัดสินใจ", score: domains[0].score,
        text: `${is("N") ? "คุณเริ่มจากภาพรวม ความเป็นไปได้ และความหมายที่ซ่อนอยู่" : "คุณเริ่มจากข้อเท็จจริง ประสบการณ์ และสิ่งที่ตรวจสอบได้"} ก่อนจะ${is("T") ? "ใช้เหตุผลกับเกณฑ์ที่ชัดเพื่อหาข้อสรุป" : "พิจารณาคุณค่า ความรู้สึก และผลกระทบต่อผู้เกี่ยวข้อง"}`,
        balance: `เมื่อสมดุล คุณรวมข้อมูลกับวิจารณญาณได้ดี เมื่อเสียสมดุลอาจ${is("T") ? "ตัดอารมณ์ของคนออกจากสมการมากไป" : "ให้น้ำหนักความรู้สึกชั่วขณะมากกว่าหลักฐาน"}`,
        advice: is("T") ? "ก่อนสรุปเรื่องคน ให้ถามความรู้สึกและความต้องการเพิ่มจากข้อมูลที่มี" : "เมื่อเรื่องมีความเสี่ยงสูง ให้เขียนข้อเท็จจริงและเกณฑ์ตัดสินใจแยกจากความรู้สึก"
      },
      {
        icon: "งาน", title: "การทำงานและภาวะผู้นำ", score: domains[1].score,
        text: `${is("J") ? "ทำงานได้ดีที่สุดเมื่อเป้าหมาย บทบาท และกำหนดเวลาชัด" : "ทำงานได้ดีเมื่อมีพื้นที่ทดลองและปรับวิธีระหว่างทาง"} คุณ${is("I") ? "มักเตรียมความคิดให้ตกผลึกก่อนนำเสนอ" : "มักขยับงานได้เร็วจากการคุยและดึงคนมาร่วมมือ"}`,
        balance: `เมื่อสมดุล คุณรับผิดชอบในแบบของตัวเองและส่งงานได้ตามคุณภาพ เมื่อเสียสมดุลอาจ${is("J") ? "ควบคุมรายละเอียดหรือกดดันทีมเกินไป" : "เริ่มหลายเรื่องแต่ปิดงานไม่ครบ"}`,
        advice: is("J") ? "เผื่อพื้นที่ให้แผนเปลี่ยนได้ โดยยึดผลลัพธ์มากกว่าวิธีเดิม" : "กำหนดจุดตรวจงานและเส้นตายย่อยเพื่อให้ไอเดียไปถึงผลลัพธ์"
      },
      {
        icon: "เงิน", title: "เงิน ความมั่นคง และการใช้ทรัพยากร", score: domains[2].score,
        text: `${is("S") ? "คุณสบายใจกับแผนที่เห็นตัวเลขและผลตอบแทนจับต้องได้" : "คุณมองเงินเป็นเครื่องมือเปิดทางเลือกและสร้างอนาคต"} การใช้เงินจึงสัมพันธ์กับความรู้สึกมั่นคงและอิสระมากกว่าจำนวนเงินเพียงอย่างเดียว`,
        balance: `เมื่อสมดุล คุณเลือกใช้ทรัพยากรตามคุณค่าและเป้าหมาย เมื่อเสียสมดุลอาจใช้เงินเพื่อคลายความกังวล รักษาภาพลักษณ์ หรือคว้าโอกาสโดยยังไม่ตรวจความเสี่ยง`,
        advice: "แยกเงินจำเป็น เงินสำรอง และเงินทดลอง พร้อมตั้งช่วงทบทวนแทนการตัดสินใจทุกครั้งตามอารมณ์"
      },
      {
        icon: "รัก", title: "ความรักและการสื่อสาร", score: domains[3].score,
        text: `${is("I") ? "ต้องการเวลาส่วนตัวเพื่อจัดการความรู้สึก" : "มักเข้าใจความรู้สึกตัวเองผ่านการพูดคุย"} และ${is("F") ? "ให้คุณค่ากับน้ำเสียง ความจริงใจ และความรู้สึกปลอดภัย" : "ให้คุณค่ากับความชัดเจน ความสมเหตุผล และการแก้ปัญหาได้จริง"}`,
        balance: `เมื่อสมดุล คุณสื่อสารความรักในภาษาที่อีกฝ่ายรับรู้ได้ เมื่อเสียสมดุลอาจเงียบ ทดสอบใจ แก้ปัญหาแทนการรับฟัง หรือคาดหวังให้อีกฝ่ายเดา`,
        advice: "บอกให้อีกฝ่ายรู้ว่าขณะนั้นต้องการคำแนะนำ การรับฟัง หรือเวลาส่วนตัว เพื่อลดการตีความแทนกัน"
      },
      {
        icon: "ใจ", title: "เมื่ออยู่ภายใต้แรงกดดัน", score: domains[4].score,
        text: `${is("J") ? "มีแนวโน้มพยายามควบคุมสถานการณ์และรีบทำให้เรื่องกลับมาเป็นระบบ" : "มีแนวโน้มเปิดทางเลือกไว้หลายทางและเลื่อนข้อสรุปจนกว่าจะมั่นใจ"} ภายนอกอาจยังทำหน้าที่ต่อได้แม้ภายในใช้พลังมาก`,
        balance: `สัญญาณที่คนรอบตัวอาจเห็นคือ${is("I") ? "ถอนตัว ตอบสั้น และใช้เวลาคิดนานขึ้น" : "พูดเร็ว รับงานเพิ่ม หรือพยายามจัดการทุกคน"} หากปล่อยไว้นานคุณอาจตัดสินใจจากความล้ามากกว่าความต้องการจริง`,
        advice: "แยกสิ่งที่ควบคุมได้ออกจากสิ่งที่ต้องรอ กำหนดเวลาหยุดคิด และขอความช่วยเหลือก่อนความเหนื่อยสะสม"
      },
      {
        icon: "โต", title: "เส้นทางพัฒนาที่ช่วยให้ไปได้ไกล", score: Math.round((domains[0].score + domains[5].score) / 2),
        text: `การเติบโตไม่ได้แปลว่าต้องเปลี่ยนตัวตน แต่คือการฝึกด้านตรงข้ามของ ${code}: ${is("I") ? "เปิดความคิดให้คนอื่นรับรู้เร็วขึ้น" : "มีพื้นที่ทบทวนก่อนตอบสนอง"}, ${is("N") ? "ตรวจภาพใหญ่ด้วยรายละเอียดจริง" : "เปิดรับทางเลือกนอกประสบการณ์เดิม"}, ${is("T") ? "เห็นความรู้สึกเป็นข้อมูลสำคัญ" : "ใช้เกณฑ์ที่ชัดเมื่อความรู้สึกขัดกัน"} และ${is("J") ? "ยืดหยุ่นกับวิธีทำ" : "ปิดงานตามเส้นตาย"}`,
        balance: "เมื่อฝึกด้านตรงข้าม จุดแข็งเดิมจะยืดหยุ่นขึ้นโดยไม่สูญเสียความเป็นตัวเอง และช่วยลดพฤติกรรมสุดโต่งในช่วงที่กดดัน",
        advice: "เลือกฝึกเพียงหนึ่งพฤติกรรมต่อเดือน วัดจากเหตุการณ์จริง และขอข้อมูลสะท้อนกลับจากคนที่ไว้ใจ"
      }
    ];
  };

  const renderNatalReading = (natal) => {
    const domains = buildNatalDomains(natal);
    const areas = birthPersonalityAreas(natal, domains);
    const ranked = [...domains].sort((a, b) => b.score - a.score);
    const strengths = ranked.slice(0, 3);
    const growth = ranked.slice(-2).reverse();
    const ascName = Astro.signs[natal.ascSign].name;
    $("#natal-reading").innerHTML = `<section class="content-card deep-reading-card birth-reading-card">
      <div class="section-title"><div><span class="result-kicker">บุคลิกจากวันเกิด</span><h2>ตัวตน จุดแข็ง และจุดที่ต้องพัฒนา</h2>
      <p>แปลข้อมูลวันเกิดเป็นภาษาพฤติกรรมที่นำไปใช้ได้ง่าย</p></div></div>
      <div class="reading-intro birth-intro">
        <p><b>ภาพรวมตัวตน:</b> ${escapeHtml(typeDescriptions[natal.personality.code])}</p>
        <p><b>วิธีแสดงออก:</b> ${escapeHtml(ascendantReadings[ascName])}</p>
      </div>
      <div class="axis-grid birth-axis-grid">${natalAxesForDisplay(natal).map(renderAxisCard).join("")}</div>
      <div class="strength-weakness-grid">
        <section class="personality-list strength-list"><span>จุดแข็งที่ใช้ได้ดี</span>
          <ul>${strengths.map((domain) => `<li><b>${domain.title}</b><small>${domain.advice}</small></li>`).join("")}</ul>
        </section>
        <section class="personality-list weakness-list"><span>จุดอ่อนที่ควรรู้ทัน</span>
          <ul>${growth.map((domain) => `<li><b>${domain.title}</b><small>${domain.advice}</small></li>`).join("")}</ul>
        </section>
      </div>
      <div class="personality-area-grid">${areas.map((area) => `<article class="personality-area">
        <header><span>${area.icon}</span><div><h3>${area.title}</h3><small>${area.score >= 68 ? "เป็นธรรมชาติและใช้ได้คล่อง" : area.score >= 50 ? "ทำได้ดีเมื่อมีสติ" : "ต้องใช้เวลาและการฝึก"}</small></div></header>
        <p>${area.text}</p><p class="area-balance"><b>เมื่อสมดุล / เมื่อเสียสมดุล:</b> ${area.balance}</p><p class="area-advice"><b>วิธีบริหาร:</b> ${area.advice}</p>
      </article>`).join("")}</div>
    </section>`;
    $("#natal-reading").hidden = false;
  };

  const renderNatal = (natal) => {
    const moon = natal.positions.find((planet) => planet.key === "Moon");
    const ascName = Astro.signs[natal.ascSign].name;
    $("#natal-summary").innerHTML = `<section class="birth-summary-card">
      <div class="birth-type-badge"><small>บุคลิกจากวันเกิด</small><strong>${natal.personality.code}</strong></div>
      <div><span class="result-kicker">ข้อมูลวันเกิดช่วยเห็นตัวตนภายใน</span>
        <h2>${escapeHtml(typeNames[natal.personality.code])}</h2>
        <p>${escapeHtml(typeDescriptions[natal.personality.code])}</p>
        <div class="birth-meta"><span>${formatThaiDate(natal.date, { dateStyle: "long" })}</span><span>${escapeHtml(natal.timeText)}</span><span>${escapeHtml(natal.location.label)}</span></div>
      </div>
    </section>`;
    $("#natal-chart").innerHTML = "";
    $("#natal-details").innerHTML = `<details class="technical-details">
      <summary><span><b>ข้อมูลพื้นดวงที่ระบบใช้คำนวณ</b><small>ส่วนนี้มีไว้ตรวจสอบ ไม่จำเป็นต้องอ่านเพื่อเข้าใจผลบุคลิก</small></span></summary>
      <div class="technical-facts">
        <div><span>ลัคนา</span><b>${ascName} ${Astro.formatDegree(natal.ascDegree)}</b></div>
        <div><span>ดาวประจำวัน</span><b>${natal.weekdayPlanet.symbol} ${natal.weekdayPlanet.thai}</b></div>
        <div><span>จันทร์</span><b>${moon.signName} ${Astro.formatDegree(moon.degree)}</b></div>
        <div><span>ตำแหน่งเกิด</span><b>${escapeHtml(natal.location.quality)}</b></div>
      </div>
      <p class="method-note">คำนวณด้วยระบบนิรายนะลาหิรีและลัคนาแบบราศีจักร แต่การแสดงผลหลักเน้นบุคลิก จุดแข็ง จุดอ่อน และความเข้ากัน</p>
    </details>`;
    renderNatalReading(natal);
    ["#natal-summary", "#natal-details", "#natal-reading"].forEach((selector) => $(selector).hidden = false);
    $("#natal-chart").hidden = true;
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
      <div class="section-title match-title"><div><span class="result-kicker">ความเข้ากันของเบอร์กับตัวคุณ</span><h2>เบอร์นี้เป็นตัวคุณแค่ไหน?</h2>
      <p>เปรียบเทียบบุคลิกจากเบอร์ ${phoneProfile.code} กับบุคลิกจากวันเกิด ${natal.personality.code}</p></div></div>
      <div class="identity-match-row"><div><small>บุคลิกจากเบอร์</small><b>${phoneProfile.code}</b><span>${escapeHtml(typeNames[phoneProfile.code])}</span></div><i>⇄</i><div><small>ตัวตนจากวันเกิด</small><b>${natal.personality.code}</b><span>${escapeHtml(typeNames[natal.personality.code])}</span></div></div>
      <div class="match-score"><span>คะแนนความสอดคล้อง</span><strong>${score}%</strong><b>${label}</b></div>
      <div class="match-grid">${rows.map((row) => `<div class="match-row"><span>${escapeHtml(row.title)}</span><b class="${row.same ? "same" : "different"}">${row.phone} ${row.same ? "=" : "↔"} ${row.natal}</b></div>`).join("")}</div>
      <p class="match-summary">${score >= 72 ? "เมื่อใช้เบอร์นี้ บุคลิกที่แสดงออกจะใกล้กับตัวตนภายใน จึงสื่อสารและตัดสินใจได้ค่อนข้างเป็นธรรมชาติ" : "เบอร์นี้ผลักให้คุณแสดงบางด้านต่างจากนิสัยเดิม จึงช่วยเติมสิ่งที่ขาดได้ แต่ในวันที่เหนื่อยอาจรู้สึกว่าต้องฝืนตัวเอง"}</p>
      <div class="match-reading">
        <h3>เข้ากันอย่างไรในแต่ละด้าน</h3>
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
      status.innerHTML = `<span>ยังไม่มีข้อมูลวันเกิด</span><p>กลับไปแท็บ “เบอร์และบุคลิก” แล้วใส่วันเกิดก่อนดูดวงตามช่วงเวลา</p><button id="go-profile" class="secondary-button" type="button">ไปกรอกวันเกิด</button>`;
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

  const transitHouseEvents = {
    1: { title: "ตัวตนและการเริ่มต้น", good: "เหมาะกับการเสนอความคิด เริ่มเป้าหมายส่วนตัว เปลี่ยนภาพลักษณ์ หรือกลับมาจัดกิจวัตรให้ตัวเอง", watch: "อาจเจอความรีบ ความมั่นใจแกว่ง ความเหนื่อย หรือการปะทะเพราะต้องการตัดสินใจด้วยตัวเอง", advice: "เลือกเรื่องที่ต้องนำด้วยตัวเองหนึ่งเรื่องและเว้นเวลาพักก่อนตอบโต้" },
    2: { title: "เงินสด รายรับ และคุณค่าตัวเอง", good: "มีแนวโน้มได้รับเงิน ปิดการขาย ต่อรองค่าตอบแทน หรือเห็นทางจัดงบประมาณได้ชัดขึ้น", watch: "อาจมีรายจ่ายแทรก เงินเข้าช้า ของจำเป็นเสียหาย หรือกังวลเรื่องรายรับจนตัดสินใจเร็ว", advice: "ตรวจยอดจริง เงื่อนไข และวันครบกำหนดก่อนซื้อ ลงทุน หรือให้ยืม" },
    3: { title: "การสื่อสาร เอกสาร และเดินทางใกล้", good: "เหมาะกับการเจรจา ส่งงาน สมัคร ติดต่อ นัดหมาย เรียนระยะสั้น หรือเดินทางเพื่อปิดธุระ", watch: "มีโอกาสสื่อสารคลาดเคลื่อน เอกสารแก้หลายรอบ นัดเปลี่ยน หรือการเดินทางล่าช้า", advice: "ยืนยันสาระสำคัญเป็นลายลักษณ์อักษรและเผื่อเวลาเดินทาง" },
    4: { title: "บ้าน ครอบครัว และพื้นที่ส่วนตัว", good: "เหมาะกับการคุยเรื่องบ้าน จัดที่อยู่ ซ่อมแซม วางแผนครอบครัว หรือกลับไปสะสางเรื่องค้างใจ", watch: "อาจมีค่าใช้จ่ายในบ้าน ความเห็นต่างกับคนในครอบครัว หรือเรื่องส่วนตัวกระทบสมาธิงาน", advice: "แยกปัญหาความรู้สึกออกจากงานที่ต้องตัดสินใจและตกลงหน้าที่ให้ชัด" },
    5: { title: "ความรัก ความคิดสร้างสรรค์ และการแสดงออก", good: "เหมาะกับการนำเสนอผลงาน เริ่มโปรเจกต์สร้างสรรค์ นัดเดต ทำกิจกรรมกับเด็ก หรือทำสิ่งที่เพิ่มความมั่นใจ", watch: "อาจคาดหวังคำชื่นชมมากไป หลงกับความตื่นเต้น เสี่ยงเก็งกำไร หรือมีอารมณ์ในเรื่องรัก", advice: "สนุกได้แต่กำหนดงบและอย่าตัดสินสถานะความสัมพันธ์จากเหตุการณ์เดียว" },
    6: { title: "งานประจำ ทีม และสุขภาวะ", good: "เหมาะกับการเคลียร์งานค้าง ปรับขั้นตอน เริ่มวินัยสุขภาพ หรือแก้ปัญหาที่ต้องใช้ความละเอียด", watch: "งานจุกจิกเพิ่ม เพื่อนร่วมงานกดดัน ร่างกายล้า หรือกิจวัตรถูกรบกวน", advice: "จัดลำดับงาน ลดสิ่งไม่จำเป็น และหากมีอาการผิดปกติให้ใช้ข้อมูลทางการแพทย์" },
    7: { title: "คู่รัก หุ้นส่วน และข้อตกลง", good: "เหมาะกับการเปิดใจ เจรจาสัญญา วางแผนร่วม พบคนใหม่ หรือทำให้ความสัมพันธ์ที่ค้างคาชัดขึ้น", watch: "อาจมีการโต้เถียง ความคาดหวังไม่ตรง เงื่อนไขคลุมเครือ หรืออีกฝ่ายต้องการคำตอบเร็ว", advice: "ถามความต้องการจริงของทั้งสองฝ่ายและบันทึกข้อตกลงสำคัญ" },
    8: { title: "หนี้ สินทรัพย์ร่วม และการเปลี่ยนแปลง", good: "เหมาะกับการสะสางหนี้ ภาษี ประกัน มรดก เงินร่วม หรือปิดเรื่องเก่าที่กินพลัง", watch: "อาจมีรายจ่ายกะทันหัน ความลับถูกเปิด ความไว้ใจถูกทดสอบ หรือแผนต้องเปลี่ยนแบบไม่ทันตั้งตัว", advice: "สำรองเงิน ตรวจเอกสารสิทธิ์ และไม่กดดันตนเองให้ตัดสินใจขณะข้อมูลไม่ครบ" },
    9: { title: "การเรียน เดินทางไกล และเรื่องกฎเกณฑ์", good: "เหมาะกับการสมัครเรียน สอบ ขอคำปรึกษาผู้ใหญ่ วางแผนต่างประเทศ หรือติดต่อเรื่องกฎหมาย", watch: "อาจมีแผนเดินทางเลื่อน เอกสารเงื่อนไขเพิ่ม หรือขัดแย้งเพราะความเชื่อและมุมมอง", advice: "ตรวจข้อกำหนดจากแหล่งทางการและเว้นพื้นที่ให้ความเห็นต่าง" },
    10: { title: "งานใหญ่ ชื่อเสียง และผู้บังคับบัญชา", good: "มีโอกาสรับผิดชอบงานสำคัญ ถูกเห็นผลงาน สมัครตำแหน่งใหม่ หรือคุยทิศทางอาชีพ", watch: "อาจถูกจับตามอง รับแรงกดดันจากหัวหน้า เจอการเปลี่ยนบทบาท หรือมีประเด็นเรื่องชื่อเสียง", advice: "สื่อสารผลงานด้วยหลักฐานและอย่ารับขอบเขตงานที่ทรัพยากรไม่พอ" },
    11: { title: "รายได้จากงาน เครือข่าย และเป้าหมาย", good: "มีแนวโน้มได้ผู้ช่วย ลูกค้า โอกาสจากเพื่อน หรือเห็นผลตอบแทนจากสิ่งที่ทำต่อเนื่อง", watch: "อาจเจอคำสัญญาจากกลุ่มที่ไม่ชัด ผลประโยชน์ล่าช้า หรือรับกิจกรรมสังคมมากจนงานหลักเสีย", advice: "เลือกเครือข่ายจากการลงมือจริงและยืนยันส่วนแบ่งหรือกำหนดส่ง" },
    12: { title: "งานเบื้องหลัง การพัก และเรื่องที่ยังไม่เปิดเผย", good: "เหมาะกับการวางแผนเงียบ ๆ ปิดงานหลังบ้าน พักฟื้น ทบทวนใจ หรือเตรียมตัวก่อนเริ่มรอบใหม่", watch: "อาจมีค่าใช้จ่ายซ่อน ความกังวล นอนไม่พอ ข่าวไม่ครบ หรือเรื่องเก่ากลับมากวนใจ", advice: "พักให้พอ ตรวจข้อมูลซ้ำ และเลื่อนเรื่องเสี่ยงถ้ายังมีข้อสงสัยสำคัญ" }
  };

  const buildTransitEvents = (sample) => {
    const events = [];
    (sample.notes || []).forEach((note) => {
      const match = note.text.match(/ภพ\s*(\d+)/);
      if (!match) return;
      const house = Number(match[1]);
      const definition = transitHouseEvents[house];
      if (!definition || events.some((event) => event.house === house && event.tone === note.tone)) return;
      const tone = note.tone === "watch" ? "watch" : "good";
      events.push({ house, tone, title: definition.title, detail: definition[tone], reason: note.text, advice: definition.advice });
    });
    if (!events.length) {
      const tone = sample.score >= 60 ? "good" : sample.score < 50 ? "watch" : "neutral";
      events.push({ tone, title: "จังหวะทบทวนและจัดลำดับ", detail: tone === "good" ? "ภาพรวมเอื้อต่อการเดินหน้ากิจวัตร นัดหมาย และงานที่วางแผนไว้ โดยยังควรตรวจรายละเอียดตามปกติ" : tone === "watch" ? "เหตุการณ์อาจไม่รุนแรงแต่มีแรงต้านหลายเรื่องพร้อมกัน เช่น งานล่าช้า อารมณ์ล้า หรือแผนต้องปรับ" : "ยังไม่มีแรงดาวด้านใดเด่นเป็นพิเศษ เหมาะกับการทำเรื่องปกติและเก็บข้อมูลก่อนตัดสินใจใหญ่", reason: `คะแนนรวมของจุดเวลานี้อยู่ที่ ${sample.score}/100`, advice: "ใช้คะแนนเป็นสัญญาณเตรียมตัว ไม่ใช่การรับรองว่าเหตุการณ์จะเกิดแน่นอน" });
    }
    return events.slice(0, 5);
  };

  const renderTransitSamples = () => {
    if (!lastTransitRange) return;
    const shown = lastTransitRange.samples.slice(0, visibleSamples);
    $("#transit-samples").innerHTML = `<section class="content-card samples-card">
      <div class="section-title"><div><h2>เหตุการณ์ที่มีแนวโน้มในแต่ละจุดเวลา</h2><p>แสดง ${shown.length} จาก ${lastTransitRange.samples.length} จุด · เหตุการณ์เป็นแนวโน้มเพื่อใช้วางแผน ไม่ใช่สิ่งที่จะเกิดแน่นอน</p></div></div>
      <div class="sample-list">${shown.map((sample) => {
        const events = buildTransitEvents(sample);
        const label = sample.score >= 72 ? "แรงหนุนเด่น" : sample.score >= 58 ? "เดินหน้าได้" : sample.score >= 48 ? "ผสมทั้งหนุนและต้าน" : "ควรเผื่อความเสี่ยง";
        return `<article class="transit-event-card"><header><div><time>${formatThaiDate(sample.dateText)}</time><span>${label}</span></div><strong>${sample.score}<small>/100</small></strong></header>
          <div class="transit-event-list">${events.map((event) => `<section class="transit-event ${event.tone}"><div class="event-title"><span>${event.tone === "watch" ? "ควรระวัง" : event.tone === "good" ? "แรงหนุน" : "เป็นกลาง"}</span><h3>${escapeHtml(event.title)}</h3></div><p>${escapeHtml(event.detail)}</p><small><b>ที่มา:</b> ${escapeHtml(event.reason)}</small><p class="event-advice"><b>เตรียมตัว:</b> ${escapeHtml(event.advice)}</p></section>`).join("")}</div>
        </article>`;
      }).join("")}</div>
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
    const axisNames = ["พลังและพื้นที่ส่วนตัว", "วิธีมองข้อมูล", "วิธีตัดสินใจ", "แผนและความยืดหยุ่น"];
    const axisCards = relationshipAxisText.map((text, index) => {
      const same = typeA[index] === typeB[index];
      return `<article class="relationship-axis-card">
        <header><span>${typeA[index]} ${same ? "=" : "↔"} ${typeB[index]}</span><b>${axisNames[index]}</b></header>
        <p><strong>ข้อดี:</strong> ${same ? text.same : text.different}</p>
        <p><strong>จุดเสี่ยง:</strong> ${same ? text.riskSame : text.riskDifferent}</p>
        <p class="axis-manage"><strong>ข้อตกลงที่ช่วยได้:</strong> ${text.manage}</p>
      </article>`;
    }).join("");
    $("#compare-result").innerHTML = `<section class="relationship-hero">
      <div><span>A</span><b>${typeA}</b><small>${escapeHtml(typeNames[typeA])}</small></div>
      <div class="relationship-score"><strong>${result.score}%</strong><span>${result.label}</span></div>
      <div><span>B</span><b>${typeB}</b><small>${escapeHtml(typeNames[typeB])}</small></div>
    </section>
    <section class="relationship-intro"><p><b>${typeA}</b> ${escapeHtml(typeDescriptions[typeA])}</p><p><b>${typeB}</b> ${escapeHtml(typeDescriptions[typeB])}</p></section>
    <section class="content-card relationship-detail-card">
      <div class="section-title"><div><span class="result-kicker">อ่านทีละมิติ</span><h2>สองบุคลิกนี้จะเจอกันอย่างไร</h2><p>อธิบายทั้งแรงส่ง จุดสะดุด และข้อตกลงที่ควรมี</p></div></div>
      <div class="relationship-axis-grid">${axisCards}</div>
    </section>
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
        $("#profile-error").textContent = `วิเคราะห์ข้อมูลวันเกิดไม่ได้: ${error?.message || error}`;
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
      $("#transit-error").textContent = "กรุณาเพิ่มข้อมูลวันเกิดในแท็บเบอร์และบุคลิกก่อน";
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
