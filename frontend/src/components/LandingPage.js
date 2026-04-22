import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ComplianceFooter from './ComplianceFooter';
import { ga } from '@/lib/analytics';

const t = {
  en: {
    nav_qualify: 'Check My Eligibility',
    nav_nonqm: 'Non-QM Loans',
    nav_fha: 'FHA Loans',
    nav_conventional: 'Conventional',
    nav_calculator: 'Calculator',
    nav_apply: 'Apply Now',
    hero_tag: 'New Jersey\'s Non-QM Specialist',
    hero_h1: 'Were You Told You Don\'t Qualify?',
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
    why_title: 'Why Work With Wael?',
    why_1_title: 'Non-QM Expert',
    why_1_body: 'Most brokers avoid Non-QM. I specialize in it — helping self-employed, cash-based, and non-traditional borrowers qualify.',
    why_2_title: 'Same-Day Pre-Approval',
    why_2_body: 'I personally review every file. Decisions in 24 hours, not weeks. You need speed — I deliver it.',
    why_3_title: 'Arabic & English',
    why_3_body: 'Full bilingual service. Every document, every call, every question — answered in the language you\'re comfortable in.',
    why_4_title: '23-Day Average Close',
    why_4_body: 'Faster than any bank. My pipeline moves because I control the process from start to finish.',
    qualify_banner: 'Not sure which loan fits you?',
    qualify_banner_cta: 'Check My Eligibility in 60 Seconds',
    calc_banner: 'Estimate your monthly payment',
    calc_banner_cta: 'Open Mortgage Calculator',
    trust_nmls: 'NMLS #2171794',
    trust_licensed: 'Licensed in NJ · NY · CT',
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
    trust_licensed: 'مرخص في NJ · NY · CT',
    trust_company: 'Barrett Financial Group',
    contact_title: 'هل أنت مستعد للتحدث؟',
    contact_sub: 'بدون ضغط. بدون التزام. فقط محادثة حول خياراتك.',
    contact_call: 'اتصل أو أرسل رسالة',
    contact_book: 'احجز استشارة مجانية',
    contact_apply: 'ابدأ الطلب',
  }
};

export default function LandingPage() {
  const [lang, setLang] = useState('en');
  const navigate = useNavigate();
  const T = t[lang];
  const isAr = lang === 'ar';

  const toggleLang = () => {
    const next = lang === 'en' ? 'ar' : 'en';
    setLang(next);
    ga.languageToggle(next);
  };

  const handleCta = (button) => {
    ga.ctaClick(button, 'landing');
  };

  return (
    <div className={`min-h-screen bg-white ${isAr ? 'rtl' : 'ltr'}`} dir={isAr ? 'rtl' : 'ltr'}>

      {/* NAV */}
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

      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <span className="inline-block bg-yellow-400 text-yellow-900 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
              {T.hero_tag}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              {T.hero_h1}
            </h1>
            <p className="text-xl text-blue-200 mb-8 leading-relaxed">
              {T.hero_sub}
            </p>

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

      {/* QUALIFY BANNER */}
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

      {/* LOAN TYPES */}
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
              <div className="mt-6 text-yellow-400 font-semibold text-sm">
                Learn more →
              </div>
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

      {/* WHY WAEL */}
      <section className="py-20 bg-gray-50">
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
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATOR BANNER */}
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

      {/* CONTACT */}
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
