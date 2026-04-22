import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ga } from '@/lib/analytics';

const T = {
  en: {
    badge: '⚡ 60 Seconds · No Credit Pull · 100% Free',
    title: 'See If You Pre-Qualify',
    sub: 'Get an instant answer — no SSN, no credit check, no commitment.',
    step1: 'Your Info',
    step2: 'Loan Details',
    step3: 'Your Result',
    name: 'Full Name',
    phone: 'Phone Number',
    email: 'Email Address (optional)',
    lang: 'Preferred Language',
    langEn: 'English',
    langAr: 'Arabic (عربي)',
    loanType: 'What are you looking to do?',
    buy: 'Buy a Home',
    refi: 'Refinance',
    invest: 'Investment Property',
    nonqm: 'Self-Employed / Non-QM',
    credit: 'Credit Score Range',
    c1: 'Below 580',
    c2: '580 – 619',
    c3: '620 – 679',
    c4: '680 – 719',
    c5: '720 – 759',
    c6: '760+',
    down: 'Down Payment Available',
    d1: 'Less than 3%',
    d2: '3% – 4%',
    d3: '5% – 9%',
    d4: '10% – 19%',
    d5: '20% or more',
    emp: 'Employment Type',
    e1: 'W-2 Employee',
    e2: 'Self-Employed / Business Owner',
    e3: 'Retired',
    e4: 'Real Estate Investor',
    next: 'Next →',
    back: '← Back',
    submit: 'Get My Result →',
    processing: 'Checking...',
    qualTitle: 'Great news — you look like a strong candidate!',
    qualBody: "Based on your answers, you're likely pre-qualifiable. Book a free call and I'll have a real answer for you same day — no obligation.",
    nonqmTitle: 'Good news — you may qualify for a Non-QM loan.',
    nonqmBody: "Non-QM loans are built for self-employed borrowers like you. No tax returns, no W-2s. Let's talk — it takes 15 minutes.",
    disqTitle: "Let's talk — I may still be able to help.",
    disqBody: "Every situation is different. I've helped people others turned away. Book a free call and we'll look at your options together.",
    book: '📅 Book Free Call with Wael',
    call: '📞 Call (917) 304-0234',
    restart: 'Start Over',
    nmls: 'Wael Abd El Dayem | NMLS #2171794 | Barrett Financial Group | Not a commitment to lend.',
  },
  ar: {
    badge: '⚡ 60 ثانية · بدون سحب ائتمان · مجاني 100%',
    title: 'اكتشف إذا كنت مؤهلاً مسبقاً',
    sub: 'احصل على إجابة فورية — بدون رقم ضمان اجتماعي، بدون فحص ائتماني، بدون التزام.',
    step1: 'معلوماتك',
    step2: 'تفاصيل القرض',
    step3: 'نتيجتك',
    name: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    email: 'البريد الإلكتروني (اختياري)',
    lang: 'اللغة المفضلة',
    langEn: 'English',
    langAr: 'العربية',
    loanType: 'ماذا تريد أن تفعل؟',
    buy: 'شراء منزل',
    refi: 'إعادة تمويل',
    invest: 'عقار استثماري',
    nonqm: 'عمل حر / Non-QM',
    credit: 'نطاق درجة الائتمان',
    c1: 'أقل من 580',
    c2: '580 – 619',
    c3: '620 – 679',
    c4: '680 – 719',
    c5: '720 – 759',
    c6: '760+',
    down: 'الدفعة الأولى المتاحة',
    d1: 'أقل من 3%',
    d2: '3% – 4%',
    d3: '5% – 9%',
    d4: '10% – 19%',
    d5: '20% أو أكثر',
    emp: 'نوع التوظيف',
    e1: 'موظف W-2',
    e2: 'عمل حر / صاحب عمل',
    e3: 'متقاعد',
    e4: 'مستثمر عقاري',
    next: 'التالي →',
    back: '← رجوع',
    submit: 'احصل على نتيجتي →',
    processing: 'جارٍ الفحص...',
    qualTitle: 'أخبار رائعة — تبدو مؤهلاً بشكل قوي!',
    qualBody: 'بناءً على إجاباتك، من المرجح أنك مؤهل مسبقاً. احجز مكالمة مجانية وسأعطيك إجابة حقيقية في نفس اليوم.',
    nonqmTitle: 'أخبار جيدة — قد تكون مؤهلاً لقرض Non-QM.',
    nonqmBody: 'قروض Non-QM مصممة للعاملين لحسابهم الخاص مثلك. بدون إقرارات ضريبية، بدون W-2. لنتحدث.',
    disqTitle: 'لنتحدث — قد أتمكن من مساعدتك.',
    disqBody: 'كل حالة مختلفة. ساعدت أشخاصاً رفضهم آخرون. احجز مكالمة مجانية ونستعرض خياراتك معاً.',
    book: '📅 احجز مكالمة مجانية مع وائل',
    call: '📞 اتصل (917) 304-0234',
    restart: 'ابدأ من جديد',
    nmls: 'وائل عبد الدايم | NMLS #2171794 | Barrett Financial Group | ليس التزاماً بالإقراض.',
  },
};

function getResult(data) {
  const creditMap = { 'below580': 560, '580-619': 599, '620-679': 649, '680-719': 699, '720-759': 739, '760plus': 780 };
  const downMap = { 'lt3': 2, '3-4': 3.5, '5-9': 7, '10-19': 15, '20plus': 20 };
  const credit = creditMap[data.credit] || 0;
  const down = downMap[data.down] || 0;
  const isSE = data.employment === 'selfemployed' || data.loanType === 'nonqm';

  if (isSE && credit >= 680 && down >= 20) return 'nonqm';
  if (credit >= 620 && down >= 3) return 'qualified';
  return 'disqualified';
}

export default function PreQualForm() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('en');
  const [step, setStep] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', lang: 'en',
    loanType: '', credit: '', down: '', employment: '',
  });

  useEffect(() => { ga.loanPageView('prequal'); }, []);

  const S = T[lang];
  const isRTL = lang === 'ar';

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const step1Valid = form.name.trim().length >= 2 && form.phone.replace(/\D/g, '').length >= 10;
  const step2Valid = form.loanType && form.credit && form.down && form.employment;

  const submit = async () => {
    setLoading(true);
    const payload = { ...form, source: 'prequal_form', submitted_at: new Date().toISOString() };
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (e) { console.warn('Lead API:', e); }
    setTimeout(() => {
      setResult(getResult(form));
      setLoading(false);
      setStep(3);
    }, 800);
  };

  const radio = (name, val, label) => (
    <label key={val} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${form[name] === val ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
      <input type="radio" name={name} value={val} checked={form[name] === val} onChange={() => set(name, val)} className="sr-only" />
      <span className="text-sm font-medium text-gray-800">{label}</span>
    </label>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-lg">
        {/* Lang toggle */}
        <div className="flex justify-end mb-4 gap-2">
          {['en','ar'].map(l => (
            <button key={l} onClick={() => { setLang(l); set('lang', l); }}
              className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${lang === l ? 'bg-white text-blue-900' : 'bg-white/20 text-white hover:bg-white/30'}`}>
              {l === 'en' ? 'EN' : 'عربي'}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-8 py-6 text-center">
            <span className="inline-block bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full mb-3">{S.badge}</span>
            <h1 className="text-2xl font-bold text-white mb-1">{S.title}</h1>
            <p className="text-blue-200 text-sm">{S.sub}</p>
            {/* Progress */}
            <div className="flex gap-2 mt-4 justify-center">
              {[1,2,3].map(n => (
                <div key={n} className={`h-1.5 rounded-full transition-all ${n <= step ? 'bg-yellow-400' : 'bg-white/30'} ${n === 2 ? 'w-16' : 'w-8'}`} />
              ))}
            </div>
          </div>

          <div className="px-8 py-6">
            {/* Step 1 — Contact */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 mb-4">{S.step1}</h2>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{S.name} *</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="John Smith" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{S.phone} *</label>
                  <input value={form.phone} onChange={e => set('phone', e.target.value)} type="tel"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="(917) 000-0000" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{S.email}</label>
                  <input value={form.email} onChange={e => set('email', e.target.value)} type="email"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="you@email.com" />
                </div>
                <button onClick={() => { if (step1Valid) setStep(2); }}
                  disabled={!step1Valid}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${step1Valid ? 'bg-blue-700 hover:bg-blue-800 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                  {S.next}
                </button>
              </div>
            )}

            {/* Step 2 — Loan Details */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-gray-900 mb-2">{S.step2}</h2>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{S.loanType}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[['buy', S.buy], ['refi', S.refi], ['invest', S.invest], ['nonqm', S.nonqm]].map(([v, l]) => radio('loanType', v, l))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{S.credit}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[['below580', S.c1], ['580-619', S.c2], ['620-679', S.c3], ['680-719', S.c4], ['720-759', S.c5], ['760plus', S.c6]].map(([v, l]) => radio('credit', v, l))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{S.down}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[['lt3', S.d1], ['3-4', S.d2], ['5-9', S.d3], ['10-19', S.d4], ['20plus', S.d5]].map(([v, l]) => radio('down', v, l))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{S.emp}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[['w2', S.e1], ['selfemployed', S.e2], ['retired', S.e3], ['investor', S.e4]].map(([v, l]) => radio('employment', v, l))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-600 hover:border-blue-300">{S.back}</button>
                  <button onClick={submit} disabled={!step2Valid || loading}
                    className={`flex-[2] py-3 rounded-xl font-bold text-lg transition-all ${step2Valid && !loading ? 'bg-blue-700 hover:bg-blue-800 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                    {loading ? S.processing : S.submit}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 — Result */}
            {step === 3 && result && (
              <div className="text-center space-y-4">
                <div className={`inline-block text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full mb-2 ${result === 'qualified' ? 'bg-green-100 text-green-800' : result === 'nonqm' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                  {result === 'qualified' ? '✅ Pre-Qualified' : result === 'nonqm' ? '🏦 Non-QM Eligible' : '💬 Let\'s Talk'}
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {result === 'qualified' ? S.qualTitle : result === 'nonqm' ? S.nonqmTitle : S.disqTitle}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {result === 'qualified' ? S.qualBody : result === 'nonqm' ? S.nonqmBody : S.disqBody}
                </p>
                <a href="https://calendly.com/abualiwael/30min" target="_blank" rel="noopener noreferrer"
                  onClick={() => ga.bookingClick('prequal_result')}
                  className="block w-full py-4 rounded-xl font-bold text-lg bg-blue-700 hover:bg-blue-800 text-white">
                  {S.book}
                </a>
                <a href="tel:+19173040234" className="block w-full py-3 rounded-xl font-semibold text-gray-600 hover:text-blue-700 border-2 border-gray-200 hover:border-blue-300">
                  {S.call}
                </a>
                <button onClick={() => { setStep(1); setResult(null); setForm({ name:'', phone:'', email:'', lang, loanType:'', credit:'', down:'', employment:'' }); }}
                  className="text-sm text-gray-400 hover:text-gray-600 mt-2">
                  {S.restart}
                </button>
                <p className="text-xs text-gray-400 mt-4 leading-relaxed">{S.nmls}</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-blue-300 text-xs mt-4">fintekmortgage.com · Equal Housing Lender 🏠</p>
      </div>
    </div>
  );
}
