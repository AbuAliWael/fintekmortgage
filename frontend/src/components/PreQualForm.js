import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ga } from '@/lib/analytics';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const OFFICIAL_APP_URL = 'https://181106.my1003app.com/2171794/register';
const HS_PORTAL_ID     = '245970533';
const HS_FORM_GUID     = 'c65d3584-1098-4ff5-ac80-7a560ed7b641';

// ─── QUALIFICATION LOGIC ──────────────────────────────────────────────────────
function getRecommendation(answers) {
  const { goal, income, credit } = answers;
  if (income === 'itin')         return { program: 'ITIN Loan',            route: '/loans/non-qm', color: 'bg-purple-50 border-purple-200 text-purple-900', icon: '🌐' };
  if (income === 'self')         return { program: 'Non-QM Bank Statement', route: '/loans/non-qm', color: 'bg-blue-50 border-blue-200 text-blue-900',   icon: '🏠' };
  if (income === '1099')         return { program: 'Non-QM 1099 Loan',      route: '/loans/non-qm', color: 'bg-blue-50 border-blue-200 text-blue-900',   icon: '🏠' };
  if (goal === 'investment')     return { program: 'DSCR Investor Loan',    route: '/loans/non-qm', color: 'bg-amber-50 border-amber-200 text-amber-900', icon: '📈' };
  if (goal === 'heloc')          return { program: 'HELOC / Cash-Out Refi', route: '/loans/non-qm', color: 'bg-green-50 border-green-200 text-green-900', icon: '💰' };
  if (credit === '580' || credit === 'below')
                                 return { program: 'FHA Loan',              route: '/loans/fha',    color: 'bg-green-50 border-green-200 text-green-900', icon: '🔑' };
  if (credit === '760' || credit === '720' || credit === '680')
                                 return { program: 'Conventional Loan',     route: '/loans/conventional', color: 'bg-indigo-50 border-indigo-200 text-indigo-900', icon: '📊' };
  return                                { program: 'FHA Loan',              route: '/loans/fha',    color: 'bg-green-50 border-green-200 text-green-900', icon: '🔑' };
}

// ─── QUESTIONS ────────────────────────────────────────────────────────────────
const QUESTIONS = {
  en: [
    {
      id: 'goal',
      question: "What are you looking to do?",
      options: [
        { value: 'purchase',   label: 'Purchase a Home',        icon: '🏡' },
        { value: 'refinance',  label: 'Refinance',              icon: '🔄' },
        { value: 'investment', label: 'Investment Property',    icon: '📈' },
        { value: 'heloc',      label: 'HELOC / Cash-Out',       icon: '💰' },
        { value: 'unsure',     label: "Not sure yet",           icon: '🤔' },
      ],
    },
    {
      id: 'income',
      question: "How do you earn your income?",
      options: [
        { value: 'w2',    label: 'W-2 Employee',         icon: '💼' },
        { value: 'self',  label: 'Self-Employed',         icon: '🧾' },
        { value: '1099',  label: '1099 / Freelance',      icon: '📄' },
        { value: 'itin',  label: 'ITIN (no SSN)',         icon: '🌐' },
        { value: 'mixed', label: 'Mixed / Other',         icon: '🔀' },
      ],
    },
    {
      id: 'credit',
      question: "What's your estimated credit score?",
      options: [
        { value: '760',   label: '760+',               icon: '⭐' },
        { value: '720',   label: '720 – 759',          icon: '✅' },
        { value: '680',   label: '680 – 719',          icon: '👍' },
        { value: '640',   label: '640 – 679',          icon: '➡️' },
        { value: '580',   label: '580 – 639',          icon: '⚠️' },
        { value: 'below', label: 'Below 580 / Not sure', icon: '❓' },
      ],
    },
    {
      id: 'amount',
      question: "Estimated loan amount?",
      options: [
        { value: 'u200',  label: 'Under $200K',        icon: '💵' },
        { value: '200',   label: '$200K – $400K',      icon: '💵' },
        { value: '400',   label: '$400K – $600K',      icon: '💵' },
        { value: '600',   label: '$600K – $800K',      icon: '💵' },
        { value: '800',   label: 'Over $800K',         icon: '💵' },
      ],
    },
  ],
  ar: [
    {
      id: 'goal',
      question: "ماذا تريد أن تفعل؟",
      options: [
        { value: 'purchase',   label: 'شراء منزل',             icon: '🏡' },
        { value: 'refinance',  label: 'إعادة تمويل',           icon: '🔄' },
        { value: 'investment', label: 'عقار استثماري',         icon: '📈' },
        { value: 'heloc',      label: 'HELOC / سحب نقدي',      icon: '💰' },
        { value: 'unsure',     label: 'لست متأكداً بعد',       icon: '🤔' },
      ],
    },
    {
      id: 'income',
      question: "كيف تكسب دخلك؟",
      options: [
        { value: 'w2',    label: 'موظف W-2',            icon: '💼' },
        { value: 'self',  label: 'صاحب عمل حر',         icon: '🧾' },
        { value: '1099',  label: '1099 / مستقل',         icon: '📄' },
        { value: 'itin',  label: 'ITIN (بدون SSN)',      icon: '🌐' },
        { value: 'mixed', label: 'مختلط / أخرى',         icon: '🔀' },
      ],
    },
    {
      id: 'credit',
      question: "ما هو تقديرك لدرجة الائتمان؟",
      options: [
        { value: '760',   label: '760+',                 icon: '⭐' },
        { value: '720',   label: '720 – 759',            icon: '✅' },
        { value: '680',   label: '680 – 719',            icon: '👍' },
        { value: '640',   label: '640 – 679',            icon: '➡️' },
        { value: '580',   label: '580 – 639',            icon: '⚠️' },
        { value: 'below', label: 'أقل من 580 / غير متأكد', icon: '❓' },
      ],
    },
    {
      id: 'amount',
      question: "المبلغ التقديري للقرض؟",
      options: [
        { value: 'u200',  label: 'أقل من $200K',         icon: '💵' },
        { value: '200',   label: '$200K – $400K',        icon: '💵' },
        { value: '400',   label: '$400K – $600K',        icon: '💵' },
        { value: '600',   label: '$600K – $800K',        icon: '💵' },
        { value: '800',   label: 'أكثر من $800K',        icon: '💵' },
      ],
    },
  ],
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function PreQualForm() {
  const [lang, setLang]       = useState('en');
  const [step, setStep]       = useState(1);       // 1 = questions, 2 = contact form
  const [qIndex, setQIndex]   = useState(0);       // which question in step 1
  const [answers, setAnswers] = useState({});
  const navigate              = useNavigate();
  const isAr                  = lang === 'ar';
  const questions             = QUESTIONS[lang];
  const totalQ                = questions.length;
  const currentQ              = questions[qIndex];
  const recommendation        = getRecommendation(answers);

  // ── Load HubSpot embed script
  useEffect(() => {
    if (step !== 2) return;
    if (document.getElementById('hs-prequal-script')) return;
    const script = document.createElement('script');
    script.id    = 'hs-prequal-script';
    script.src   = `https://js-na2.hsforms.net/forms/embed/${HS_PORTAL_ID}.js`;
    script.defer = true;
    document.body.appendChild(script);
  }, [step]);

  const toggleLang = () => setLang(l => l === 'en' ? 'ar' : 'en');

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);
    ga.ctaClick(`prequal_q${qIndex + 1}_${value}`, 'prequal');

    if (qIndex < totalQ - 1) {
      setQIndex(i => i + 1);
    } else {
      // All questions answered — move to contact form
      setStep(2);
      ga.ctaClick('prequal_step2_reached', 'prequal');
    }
  };

  const handleBack = () => {
    if (qIndex > 0) setQIndex(i => i - 1);
  };

  const progressPct = Math.round((qIndex / totalQ) * 100);

  // ─── STEP 1 — Qualification questions ─────────────────────────────────────
  if (step === 1) {
    return (
      <div className={`min-h-screen bg-gray-50 ${isAr ? 'rtl' : 'ltr'}`} dir={isAr ? 'rtl' : 'ltr'}>

        {/* Mini nav */}
        <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 hover:text-blue-700 text-sm font-medium">
            ← {isAr ? 'العودة' : 'Back'}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-800 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">FM</span>
            </div>
            <span className="font-bold text-blue-900 text-sm">Fintek Mortgage</span>
          </div>
          <button onClick={toggleLang} className="text-xs border border-gray-300 rounded px-2 py-1 text-gray-600 hover:border-blue-500">
            {lang === 'en' ? 'عربي' : 'English'}
          </button>
        </nav>

        <div className="max-w-xl mx-auto px-4 py-12">

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>{isAr ? `السؤال ${qIndex + 1} من ${totalQ}` : `Question ${qIndex + 1} of ${totalQ}`}</span>
              <span>{progressPct}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full">
              <div
                className="h-1.5 bg-blue-700 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full mb-3">
              {isAr ? 'خطوة 1 من 2 — أسئلة التأهيل' : 'Step 1 of 2 — Qualification'}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {currentQ.question}
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              {isAr ? 'اختر الخيار الأنسب لك' : 'Select the option that best fits you'}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3 mb-8">
            {currentQ.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                className="flex items-center gap-4 bg-white border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-2xl p-4 text-left transition-all group"
              >
                <span className="text-2xl w-8 text-center flex-shrink-0">{opt.icon}</span>
                <span className="font-semibold text-gray-800 group-hover:text-blue-800 text-base">
                  {opt.label}
                </span>
                <span className="ml-auto text-gray-300 group-hover:text-blue-400 text-lg">→</span>
              </button>
            ))}
          </div>

          {/* Back button */}
          {qIndex > 0 && (
            <div className="text-center">
              <button onClick={handleBack} className="text-sm text-gray-400 hover:text-gray-600 underline">
                {isAr ? '← السؤال السابق' : '← Previous question'}
              </button>
            </div>
          )}

          {/* Trust line */}
          <div className="mt-10 text-center text-xs text-gray-400 space-y-1">
            <p>{isAr ? 'لا يتطلب سحب ائتماني · مجاني تماماً · NMLS #2171794' : 'No credit pull · 100% free · NMLS #2171794'}</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── STEP 2 — Contact form + recommendation ────────────────────────────────
  return (
    <div className={`min-h-screen bg-gray-50 ${isAr ? 'rtl' : 'ltr'}`} dir={isAr ? 'rtl' : 'ltr'}>

      {/* Mini nav */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => { setStep(1); setQIndex(totalQ - 1); }} className="flex items-center gap-2 text-gray-600 hover:text-blue-700 text-sm font-medium">
          ← {isAr ? 'تعديل إجاباتي' : 'Edit answers'}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-800 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xs">FM</span>
          </div>
          <span className="font-bold text-blue-900 text-sm">Fintek Mortgage</span>
        </div>
        <button onClick={toggleLang} className="text-xs border border-gray-300 rounded px-2 py-1 text-gray-600 hover:border-blue-500">
          {lang === 'en' ? 'عربي' : 'English'}
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Progress — complete */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>{isAr ? 'اكتملت الأسئلة' : 'Questions complete'}</span>
            <span>100%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full">
            <div className="h-1.5 bg-green-500 rounded-full w-full" />
          </div>
        </div>

        {/* Recommendation card */}
        <div className={`border-2 rounded-2xl p-5 mb-8 ${recommendation.color}`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{recommendation.icon}</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide opacity-70">
                {isAr ? 'البرنامج الموصى به' : 'Recommended program'}
              </p>
              <p className="text-xl font-bold">{recommendation.program}</p>
            </div>
          </div>
          <p className="text-sm opacity-80 mb-3">
            {isAr
              ? 'بناءً على إجاباتك، هذا البرنامج هو الأنسب لوضعك. وائل سيتواصل معك لتأكيد التفاصيل.'
              : "Based on your answers, this program fits your profile. Wael will confirm the details when he reaches out."}
          </p>
          <button
            onClick={() => navigate(recommendation.route)}
            className="text-sm font-bold underline opacity-80 hover:opacity-100"
          >
            {isAr ? 'تعرف على هذا البرنامج ←' : 'Learn about this program →'}
          </button>
        </div>

        {/* Step 2 header */}
        <div className="text-center mb-8">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full mb-3">
            {isAr ? 'خطوة 2 من 2 — معلومات التواصل' : 'Step 2 of 2 — Contact Info'}
          </span>
          <h2 className="text-2xl font-bold text-gray-900">
            {isAr ? 'كيف يتواصل معك وائل؟' : 'How should Wael reach you?'}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {isAr
              ? 'يراجع وائل كل ملف شخصياً ويتواصل خلال يوم عمل واحد.'
              : 'Wael reviews every file personally and reaches out within 1 business day.'}
          </p>
        </div>

        {/* HubSpot form card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          {/* HubSpot div-based embed */}
          <div
            className="hs-form-frame"
            data-region="na2"
            data-form-id={HS_FORM_GUID}
            data-portal-id={HS_PORTAL_ID}
          />
        </div>

        {/* Or apply directly */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-3">
            {isAr ? 'أو قدّم طلبك الرسمي مباشرة:' : 'Or go straight to the official application:'}
          </p>
          <a
            href={OFFICIAL_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => ga.ctaClick('prequal_official_app', 'prequal')}
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-xl transition-all"
          >
            {isAr ? 'ابدأ طلبي الرسمي ←' : 'Start Official Application →'}
          </a>
          <p className="text-xs text-gray-400 mt-3">NMLS #2171794 · {isAr ? 'مرخص في NJ' : 'Licensed in NJ'} · Equal Housing Lender</p>
        </div>
      </div>
    </div>
  );
}
