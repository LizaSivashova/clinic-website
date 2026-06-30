import { useNavigate } from 'react-router-dom';
import { THERAPIST } from '../config/content';
import AccessibilityBar from '../components/AccessibilityBar';

const UPDATED = '30 ביוני 2026';

const sectionTitle = {
  fontFamily: '"Heebo", sans-serif',
  fontWeight: 800,
  fontSize: 'clamp(20px,4vw,26px)',
  color: '#2c2823',
  margin: '0 0 14px',
};
const para = {
  fontSize: 'clamp(15px,2.5vw,17px)',
  lineHeight: 1.85,
  color: '#4a4138',
  margin: '0 0 14px',
};
const li = { fontSize: 'clamp(15px,2.5vw,17px)', lineHeight: 1.8, color: '#4a4138', marginBottom: 8 };

function Block({ title, children }) {
  return (
    <section style={{ marginBottom: 38 }}>
      <h2 style={sectionTitle}>{title}</h2>
      {children}
    </section>
  );
}

export default function AccessibilityStatement() {
  const navigate = useNavigate();

  return (
    <div
      dir="rtl"
      lang="he"
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(120% 80% at 80% -10%, #f7f0e2 0%, #f1e9da 45%, #ece2cf 100%)',
      }}
    >
      <main
        style={{
          maxWidth: 820,
          margin: '0 auto',
          padding: 'clamp(40px,8vw,80px) clamp(20px,5vw,40px)',
        }}
      >
        {/* Back link */}
        <button
          onClick={() => navigate('/')}
          className="cursor-pointer"
          style={{
            background: 'none',
            border: 'none',
            color: '#8a4a20',
            fontSize: 15,
            fontWeight: 600,
            fontFamily: '"Heebo", sans-serif',
            marginBottom: 28,
            padding: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span aria-hidden="true">→</span> חזרה לעמוד הבית
        </button>

        <h1
          style={{
            fontFamily: '"Suez One", "Heebo", serif',
            fontWeight: 500,
            fontSize: 'clamp(32px,7vw,52px)',
            color: '#2c2823',
            lineHeight: 1.15,
            margin: '0 0 10px',
          }}
        >
          הצהרת נגישות
        </h1>
        <p style={{ fontSize: 14, color: '#8a7a68', margin: '0 0 36px' }}>
          עודכן לאחרונה: {UPDATED}
        </p>

        <Block title="מחויבות לנגישות">
          <p style={para}>
            {THERAPIST.name}, עובדת סוציאלית קלינית, רואה חשיבות רבה במתן שירות שוויוני
            ונגיש לכלל הגולשים, לרבות אנשים עם מוגבלות. אנו פועלים ככל יכולתנו על מנת
            שאתר זה יהיה נגיש וניתן לשימוש בקלות ובנוחות עבור כולם.
          </p>
        </Block>

        <Block title="רמת הנגישות באתר">
          <p style={para}>
            האתר הונגש בהתאם להוראות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות
            לשירות), התשע״ג–2013, ועומד בדרישות התקן הישראלי הרשמי ת״י 5568 ברמת התאמה{' '}
            <strong>AA</strong>, המבוסס על הנחיות הנגישות לתכני אינטרנט{' '}
            <span style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>WCAG 2.0</span> של ארגון
            ה-<span style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>W3C</span>.
          </p>
        </Block>

        <Block title="אמצעי הנגישות באתר">
          <p style={para}>
            באתר מותקן סרגל נגישות הנפתח באמצעות הכפתור הקבוע בצד המסך. הסרגל מאפשר
            התאמות אישיות, וביניהן:
          </p>
          <ul style={{ paddingRight: 22, margin: '0 0 14px' }}>
            <li style={li}>הגדלת גודל הטקסט במספר רמות (עד פי 2).</li>
            <li style={li}>מצב ניגודיות גבוהה לשיפור הקריאוּת.</li>
            <li style={li}>תצוגת גווני אפור.</li>
            <li style={li}>הדגשת קישורים באמצעות קו תחתון.</li>
            <li style={li}>החלפה לגופן קריא יותר.</li>
            <li style={li}>עצירת אנימציות ותנועה באתר.</li>
          </ul>
          <p style={para}>
            בנוסף, האתר תוכנן לתמיכה בניווט מקלדת, כולל קישור ״דלג לתוכן הראשי״, מבנה
            כותרות היררכי, תיאורי טקסט חלופי לתמונות, ותאימות לתוכנות הקראת מסך. האתר
            מכבד גם את העדפת המערכת לצמצום תנועה (Reduced Motion).
          </p>
        </Block>

        <Block title="מגבלות ידועות">
          <p style={para}>
            על אף מאמצינו להנגיש את כלל הדפים והרכיבים באתר, ייתכן שיימצאו חלקים שטרם
            הונגשו במלואם, או תכנים של צד שלישי שאינם בשליטתנו המלאה. אנו ממשיכים לפעול
            לשיפור הנגישות באופן שוטף. אם נתקלת ברכיב שאינו נגיש, נשמח שתעדכנו אותנו
            ונפעל לתקנו בהקדם.
          </p>
        </Block>

        <Block title="פנייה בנושא נגישות">
          <p style={para}>
            אם נתקלת בבעיית נגישות באתר, או שיש לך הצעה לשיפור, נשמח לשמוע. ניתן לפנות
            אל רכזת הנגישות:
          </p>
          <div
            style={{
              background: 'rgba(58,90,64,.07)',
              border: '1px solid rgba(58,90,64,.15)',
              borderRadius: 16,
              padding: 'clamp(18px,4vw,24px)',
            }}
          >
            <p style={{ ...para, margin: '0 0 6px', fontWeight: 700, color: '#2c2823' }}>
              {THERAPIST.name}
            </p>
            <p style={{ ...para, margin: '0 0 4px' }}>
              טלפון:{' '}
              <a href={THERAPIST.phoneHref} style={{ color: '#3a5a40', fontWeight: 600, direction: 'ltr', unicodeBidi: 'isolate' }}>
                {THERAPIST.phone}
              </a>
            </p>
            <p style={{ ...para, margin: '0 0 4px' }}>
              דוא״ל:{' '}
              <a href={`mailto:${THERAPIST.email}`} style={{ color: '#3a5a40', fontWeight: 600, direction: 'ltr', unicodeBidi: 'isolate' }}>
                {THERAPIST.email}
              </a>
            </p>
            <p style={{ ...para, margin: 0 }}>כתובת: {THERAPIST.address}</p>
          </div>
          <p style={{ ...para, marginTop: 14, fontSize: 14.5, color: '#6b5d4f' }}>
            נשתדל לטפל בפנייתך ולתת מענה בהקדם האפשרי.
          </p>
        </Block>
      </main>
      <AccessibilityBar />
    </div>
  );
}
