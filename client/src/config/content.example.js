// Copy this file to content.js and fill in the real values.
// content.js is git-ignored — this example file is what gets committed.

// ─── Therapist identity ───────────────────────────────────────────────────────
export const THERAPIST = {
  name:          'שם המטפל/ת',
  initial:       'מ',
  navSubtitle:   'Clinical Social Worker · City',
  phone:         '050-0000000',
  phoneHref:     'tel:0500000000',
  email:         'therapist@example.com',
  address:       'רחוב, עיר',
  city:          'עיר',
  copyrightYear: '2026',
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
export const HERO = {
  badge:      'מקבלת פניות חדשות · פגישה ראשונה ללא התחייבות',
  tagline:    'טיפול רגשי',
  taglineEm:  'בגובה עיניים',
  subtitle:   'תיאור קצר של הגישה הטיפולית והמרחב שאתה מציע/ה.',
  pullQuote:  '״ציטוט מעורר השראה שמתאר את הגישה הטיפולית.״',
  stats: [
    { value: '+X',    label: 'שנות ניסיון' },
    { value: 'קהל',  label: 'פרטני וזוגי' },
    { value: 'שיטה', label: 'גישה טיפולית' },
  ],
};

// ─── About ────────────────────────────────────────────────────────────────────
export const ABOUT = {
  photoAlt:    'שם המטפל/ת — תואר מקצועי',
  badge:       'תואר מקצועי',
  badgeSub:    'התמחות · שיטה',
  heading:     'שמי [שם]',
  bio1:        'תיאור קצר של הרקע המקצועי.',
  bio2:        'תיאור מורחב של הגישה הטיפולית.',
  credentials: [
    'תואר — מוסד לימודים',
    'הסמכה נוספת',
    'מספר רישיון: XXXXX',
  ],
  tags: [
    { label: 'גישה אינטגרטיבית', bg: 'rgba(192,130,79,.12)', color: '#a86a3a' },
    { label: 'ליווי בין פגישות',  bg: 'rgba(58,90,64,.1)',   color: '#3a5a40' },
    { label: 'קצב אישי',          bg: 'rgba(192,130,79,.12)', color: '#a86a3a' },
  ],
};

// ─── Footer ───────────────────────────────────────────────────────────────────
export const FOOTER = {
  description: 'תיאור קצר של המטפל/ת והקליניקה לפוטר.',
};

// ─── Contact form ─────────────────────────────────────────────────────────────
export const CONTACT_TOPICS = [
  'חרדה ולחץ', 'דיכאון ועצב', 'הדרכת הורים',
  'טיפול זוגי', 'נוער ומתבגרים', 'אבל ואובדן', 'אחר',
];

// ─── Specialties ──────────────────────────────────────────────────────────────
export const SPECIALTIES = [
  { title: 'תחום טיפול 1', desc: 'תיאור תחום הטיפול.', icon: '❀', tint: 'rgba(192,130,79,.12)', color: '#a86a3a' },
  { title: 'תחום טיפול 2', desc: 'תיאור תחום הטיפול.', icon: '❋', tint: 'rgba(58,90,64,.1)',   color: '#3a5a40' },
  { title: 'תחום טיפול 3', desc: 'תיאור תחום הטיפול.', icon: '☼', tint: 'rgba(192,130,79,.12)', color: '#a86a3a' },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const TESTIMONIALS = [
  { quote: 'המלצה ראשונה של מטופל/ת.', initial: 'א', name: 'א., בן/בת XX', tag: 'נושא טיפול', tint: 'rgba(192,130,79,.16)', color: '#a86a3a', delay: 0   },
  { quote: 'המלצה שניה של מטופל/ת.',   initial: 'ב', name: 'ב. וג.',       tag: 'נושא טיפול', tint: 'rgba(58,90,64,.12)',   color: '#3a5a40', delay: 90  },
  { quote: 'המלצה שלישית של מטופל/ת.', initial: 'ד', name: 'ד., בן/בת XX', tag: 'נושא טיפול', tint: 'rgba(192,130,79,.16)', color: '#a86a3a', delay: 180 },
];
