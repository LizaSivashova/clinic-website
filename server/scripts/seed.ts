import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';

const here   = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(here, '../src/db/app.sqlite');
const db     = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    phone      TEXT NOT NULL,
    email      TEXT NOT NULL,
    topic      TEXT NOT NULL,
    message    TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const insert = db.prepare(
  `INSERT INTO submissions (name, phone, email, topic, message, created_at)
   VALUES (@name, @phone, @email, @topic, @message, @created_at)`
);

const ROWS = [
  { name: 'מיכל כהן',       phone: '052-1234567', email: 'michal.cohen@gmail.com',    topic: 'חרדה ולחץ',        message: 'אני מתמודדת עם חרדות חזקות בעבודה כבר כמה חודשים. קשה לי להירגע ואני מחפשת עזרה.',                          days: 1  },
  { name: 'דוד לוי',         phone: '054-9876543', email: 'david.levi@walla.co.il',    topic: 'דיכאון ועצב',      message: 'עברתי תקופה קשה לאחר פרידה וקשה לי לצאת מהבית. רוצה לנסות טיפול.',                                          days: 3  },
  { name: 'שרה אברהם',       phone: '050-5551234', email: 'sara.avraham@outlook.com',  topic: 'טיפול זוגי',       message: 'אני ובעלי מתקשים בתקשורת ורוצים לקבל כלים לחיזוק הקשר לפני שזה מחמיר.',                                    days: 5  },
  { name: 'יוסי מזרחי',      phone: '053-7778899', email: 'yossi.mizrahi@gmail.com',   topic: 'הדרכת הורים',      message: 'הבן שלי בן 14 ומאתגר מאוד. לא יודע איך לנהל את הגבולות בצורה שעובדת.',                                        days: 7  },
  { name: 'רחל גולדברג',     phone: '052-4445566', email: 'rachel.g@gmail.com',        topic: 'אבל ואובדן',       message: 'איבדתי את אמי לפני 3 חודשים ואני מתקשה מאוד להמשיך. אשמח לשמוע על התהליך.',                                  days: 10 },
  { name: 'אמיר שפירא',      phone: '054-3332211', email: 'amir.shapira@hotmail.com',  topic: 'חרדה ולחץ',        message: '',                                                                                                            days: 12 },
  { name: 'נועה ברקוביץ',    phone: '050-6667788', email: 'noa.b@gmail.com',           topic: 'נוער ומתבגרים',    message: 'הבת שלי בת 16 סובלת מחרדות חברתיות קשות. היא הסכימה לנסות טיפול ואני מחפשת מטפלת.',                          days: 15 },
  { name: 'עמית ישראלי',     phone: '053-2223344', email: 'amit.israeli@gmail.com',    topic: 'דיכאון ועצב',      message: 'עברתי שחיקה קשה בעבודה ואני מרגיש ריק. פנייה ראשונה, לא בטוח מה לצפות.',                                    days: 18 },
  { name: 'לילך פרידמן',     phone: '052-8889900', email: 'lilach.f@walla.co.il',      topic: 'אחר',              message: 'מחפשת מטפלת לאחר חוויה קשה בעבודה. רוצה לדעת יותר על הגישה שלך לפני שאחליט.',                               days: 20 },
  { name: 'רון כץ',           phone: '054-1112233', email: 'ron.katz@gmail.com',        topic: 'טיפול זוגי',       message: 'אנחנו זוג נשוי 8 שנים ומרגישים שאנחנו מדברים אחד על השני ולא אחד עם השני.',                                  days: 23 },
  { name: 'הילה סדן',         phone: '050-4445577', email: 'hila.sadan@gmail.com',      topic: 'חרדה ולחץ',        message: 'חרדות בלילה שמונעות ממני לישון. זה משפיע על כל תחומי החיים.',                                                days: 26 },
  { name: 'יעקב גרינברג',    phone: '053-9990011', email: 'yaakov.gr@outlook.com',     topic: 'הדרכת הורים',      message: '',                                                                                                            days: 30 },
  { name: 'מורן דהן',         phone: '052-7776655', email: 'moran.dahan@gmail.com',     topic: 'אבל ואובדן',       message: 'עברתי גירושין קשים לפני חצי שנה ועדיין מתמודד עם תחושות אובדן. מחפש תמיכה.',                                 days: 35 },
  { name: 'שיר לוינסון',     phone: '054-5554433', email: 'shir.l@gmail.com',          topic: 'נוער ומתבגרים',    message: 'אני בת 17 ומרגישה לחץ חזק מהלימודים. אמא שלי מציעה שאנסה טיפול.',                                           days: 40 },
  { name: 'אלון בן דוד',      phone: '050-1113355', email: 'alon.bd@gmail.com',         topic: 'דיכאון ועצב',      message: 'כבר שנה שאני לא מרגיש את עצמי. קשה לי לתאר את זה. אשמח לשיחת היכרות.',                                     days: 45 },
  { name: 'תמר רוזן',         phone: '053-6665544', email: 'tamar.rosen@walla.co.il',   topic: 'חרדה ולחץ',        message: 'חרדת ביצוע לפני מצגות ואירועים. זה מגביל אותי מקצועית.',                                                   days: 50 },
  { name: 'איתי גבע',         phone: '052-2224466', email: 'itay.geva@gmail.com',       topic: 'אחר',              message: 'עברתי תאונת דרכים לפני כמה חודשים. מאז אני חרד ומסרב לנהוג. רוצה לטפל בזה.',                              days: 55 },
  { name: 'ורד עוז',           phone: '054-8887766', email: 'vered.oz@gmail.com',        topic: 'טיפול זוגי',       message: '',                                                                                                            days: 60 },
  { name: 'גיל שמש',          phone: '050-3335599', email: 'gil.shemesh@outlook.com',   topic: 'הדרכת הורים',      message: 'ילד בן 9 עם קשיי קשב. מחפשים הכוונה כיצד לתמוך בו בבית.',                                                  days: 65 },
  { name: 'נטע אורן',         phone: '053-4443322', email: 'neta.oren@gmail.com',       topic: 'אבל ואובדן',       message: 'עברתי הפלה לפני חודשיים ואני עדיין לא מסוגלת להמשיך הלאה. צריכה מישהי לדבר איתה.', days: 72 },
];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(Math.floor(Math.random() * 13) + 8); // 08:00–20:00
  d.setMinutes(Math.floor(Math.random() * 60));
  return d.toISOString().replace('T', ' ').substring(0, 19);
}

const insertMany = db.transaction((rows: typeof ROWS) => {
  for (const r of rows) {
    insert.run({ ...r, created_at: daysAgo(r.days) });
  }
});

// Clear existing seed data and re-insert
db.exec('DELETE FROM submissions');
insertMany(ROWS);

console.log(`✓ Seeded ${ROWS.length} fake submissions into ${dbPath}`);
db.close();
