// ─────────────────────────────────────────────
// data.js — all course content
// Edit this file to add / change words
// ─────────────────────────────────────────────

// ── LESSON PROFILES ──────────────────────────
// Describes what's unlocked at each lesson milestone.
// `maxLesson` is the ceiling — words/questions tagged <= that number are shown.
const LESSON_PROFILES = [
  { lessons: 1,  label: "Lesson 1",    desc: "First words: hello, goodbye, thank you",          maxLesson: 1  },
  { lessons: 2,  label: "Lessons 1–2", desc: "Greetings, names, nationalities, how are you",    maxLesson: 2  },
  { lessons: 5,  label: "Lessons 1–5", desc: "Basic intro, vowels, likes & dislikes, numbers",  maxLesson: 5  },
  { lessons: 7,  label: "Lessons 1–7", desc: "Consonant clusters CH, KH, NH, NG added",         maxLesson: 7  },
  { lessons: 10, label: "Lessons 1–10", desc: "NGH, PH, TR, QU, TH, GI clusters + days",       maxLesson: 10 },
  { lessons: 12, label: "Lessons 1–12", desc: "Family, time, weather, numbers to 1000",         maxLesson: 12 },
  { lessons: 15, label: "Lessons 1–15", desc: "Transport, directions, shopping, question words", maxLesson: 15 },
  { lessons: 19, label: "Lessons 1–19", desc: "Classifiers, ít/nhiều, locations",               maxLesson: 19 },
  { lessons: 23, label: "Lessons 1–23", desc: "Bao nhiêu/mấy, rooms, time expressions",         maxLesson: 23 },
  { lessons: 27, label: "Lessons 1–27", desc: "Tense system: đã/đang/sẽ/sắp/vừa",              maxLesson: 27 },
  { lessons: 32, label: "Lessons 1–32", desc: "Comparatives hơn/nhất/bằng, vừa…vừa, full deck", maxLesson: 32 },
];

// Each card gets a `lesson` tag — the lesson it was first introduced.
// This mirrors the actual course PDF sequence.
const DECKS = {
  "Greetings": [
    { v: "Xin chào!", e: "Hello! (for everyone)", n: "Most universal greeting — safe in any situation", lesson: 1 },
    { v: "Chào anh!", e: "Hello! (to an older man)", n: "Swap pronoun: chị = older woman, em = younger person", lesson: 1 },
    { v: "Cảm ơn.", e: "Thank you.", n: "", lesson: 1 },
    { v: "Tạm biệt!", e: "Goodbye!", n: "", lesson: 1 },
    { v: "Xin lỗi.", e: "Sorry / Excuse me.", n: "", lesson: 1 },
    { v: "Không sao.", e: "No problem / It's okay.", n: "", lesson: 1 },
    { v: "Anh khỏe không?", e: "How are you? (to older man)", n: "khỏe = healthy/well; adjust pronoun for context", lesson: 2 },
    { v: "Tôi khỏe. Cảm ơn anh.", e: "I'm well. Thank you.", n: "Standard reply to a well-being question", lesson: 2 },
    { v: "Rất vui được gặp anh.", e: "Nice to meet you.", n: "Adjust final pronoun to match the person", lesson: 2 },
    { v: "Bạn tên là gì?", e: "What is your name?", n: "Literally: friend name is what?", lesson: 2 },
    { v: "Tôi tên là ___.", e: "My name is ___.", n: "", lesson: 2 },
    { v: "Tôi là người Hà Lan.", e: "I am Dutch.", n: "Replace with your nationality", lesson: 2 },
    { v: "Tôi sống ở ___.", e: "I live in ___.", n: "", lesson: 2 },
    { v: "Hẹn gặp lại!", e: "See you again!", n: "hẹn = plan/appointment; gặp = meet", lesson: 2 },
    { v: "Cảm ơn rất nhiều.", e: "Thank you very much.", n: "", lesson: 2 },
    { v: "Hẹn gặp lại ngày mai.", e: "See you tomorrow.", n: "", lesson: 7 },
    { v: "Dạo này anh làm gì?", e: "What have you been up to lately?", n: "", lesson: 16 },
  ],
  "Pronouns": [
    { v: "tôi", e: "I / me (neutral, formal)", n: "Always safe to use", lesson: 1 },
    { v: "anh", e: "you/he — older male", n: "Also: older brother", lesson: 1 },
    { v: "chị", e: "you/she — older female", n: "Also: older sister", lesson: 1 },
    { v: "em", e: "you/I — younger person", n: "Also: younger sibling", lesson: 1 },
    { v: "bạn", e: "you / friend (peer)", n: "Literally means 'friend'", lesson: 2 },
    { v: "mình", e: "I / me (informal, friendly)", n: "Used among close friends", lesson: 5 },
    { v: "ông", e: "you/he — elderly man", n: "Also: grandfather", lesson: 5 },
    { v: "bà", e: "you/she — elderly woman", n: "Also: grandmother", lesson: 5 },
    { v: "cô", e: "she — young/mid woman, female teacher", n: "", lesson: 5 },
    { v: "thầy", e: "he — male teacher", n: "", lesson: 5 },
    { v: "họ", e: "they", n: "", lesson: 11 },
    { v: "cô ấy", e: "she (third person)", n: "", lesson: 11 },
    { v: "anh ấy", e: "he (third person)", n: "", lesson: 11 },
    { v: "chúng tôi", e: "we (NOT including listener)", n: "Exclusive 'we'", lesson: 17 },
    { v: "chúng ta", e: "we (INCLUDING listener)", n: "Inclusive 'we'", lesson: 17 },
  ],
  "Family": [
    { v: "Bố / Ba", e: "father", n: "Bố = Northern dialect; Ba = Southern", lesson: 11 },
    { v: "Mẹ / Má", e: "mother", n: "Mẹ = Northern; Má = Southern", lesson: 11 },
    { v: "Anh trai", e: "elder brother", n: "", lesson: 11 },
    { v: "Chị gái", e: "elder sister", n: "", lesson: 11 },
    { v: "Em trai", e: "younger brother", n: "", lesson: 11 },
    { v: "Em gái", e: "younger sister", n: "", lesson: 11 },
    { v: "Con trai / Con gái", e: "son / daughter", n: "", lesson: 11 },
    { v: "Vợ / Chồng", e: "wife / husband", n: "", lesson: 11 },
    { v: "Ông nội / Bà nội", e: "paternal grandfather / grandmother", n: "Father's side", lesson: 11 },
    { v: "Ông ngoại / Bà ngoại", e: "maternal grandfather / grandmother", n: "Mother's side", lesson: 11 },
    { v: "Cháu trai / Cháu gái", e: "grandson / granddaughter", n: "Also: nephew / niece", lesson: 11 },
    { v: "Anh rể / Em rể", e: "elder / younger brother-in-law", n: "Husband of elder / younger sister", lesson: 15 },
    { v: "Chị dâu / Em dâu", e: "elder / younger sister-in-law", n: "Wife of elder / younger brother", lesson: 15 },
  ],
  "Numbers": [
    { v: "không", e: "0", n: "", lesson: 2 },
    { v: "một", e: "1", n: "", lesson: 2 },
    { v: "hai", e: "2", n: "", lesson: 2 },
    { v: "ba", e: "3", n: "Also means 'father' in South!", lesson: 2 },
    { v: "bốn", e: "4", n: "", lesson: 2 },
    { v: "năm", e: "5", n: "Also means 'year' (năm)", lesson: 2 },
    { v: "sáu", e: "6", n: "", lesson: 2 },
    { v: "bảy", e: "7", n: "", lesson: 2 },
    { v: "tám", e: "8", n: "", lesson: 2 },
    { v: "chín", e: "9", n: "", lesson: 2 },
    { v: "mười", e: "10", n: "", lesson: 2 },
    { v: "mười một", e: "11", n: "", lesson: 6 },
    { v: "mười lăm", e: "15", n: "'lăm' not 'năm' in compounds", lesson: 6 },
    { v: "hai mươi", e: "20", n: "", lesson: 6 },
    { v: "hai mươi mốt", e: "21", n: "'mốt' for 1 in tens position", lesson: 6 },
    { v: "một trăm", e: "100", n: "", lesson: 12 },
    { v: "một trăm linh ba", e: "103", n: "'linh' or 'lẻ' for zero-tens", lesson: 12 },
  ],
  "Time": [
    { v: "Hôm nay", e: "today", n: "", lesson: 7 },
    { v: "Hôm qua", e: "yesterday", n: "", lesson: 7 },
    { v: "Ngày mai", e: "tomorrow", n: "", lesson: 7 },
    { v: "Sáng nay", e: "this morning", n: "", lesson: 7 },
    { v: "Chiều nay", e: "this afternoon", n: "", lesson: 7 },
    { v: "Tối nay", e: "this evening", n: "", lesson: 7 },
    { v: "Thứ hai", e: "Monday", n: "2nd day", lesson: 10 },
    { v: "Thứ ba", e: "Tuesday", n: "3rd day", lesson: 10 },
    { v: "Thứ tư", e: "Wednesday", n: "4th day", lesson: 10 },
    { v: "Thứ năm", e: "Thursday", n: "5th day", lesson: 10 },
    { v: "Thứ sáu", e: "Friday", n: "6th day", lesson: 10 },
    { v: "Thứ bảy", e: "Saturday", n: "7th day", lesson: 10 },
    { v: "Chủ nhật", e: "Sunday", n: "Lord's day — not numbered", lesson: 10 },
    { v: "7 giờ rưỡi", e: "7:30", n: "rưỡi = half", lesson: 12 },
    { v: "8 giờ kém 15", e: "7:45", n: "kém = minus", lesson: 12 },
    { v: "Ngày kia", e: "day after tomorrow", n: "", lesson: 12 },
    { v: "Đêm nay", e: "tonight", n: "", lesson: 12 },
    { v: "Tuần sau / tới", e: "next week", n: "Both forms are common", lesson: 12 },
    { v: "Tháng trước", e: "last month", n: "", lesson: 12 },
    { v: "Năm ngoái", e: "last year", n: "", lesson: 12 },
    { v: "Hàng ngày", e: "every day", n: "", lesson: 7 },
    { v: "Dạo này", e: "these days / lately", n: "", lesson: 16 },
    { v: "từ … đến …", e: "from … to … (time)", n: "Tôi học từ 4h đến 5h", lesson: 25 },
    { v: "Bao lâu?", e: "How long? (duration)", n: "Anh học tiếng Việt bao lâu rồi?", lesson: 25 },
  ],
  "Transport": [
    { v: "Xe máy", e: "motorbike", n: "", lesson: 4 },
    { v: "Xe đạp", e: "bicycle", n: "", lesson: 4 },
    { v: "Ô tô / xe hơi", e: "car", n: "", lesson: 4 },
    { v: "Đi bộ", e: "walk (on foot)", n: "", lesson: 5 },
    { v: "Xe buýt", e: "bus", n: "", lesson: 13 },
    { v: "Tắc xi", e: "taxi", n: "", lesson: 13 },
    { v: "Xe ôm", e: "motorbike taxi", n: "Rider sits behind a driver on their motorbike", lesson: 13 },
    { v: "Xích lô", e: "cyclo (pedicab)", n: "Traditional 3-wheeled bicycle taxi", lesson: 13 },
    { v: "Tắc đường", e: "traffic jam", n: "", lesson: 13 },
    { v: "Đúng giờ / Muộn", e: "on time / late", n: "", lesson: 13 },
    { v: "Rẽ trái / Rẽ phải", e: "turn left / turn right", n: "", lesson: 13 },
    { v: "Đi thẳng", e: "go straight", n: "", lesson: 13 },
    { v: "Xa / Gần", e: "far / near", n: "", lesson: 13 },
  ],
  "Food": [
    { v: "Cơm", e: "cooked rice", n: "≠ gạo = uncooked rice — different words!", lesson: 2 },
    { v: "Phở gà / Phở bò", e: "chicken phở / beef phở", n: "", lesson: 8 },
    { v: "Bánh mỳ", e: "bread / baguette", n: "", lesson: 5 },
    { v: "Rau", e: "vegetables", n: "", lesson: 5 },
    { v: "Cà phê", e: "coffee", n: "", lesson: 5 },
    { v: "Bia", e: "beer", n: "", lesson: 5 },
    { v: "Thịt gà", e: "chicken (meat)", n: "", lesson: 17 },
    { v: "Thịt bò", e: "beef", n: "", lesson: 17 },
    { v: "Thịt lợn / Thịt heo", e: "pork", n: "lợn = North; heo = South", lesson: 19 },
    { v: "Nước cam / Nước dừa", e: "orange juice / coconut water", n: "", lesson: 19 },
    { v: "Trà xanh / Trà đen", e: "green tea / black tea", n: "", lesson: 9 },
    { v: "Cay / Ngon / Thơm", e: "spicy / delicious / fragrant", n: "", lesson: 5 },
    { v: "No quá!", e: "I'm so full!", n: "", lesson: 3 },
    { v: "Đắt / Rẻ", e: "expensive / cheap", n: "", lesson: 14 },
  ],
  "Adjectives": [
    { v: "To / Nhỏ", e: "big / small", n: "", lesson: 3 },
    { v: "Nóng / Lạnh", e: "hot / cold", n: "", lesson: 3 },
    { v: "Khỏe", e: "healthy / well", n: "", lesson: 2 },
    { v: "Ngon", e: "delicious", n: "", lesson: 2 },
    { v: "Vui / Buồn", e: "happy / sad", n: "", lesson: 5 },
    { v: "Đẹp / Xấu", e: "beautiful / ugly", n: "", lesson: 5 },
    { v: "Mới / Cũ", e: "new / old", n: "", lesson: 5 },
    { v: "Mệt", e: "tired", n: "", lesson: 8 },
    { v: "Bận", e: "busy", n: "⚠️ NOT bạn = friend — one tone difference!", lesson: 16 },
    { v: "Giỏi", e: "skilled / talented", n: "", lesson: 10 },
    { v: "Cao / Thấp", e: "tall / short", n: "", lesson: 11 },
    { v: "Nhanh / Chậm", e: "fast / slow", n: "", lesson: 13 },
    { v: "Lười / Chăm chỉ", e: "lazy / hard-working", n: "", lesson: 23 },
    { v: "Thông minh", e: "smart / intelligent", n: "", lesson: 23 },
    { v: "Gầy / Béo", e: "thin / fat", n: "", lesson: 32 },
    { v: "Ấm áp / Mát mẻ", e: "warm / cool", n: "", lesson: 12 },
  ],
  "Classifiers": [
    { v: "một cái bàn", e: "one table", n: "cái = general objects, furniture, vehicles", lesson: 18 },
    { v: "ba con mèo", e: "three cats", n: "con = animals", lesson: 18 },
    { v: "năm quả cam", e: "five oranges", n: "quả / trái = round fruits", lesson: 18 },
    { v: "hai cây táo", e: "two apple trees", n: "cây = trees", lesson: 18 },
    { v: "một quyển sách", e: "one book", n: "quyển = books, notebooks, magazines", lesson: 18 },
    { v: "ba tờ báo", e: "three newspapers", n: "tờ = flat paper items", lesson: 18 },
    { v: "hai ngôi nhà", e: "two houses", n: "ngôi = buildings", lesson: 19 },
    { v: "một chiếc đồng hồ", e: "one watch", n: "chiếc = paired or individual items", lesson: 18 },
  ],
  "Phrases": [
    { v: "Đúng rồi!", e: "Correct! That's right!", n: "", lesson: 2 },
    { v: "Tuyệt vời!", e: "Excellent! Wonderful!", n: "", lesson: 2 },
    { v: "Hiểu không?", e: "Do you understand?", n: "", lesson: 7 },
    { v: "Không hiểu.", e: "I don't understand.", n: "", lesson: 7 },
    { v: "Đừng lo!", e: "Don't worry!", n: "Đừng = don't (imperative)", lesson: 3 },
    { v: "Đừng sợ nói sai!", e: "Don't be scared of making mistakes!", n: "From your teacher Hằng", lesson: 5 },
    { v: "Trời ơi! Nóng quá!", e: "Oh God, it's so hot!", n: "Trời ơi works for any strong emotion", lesson: 9 },
    { v: "Chúng ta cùng đi nhé!", e: "Let's go together!", n: "", lesson: 17 },
    { v: "Anh nhớ em.", e: "I miss you.", n: "nhớ = miss / remember", lesson: 7 },
    { v: "Anh yêu em.", e: "I love you.", n: "", lesson: 5 },
    { v: "Giỏi quá!", e: "Very good! Great job!", n: "", lesson: 10 },
  ],
  "Tense": [
    { v: "đang + verb", e: "present continuous (happening now)", n: "Tôi đang ăn = I am eating", lesson: 27 },
    { v: "sẽ + verb", e: "future tense", n: "Tôi sẽ đi = I will go", lesson: 27 },
    { v: "đã + verb", e: "past tense", n: "Tôi đã ăn = I ate / have eaten", lesson: 26 },
    { v: "sắp + verb", e: "about to happen (near future)", n: "Trời sắp mưa = It's about to rain", lesson: 27 },
    { v: "vừa/mới + verb", e: "just now (very recent past)", n: "Tôi vừa ăn xong = I just finished", lesson: 27 },
    { v: "verb + rồi", e: "already done", n: "Tôi ăn rồi = I already ate", lesson: 26 },
    { v: "chưa", e: "not yet", n: "Tôi chưa ăn = I haven't eaten yet", lesson: 26 },
  ],
  "Comparisons": [
    { v: "A + adj + hơn + B", e: "A is more ___ than B", n: "Việt Nam nóng hơn Hà Lan", lesson: 31 },
    { v: "A + adj + nhất", e: "A is the most ___", n: "Đây là món ngon nhất", lesson: 31 },
    { v: "A + bằng + B", e: "A is as ___ as B (equal)", n: "Tôi cao bằng anh", lesson: 30 },
    { v: "A + như + B", e: "A is like B", n: "Trời lạnh như băng = Cold as ice", lesson: 30 },
    { v: "vừa … vừa …", e: "both … and … (simultaneously)", n: "Cô ấy vừa xinh vừa giỏi", lesson: 32 },
    { v: "nhưng", e: "but (contrast)", n: "Đẹp nhưng đắt = Beautiful but expensive", lesson: 6 },
  ],
};

// ── FLATTEN for quiz / vocab ──────────────────
const ALL_VOCAB = [];
Object.entries(DECKS).forEach(([cat, words]) => {
  words.forEach(w => ALL_VOCAB.push({ ...w, cat }));
});

// ── GRAMMAR RULES ────────────────────────────
const GRAMMAR_SECTIONS = [
  {
    title: "⏱ Tense particles",
    rules: [
      { p: "đang + V",      ex: "Tôi <b>đang</b> ăn.", tr: "I am eating right now." },
      { p: "sẽ + V",        ex: "Tôi <b>sẽ</b> đi.", tr: "I will go." },
      { p: "sắp + V",       ex: "Trời <b>sắp</b> mưa.", tr: "It's about to rain." },
      { p: "đã + V",        ex: "Tôi <b>đã</b> ăn.", tr: "I ate / I have eaten." },
      { p: "vừa/mới + V",   ex: "Tôi <b>vừa</b> ăn xong.", tr: "I just finished eating." },
      { p: "V + rồi",       ex: "Tôi ăn <b>rồi</b>.", tr: "I already ate." },
      { p: "V + chưa?",     ex: "Anh ăn <b>chưa</b>?", tr: "Have you eaten yet?" },
      { p: "chưa + V",      ex: "Tôi <b>chưa</b> ăn.", tr: "I haven't eaten yet." },
    ]
  },
  {
    title: "❓ Questions",
    rules: [
      { p: "... không?",      ex: "Anh khỏe <b>không</b>?", tr: "Are you well? (yes/no)" },
      { p: "gì? — what",      ex: "Đây là cái <b>gì</b>?", tr: "What is this?" },
      { p: "ai? — who",       ex: "Đây là <b>ai</b>?", tr: "Who is this?" },
      { p: "ở đâu? — where",  ex: "Em ở <b>đâu</b>?", tr: "Where are you?" },
      { p: "khi nào? — when", ex: "<b>Khi nào</b> anh về?", tr: "When will you return?" },
      { p: "tại sao? — why",  ex: "<b>Tại sao</b> em không ăn?", tr: "Why don't you eat?" },
      { p: "bao nhiêu? — how much", ex: "Cái này <b>bao nhiêu</b>?", tr: "How much is this?" },
      { p: "thế nào? — how",  ex: "Em <b>thế nào</b>?", tr: "How are you?" },
    ]
  },
  {
    title: "🚫 Negation",
    rules: [
      { p: "không + V/adj",     ex: "Tôi <b>không</b> thích.", tr: "I don't like it." },
      { p: "không phải (là)",   ex: "Tôi <b>không phải là</b> bác sĩ.", tr: "I'm not a doctor." },
      { p: "chưa — not yet",    ex: "Tôi <b>chưa</b> ăn.", tr: "I haven't eaten yet." },
      { p: "không bao giờ",     ex: "Tôi <b>không bao giờ</b> hút thuốc.", tr: "I never smoke." },
      { p: "đừng + V — don't!", ex: "<b>Đừng</b> lo!", tr: "Don't worry!" },
    ]
  },
  {
    title: "📊 Comparisons",
    rules: [
      { p: "A + adj + hơn + B",  ex: "Việt Nam nóng <b>hơn</b> Hà Lan.", tr: "VN is hotter than NL." },
      { p: "A + adj + nhất",     ex: "Đây là món ngon <b>nhất</b>.", tr: "This is the most delicious." },
      { p: "A + bằng + B",       ex: "Tôi cao <b>bằng</b> anh.", tr: "I'm as tall as you." },
      { p: "A + như + B",        ex: "Trời lạnh <b>như</b> băng.", tr: "Cold as ice." },
      { p: "vừa … vừa …",        ex: "Cô ấy <b>vừa</b> xinh <b>vừa</b> giỏi.", tr: "Both beautiful and talented." },
    ]
  },
  {
    title: "❤️ Likes, wants, fear",
    rules: [
      { p: "thích + N/V",       ex: "Tôi <b>thích</b> phở.", tr: "I like phở." },
      { p: "yêu + N",           ex: "Tôi <b>yêu</b> Hà Nội.", tr: "I love Hanoi." },
      { p: "sợ + N",            ex: "Tôi <b>sợ</b> ma.", tr: "I'm scared of ghosts." },
      { p: "muốn + V",          ex: "Tôi <b>muốn</b> mua sách.", tr: "I want to buy a book." },
      { p: "phải + V — must",   ex: "Tôi <b>phải</b> đi ngủ.", tr: "I have to go to sleep." },
    ]
  },
  {
    title: "🔗 Connectors",
    rules: [
      { p: "và — and",          ex: "Tôi ăn cơm <b>và</b> uống trà.", tr: "" },
      { p: "nhưng — but",       ex: "Đẹp <b>nhưng</b> đắt.", tr: "Beautiful but expensive." },
      { p: "vì — because",      ex: "Ở nhà <b>vì</b> trời mưa.", tr: "Staying home because it rains." },
      { p: "để — in order to",  ex: "Mua sách <b>để</b> đọc.", tr: "Buy books to read." },
      { p: "hay — or (Q)",      ex: "Trà <b>hay</b> cà phê?", tr: "Tea or coffee?" },
      { p: "cũng — also / too", ex: "Tôi <b>cũng</b> khỏe.", tr: "I'm fine too." },
    ]
  },
];

// ── CONFUSABLE PAIRS ──────────────────────────
const CONFUSABLES = [
  { a: "bạn", ae: "friend", b: "bận", be: "busy",           note: "One tone mark — easy typo!" },
  { a: "gạo", ae: "uncooked rice", b: "cơm", be: "cooked rice", note: "Both translate as 'rice'" },
  { a: "ngủ", ae: "to sleep", b: "ngu", be: "stupid/silly",  note: "Tones really matter here" },
  { a: "cuối", ae: "end / last", b: "cưới", be: "wedding",   note: "Cuối tuần = weekend" },
  { a: "sắp", ae: "about to (future)", b: "vừa", be: "just now (past)", note: "Opposite time directions" },
  { a: "tiếng", ae: "language / hour", b: "giờ", be: "hour / o'clock", note: "12 tiếng bay = 12 hrs flying" },
  { a: "thịt lợn", ae: "pork (North)", b: "thịt heo", be: "pork (South)", note: "Dialect difference" },
  { a: "ngoại", ae: "maternal side", b: "ngoài", be: "outside",  note: "Context tells you which" },
];

// ── TONES ─────────────────────────────────────
const TONES = [
  { sym: "a",  name: "Ngang — level",       desc: "Mid, flat, steady. Like holding a musical note.", ex: "ba = father / 3",  color: "#1A2744" },
  { sym: "á",  name: "Sắc — rising",        desc: "Starts mid, rises sharply. Surprised upward pitch.", ex: "cá = fish",        color: "#C0392B" },
  { sym: "à",  name: "Huyền — falling",     desc: "Starts mid-high, falls gently and low.", ex: "bà = grandmother", color: "#7D3C98" },
  { sym: "ả",  name: "Hỏi — dipping",       desc: "Dips down then rises. Like a hesitant question.", ex: "bả = bait",        color: "#E67E22" },
  { sym: "ã",  name: "Ngã — creaky rising", desc: "Rises with a glottal creak halfway through.", ex: "bã = grounds",      color: "#148F77" },
  { sym: "ạ",  name: "Nặng — heavy",        desc: "Short, falls abruptly. The lowest and sharpest.", ex: "bạ = random",      color: "#2C3E50" },
];

const TONE_BA = [
  { word: "ba",  tone: "level →",    meaning: "father / 3" },
  { word: "bá",  tone: "rising ↗",   meaning: "lord" },
  { word: "bà",  tone: "falling ↘",  meaning: "grandmother" },
  { word: "bả",  tone: "dip ↙↗",    meaning: "bait" },
  { word: "bã",  tone: "creaky ↗~",  meaning: "grounds" },
  { word: "bạ",  tone: "heavy ↓",    meaning: "random" },
];

const TONE_SENTENCES = [
  { vn: "Ba ăn cá.",    en: "Dad eats fish.",               note: "flat · flat · falling" },
  { vn: "Bà ăn na.",    en: "Grandma eats custard apple.",  note: "falling · flat · flat" },
  { vn: "Bé ăn gà.",    en: "Kid eats chicken.",            note: "rising · flat · falling" },
  { vn: "Mẹ bế bé.",    en: "Mom carries baby.",            note: "falling · dip · rising" },
  { vn: "Bò ăn lá.",    en: "Cow eats leaves.",             note: "falling · flat · rising" },
  { vn: "Bé vẽ cô.",    en: "Kid draws teacher.",           note: "rising · dip · flat" },
];

// ── OPEN QUESTIONS ────────────────────────────
const OPEN_QUESTIONS = [
  {
    prompt: "You see your teacher in the hallway. How do you say hello to her?",
    hints: ["She is female and older than you", "Use the right pronoun for a female teacher"],
    model: "Chào cô! (or: Xin chào cô!) — 'Cô' is used for a female teacher or older woman.",
    tags: ["Greetings", "Pronouns"],
    lesson: 1,
  },
  {
    prompt: "Someone says 'Cảm ơn rất nhiều!' to you. What do you reply?",
    hints: ["They're thanking you", "The standard reply to thanks"],
    model: "Không sao! (No problem / You're welcome) or: Không có gì (it's nothing).",
    tags: ["Greetings"],
    lesson: 1,
  },
  {
    prompt: "You've just met your friend's mother (clearly older than you). How do you greet her and ask how she is?",
    hints: ["Use the correct pronoun for an elderly woman", "You refer to yourself as 'cháu' when talking to people much older"],
    model: "Xin chào bà! Bà khỏe không? — Hello! Are you well? (Use 'bà' for elderly woman; refer to yourself as 'cháu'.)",
    tags: ["Pronouns", "Greetings"],
    lesson: 2,
  },
  {
    prompt: "Introduce yourself: your name, nationality, and where you live.",
    hints: ["Tôi tên là...", "Tôi là người...", "Tôi sống ở..."],
    model: "Tôi tên là Wim. Tôi là người Hà Lan. Tôi sống ở Amsterdam.",
    tags: ["Greetings"],
    lesson: 2,
  },
  {
    prompt: "How do you say 'I like phở but I don't like spicy food'?",
    hints: ["thích = like", "không thích = don't like", "nhưng = but"],
    model: "Tôi thích phở nhưng tôi không thích đồ ăn cay.",
    tags: ["Food", "Phrases"],
    lesson: 5,
  },
  {
    prompt: "A shopkeeper asks: 'Bạn muốn mua gì?' — What does this mean, and how do you answer if you want three oranges?",
    hints: ["muốn = want", "mua = buy", "gì = what", "Don't forget the classifier for round fruits"],
    model: "It means: 'What do you want to buy?' Answer: Tôi muốn mua ba quả cam.",
    tags: ["Shopping", "Classifiers"],
    lesson: 6,
  },
  {
    prompt: "What day comes after Thứ sáu? And what comes before Thứ hai?",
    hints: ["Days are numbered 2–7", "Sunday is special — not numbered"],
    model: "After thứ sáu (Friday) comes thứ bảy (Saturday). Before thứ hai (Monday) is chủ nhật (Sunday).",
    tags: ["Time"],
    lesson: 10,
  },
  {
    prompt: "Explain the difference between 'chúng tôi' and 'chúng ta'. Give an example of each.",
    hints: ["Think about whether the listener is included"],
    model: "Chúng tôi = we, NOT including you. Chúng ta = we, INCLUDING you. E.g.: Chúng tôi đi Việt Nam (we're going, you're not). Chúng ta cùng đi nhé! (Let's go — you're included!)",
    tags: ["Pronouns"],
    lesson: 11,
  },
  {
    prompt: "Translate: 'Hôm qua tôi đã đi chợ và mua năm quả táo.'",
    hints: ["hôm qua = yesterday", "đã marks past tense", "chợ = market"],
    model: "Yesterday I went to the market and bought five apples. (đã = past; năm quả táo = five apples, quả is the classifier for round fruits.)",
    tags: ["Tense", "Classifiers"],
    lesson: 18,
  },
  {
    prompt: "Your teacher asks 'Anh học tiếng Việt được bao lâu rồi?' — what is she asking, and how do you answer for 8 months?",
    hints: ["bao lâu = how long", "được ... rồi = have been doing for..."],
    model: "She's asking: 'How long have you been studying Vietnamese?' Answer: Tôi học tiếng Việt được tám tháng rồi.",
    tags: ["Time", "Questions"],
    lesson: 23,
  },
  {
    prompt: "What's the difference between 'Tôi không ăn' and 'Tôi chưa ăn'?",
    hints: ["không = general negation", "chưa = not yet (implies you might later)"],
    model: "Tôi không ăn = I don't eat / I'm not eating (refusal or habit). Tôi chưa ăn = I haven't eaten yet (but probably will — the natural answer to 'Anh ăn chưa?')",
    tags: ["Negation", "Tense"],
    lesson: 26,
  },
  {
    prompt: "How would you say 'It's about to rain — oh my God, it's so cold!'?",
    hints: ["sắp = about to", "Trời ơi! = Oh my God!", "quá as suffix = so/too"],
    model: "Trời sắp mưa rồi! Trời ơi, lạnh quá!",
    tags: ["Tense", "Phrases"],
    lesson: 27,
  },
  {
    prompt: "How do you say 'She is both beautiful and talented, but she's lazy'?",
    hints: ["vừa...vừa... = both...and...", "nhưng = but", "lazy = lười"],
    model: "Cô ấy vừa đẹp vừa giỏi, nhưng cô ấy lười.",
    tags: ["Comparisons", "Adjectives"],
    lesson: 32,
  },
  {
    prompt: "You want to say 'Hanoi is hotter than Amsterdam, but Amsterdam is rainier in autumn.' How?",
    hints: ["hơn = more than", "mưa nhiều = rainy / rains a lot"],
    model: "Hà Nội nóng hơn Amsterdam, nhưng Amsterdam mưa nhiều hơn Hà Nội vào mùa thu.",
    tags: ["Comparisons", "Weather"],
    lesson: 31,
  },
  {
    prompt: "Describe your daily routine in Vietnamese — at least 4 sentences using past, present, and future tense.",
    hints: ["đã = past, đang = now, sẽ = future", "Include time expressions like sáng nay, tối nay"],
    model: "Sáng nay tôi đã uống cà phê lúc 7 giờ. Bây giờ tôi đang học tiếng Việt. Chiều nay tôi sẽ đi siêu thị. Tối nay tôi sẽ ăn tối với gia đình.",
    tags: ["Tense", "Daily life"],
    lesson: 27,
  },
];

// ── TARGETED DISTRACTORS ─────────────────────
//
// For each quiz-worthy Vietnamese term, we list 3 wrong answers
// chosen for a specific reason: same tone pattern, shared root,
// semantic neighbour, or a known student confusion.
// The `why` string is shown as a post-answer tip.
//
// Key = the Vietnamese string as it appears in DECKS (q.v)
// If a key is missing, app.js falls back to random pool picks.

const DISTRACTORS = {

  // ── GREETINGS ──
  "Xin chào!": [
    { v: "Tạm biệt!", why: "Xin chào = hello; Tạm biệt = goodbye — easy to confuse when nervous" },
    { v: "Xin lỗi.", why: "Both start with 'Xin' — but xin lỗi = sorry/excuse me" },
    { v: "Không sao.", why: "Không sao = no problem — a reply, not a greeting" },
  ],
  "Tạm biệt!": [
    { v: "Xin chào!", why: "Opposite: xin chào = hello" },
    { v: "Hẹn gặp lại!", why: "Hẹn gặp lại = see you again — often said together, but not the same" },
    { v: "Không sao.", why: "Không sao = no problem — completely different register" },
  ],
  "Hẹn gặp lại!": [
    { v: "Tạm biệt!", why: "Tạm biệt = goodbye — said at the same moment, but means 'farewell' not 'see you again'" },
    { v: "Rất vui được gặp anh.", why: "This is 'nice to meet you' — meeting, not parting" },
    { v: "Xin chào!", why: "Xin chào is the greeting, not the farewell" },
  ],
  "Cảm ơn rất nhiều.": [
    { v: "Xin lỗi.", why: "Xin lỗi = sorry — also a polite phrase but opposite in meaning" },
    { v: "Cảm ơn.", why: "Close! Cảm ơn alone = thank you; rất nhiều adds 'very much'" },
    { v: "Không sao.", why: "Không sao = no problem — the reply to an apology, not a thanks" },
  ],
  "Xin lỗi.": [
    { v: "Cảm ơn.", why: "Easy mix-up for beginners — cảm ơn = thank you, not sorry" },
    { v: "Xin chào!", why: "Both start with 'Xin' but very different meanings" },
    { v: "Không sao.", why: "Không sao is the reply ('no problem'), not the apology" },
  ],
  "Không sao.": [
    { v: "Xin lỗi.", why: "Xin lỗi is the apology; không sao is the response to it" },
    { v: "Hiểu không?", why: "Không appears in both — but hiểu không? = do you understand?" },
    { v: "Cảm ơn.", why: "Cảm ơn = thank you — a different polite exchange" },
  ],

  // ── PRONOUNS ──
  "tôi": [
    { v: "mình", why: "Mình also means 'I' but is informal/friendly — not interchangeable in formal contexts" },
    { v: "em", why: "Em can mean 'I' when you're the younger party, but carries a different social signal" },
    { v: "bạn", why: "Bạn = friend/you (peer) — looks like 'I' in translation but it's 'you'" },
  ],
  "anh": [
    { v: "chị", why: "Chị is the female equivalent — both = older sibling/you, but gender differs" },
    { v: "ông", why: "Ông is for elderly men — anh for men of similar or slightly older age" },
    { v: "em", why: "Em is the opposite direction: younger. Anh vs em is one of the most important contrasts" },
  ],
  "chị": [
    { v: "anh", why: "Anh is the male equivalent — same age group, opposite gender" },
    { v: "cô", why: "Cô can also refer to a woman, but usually younger/mid-aged — and is also 'aunt'" },
    { v: "bà", why: "Bà is for elderly women — chị is for women somewhat older than you" },
  ],
  "em": [
    { v: "anh", why: "Anh = older male — the exact opposite age direction" },
    { v: "bạn", why: "Bạn = peer/friend — em specifically signals you're younger" },
    { v: "mình", why: "Mình also = I (informal) but doesn't carry the 'I am younger' social meaning" },
  ],
  "chúng tôi": [
    { v: "chúng ta", why: "The classic confusion! Chúng ta includes the listener; chúng tôi excludes them" },
    { v: "họ", why: "Họ = they (third person) — chúng tôi is first person plural" },
    { v: "tôi", why: "Tôi = I (singular) — chúng tôi = we" },
  ],
  "chúng ta": [
    { v: "chúng tôi", why: "Chúng tôi = we WITHOUT you — chúng ta = we WITH you. Critical difference." },
    { v: "họ", why: "Họ = they — third person, not first person" },
    { v: "bạn", why: "Bạn = you/friend — singular, not plural" },
  ],

  // ── FAMILY ──
  "Anh trai": [
    { v: "Em trai", why: "Em trai = younger brother — anh/em is the elder/younger distinction" },
    { v: "Chị gái", why: "Chị gái = elder sister — same age direction, different gender" },
    { v: "Anh rể / Em rể", why: "Anh rể = brother-in-law — the extra word 'rể' marks marriage" },
  ],
  "Em trai": [
    { v: "Anh trai", why: "Anh trai = elder brother — same gender, opposite age direction" },
    { v: "Em gái", why: "Em gái = younger sister — same age direction, different gender" },
    { v: "Con trai", why: "Con trai = son — con marks the child relationship, em marks sibling" },
  ],
  "Chị gái": [
    { v: "Em gái", why: "Em gái = younger sister — chị vs em is the crucial elder/younger split" },
    { v: "Anh trai", why: "Anh trai = elder brother — same position but male" },
    { v: "Chị dâu / Em dâu", why: "Chị dâu = sister-in-law — 'dâu' marks marriage" },
  ],
  "Ông nội / Bà nội": [
    { v: "Ông ngoại / Bà ngoại", why: "Ngoại = maternal side (mother's parents); nội = paternal side (father's parents)" },
    { v: "Bố / Ba", why: "Bố = father — one generation up, not two" },
    { v: "Cháu trai / Cháu gái", why: "Cháu = grandchild — the opposite generation" },
  ],
  "Ông ngoại / Bà ngoại": [
    { v: "Ông nội / Bà nội", why: "Nội = paternal (father's side); ngoại = maternal (mother's side)" },
    { v: "Bố / Ba", why: "Father is one generation up, not grandparent level" },
    { v: "Anh trai", why: "Anh trai = elder brother — a sibling, not a grandparent" },
  ],
  "Vợ / Chồng": [
    { v: "Anh rể / Em rể", why: "Anh rể = brother-in-law — related by marriage but not the spouse" },
    { v: "Con trai / Con gái", why: "Con = child, not spouse" },
    { v: "Chị dâu / Em dâu", why: "Chị dâu = sister-in-law — another marriage relation but different" },
  ],

  // ── TIME & DAYS ──
  "Hôm nay": [
    { v: "Hôm qua", why: "Hôm qua = yesterday — just one tone/vowel different: nay vs qua" },
    { v: "Ngày mai", why: "Ngày mai = tomorrow — opposite direction in time" },
    { v: "Tuần sau / tới", why: "That's next week — hôm nay is specifically today" },
  ],
  "Hôm qua": [
    { v: "Hôm nay", why: "Hôm nay = today — very similar sound" },
    { v: "Ngày mai", why: "Ngày mai = tomorrow — two days in the wrong direction" },
    { v: "Năm ngoái", why: "Năm ngoái = last year — same past idea but very different scale" },
  ],
  "Ngày mai": [
    { v: "Hôm nay", why: "Hôm nay = today — one day off" },
    { v: "Ngày kia", why: "Ngày kia = the day after tomorrow — one day further" },
    { v: "Hôm qua", why: "Hôm qua = yesterday — opposite direction" },
  ],
  "Thứ hai": [
    { v: "Thứ ba", why: "Thứ ba = Tuesday — days are just numbers, so these are easy to muddle" },
    { v: "Chủ nhật", why: "Chủ nhật = Sunday — it's named differently (Lord's day), not numbered" },
    { v: "Thứ sáu", why: "Thứ sáu = Friday — also a number day, six vs two" },
  ],
  "Chủ nhật": [
    { v: "Thứ bảy", why: "Thứ bảy = Saturday — the day before; Sunday is not numbered like the weekdays" },
    { v: "Thứ hai", why: "Thứ hai = Monday — the first numbered day, not the weekend" },
    { v: "Thứ sáu", why: "Thứ sáu = Friday — end of the work week but not Sunday" },
  ],
  "Thứ năm": [
    { v: "Thứ tư", why: "Thứ tư = Wednesday — 4th vs 5th day" },
    { v: "Thứ sáu", why: "Thứ sáu = Friday — 5th vs 6th day" },
    { v: "Năm ngoái", why: "Năm = both 5 and year — thứ năm is Thursday, năm ngoái is last year" },
  ],

  // ── TRANSPORT ──
  "Xe máy": [
    { v: "Xe đạp", why: "Xe đạp = bicycle — pedal-powered, not motorised" },
    { v: "Xe ôm", why: "Xe ôm = motorbike taxi — it's also a motorbike, but you're a paying passenger" },
    { v: "Ô tô / xe hơi", why: "Ô tô = car — four wheels, not two" },
  ],
  "Xe ôm": [
    { v: "Xe máy", why: "Xe máy = motorbike (owned) — xe ôm is specifically the taxi service" },
    { v: "Tắc xi", why: "Tắc xi = car taxi — xe ôm uses a motorbike" },
    { v: "Xích lô", why: "Xích lô = cyclo (3 wheels, pedal-powered) — very different vehicle" },
  ],
  "Xích lô": [
    { v: "Xe ôm", why: "Xe ôm = motorbike taxi — xích lô is the old 3-wheeled pedicab" },
    { v: "Xe đạp", why: "Xe đạp = regular bicycle — xích lô carries a passenger in front" },
    { v: "Xe buýt", why: "Xe buýt = bus — also public transport but very different" },
  ],
  "Rẽ trái / Rẽ phải": [
    { v: "Đi thẳng", why: "Đi thẳng = go straight — no turning at all" },
    { v: "Tắc đường", why: "Tắc đường = traffic jam — a condition, not a direction instruction" },
    { v: "Xa / Gần", why: "Xa / gần = far / near — distance, not direction" },
  ],

  // ── FOOD ──
  "Cơm": [
    { v: "Gạo", why: "Gạo = uncooked/raw rice — cơm is cooked rice ready to eat. Different words!" },
    { v: "Bánh mỳ", why: "Bánh mỳ = bread — also a staple, but wheat not rice" },
    { v: "Phở gà / Phở bò", why: "Phở is noodle soup — not the same as a bowl of rice" },
  ],
  "Thịt gà": [
    { v: "Thịt bò", why: "Thịt bò = beef — same structure (thịt + animal), different animal" },
    { v: "Thịt lợn / Thịt heo", why: "That's pork — chicken/cow/pig are the three most confused meats" },
    { v: "Rau", why: "Rau = vegetables — not meat at all" },
  ],
  "Thịt bò": [
    { v: "Thịt gà", why: "Thịt gà = chicken — bò = cow, gà = chicken" },
    { v: "Thịt lợn / Thịt heo", why: "That's pork — all share the word thịt (meat)" },
    { v: "Phở gà / Phở bò", why: "Phở bò contains bò (beef) but phở is the whole dish, not just the meat" },
  ],
  "Cay / Ngon / Thơm": [
    { v: "Nóng / Lạnh", why: "Nóng/lạnh = hot/cold (temperature) — cay = spicy (flavour)" },
    { v: "Đắt / Rẻ", why: "Đắt/rẻ = expensive/cheap — about price, not taste" },
    { v: "To / Nhỏ", why: "To/nhỏ = big/small — about size, not flavour" },
  ],

  // ── ADJECTIVES ──
  "Khỏe": [
    { v: "Bận", why: "A common real-life confusion: 'I'm busy' vs 'I'm well' — both are how-are-you answers" },
    { v: "Mệt", why: "Mệt = tired — the opposite of feeling well" },
    { v: "Vui", why: "Vui = happy — a different positive state; khỏe is specifically healthy/well" },
  ],
  "Mệt": [
    { v: "Khỏe", why: "Khỏe = healthy/well — the opposite" },
    { v: "Bận", why: "Bận = busy — also explains why you can't do something, but means busy not tired" },
    { v: "Buồn", why: "Buồn = sad — an emotional state; mệt is physical fatigue" },
  ],
  "Bận": [
    { v: "Bạn", why: "The classic tone trap: bạn = friend, bận = busy — one mark difference" },
    { v: "Khỏe", why: "Khỏe = well/healthy — both answer 'how are you' but very differently" },
    { v: "Mệt", why: "Mệt = tired — also an excuse not to do things, but different reason" },
  ],
  "Vui / Buồn": [
    { v: "Khỏe", why: "Khỏe = healthy — a physical state; vui/buồn are emotional states" },
    { v: "Mệt", why: "Mệt = tired — physical, not emotional" },
    { v: "Nóng / Lạnh", why: "Nóng/lạnh = hot/cold — temperature, not mood" },
  ],
  "Giỏi": [
    { v: "Thông minh", why: "Thông minh = intelligent (a trait) — giỏi = skilled/talented (a result of effort)" },
    { v: "Tốt", why: "Tốt = good (general) — giỏi is specifically about ability" },
    { v: "Đẹp / Xấu", why: "Đẹp = beautiful — about appearance, not skill" },
  ],

  // ── TENSE CONFUSION QUESTIONS ──
  // These appear as fill-the-blank style via open questions, but
  // if pulled into MC quiz we give realistic tense-particle distractors
  "đang": [
    { v: "sẽ", why: "Sẽ = will (future) — đang = right now" },
    { v: "đã", why: "Đã = past tense — đang = present continuous" },
    { v: "sắp", why: "Sắp = about to (near future) — đang = currently happening" },
  ],

  // ── CLASSIFIERS ──
  "một cái bàn": [
    { v: "một chiếc bàn", why: "Chiếc is used for paired or individual items — cái is the standard for furniture" },
    { v: "một con bàn", why: "Con is for animals — never for furniture" },
    { v: "một quyển bàn", why: "Quyển is for books — the word bàn already signals a table" },
  ],
  "ba con mèo": [
    { v: "ba cái mèo", why: "Cái is for objects — living animals take con" },
    { v: "ba quả mèo", why: "Quả is for round fruits — an animal never takes quả" },
    { v: "ba ngôi mèo", why: "Ngôi is for buildings — completely wrong category" },
  ],
  "năm quả cam": [
    { v: "năm cái cam", why: "Cái is a general object classifier — round fruits specifically take quả" },
    { v: "năm cây cam", why: "Cây cam = orange tree — not the fruit itself" },
    { v: "năm con cam", why: "Con is for animals — oranges are never classified this way" },
  ],
  "một quyển sách": [
    { v: "một tờ sách", why: "Tờ is for flat single-sheet items like newspaper — books have many pages and take quyển" },
    { v: "một cái sách", why: "Cái can work informally but quyển is the correct and expected classifier for books" },
    { v: "một chiếc sách", why: "Chiếc is for paired individual items — not for books" },
  ],
  "ba tờ báo": [
    { v: "ba quyển báo", why: "Quyển is for thick multi-page books — a newspaper is flat and thin, so tờ" },
    { v: "ba cái báo", why: "Cái is general but tờ is the precise classifier for flat paper items" },
    { v: "ba chiếc báo", why: "Chiếc is for paired items — not for newspapers" },
  ],

  // ── PHRASES / EXPRESSIONS ──
  "Đừng lo!": [
    { v: "Không lo!", why: "Không negates a statement; đừng is the imperative 'don't' — subtle but important" },
    { v: "Đừng sợ nói sai!", why: "Also uses đừng, but means 'don't be scared of making mistakes' — different message" },
    { v: "Không sao.", why: "Không sao = no problem — reassuring, but it's a statement not a command" },
  ],
  "Hiểu không?": [
    { v: "Biết không?", why: "Biết = to know (a fact); hiểu = to understand. Biết không? = Do you know? Hiểu không? = Do you understand?" },
    { v: "Nghe không?", why: "Nghe = to hear/listen — Nghe không? = Can you hear? Hiểu không? = Do you understand?" },
    { v: "Nhớ không?", why: "Nhớ = to remember — Nhớ không? = Do you remember? Very different question" },
  ],
  "Anh nhớ em.": [
    { v: "Anh yêu em.", why: "Yêu = love; nhớ = miss. Both emotionally charged — but very different!" },
    { v: "Anh biết em.", why: "Biết = know (someone) — not missing them" },
    { v: "Anh gặp em.", why: "Gặp = meet — not missing, actually seeing them" },
  ],
  "Trời ơi! Nóng quá!": [
    { v: "Trời ơi! Lạnh quá!", why: "Lạnh = cold — same exclamation pattern but opposite temperature" },
    { v: "Trời ơi! Ngon quá!", why: "Ngon = delicious — same structure but about food, not weather" },
    { v: "Trời ơi! Đẹp quá!", why: "Đẹp = beautiful — same exclamation, different adjective" },
  ],

  // ── SHOPPING ──
  "Cái này bao nhiêu tiền?": [
    { v: "Có giảm giá không?", why: "That asks for a discount — this asks for the price" },
    { v: "Bạn có bán cái này không?", why: "That asks 'do you sell this?' — this asks 'how much?'" },
    { v: "Tôi muốn mua cái này.", why: "That's a statement of intent to buy — not asking the price" },
  ],
  "Có giảm giá không?": [
    { v: "Cái này bao nhiêu tiền?", why: "That asks the price — this asks specifically for a discount" },
    { v: "Đắt quá! Bớt chút được không?", why: "Very similar! But this is more direct: 'too expensive, can you lower it?'" },
    { v: "Tôi trả bằng thẻ nhé.", why: "That's about payment method — not about price negotiation" },
  ],
};

// ── VOCAB TABLE DATA ──────────────────────────
// [category, Vietnamese, English, Notes]
const VOCAB_TABLE = [
  ...Object.entries({
    "Greetings": [
      ["Xin chào!", "Hello (everyone)", "Most universal"],
      ["Chào anh / chị / em", "Hello (adj. for relationship)", ""],
      ["Bạn khỏe không?", "How are you?", ""],
      ["Tôi khỏe.", "I am well.", ""],
      ["Cảm ơn rất nhiều.", "Thank you very much.", ""],
      ["Xin lỗi.", "Sorry / Excuse me.", ""],
      ["Không sao.", "No problem.", ""],
      ["Hẹn gặp lại!", "See you again!", ""],
    ],
    "Family": [
      ["Bố / Ba", "Father", "North / South"],
      ["Mẹ / Má", "Mother", "North / South"],
      ["Anh trai / Chị gái", "Elder brother / sister", ""],
      ["Em trai / Em gái", "Younger brother / sister", ""],
      ["Ông nội / Bà nội", "Paternal grandparents", "Father's side"],
      ["Ông ngoại / Bà ngoại", "Maternal grandparents", "Mother's side"],
      ["Con trai / Con gái", "Son / Daughter", ""],
      ["Vợ / Chồng", "Wife / Husband", ""],
    ],
    "Time & Days": [
      ["Thứ hai – thứ bảy", "Monday – Saturday", "2nd to 7th day"],
      ["Chủ nhật", "Sunday", "Lord's day"],
      ["Hôm nay / Hôm qua / Ngày mai", "Today / Yesterday / Tomorrow", ""],
      ["7 giờ rưỡi", "7:30", "rưỡi = half"],
      ["8 giờ kém 15", "7:45", "kém = minus"],
      ["Tuần trước / sau", "Last / next week", ""],
      ["Năm ngoái / Năm sau", "Last / next year", ""],
      ["Hàng ngày", "Every day", ""],
    ],
    "Transport": [
      ["Xe máy / Xe đạp / Ô tô", "Motorbike / Bicycle / Car", ""],
      ["Xe buýt / Tắc xi", "Bus / Taxi", ""],
      ["Xe ôm", "Motorbike taxi", "Rider sits behind driver"],
      ["Xích lô", "Cyclo (pedicab)", "Traditional"],
      ["Tắc đường", "Traffic jam", ""],
      ["Rẽ trái / Rẽ phải", "Turn left / right", ""],
      ["Đi thẳng", "Go straight", ""],
      ["Xa / Gần", "Far / Near", ""],
    ],
    "Shopping": [
      ["Cái này bao nhiêu tiền?", "How much is this?", ""],
      ["Có giảm giá không?", "Is there a discount?", ""],
      ["Đắt quá! Bớt chút được không?", "Too expensive! Lower a bit?", ""],
      ["Tôi muốn mua cái này.", "I want to buy this.", ""],
      ["Tôi trả bằng thẻ nhé.", "I'll pay by card.", ""],
      ["Chợ / Siêu thị", "Market / Supermarket", ""],
      ["Tiền thừa", "Change (money back)", ""],
    ],
    "Food & Drink": [
      ["Phở gà / Phở bò", "Chicken / Beef phở", ""],
      ["Cơm", "Cooked rice", "≠ gạo = uncooked"],
      ["Thịt gà / Thịt bò", "Chicken / Beef", ""],
      ["Thịt lợn / Thịt heo", "Pork", "lợn=N; heo=S"],
      ["Nước cam / Nước dừa", "Orange juice / Coconut water", ""],
      ["Trà xanh / Cà phê", "Green tea / Coffee", ""],
      ["Cay / Ngon / Thơm", "Spicy / Delicious / Fragrant", ""],
      ["No quá!", "I'm so full!", ""],
    ],
    "Weather": [
      ["Trời nóng / Lạnh", "It's hot / cold", ""],
      ["Trời mưa / Nắng", "It rains / It's sunny", ""],
      ["Mùa xuân / Hè / Thu / Đông", "Spring / Summer / Autumn / Winter", ""],
      ["Mùa mưa / Mùa khô", "Rainy / Dry season", "South VN"],
      ["Ấm áp / Mát mẻ", "Warm / Cool", ""],
      ["Trời ơi!", "Oh God! (exclamation)", "Any strong emotion"],
    ],
    "Classifiers": [
      ["cái", "General objects", "cái bàn = a table"],
      ["con", "Animals", "con mèo = a cat"],
      ["quả / trái", "Round fruits", "quả cam = an orange"],
      ["cây", "Trees", "cây táo = apple tree"],
      ["quyển", "Books", "quyển sách = a book"],
      ["tờ", "Flat paper", "tờ báo = newspaper"],
      ["ngôi", "Buildings", "ngôi nhà = a house"],
      ["chiếc", "Paired items", "chiếc đồng hồ = watch"],
    ],
    "Colors": [
      ["Đỏ", "Red", ""],
      ["Xanh lá cây", "Green", "xanh alone can mean green or blue"],
      ["Xanh da trời", "Blue", "sky-blue"],
      ["Vàng", "Yellow", ""],
      ["Trắng / Đen", "White / Black", ""],
      ["Nâu", "Brown", ""],
      ["Tím", "Purple", ""],
      ["Hồng", "Pink", "hoa hồng = rose"],
    ],
  }).flatMap(([cat, rows]) => rows.map(r => [cat, ...r]))
];
