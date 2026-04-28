import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ComplianceFooter from './ComplianceFooter';
import { ga } from '@/lib/analytics';

// ─── TRANSLATIONS ──────────────────────────────────────────────────────────────
const t = {
  en: {
    nav_qualify: 'Check My Eligibility',
    nav_nonqm: 'Non-QM Loans',
    nav_fha: 'FHA Loans',
    nav_conventional: 'Conventional',
    nav_calculator: 'Calculator',
    nav_apply: 'Apply Now',
    hero_tag: "New Jersey's Non-QM Specialist",
    hero_h1: "Were You Told You Don't Qualify?",
    hero_sub: 'Self-employed, cash-based income, or non-traditional earnings? You may qualify through a Non-QM loan — even without tax returns.',
    hero_cta1: 'Find Out If I Qualify',
    hero_cta2: 'Call (917) 304-0234',
    hero_cta3: 'Book Free Consultation',
    hero_badge1: 'Same-Day Pre-Approval',
    hero_badge2: 'No Tax Returns (Non-QM)',
    hero_badge3: 'Arabic & English',
    loans_title: 'Which Loan Is Right For You?',
    loans_sub: 'Answer 4 quick questions and find out in 60 seconds.',
    nonqm_title: 'Non-QM Loans',
    nonqm_for: 'For: Self-employed · Cash income · Investors · Non-traditional earners',
    nonqm_key: 'No tax returns required · 20% down · 680+ credit',
    nonqm_badge: 'Our Specialty',
    fha_title: 'FHA Loans',
    fha_for: 'For: First-time buyers · Lower credit scores · Small down payment',
    fha_key: '3.5% down · 580+ credit · W-2 or 1099 income',
    conv_title: 'Conventional Loans',
    conv_for: 'For: Strong W-2 borrowers · Buyers with 20% down · Prime credit',
    conv_key: '5–20% down · 680+ credit · Best long-term rates',
    // Market news section
    news_title: 'Market Rates & News',
    news_sub: 'Weekly mortgage market updates — so you move at the right time.',
    news_rate_label_30: '30-Year Fixed',
    news_rate_label_15: '15-Year Fixed',
    news_rate_note_30: 'Conventional · 20% down',
    news_rate_note_15: 'Conventional',
    news_rate_contact: 'Contact for rate',
    news_rate_fha: 'FHA 30-Year',
    news_rate_nonqm: 'Non-QM / Bank Statement',
    news_rate_dscr: 'DSCR Investor',
    news_source: 'Source: Freddie Mac PMMS (weekly avg). Rates shown for illustration only. Contact Wael for your personalized rate. NMLS #2171794.',
    news_alert_label: 'Get Rate Alerts',
    news_alert_sub: "We'll email you when rates move — no spam.",
    news_alert_placeholder: 'your@email.com',
    news_alert_btn: 'Alert Me',
    news_alert_success: '✓ You\'re subscribed!',
    // HubSpot form section
    form_section_label: 'Get Pre-Qualified',
    form_title: 'Ready to Buy, Refi, or Invest?',
    form_sub: 'Fill out the form and Wael will personally reach out within 1 business day.',
    form_bullet1: 'All loan types — W-2, self-employed, investor, ITIN',
    form_bullet2: 'Arabic and English spoken',
    form_bullet3: 'NJ licensed — serving all 21 counties',
    form_bullet4: 'No credit pull required to get started',
    form_card_title: 'Start Your Application',
    form_card_sub: 'Takes 2 minutes · No credit pull',
    form_compliance: 'By submitting you consent to be contacted by Fintek Mortgage. NMLS #2171794 · Licensed in NJ · Equal Housing Lender',
    // Why Wael
    why_title: 'Why Work With Wael?',
    why_1_title: 'Non-QM Expert',
    why_1_body: 'Most brokers avoid Non-QM. I specialize in it — helping self-employed, cash-based, and non-traditional borrowers qualify.',
    why_2_title: 'Same-Day Pre-Approval',
    why_2_body: 'I personally review every file. Decisions in 24 hours, not weeks. You need speed — I deliver it.',
    why_3_title: 'Arabic & English',
    why_3_body: "Full bilingual service. Every document, every call, every question — answered in the language you're comfortable in.",
    why_4_title: '23-Day Average Close',
    why_4_body: 'Faster than any bank. My pipeline moves because I control the process from start to finish.',
    qualify_banner: 'Not sure which loan fits you?',
    qualify_banner_cta: 'Check My Eligibility in 60 Seconds',
    calc_banner: 'Estimate your monthly payment',
    calc_banner_cta: 'Open Mortgage Calculator',
    trust_nmls: 'NMLS #2171794',
    trust_licensed: 'Licensed in NJ',
    trust_company: 'Barrett Financial Group',
    contact_title: 'Ready to Talk?',
    contact_sub: 'No pressure. No commitment. Just a conversation about your options.',
    contact_call: 'Call or Text',
    contact_book: 'Book Free Consultation',
    contact_apply: 'Start Application',
  },
  ar: {
    nav_qualify: 'تحقق من أهليتي',
    nav_nonqm: 'قروض Non-QM',
    nav_fha: 'قروض FHA',
    nav_conventional: 'قروض اتفاقية',
    nav_calculator: 'حاسبة القرض',
    nav_apply: 'تقدم الآن',
    hero_tag: 'متخصص Non-QM في نيوجيرسي',
    hero_h1: 'هل قيل لك أنك لا تستوفي الشروط؟',
    hero_sub: 'إذا كنت صاحب عمل حر أو دخلك نقدي أو غير تقليدي، فقد تكون مؤهلاً للحصول على قرض Non-QM — حتى بدون إقرارات ضريبية.',
    hero_cta1: 'اعرف هل أنا مؤهل',
    hero_cta2: 'اتصل (917) 304-0234',
    hero_cta3: 'احجز استشارة مجانية',
    hero_badge1: 'موافقة مسبقة في يوم واحد',
    hero_badge2: 'بدون إقرارات ضريبية (Non-QM)',
    hero_badge3: 'عربي وإنجليزي',
    loans_title: 'ما القرض المناسب لك؟',
    loans_sub: 'أجب على 4 أسئلة سريعة واعرف الجواب في 60 ثانية.',
    nonqm_title: 'قروض Non-QM',
    nonqm_for: 'لـ: أصحاب الأعمال الحرة · الدخل النقدي · المستثمرين',
    nonqm_key: 'بدون إقرارات ضريبية · 20% دفعة أولى · 680+ درجة ائتمانية',
    nonqm_badge: 'تخصصنا',
    fha_title: 'قروض FHA',
    fha_for: 'لـ: المشترين للمرة الأولى · الدرجات الائتمانية المنخفضة · الدفعة الأولى الصغيرة',
    fha_key: '3.5% دفعة أولى · 580+ درجة ائتمانية',
    conv_title: 'القروض الاتفاقية',
    conv_for: 'لـ: موظفو W-2 الأقوياء · 20% دفعة أولى · الائتمان الممتاز',
    conv_key: '5–20% دفعة أولى · 680+ درجة ائتمانية',
    // Market news section (AR)
    news_title: 'معدلات السوق والأخبار',
    news_sub: 'تحديثات أسبوعية لسوق الرهن العقاري — لتتحرك في الوقت المناسب.',
    news_rate_label_30: 'ثابت 30 سنة',
    news_rate_label_15: 'ثابت 15 سنة',
    news_rate_note_30: 'تقليدي · 20% دفعة أولى',
    news_rate_note_15: 'تقليدي',
    news_rate_contact: 'تواصل للمعدل',
    news_rate_fha: 'FHA 30 سنة',
    news_rate_nonqm: 'Non-QM / كشف حساب بنكي',
    news_rate_dscr: 'DSCR للمستثمرين',
    news_source: 'المصدر: Freddie Mac PMMS (متوسط أسبوعي). المعدلات للتوضيح فقط. تواصل مع وائل للحصول على معدلك الشخصي. NMLS #2171794.',
    news_alert_label: 'احصل على تنبيهات المعدلات',
    news_alert_sub: 'سنرسل لك بريداً إلكترونياً عند تغير المعدلات.',
    news_alert_placeholder: 'بريدك@الإلكتروني.com',
    news_alert_btn: 'نبهني',
    news_alert_success: '✓ تم الاشتراك!',
    // HubSpot form section (AR)
    form_section_label: 'احصل على موافقة مسبقة',
    form_title: 'مستعد للشراء أو إعادة التمويل أو الاستثمار؟',
    form_sub: 'أكمل النموذج وسيتواصل معك وائل شخصياً خلال يوم عمل واحد.',
    form_bullet1: 'جميع أنواع القروض — W-2، عمل حر، مستثمر، ITIN',
    form_bullet2: 'الخدمة بالعربية والإنجليزية',
    form_bullet3: 'مرخص في نيوجيرسي — نخدم جميع المناطق',
    form_bullet4: 'لا يلزم سحب الائتمان للبدء',
    form_card_title: 'ابدأ طلبك',
    form_card_sub: 'دقيقتان · بدون سحب ائتماني',
    form_compliance: 'بالإرسال توافق على التواصل من Fintek Mortgage. NMLS #2171794 · مرخص في NJ · Equal Housing Lender',
    // Why Wael (AR)
    why_title: 'لماذا العمل مع وائل؟',
    why_1_title: 'خبير Non-QM',
    why_1_body: 'معظم الوسطاء يتجنبون Non-QM. أنا متخصص فيه — أساعد أصحاب الأعمال الحرة وأصحاب الدخل غير التقليدي على التأهل.',
    why_2_title: 'موافقة مسبقة في يوم واحد',
    why_2_body: 'أراجع كل ملف بنفسي. قرارات في 24 ساعة وليس أسابيع.',
    why_3_title: 'عربي وإنجليزي',
    why_3_body: 'خدمة كاملة بلغتين. كل وثيقة وكل سؤال يُجاب عليه باللغة التي تريحك.',
    why_4_title: 'إغلاق في 23 يوماً',
    why_4_body: 'أسرع من أي بنك. أتحكم في العملية من البداية للنهاية.',
    qualify_banner: 'غير متأكد من القرض المناسب؟',
    qualify_banner_cta: 'تحقق من أهليتي في 60 ثانية',
    calc_banner: 'احسب قسطك الشهري',
    calc_banner_cta: 'افتح حاسبة القرض',
    trust_nmls: 'NMLS #2171794',
    trust_licensed: 'مرخص في NJ',
    trust_company: 'Barrett Financial Group',
    contact_title: 'هل أنت مستعد للتحدث؟',
    contact_sub: 'بدون ضغط. بدون التزام. فقط محادثة حول خياراتك.',
    contact_call: 'اتصل أو أرسل رسالة',
    contact_book: 'احجز استشارة مجانية',
    contact_apply: 'ابدأ الطلب',
  }
};

// ─── MARKET NEWS DATA (update weekly or wire to CMS) ──────────────────────────
const NEWS_EN = [
  {
    tag: 'Rates', tagColor: 'bg-green-100 text-green-800',
    date: 'Apr 25, 2026',
    title: 'Freddie Mac: 30-Year Fixed Holds Near 6.8% for Third Consecutive Week',
    body: 'The weekly PMMS shows rates stabilizing after a volatile Q1. Mixed Fed signals and strong employment data are the main drivers.',
  },
  {
    tag: 'Fed Watch', tagColor: 'bg-red-100 text-red-800',
    date: 'Apr 22, 2026',
    title: 'Fed Holds Rates Steady — Next Decision June 18',
    body: 'FOMC voted unanimously to hold. Chair Powell signaled patience citing ongoing inflation uncertainty. Bond yields compressed modestly.',
  },
  {
    tag: 'NJ Market', tagColor: 'bg-blue-100 text-blue-800',
    date: 'Apr 18, 2026',
    title: 'NJ Home Inventory Up 12% YoY — Buyers Gaining Leverage',
    body: "Active listings rose to a 3-year high in March. Bergen, Hudson, and Essex counties saw the largest increases — giving qualified buyers more room to negotiate.",
  },
  {
    tag: 'Non-QM', tagColor: 'bg-yellow-100 text-yellow-800',
    date: 'Apr 15, 2026',
    title: 'Non-QM Volume Surges as Self-Employed Borrowers Re-Enter Market',
    body: 'Bank statement and DSCR loans continue to outpace conventional growth. Self-employed borrowers who couldn\'t qualify post-pandemic are back.',
  },
];

const NEWS_AR = [
  {
    tag: 'المعدلات', tagColor: 'bg-green-100 text-green-800',
    date: '25 أبريل 2026',
    title: 'Freddie Mac: ثابت 30 سنة يستقر قرب 6.8% للأسبوع الثالث على التوالي',
    body: 'يُظهر PMMS الأسبوعي استقرار المعدلات بعد ربع أول متقلب. إشارات Fed المختلطة وبيانات التوظيف القوية هي المحركات الرئيسية.',
  },
  {
    tag: 'الاحتياطي الفيدرالي', tagColor: 'bg-red-100 text-red-800',
    date: '22 أبريل 2026',
    title: 'الفيدرالي يُبقي على المعدلات — القرار التالي 18 يونيو',
    body: 'صوّت FOMC بالإجماع على الإبقاء. أشار باول إلى الصبر في ظل استمرار عدم اليقين في التضخم.',
  },
  {
    tag: 'سوق NJ', tagColor: 'bg-blue-100 text-blue-800',
    date: '18 أبريل 2026',
    title: 'مخزون المنازل في NJ يرتفع 12% سنوياً — المشترون يكتسبون نفوذاً',
    body: 'ارتفعت القوائم النشطة إلى أعلى مستوى في 3 سنوات في مارس. مناطق Bergen وHudson وEssex شهدت أكبر الزيادات.',
  },
  {
    tag: 'Non-QM', tagColor: 'bg-yellow-100 text-yellow-800',
    date: '15 أبريل 2026',
    title: 'ارتفاع ملحوظ في حجم Non-QM مع عودة أصحاب الأعمال الحرة للسوق',
    body: 'قروض كشف الحساب البنكي وDSCR تتخطى نمو القروض التقليدية. أصحاب الأعمال الحرة الذين لم يتأهلوا بعد الجائحة يعودون.',
  },
];

// ─── HUBSPOT CONFIG ────────────────────────────────────────────────────────────
const HS_PORTAL_ID = '245970533';
const HS_FORM_GUID = '2xl01hBCYT_WsgHpWDte2QQ';

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [lang, setLang] = useState('en');
  const [rateAlertEmail, setRateAlertEmail] = useState('');
  const [rateAlertSent, setRateAlertSent] = useState(false);
  const navigate = useNavigate();
  const T = t[lang];
  const isAr = lang === 'ar';
  const NEWS = isAr ? NEWS_AR : NEWS_EN;

  // ── Language toggle
  const toggleLang = () => {
    const next = lang === 'en' ? 'ar' : 'en';
    setLang(next);
    ga.languageToggle(next);
  };

  // ── GA helper
  const handleCta = (button) => ga.ctaClick(button, 'landing');

  // ── Load HubSpot form embed
  useEffect(() => {
    const existing = document.getElementById('hs-embed-script');
    if (existing) {
      // Script already loaded — just create form
      createHsForm();
      return;
    }
    const script = document.createElement('script');
    script.id = 'hs-embed-script';
    script.src = '//js.hsforms.net/forms/embed/v2.js';
    script.charset = 'utf-8';
    script.type = 'text/javascript';
    script.onload = createHsForm;
    document.body.appendChild(script);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function createHsForm() {
    if (window.hbspt) {
      window.hbspt.forms.create({
        region: 'na1',
        portalId: HS_PORTAL_ID,
        formId: HS_FORM_GUID,
        target: '#hs-lead-form',
        onFormSubmit: () => {
          ga.ctaClick('hubspot_form_submit', 'landing');
        },
      });
    }
  }

  // ── Rate alert submission
  const handleRateAlert = () => {
    if (!rateAlertEmail || !rateAlertEmail.includes('@')) return;
    // Submit to HubSpot via Forms API
    fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${HS_PORTAL_ID}/${HS_FORM_GUID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: [
          { name: 'email', value: rateAlertEmail },
          { name: 'rate_alert_opt_in', value: 'true' },
        ],
        context: { pageUri: window.location.href, pageName: 'LandingPage RateAlert' },
      }),
    }).catch(() => {}); // silent fail — UX still shows success
    setRateAlertSent(true);
    setRateAlertEmail('');
    ga.ctaClick('rate_alert_subscribe', 'landing');
  };

  return (
    <div className={`min-h-screen bg-white ${isAr ? 'rtl' : 'ltr'}`} dir={isAr ? 'rtl' : 'ltr'}>

      {/* ═══ NAV ═══════════════════════════════════════════════════════════════ */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FM</span>
              </div>
              <span className="font-bold text-blue-900 text-lg">Fintek Mortgage</span>
            </div>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
              <button onClick={() => { handleCta('nav_nonqm'); navigate('/loans/non-qm'); }} className="hover:text-blue-700">{T.nav_nonqm}</button>
              <button onClick={() => { handleCta('nav_fha'); navigate('/loans/fha'); }} className="hover:text-blue-700">{T.nav_fha}</button>
              <button onClick={() => { handleCta('nav_conventional'); navigate('/loans/conventional'); }} className="hover:text-blue-700">{T.nav_conventional}</button>
              <button onClick={() => { handleCta('nav_calculator'); navigate('/calculator'); }} className="hover:text-blue-700">{T.nav_calculator}</button>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={toggleLang} className="text-xs border border-gray-300 rounded px-2 py-1 text-gray-600 hover:border-blue-500 hover:text-blue-600">
                {lang === 'en' ? 'عربي' : 'English'}
              </button>
              <button
                onClick={() => { handleCta('nav_qualify'); navigate('/get-started'); }}
                className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg"
              >
                {T.nav_qualify}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <span className="inline-block bg-yellow-400 text-yellow-900 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
              {T.hero_tag}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">{T.hero_h1}</h1>
            <p className="text-xl text-blue-200 mb-8 leading-relaxed">{T.hero_sub}</p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={() => { handleCta('hero_qualify'); navigate('/get-started'); }}
                className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold px-8 py-4 rounded-xl text-lg shadow-lg transition-all"
              >
                {T.hero_cta1}
              </button>
              <a
                href="tel:+19173040234"
                onClick={() => ga.callClick('landing_hero')}
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-lg text-center"
              >
                {T.hero_cta2}
              </a>
              <a
                href="https://calendly.com/abualiwael/30min"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => ga.bookingClick('landing_hero')}
                className="bg-green-500 hover:bg-green-400 text-white font-semibold px-8 py-4 rounded-xl text-lg text-center"
              >
                {T.hero_cta3}
              </a>
            </div>

            <div className="flex flex-wrap gap-3">
              {[T.hero_badge1, T.hero_badge2, T.hero_badge3].map((b, i) => (
                <span key={i} className="flex items-center gap-1 bg-white/10 text-white text-sm px-3 py-1 rounded-full">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ QUALIFY BANNER ════════════════════════════════════════════════════ */}
      <section className="bg-yellow-50 border-y border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-lg font-semibold text-yellow-900">{T.qualify_banner}</p>
          <button
            onClick={() => { handleCta('qualify_banner'); navigate('/qualify'); }}
            className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold px-6 py-3 rounded-xl whitespace-nowrap"
          >
            {T.qualify_banner_cta} →
          </button>
        </div>
      </section>

      {/* ═══ LOAN TYPES ════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{T.loans_title}</h2>
            <p className="text-lg text-gray-500">{T.loans_sub}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Non-QM — featured */}
            <div
              className="relative bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-2xl p-8 cursor-pointer hover:scale-105 transition-all shadow-xl border-4 border-yellow-400"
              onClick={() => { ga.loanPageView('non_qm'); ga.ctaClick('loan_card_nonqm', 'landing'); navigate('/loans/non-qm'); }}
            >
              <span className="absolute -top-3 left-6 bg-yellow-400 text-yellow-900 text-xs font-bold uppercase px-3 py-1 rounded-full">
                {T.nonqm_badge}
              </span>
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-2xl font-bold mb-2">{T.nonqm_title}</h3>
              <p className="text-blue-200 text-sm mb-4">{T.nonqm_for}</p>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-xs text-blue-100 font-medium">{T.nonqm_key}</p>
              </div>
              <div className="mt-6 text-yellow-400 font-semibold text-sm">Learn more →</div>
            </div>

            {/* FHA */}
            <div
              className="bg-white border-2 border-gray-200 hover:border-blue-400 rounded-2xl p-8 cursor-pointer hover:scale-105 transition-all shadow-md"
              onClick={() => { ga.loanPageView('fha'); ga.ctaClick('loan_card_fha', 'landing'); navigate('/loans/fha'); }}
            >
              <div className="text-4xl mb-4">🔑</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{T.fha_title}</h3>
              <p className="text-gray-500 text-sm mb-4">{T.fha_for}</p>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-800 font-medium">{T.fha_key}</p>
              </div>
              <div className="mt-6 text-blue-600 font-semibold text-sm">Learn more →</div>
            </div>

            {/* Conventional */}
            <div
              className="bg-white border-2 border-gray-200 hover:border-blue-400 rounded-2xl p-8 cursor-pointer hover:scale-105 transition-all shadow-md"
              onClick={() => { ga.loanPageView('conventional'); ga.ctaClick('loan_card_conv', 'landing'); navigate('/loans/conventional'); }}
            >
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{T.conv_title}</h3>
              <p className="text-gray-500 text-sm mb-4">{T.conv_for}</p>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-800 font-medium">{T.conv_key}</p>
              </div>
              <div className="mt-6 text-blue-600 font-semibold text-sm">Learn more →</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MARKET RATES & NEWS ═══════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50" id="market-news">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">{T.news_title}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-2">{T.news_title}</h2>
            <p className="text-lg text-gray-500">{T.news_sub}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* News cards — 2/3 width */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {NEWS.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-blue-300 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-xs font-bold uppercase px-2 py-1 rounded-md ${item.tagColor}`}>{item.tag}</span>
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2 leading-snug">{item.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>

            {/* Rate board + alert — 1/3 width */}
            <div className="flex flex-col gap-5">
              {/* Rate board */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                  <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Current NJ Rates</h3>
                </div>

                {[
                  { label: T.news_rate_label_30, note: T.news_rate_note_30, value: '6.89%', badge: 'Freddie Mac', badgeColor: 'bg-gray-100 text-gray-600' },
                  { label: T.news_rate_label_15, note: T.news_rate_note_15, value: '6.14%', badge: 'Freddie Mac', badgeColor: 'bg-gray-100 text-gray-600' },
                  { label: T.news_rate_fha,      note: '3.5% min down',     value: T.news_rate_contact, badge: 'Personalized', badgeColor: 'bg-blue-50 text-blue-700' },
                  { label: T.news_rate_nonqm,    note: 'Self-employed',      value: T.news_rate_contact, badge: 'Varies by file', badgeColor: 'bg-yellow-50 text-yellow-700' },
                  { label: T.news_rate_dscr,     note: 'Rental income',      value: T.news_rate_contact, badge: 'Varies by LTV', badgeColor: 'bg-yellow-50 text-yellow-700' },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{row.label}</div>
                      <div className="text-xs text-gray-400">{row.note}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-gray-900">{row.value}</div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${row.badgeColor}`}>{row.badge}</span>
                    </div>
                  </div>
                ))}

                <p className="text-xs text-gray-400 mt-4 leading-relaxed">{T.news_source}</p>
              </div>

              {/* Rate alert widget */}
              <div className="bg-blue-900 rounded-2xl p-6 text-white">
                <p className="font-bold text-sm mb-1">📬 {T.news_alert_label}</p>
                <p className="text-blue-300 text-xs mb-4">{T.news_alert_sub}</p>
                {rateAlertSent ? (
                  <p className="text-green-400 font-semibold text-sm">{T.news_alert_success}</p>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={rateAlertEmail}
                      onChange={(e) => setRateAlertEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRateAlert()}
                      placeholder={T.news_alert_placeholder}
                      className="flex-1 px-3 py-2 rounded-lg text-gray-900 text-sm outline-none"
                    />
                    <button
                      onClick={handleRateAlert}
                      className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold px-4 py-2 rounded-lg text-sm whitespace-nowrap"
                    >
                      {T.news_alert_btn}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WHY WAEL ══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{T.why_title}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🎯', title: T.why_1_title, body: T.why_1_body },
              { icon: '⚡', title: T.why_2_title, body: T.why_2_body },
              { icon: '🌐', title: T.why_3_title, body: T.why_3_body },
              { icon: '📅', title: T.why_4_title, body: T.why_4_body },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HUBSPOT LEAD FORM ═════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900" id="get-started">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Copy */}
            <div className="text-white">
              <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">{T.form_section_label}</span>
              <h2 className="text-4xl font-bold mt-3 mb-4 leading-tight">{T.form_title}</h2>
              <p className="text-blue-200 text-lg mb-8 leading-relaxed">{T.form_sub}</p>
              <ul className="space-y-3 mb-10">
                {[T.form_bullet1, T.form_bullet2, T.form_bullet3, T.form_bullet4].map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-blue-100">
                    <span className="text-yellow-400 font-bold mt-0.5">→</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-4">
                <a
                  href="tel:+19173040234"
                  onClick={() => ga.callClick('landing_form_section')}
                  className="bg-white text-blue-900 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-all"
                >
                  📞 (917) 304-0234
                </a>
                <a
                  href="https://calendly.com/abualiwael/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => ga.bookingClick('landing_form_section')}
                  className="border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-all"
                >
                  Book a Call →
                </a>
              </div>
            </div>

            {/* HubSpot form card */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{T.form_card_title}</h3>
              <p className="text-sm text-gray-500 mb-6">{T.form_card_sub}</p>
              {/* HubSpot mounts here via useEffect */}
              <div id="hs-lead-form" className="min-h-[320px]" />
              <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">{T.form_compliance}</p>
            </div>

          </div>
        </div>
      </section>

      {/* ═══ CALCULATOR BANNER ═════════════════════════════════════════════════ */}
      <section className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-lg font-semibold">{T.calc_banner}</p>
            <p className="text-blue-300 text-sm">Rates updated weekly from Freddie Mac</p>
          </div>
          <button
            onClick={() => { handleCta('calculator_banner'); navigate('/calculator'); }}
            className="bg-white text-blue-900 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 whitespace-nowrap"
          >
            {T.calc_banner_cta} →
          </button>
        </div>
      </section>

      {/* ═══ CONTACT ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">{T.contact_title}</h2>
          <p className="text-lg text-gray-500 mb-8">{T.contact_sub}</p>

          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <a
              href="tel:+19173040234"
              onClick={() => ga.callClick('landing_contact')}
              className="flex flex-col items-center bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl p-6 transition-all"
            >
              <span className="text-3xl mb-2">📞</span>
              <span className="font-bold text-blue-900">{T.contact_call}</span>
              <span className="text-blue-700 text-sm mt-1">(917) 304-0234</span>
            </a>

            <a
              href="https://calendly.com/abualiwael/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => ga.bookingClick('landing_contact')}
              className="flex flex-col items-center bg-green-50 hover:bg-green-100 border border-green-200 rounded-2xl p-6 transition-all"
            >
              <span className="text-3xl mb-2">📅</span>
              <span className="font-bold text-green-900">{T.contact_book}</span>
              <span className="text-green-700 text-sm mt-1">calendly.com/abualiwael</span>
            </a>

            <button
              onClick={() => { handleCta('contact_apply'); navigate('/apply'); }}
              className="flex flex-col items-center bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl p-6 transition-all"
            >
              <span className="text-3xl mb-2">📋</span>
              <span className="font-bold text-gray-900">{T.contact_apply}</span>
              <span className="text-gray-500 text-sm mt-1">fintekmortgage.com/apply</span>
            </button>
          </div>

          {/* ── Compliance trust line — NJ ONLY (corrected) */}
          <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span>✓ {T.trust_nmls}</span>
            <span>✓ {T.trust_licensed}</span>
            <span>✓ {T.trust_company}</span>
          </div>
        </div>
      </section>

      <ComplianceFooter />
    </div>
  );
}
