// ─────────────────────────────────────────────
// readings.js — Graded reading texts
// Each text is tagged with a lesson level.
// Tokens with grammar annotations are marked
// with { w, grammar, tip } objects.
// ─────────────────────────────────────────────

// ── GRAMMAR TAG COLOURS ───────────────────────
// Used to highlight word classes / patterns inline
const GRAMMAR_COLOURS = {
  pronoun:    { label: "Pronoun",          colour: "#7C3AED" },  // purple
  greeting:   { label: "Greeting",         colour: "#059669" },  // green
  tense:      { label: "Tense marker",     colour: "#DC2626" },  // red
  question:   { label: "Question word",    colour: "#D97706" },  // amber
  negation:   { label: "Negation",         colour: "#0369A1" },  // blue
  classifier: { label: "Classifier",       colour: "#0891B2" },  // cyan
  connector:  { label: "Connector",        colour: "#65A30D" },  // lime
  comparison: { label: "Comparison",       colour: "#C2410C" },  // orange
  modal:      { label: "Modal verb",       colour: "#7E22CE" },  // violet
  vocab:      { label: "New word",         colour: "#1D4ED8" },  // indigo
};

// ── READINGS ──────────────────────────────────
// Each reading:
//   id, title, level (lesson number), type, duration (mins to read),
//   sentences: array of sentence objects
//     Each sentence: { vn, en, tokens? }
//     tokens: array of { w (Vietnamese), grammar (key), tip (tooltip text) }
//             — only annotate key words, not every word

const READINGS = [

  // ════════════════════════════════════
  // LEVEL 1–2 — Absolute beginner
  // ════════════════════════════════════
  {
    id: "r01",
    title: "Xin chào!",
    subtitle: "A first meeting",
    type: "Conversation",
    level: 2,
    duration: 1,
    intro: "Two students meet their teacher for the first time.",
    sentences: [
      {
        vn: "Xin chào các bạn!",
        en: "Hello everyone!",
        tokens: [
          { w: "Xin chào", grammar: "greeting", tip: "Universal hello — safe in any situation" },
          { w: "các bạn", grammar: "pronoun", tip: "Plural 'you' among peers — các makes bạn plural" },
        ]
      },
      {
        vn: "Tôi là cô Hằng. Tôi là giáo viên tiếng Việt.",
        en: "I am Ms. Hằng. I am a Vietnamese teacher.",
        tokens: [
          { w: "Tôi", grammar: "pronoun", tip: "I/me — neutral and always safe" },
          { w: "cô", grammar: "pronoun", tip: "Used for a woman teacher or older woman. She uses it to refer to herself here." },
        ]
      },
      {
        vn: "Bạn tên là gì?",
        en: "What is your name?",
        tokens: [
          { w: "Bạn", grammar: "pronoun", tip: "You (peer/friend) — teacher is being friendly here" },
          { w: "gì", grammar: "question", tip: "What? — question words usually go at the END in Vietnamese" },
        ]
      },
      {
        vn: "Tôi tên là Lan. Rất vui được gặp cô!",
        en: "My name is Lan. Very nice to meet you, teacher!",
        tokens: [
          { w: "Rất vui được gặp", grammar: "greeting", tip: "Nice to meet you — literally: very happy to be able to meet" },
          { w: "cô", grammar: "pronoun", tip: "Here Lan uses 'cô' to address her female teacher respectfully" },
        ]
      },
      {
        vn: "Tôi tên là Minh. Tôi là người Việt Nam.",
        en: "My name is Minh. I am Vietnamese.",
        tokens: [
          { w: "người Việt Nam", grammar: "vocab", tip: "Nationality: người (person) + country name. người Hà Lan = Dutch person" },
        ]
      },
      {
        vn: "Rất vui được gặp các bạn! Chúng ta bắt đầu nhé!",
        en: "Very nice to meet you all! Let's begin!",
        tokens: [
          { w: "Chúng ta", grammar: "pronoun", tip: "We — INCLUSIVE, meaning the speaker includes the listeners. If she said chúng tôi, it would exclude the students." },
          { w: "nhé", grammar: "connector", tip: "A softener at the end of a suggestion — like 'shall we?' or 'okay?'" },
        ]
      },
    ],
    vocab: ["Xin chào", "tôi", "cô", "bạn", "tên là gì", "người Việt Nam", "rất vui được gặp"],
  },

  {
    id: "r02",
    title: "Tôi là ai?",
    subtitle: "Introductions",
    type: "Short story",
    level: 2,
    duration: 1,
    intro: "Lan introduces herself to the class.",
    sentences: [
      {
        vn: "Xin chào! Tôi tên là Lan.",
        en: "Hello! My name is Lan.",
        tokens: []
      },
      {
        vn: "Tôi là người Việt Nam. Tôi sống ở Hà Nội.",
        en: "I am Vietnamese. I live in Hanoi.",
        tokens: [
          { w: "sống ở", grammar: "vocab", tip: "To live in — sống = to live, ở = at/in (location)" },
        ]
      },
      {
        vn: "Tôi là giáo viên. Tôi thích cà phê và phở.",
        en: "I am a teacher. I like coffee and phở.",
        tokens: [
          { w: "thích", grammar: "modal", tip: "To like — thích + noun or verb. Tôi không thích = I don't like" },
          { w: "và", grammar: "connector", tip: "And — connects two nouns or clauses" },
        ]
      },
      {
        vn: "Tôi không thích sầu riêng. Sầu riêng có mùi rất nặng!",
        en: "I don't like durian. Durian has a very strong smell!",
        tokens: [
          { w: "không thích", grammar: "negation", tip: "Don't like — không before any verb negates it" },
          { w: "rất", grammar: "vocab", tip: "Very — intensifier before adjectives: rất ngon = very delicious" },
        ]
      },
      {
        vn: "Tôi sợ ma nhưng tôi không sợ chó.",
        en: "I'm scared of ghosts but I'm not scared of dogs.",
        tokens: [
          { w: "sợ", grammar: "modal", tip: "To fear/be scared of — Tôi sợ + noun" },
          { w: "nhưng", grammar: "connector", tip: "But — contrasts two clauses" },
          { w: "không sợ", grammar: "negation", tip: "Not scared of — không negates sợ" },
        ]
      },
    ],
    vocab: ["sống ở", "thích", "không thích", "và", "nhưng", "sợ"],
  },

  // ════════════════════════════════════
  // LEVEL 5–7 — Elementary
  // ════════════════════════════════════
  {
    id: "r03",
    title: "Gia đình Lan",
    subtitle: "Lan's family",
    type: "Short story",
    level: 7,
    duration: 2,
    intro: "Lan describes her family. Notice how Vietnamese uses different words for family members depending on age and gender.",
    sentences: [
      {
        vn: "Nhà tôi có năm người: bố, mẹ, anh trai, em gái và tôi.",
        en: "My household has five people: father, mother, elder brother, younger sister, and me.",
        tokens: [
          { w: "Nhà tôi", grammar: "vocab", tip: "My home/household — nhà = house, tôi = my" },
          { w: "năm người", grammar: "vocab", tip: "Five people — năm = 5, người = person/people" },
          { w: "anh trai", grammar: "pronoun", tip: "Elder brother — anh = elder male, trai = male. Compare: chị gái = elder sister" },
          { w: "em gái", grammar: "pronoun", tip: "Younger sister — em = younger, gái = female. Compare: em trai = younger brother" },
        ]
      },
      {
        vn: "Bố tôi là kỹ sư. Mẹ tôi là y tá.",
        en: "My father is an engineer. My mother is a nurse.",
        tokens: [
          { w: "Bố tôi", grammar: "pronoun", tip: "My father — bố is northern dialect. Southern dialect uses ba." },
          { w: "Mẹ tôi", grammar: "pronoun", tip: "My mother — mẹ is northern. Southern dialect uses má." },
        ]
      },
      {
        vn: "Anh trai tôi tên là Nam. Anh ấy là sinh viên.",
        en: "My elder brother's name is Nam. He is a university student.",
        tokens: [
          { w: "Anh ấy", grammar: "pronoun", tip: "He (third person) — anh ấy for a man older than the speaker, anh trai = elder brother" },
          { w: "sinh viên", grammar: "vocab", tip: "University student — học sinh = school student. Different words!" },
        ]
      },
      {
        vn: "Em gái tôi tên là Hoa. Cô ấy học lớp mười.",
        en: "My younger sister's name is Hoa. She is in year ten.",
        tokens: [
          { w: "Cô ấy", grammar: "pronoun", tip: "She — used for a woman. Here for the younger sister. Also: chị ấy for an older woman." },
        ]
      },
      {
        vn: "Chúng tôi sống ở Hà Nội. Tôi rất yêu gia đình tôi.",
        en: "We live in Hanoi. I love my family very much.",
        tokens: [
          { w: "Chúng tôi", grammar: "pronoun", tip: "We — EXCLUSIVE (not including the reader). Compare chúng ta = we including you." },
          { w: "rất yêu", grammar: "modal", tip: "Love very much — yêu = love (stronger than thích = like)" },
        ]
      },
    ],
    vocab: ["nhà tôi", "bố / mẹ", "anh trai / em gái", "anh ấy / cô ấy", "sinh viên", "chúng tôi"],
  },

  {
    id: "r04",
    title: "Hôm nay trời thế nào?",
    subtitle: "Weather and seasons",
    type: "Daily conversation",
    level: 12,
    duration: 2,
    intro: "Minh and his Dutch friend Wim talk about the weather. Vietnam has very different seasons from the Netherlands.",
    sentences: [
      {
        vn: "Wim: Trời hôm nay thế nào, Minh?",
        en: "Wim: What's the weather like today, Minh?",
        tokens: [
          { w: "Trời hôm nay thế nào", grammar: "question", tip: "What's the weather today? — thế nào = how/what like, a question word at the end" },
        ]
      },
      {
        vn: "Minh: Hôm nay trời nóng lắm! Hà Nội đang là mùa hè.",
        en: "Minh: Today it's very hot! Hanoi is in summer right now.",
        tokens: [
          { w: "lắm", grammar: "vocab", tip: "Very/a lot (placed AFTER adjective) — nóng lắm = very hot. Similar to quá: nóng quá = too hot!" },
          { w: "đang là", grammar: "tense", tip: "đang = present continuous marker — currently, right now" },
          { w: "mùa hè", grammar: "vocab", tip: "Summer — mùa = season. mùa xuân/hè/thu/đông = spring/summer/autumn/winter" },
        ]
      },
      {
        vn: "Wim: Ở Hà Lan, bây giờ là mùa thu. Trời lạnh và mưa nhiều.",
        en: "Wim: In the Netherlands, it's autumn now. It's cold and rains a lot.",
        tokens: [
          { w: "mùa thu", grammar: "vocab", tip: "Autumn/fall — mùa = season" },
          { w: "mưa nhiều", grammar: "vocab", tip: "Rains a lot — mưa = rain, nhiều = many/much/a lot" },
        ]
      },
      {
        vn: "Minh: Trời ơi! Lạnh quá! Anh có thích thời tiết lạnh không?",
        en: "Minh: Oh my! So cold! Do you like cold weather?",
        tokens: [
          { w: "Trời ơi", grammar: "greeting", tip: "Oh God!/Oh my! — used for any strong emotion: surprise, heat, delight, frustration" },
          { w: "quá", grammar: "vocab", tip: "Too/so (after adjective) — lạnh quá = so cold! More emphatic than lắm." },
          { w: "không", grammar: "question", tip: "Added to end of sentence to make a yes/no question — like a question tag" },
        ]
      },
      {
        vn: "Wim: Không nhiều lắm! Tôi thích mùa xuân hơn — ấm áp và đẹp.",
        en: "Wim: Not that much! I prefer spring — warm and beautiful.",
        tokens: [
          { w: "hơn", grammar: "comparison", tip: "More/prefer — thích A hơn = prefer A. A + adj + hơn B = A is more adj than B" },
          { w: "ấm áp", grammar: "vocab", tip: "Warm (weather) — two-syllable word where both parts mean warm. Common pattern in Vietnamese." },
        ]
      },
      {
        vn: "Minh: Ở Sài Gòn không có mùa đông. Chỉ có hai mùa: mùa mưa và mùa khô.",
        en: "Minh: In Saigon there is no winter. There are only two seasons: rainy season and dry season.",
        tokens: [
          { w: "không có", grammar: "negation", tip: "There is no / don't have — không + có (to have/exist)" },
          { w: "Chỉ có", grammar: "vocab", tip: "Only / there is only — chỉ = only, có = to have/exist" },
          { w: "mùa mưa / mùa khô", grammar: "vocab", tip: "Rainy season / dry season — Southern Vietnam's two seasons instead of four" },
        ]
      },
    ],
    vocab: ["thời tiết", "nóng / lạnh", "mùa hè / thu / đông / xuân", "mưa nhiều", "quá / lắm", "hơn", "không có"],
  },

  // ════════════════════════════════════
  // LEVEL 13–15 — Pre-intermediate
  // ════════════════════════════════════
  {
    id: "r05",
    title: "Đi chợ Bến Thành",
    subtitle: "Shopping at Bến Thành market",
    type: "Daily conversation",
    level: 15,
    duration: 3,
    intro: "Lan takes her friend to Bến Thành market in Ho Chi Minh City. Notice how Vietnamese handles numbers, classifiers, and bargaining.",
    sentences: [
      {
        vn: "Lan đưa bạn cô ấy đến chợ Bến Thành.",
        en: "Lan takes her friend to Bến Thành market.",
        tokens: [
          { w: "đưa … đến", grammar: "vocab", tip: "To take someone to a place — đưa = to take/bring, đến = to arrive/reach" },
          { w: "chợ", grammar: "vocab", tip: "Open-air market — compare: siêu thị = supermarket, cửa hàng = shop/store" },
        ]
      },
      {
        vn: "Bạn: Trời ơi, chợ này đông quá! Ở đây bán gì vậy?",
        en: "Friend: Oh my, this market is so busy! What do they sell here?",
        tokens: [
          { w: "đông", grammar: "vocab", tip: "Crowded/busy (of a place) — đông người = many people. Also: đông = east" },
          { w: "bán gì", grammar: "question", tip: "Sell what? — bán = to sell, gì = what (question word at end)" },
        ]
      },
      {
        vn: "Lan: Ở đây bán tất cả: quần áo, túi xách, đồ ăn, trái cây...",
        en: "Lan: They sell everything here: clothes, bags, food, fruit...",
        tokens: [
          { w: "tất cả", grammar: "vocab", tip: "Everything/all — a useful all-purpose word" },
          { w: "trái cây", grammar: "vocab", tip: "Fruit (Southern) — Northern Vietnamese says hoa quả. Both are correct." },
        ]
      },
      {
        vn: "Người bán: Cô ơi, mua gì không? Áo này đẹp lắm, chỉ hai trăm nghìn thôi!",
        en: "Vendor: Miss, want to buy something? This shirt is beautiful, only 200,000 dong!",
        tokens: [
          { w: "Cô ơi", grammar: "pronoun", tip: "Hey Miss! — ơi after a pronoun gets someone's attention politely" },
          { w: "chỉ … thôi", grammar: "vocab", tip: "Only … — chỉ = only (before), thôi = that's all (after). Used together for emphasis in selling." },
          { w: "hai trăm nghìn", grammar: "vocab", tip: "200,000 — Vietnamese prices in đồng. hai = 2, trăm = 100, nghìn = 1,000" },
        ]
      },
      {
        vn: "Bạn: Cái áo này bao nhiêu tiền?",
        en: "Friend: How much is this shirt?",
        tokens: [
          { w: "Cái", grammar: "classifier", tip: "Classifier for shirts, objects, furniture — cái áo = a/the shirt" },
          { w: "bao nhiêu tiền", grammar: "question", tip: "How much money? — bao nhiêu = how much/many (>10), tiền = money" },
        ]
      },
      {
        vn: "Người bán: Một trăm năm mươi nghìn đồng.",
        en: "Vendor: One hundred and fifty thousand dong.",
        tokens: [
          { w: "một trăm năm mươi nghìn", grammar: "vocab", tip: "150,000 — một = 1, trăm = 100, năm mươi = 50, nghìn = 1,000" },
        ]
      },
      {
        vn: "Bạn: Đắt quá! Bớt chút được không?",
        en: "Friend: Too expensive! Can you lower the price a bit?",
        tokens: [
          { w: "Đắt quá", grammar: "vocab", tip: "Too expensive! — đắt = expensive, quá = too/so much" },
          { w: "Bớt chút được không", grammar: "question", tip: "Can you reduce a little? — standard bargaining phrase in Vietnamese markets" },
        ]
      },
      {
        vn: "Người bán: Được, một trăm hai mươi nghìn — giá tốt nhất cho cô đó!",
        en: "Vendor: Okay, 120,000 — the best price for you!",
        tokens: [
          { w: "Được", grammar: "vocab", tip: "Okay/can/able — very versatile word: được? = okay? / can? được! = done! yes!" },
          { w: "tốt nhất", grammar: "comparison", tip: "The best — adj + nhất = superlative. tốt = good, tốt nhất = the best" },
        ]
      },
    ],
    vocab: ["chợ / siêu thị", "bán / mua", "bao nhiêu tiền", "đắt / rẻ", "bớt chút được không", "được", "classifier: cái"],
  },

  {
    id: "r06",
    title: "Hỏi đường",
    subtitle: "Asking for directions",
    type: "Daily conversation",
    level: 15,
    duration: 2,
    intro: "A tourist asks a local for directions in Hanoi. Directions in Vietnamese use very practical, landmark-based language.",
    sentences: [
      {
        vn: "Một người nước ngoài đang đứng ở góc phố Hoàn Kiếm.",
        en: "A foreigner is standing at a corner of Hoàn Kiếm street.",
        tokens: [
          { w: "người nước ngoài", grammar: "vocab", tip: "Foreigner — người = person, nước ngoài = foreign country (literally: outside country)" },
          { w: "đang đứng", grammar: "tense", tip: "đang = present continuous — is standing right now" },
        ]
      },
      {
        vn: "Anh ấy hỏi một người phụ nữ đi qua: \"Xin lỗi chị, hồ Hoàn Kiếm ở đâu ạ?\"",
        en: "He asks a woman passing by: \"Excuse me, where is Hoàn Kiếm Lake?\"",
        tokens: [
          { w: "Xin lỗi", grammar: "greeting", tip: "Excuse me / sorry — used to get someone's attention politely" },
          { w: "ở đâu", grammar: "question", tip: "Where? — ở = at/in, đâu = where. The question word goes at the END." },
          { w: "ạ", grammar: "vocab", tip: "Polite sentence-ending particle — adds respect, especially when speaking to elders or strangers" },
        ]
      },
      {
        vn: "Người phụ nữ: \"Anh đi thẳng khoảng hai trăm mét, rồi rẽ trái.\"",
        en: "The woman: \"Go straight about two hundred metres, then turn left.\"",
        tokens: [
          { w: "đi thẳng", grammar: "vocab", tip: "Go straight — thẳng = straight" },
          { w: "rồi rẽ trái", grammar: "vocab", tip: "Then turn left — rồi = then/after that, rẽ trái = turn left (rẽ phải = turn right)" },
        ]
      },
      {
        vn: "\"Hồ sẽ ở bên tay phải của anh. Không xa lắm, chỉ đi bộ năm phút thôi.\"",
        en: "\"The lake will be on your right side. Not very far, just five minutes on foot.\"",
        tokens: [
          { w: "bên tay phải", grammar: "vocab", tip: "On the right side — bên = side, tay = hand, phải = right. tay trái = left hand/side" },
          { w: "đi bộ", grammar: "vocab", tip: "To walk/go on foot — đi = go, bộ = on foot" },
          { w: "phút", grammar: "vocab", tip: "Minute — giờ = hour, phút = minute, giây = second" },
        ]
      },
      {
        vn: "Người nước ngoài: \"Cảm ơn chị rất nhiều! Chị có biết gần đây có quán cà phê không?\"",
        en: "Foreigner: \"Thank you so much! Do you know if there's a café nearby?\"",
        tokens: [
          { w: "Cảm ơn … rất nhiều", grammar: "greeting", tip: "Thank you very much — rất nhiều intensifies: very much/a lot" },
          { w: "gần đây", grammar: "vocab", tip: "Nearby — gần = near, đây = here" },
          { w: "quán cà phê", grammar: "vocab", tip: "Coffee shop — quán is the classifier for small eateries and cafés" },
        ]
      },
      {
        vn: "\"Có! Quán Cộng nổi tiếng lắm, ngay gần hồ. Anh không thể bỏ qua đâu!\"",
        en: "\"Yes! Cộng café is very famous, right near the lake. You can't miss it!\"",
        tokens: [
          { w: "nổi tiếng", grammar: "vocab", tip: "Famous/well-known — a very useful adjective" },
          { w: "ngay gần", grammar: "vocab", tip: "Right near/just next to — ngay adds immediacy to gần (near)" },
          { w: "không thể … đâu", grammar: "negation", tip: "Cannot possibly — không thể = cannot, đâu at end reinforces impossibility" },
        ]
      },
    ],
    vocab: ["ở đâu", "đi thẳng", "rẽ trái / rẽ phải", "đi bộ", "gần / xa", "gần đây", "bên tay phải / trái"],
  },

  // ════════════════════════════════════
  // LEVEL 19–23 — Intermediate
  // ════════════════════════════════════
  {
    id: "r07",
    title: "Một ngày ở Hà Nội",
    subtitle: "A day in Hanoi",
    type: "Short story",
    level: 19,
    duration: 3,
    intro: "Wim describes a typical day in Hanoi. Notice the tense markers and classifiers throughout.",
    sentences: [
      {
        vn: "Wim sống ở Hà Nội được tám tháng rồi.",
        en: "Wim has been living in Hanoi for eight months already.",
        tokens: [
          { w: "được … rồi", grammar: "tense", tip: "Have been doing for (duration) — X được [time] rồi = X has been [doing] for [time]. A key pattern!" },
          { w: "tháng", grammar: "vocab", tip: "Month — tuần = week, ngày = day, năm = year" },
        ]
      },
      {
        vn: "Mỗi sáng anh ấy thức dậy lúc sáu giờ và uống một ly cà phê trứng.",
        en: "Every morning he wakes up at six o'clock and drinks a glass of egg coffee.",
        tokens: [
          { w: "Mỗi sáng", grammar: "vocab", tip: "Every morning — mỗi = every. mỗi ngày = every day, mỗi tuần = every week" },
          { w: "lúc sáu giờ", grammar: "vocab", tip: "At six o'clock — lúc = at (a specific time). lúc + time" },
          { w: "một ly", grammar: "classifier", tip: "One glass — ly / cốc are classifiers for cups and glasses" },
          { w: "cà phê trứng", grammar: "vocab", tip: "Egg coffee — a Hanoi specialty. Whipped egg yolk cream on top of strong coffee." },
        ]
      },
      {
        vn: "Sau đó anh ấy đi làm bằng xe máy.",
        en: "After that he goes to work by motorbike.",
        tokens: [
          { w: "Sau đó", grammar: "connector", tip: "After that / then — a very useful connector for telling stories" },
          { w: "đi làm", grammar: "vocab", tip: "Go to work — đi = go, làm = work/do" },
          { w: "bằng xe máy", grammar: "vocab", tip: "By motorbike — bằng = by means of. bằng ô tô = by car, bằng xe buýt = by bus" },
        ]
      },
      {
        vn: "Buổi trưa anh ấy thường ăn một bát phở bò ở quán gần công ty.",
        en: "At noon he usually eats a bowl of beef phở at a shop near the office.",
        tokens: [
          { w: "thường", grammar: "vocab", tip: "Usually/often — a frequency adverb. hay = often (informal), luôn luôn = always" },
          { w: "một bát", grammar: "classifier", tip: "One bowl — bát = bowl (classifier for soup dishes)" },
          { w: "phở bò", grammar: "vocab", tip: "Beef phở — phở gà = chicken phở, phở tái = rare beef phở" },
          { w: "công ty", grammar: "vocab", tip: "Company/office — nơi làm việc = workplace (more general)" },
        ]
      },
      {
        vn: "Buổi tối anh ấy thường đi dạo quanh hồ Tây hoặc học tiếng Việt.",
        en: "In the evenings he usually takes a walk around West Lake or studies Vietnamese.",
        tokens: [
          { w: "đi dạo", grammar: "vocab", tip: "Take a stroll/walk — dạo = leisurely walk. Compare: đi bộ = walk (practical)" },
          { w: "quanh", grammar: "vocab", tip: "Around — đi quanh = walk around" },
          { w: "hoặc", grammar: "connector", tip: "Or (in statements) — hay = or (in questions). Hoặc … hoặc = either … or" },
        ]
      },
      {
        vn: "Anh ấy nói: \"Hà Nội ồn ào nhưng rất thú vị. Tôi yêu thành phố này.\"",
        en: "He says: \"Hanoi is noisy but very interesting. I love this city.\"",
        tokens: [
          { w: "ồn ào", grammar: "vocab", tip: "Noisy/loud — ồn = noisy. ồn ào is more emphatic, very noisy" },
          { w: "thú vị", grammar: "vocab", tip: "Interesting/fascinating — a very useful adjective" },
          { w: "thành phố này", grammar: "vocab", tip: "This city — này = this (near), kia/đó = that (far). Goes AFTER the noun." },
        ]
      },
    ],
    vocab: ["được … rồi", "mỗi", "lúc + time", "bằng", "thường", "sau đó", "hoặc", "ồn ào", "thú vị"],
  },

  {
    id: "r08",
    title: "Chuyện của Hà",
    subtitle: "Hà's story",
    type: "Short story",
    level: 23,
    duration: 3,
    intro: "A short story about Hà's morning, using the full range of tense markers. See how past, present, and future are expressed without changing the verb.",
    sentences: [
      {
        vn: "Sáng nay, Hà thức dậy lúc sáu giờ.",
        en: "This morning, Hà woke up at six o'clock.",
        tokens: [
          { w: "Sáng nay", grammar: "tense", tip: "This morning — establishes past time without any verb change. Vietnamese uses TIME WORDS, not verb conjugation." },
        ]
      },
      {
        vn: "Cô ấy đang nấu ăn trong bếp khi điện thoại reo.",
        en: "She was cooking in the kitchen when the phone rang.",
        tokens: [
          { w: "đang nấu ăn", grammar: "tense", tip: "Was cooking — đang = continuous. Here it shows she was mid-action when interrupted." },
          { w: "khi", grammar: "connector", tip: "When — khi + clause. khi nào = when? (question)" },
          { w: "reo", grammar: "vocab", tip: "Ring (of a phone or bell) — điện thoại reo = the phone rang/is ringing" },
        ]
      },
      {
        vn: "Cô ấy vừa mới pha cà phê xong thì nhớ ra chồng đã đi làm rồi.",
        en: "She had just finished making coffee when she remembered her husband had already left for work.",
        tokens: [
          { w: "vừa mới … xong", grammar: "tense", tip: "Had just finished — vừa/mới = just, xong = finished/done. Very recent past." },
          { w: "thì", grammar: "connector", tip: "Then/when — marks the moment something happens. Similar to khi but more abrupt." },
          { w: "nhớ ra", grammar: "vocab", tip: "Remembered / realised — nhớ = remember, ra adds 'coming to realisation'" },
          { w: "đã đi làm rồi", grammar: "tense", tip: "Had already gone to work — đã = past, rồi = already. Double confirmation of past." },
        ]
      },
      {
        vn: "Bây giờ, con trai của cô ấy đang ăn sáng và xem tivi.",
        en: "Now, her son is eating breakfast and watching TV.",
        tokens: [
          { w: "Bây giờ", grammar: "tense", tip: "Now/right now — contrasts with the past context above. Time word shifts tense." },
          { w: "đang ăn sáng", grammar: "tense", tip: "Is eating breakfast — đang = right now, in progress" },
          { w: "con trai", grammar: "pronoun", tip: "Son — con = child, trai = male. con gái = daughter" },
        ]
      },
      {
        vn: "Chiều nay, gia đình cô ấy sẽ đi siêu thị để mua đồ.",
        en: "This afternoon, her family will go to the supermarket to buy things.",
        tokens: [
          { w: "Chiều nay", grammar: "tense", tip: "This afternoon — future time word. No verb change needed." },
          { w: "sẽ đi", grammar: "tense", tip: "Will go — sẽ = future tense marker. Optional when context is clear, but makes it explicit." },
          { w: "để", grammar: "connector", tip: "In order to / so that — links purpose: đi siêu thị để mua đồ = go to supermarket to buy things" },
        ]
      },
      {
        vn: "Họ sắp có một chuyến du lịch vào cuối tuần.",
        en: "They are about to have a trip at the weekend.",
        tokens: [
          { w: "sắp", grammar: "tense", tip: "About to / very soon — near future. Stronger sense of imminence than sẽ." },
          { w: "chuyến du lịch", grammar: "vocab", tip: "A trip/journey — chuyến = a journey/trip (classifier for travel)" },
          { w: "cuối tuần", grammar: "vocab", tip: "Weekend — cuối = end, tuần = week. Don't confuse with cưới = wedding!" },
        ]
      },
      {
        vn: "Tối nay, cả gia đình sẽ ăn tối cùng nhau và nói chuyện về chuyến đi.",
        en: "Tonight, the whole family will eat dinner together and talk about the trip.",
        tokens: [
          { w: "cả gia đình", grammar: "vocab", tip: "The whole family — cả = entire/whole, before noun" },
          { w: "cùng nhau", grammar: "vocab", tip: "Together — cùng = together/with. chúng ta cùng đi = let's go together" },
          { w: "nói chuyện về", grammar: "vocab", tip: "Talk about — nói chuyện = have a conversation, về = about" },
        ]
      },
    ],
    vocab: ["đang", "vừa mới … xong", "đã … rồi", "sẽ", "sắp", "để", "cùng nhau", "cuối tuần"],
  },

  // ════════════════════════════════════
  // LEVEL 27–32 — Upper intermediate
  // ════════════════════════════════════
  {
    id: "r09",
    title: "Phở — Món ăn của Hà Nội",
    subtitle: "Phở — Hanoi's dish",
    type: "Article",
    level: 27,
    duration: 4,
    intro: "A short magazine-style article about phở. Real Vietnamese journalism uses all the tense markers, comparatives, and connectors you've learned.",
    sentences: [
      {
        vn: "Phở là một trong những món ăn nổi tiếng nhất của Việt Nam.",
        en: "Phở is one of the most famous dishes in Vietnam.",
        tokens: [
          { w: "một trong những", grammar: "vocab", tip: "One of the — a very common phrase. một trong những + noun + nhất = one of the most..." },
          { w: "nổi tiếng nhất", grammar: "comparison", tip: "The most famous — adj + nhất = superlative. nổi tiếng = famous" },
        ]
      },
      {
        vn: "Mỗi buổi sáng, hàng triệu người Việt Nam ăn một bát phở nóng để bắt đầu ngày mới.",
        en: "Every morning, millions of Vietnamese people eat a hot bowl of phở to start the new day.",
        tokens: [
          { w: "hàng triệu", grammar: "vocab", tip: "Millions — hàng = in the order of (large number), triệu = million" },
          { w: "một bát phở nóng", grammar: "classifier", tip: "A hot bowl of phở — bát = bowl (classifier). Adjective comes AFTER the noun in Vietnamese." },
          { w: "để bắt đầu", grammar: "connector", tip: "To start / in order to start — để + verb = in order to" },
        ]
      },
      {
        vn: "Phở bò có vị ngọt của xương bò và thơm của gừng và quế.",
        en: "Beef phở has the sweet taste of beef bone and the fragrance of ginger and cinnamon.",
        tokens: [
          { w: "có vị", grammar: "vocab", tip: "Has the taste/flavour of — vị = taste/flavour" },
          { w: "thơm", grammar: "vocab", tip: "Fragrant (of food) — a very positive word. Thơm quá! = It smells/tastes so good!" },
        ]
      },
      {
        vn: "Phở Hà Nội khác phở Sài Gòn: phở Hà Nội ít ngọt hơn và có ít loại rau hơn.",
        en: "Hanoi phở is different from Saigon phở: Hanoi phở is less sweet and has fewer types of herbs.",
        tokens: [
          { w: "khác", grammar: "vocab", tip: "Different from — giống = similar to. Khác nhau = different from each other." },
          { w: "ít … hơn", grammar: "comparison", tip: "Less than — ít = few/little + adj + hơn. ít ngọt hơn = less sweet than" },
          { w: "loại", grammar: "classifier", tip: "Type/kind — loại is a classifier for types and varieties" },
        ]
      },
      {
        vn: "Người Hà Nội thích ăn phở với quẩy, còn người Sài Gòn thường ăn với giá và rau thơm.",
        en: "Hanoi people like to eat phở with fried dough sticks, while Saigon people usually eat it with bean sprouts and fresh herbs.",
        tokens: [
          { w: "còn", grammar: "connector", tip: "While/whereas — used to contrast two things. Similar to nhưng (but) but softer." },
          { w: "giá", grammar: "vocab", tip: "Bean sprouts — a common Southern phở accompaniment" },
          { w: "rau thơm", grammar: "vocab", tip: "Fresh herbs — rau = vegetable/greens, thơm = fragrant" },
        ]
      },
      {
        vn: "Dù ăn theo kiểu nào, phở vẫn là biểu tượng ẩm thực của Việt Nam.",
        en: "No matter how it's eaten, phở remains a symbol of Vietnamese cuisine.",
        tokens: [
          { w: "Dù … vẫn", grammar: "connector", tip: "No matter / regardless — dù = even though/no matter, vẫn = still. A sophisticated connector." },
          { w: "biểu tượng", grammar: "vocab", tip: "Symbol/icon — a more literary/formal word" },
          { w: "ẩm thực", grammar: "vocab", tip: "Cuisine/culinary culture — ẩm = drink, thực = food. Used in formal/written contexts." },
        ]
      },
    ],
    vocab: ["một trong những … nhất", "ít … hơn", "khác", "còn", "dù … vẫn", "loại", "ẩm thực"],
  },

  {
    id: "r10",
    title: "Học tiếng Việt có khó không?",
    subtitle: "Is Vietnamese hard to learn?",
    type: "Article",
    level: 32,
    duration: 4,
    intro: "A conversational article written from a foreigner's perspective. This uses comparatives, the full tense system, and more complex connectors.",
    sentences: [
      {
        vn: "Nhiều người nói rằng tiếng Việt là một trong những ngôn ngữ khó nhất thế giới.",
        en: "Many people say that Vietnamese is one of the most difficult languages in the world.",
        tokens: [
          { w: "nói rằng", grammar: "connector", tip: "Say that — rằng introduces a reported clause, like 'that' in English" },
          { w: "khó nhất", grammar: "comparison", tip: "The most difficult — khó = difficult, khó nhất = the most difficult" },
        ]
      },
      {
        vn: "Nhưng thực ra, tiếng Việt có nhiều điểm dễ hơn tiếng Anh.",
        en: "But in fact, Vietnamese has many points that are easier than English.",
        tokens: [
          { w: "thực ra", grammar: "vocab", tip: "In fact/actually — a useful discourse marker for clarifying or surprising the listener" },
          { w: "dễ hơn", grammar: "comparison", tip: "Easier than — dễ = easy, hơn = more/than. dễ hơn tiếng Anh = easier than English" },
        ]
      },
      {
        vn: "Động từ tiếng Việt không chia theo thì. Bạn chỉ cần thêm một từ chỉ thời gian là xong.",
        en: "Vietnamese verbs are not conjugated by tense. You just need to add a time word and that's it.",
        tokens: [
          { w: "không chia theo thì", grammar: "tense", tip: "Not conjugated by tense — the biggest difference from European languages. đi = go, went, will go — always đi." },
          { w: "chỉ cần", grammar: "vocab", tip: "Just need to / only need to — chỉ = only, cần = need" },
          { w: "là xong", grammar: "vocab", tip: "And that's it / done — xong = finished. A satisfying sentence-ender." },
        ]
      },
      {
        vn: "Cái khó nhất là thanh điệu. Tiếng Việt có sáu thanh điệu khác nhau.",
        en: "The hardest part is the tones. Vietnamese has six different tones.",
        tokens: [
          { w: "Cái khó nhất", grammar: "comparison", tip: "The hardest thing — cái here nominalises the adjective: cái khó nhất = 'the difficult-est thing'" },
          { w: "thanh điệu", grammar: "vocab", tip: "Tone (in language) — thanh = sound/tone, điệu = melody/tune" },
          { w: "sáu thanh điệu khác nhau", grammar: "vocab", tip: "Six different tones — khác nhau = different from each other" },
        ]
      },
      {
        vn: "Một từ có thể có sáu nghĩa khác nhau tùy theo thanh điệu.",
        en: "One word can have six different meanings depending on the tone.",
        tokens: [
          { w: "có thể", grammar: "modal", tip: "Can/may/able to — a modal verb. Tôi có thể giúp anh = I can help you" },
          { w: "tùy theo", grammar: "connector", tip: "Depending on — tùy = depends, theo = according to/following" },
        ]
      },
      {
        vn: "Ví dụ, \"ma\" nghĩa là ma (ghost), nhưng \"má\" nghĩa là mẹ, và \"mã\" nghĩa là mã (code)!",
        en: "For example, \"ma\" means ghost, but \"má\" means mother, and \"mã\" means code!",
        tokens: [
          { w: "Ví dụ", grammar: "connector", tip: "For example — essential connector. ví dụ như = such as" },
          { w: "nghĩa là", grammar: "vocab", tip: "Means / is defined as — nghĩa = meaning. Cái này nghĩa là gì? = What does this mean?" },
        ]
      },
      {
        vn: "Tuy nhiên, sau sáu tháng học, bạn đã có thể nói chuyện đơn giản với người Việt Nam rồi.",
        en: "However, after six months of study, you can already have simple conversations with Vietnamese people.",
        tokens: [
          { w: "Tuy nhiên", grammar: "connector", tip: "However/nevertheless — a formal connector. Nhưng is more casual." },
          { w: "sau … học", grammar: "tense", tip: "After … of studying — sau = after, a time expression for elapsed duration" },
          { w: "đã có thể … rồi", grammar: "tense", tip: "Can already — đã = past/already, có thể = can, rồi = already done. Strong completion." },
        ]
      },
      {
        vn: "Quan trọng nhất là: đừng sợ nói sai! Người Việt Nam rất vui khi thấy người nước ngoài học tiếng của họ.",
        en: "The most important thing is: don't be afraid of making mistakes! Vietnamese people are very happy when they see foreigners learning their language.",
        tokens: [
          { w: "Quan trọng nhất", grammar: "comparison", tip: "Most important — quan trọng = important, nhất = most" },
          { w: "đừng sợ", grammar: "negation", tip: "Don't be afraid — đừng + verb = don't do (imperative). Your teacher Hằng says this all the time!" },
          { w: "khi thấy", grammar: "connector", tip: "When they see — khi = when, thấy = see/notice" },
          { w: "tiếng của họ", grammar: "vocab", tip: "Their language — tiếng = language/sound, của = of/belonging to, họ = they/them" },
        ]
      },
    ],
    vocab: ["thực ra", "chỉ cần", "có thể", "tùy theo", "nghĩa là", "tuy nhiên", "đừng sợ", "quan trọng nhất"],
  },
];
