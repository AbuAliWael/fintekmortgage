import React, { useEffect } from 'react';

const ApplyPage = () => {
  useEffect(() => {
    // Inject the inline script after component mounts
    const script = document.createElement('script');
    script.textContent = `
    // ─── Language Strings ───────────────────────────────────────────────
    const strings = {
      en: {
        headerTitle: "Get Pre-Approved Today",
        headerSub: "Same-day results · No credit impact · 100% free",
        headerBadge: "⚡ Average response: under 1 hour",
        secContact: "Your Contact Info",
        secLoan: "Loan Details",
        secQual: "Qualification Info",
        lblName: "Full Name",
        lblPhone: "Phone Number",
        lblEmail: "Email Address",
        lblLang: "Preferred Language",
        lblCalltime: "Best Time to Call",
        lblLoantype: "What are you looking to do?",
        lblState: "Property State",
        lblPrice: "Estimated Purchase Price / Loan Amount",
        lblCredit: "Credit Score Range",
        lblDownpay: "Down Payment Available",
        lblEmployment: "Employment Type",
        lblSeyears: "Years Self-Employed",
        lblSource: "How did you hear about me?",
        lblNotes: "Anything else you'd like me to know?",
        submitBtn: "Get My Free Pre-Approval →",
        stateWarning: "I'm currently licensed in NJ, and can assist with investment purchases in NY and CT. For other states, I'll connect you with a trusted partner lender.",
        creditWarning: "No problem — I can still help you build a plan to get mortgage-ready. Let's talk.",
        seWarning: "For self-employed borrowers with under 2 years, we may still have options. Let's discuss your situation.",
        successTitle: "You Qualify — Let's Book Your Call!",
        successBody: "Great news! Based on your information, you're a strong candidate for pre-approval. Book your free 30-minute call below and I'll have your pre-approval ready same day.",
        calendlyBtn: "📅 Book Your Free Call Now",
        disqTitle: "Let's Talk — I Can Still Help",
        disqBody: "You may not be ready for a mortgage today, but that doesn't mean we can't get you there. I work with clients at every stage and can build a free 90-day plan to get you mortgage-ready. No pressure — just a conversation.",
        disqSub: "Questions? Send me a message on Instagram or Facebook @fintekwael",
        errName: "Please enter your full name.",
        errPhone: "Please enter a valid US phone number.",
        errLoantype: "Please select a loan type.",
        errState: "Please select a state.",
        errCredit: "Please select your credit score range.",
        errDown: "Please select your down payment range.",
        errEmployment: "Please select your employment type.",
      },
      ar: {
        headerTitle: "احصل على موافقة مسبقة اليوم",
        headerSub: "نتائج في نفس اليوم · بدون تأثير على الائتمان · مجاناً 100%",
        headerBadge: "⚡ متوسط وقت الرد: أقل من ساعة واحدة",
        secContact: "معلومات التواصل",
        secLoan: "تفاصيل القرض",
        secQual: "معلومات التأهيل",
        lblName: "الاسم الكامل",
        lblPhone: "رقم الهاتف",
        lblEmail: "البريد الإلكتروني",
        lblLang: "اللغة المفضلة",
        lblCalltime: "أفضل وقت للاتصال",
        lblLoantype: "ماذا تريد أن تفعل؟",
        lblState: "ولاية العقار",
        lblPrice: "السعر التقديري للشراء / مبلغ القرض",
        lblCredit: "نطاق درجة الائتمان",
        lblDownpay: "الدفعة الأولى المتاحة",
        lblEmployment: "نوع التوظيف",
        lblSeyears: "سنوات العمل الحر",
        lblSource: "كيف سمعت عني؟",
        lblNotes: "هل هناك أي شيء آخر تريد إخباري به؟",
        submitBtn: "احصل على موافقتي المسبقة المجانية ←",
        stateWarning: "أنا مرخص حالياً في نيوجيرسي، ويمكنني المساعدة في شراء العقارات الاستثمارية في نيويورك وكونيتيكت. لولايات أخرى، سأوصلك بمُقرض شريك موثوق.",
        creditWarning: "لا مشكلة — لا يزال بإمكاني مساعدتك في وضع خطة لتأهيلك للحصول على رهن عقاري. لنتحدث.",
        seWarning: "للمقترضين العاملين لحسابهم الخاص منذ أقل من سنتين، قد تكون لدينا خيارات. دعنا نناقش وضعك.",
        successTitle: "أنت مؤهل — لنحجز مكالمتك!",
        successBody: "أخبار رائعة! بناءً على معلوماتك، أنت مرشح قوي للحصول على موافقة مسبقة. احجز مكالمتك المجانية لمدة 30 دقيقة أدناه وسأكون جاهزاً بالموافقة المسبقة في نفس اليوم.",
        calendlyBtn: "📅 احجز مكالمتك المجانية الآن",
        disqTitle: "لنتحدث — لا يزال بإمكاني المساعدة",
        disqBody: "قد لا تكون مستعداً للرهن العقاري اليوم، لكن هذا لا يعني أننا لا نستطيع الوصول إليه. أعمل مع العملاء في كل مرحلة ويمكنني بناء خطة مجانية لمدة 90 يوماً لتأهيلك. بدون ضغط — مجرد محادثة.",
        disqSub: "أسئلة؟ أرسل لي رسالة على إنستغرام أو فيسبوك @fintekwael",
        errName: "يرجى إدخال اسمك الكامل.",
        errPhone: "يرجى إدخال رقم هاتف أمريكي صحيح.",
        errLoantype: "يرجى اختيار نوع القرض.",
        errState: "يرجى اختيار الولاية.",
        errCredit: "يرجى اختيار نطاق درجة الائتمان.",
        errDown: "يرجى اختيار نطاق الدفعة الأولى.",
        errEmployment: "يرجى اختيار نوع التوظيف.",
      }
    };

    let currentLang = 'en';

    window.setLang = function(lang) {
      currentLang = lang;
      const s = strings[lang];
      const dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.setAttribute('dir', dir);

      document.getElementById('header-title').textContent = s.headerTitle;
      document.getElementById('header-sub').textContent = s.headerSub;
      document.getElementById('header-badge').textContent = s.headerBadge;
      document.getElementById('sec-contact').textContent = s.secContact;
      document.getElementById('sec-loan').textContent = s.secLoan;
      document.getElementById('sec-qual').textContent = s.secQual;
      document.getElementById('lbl-name').childNodes[0].textContent = s.lblName;
      document.getElementById('lbl-phone').childNodes[0].textContent = s.lblPhone;
      document.getElementById('lbl-email').textContent = s.lblEmail;
      document.getElementById('lbl-lang').textContent = s.lblLang;
      document.getElementById('lbl-calltime').textContent = s.lblCalltime;
      document.getElementById('lbl-loantype').childNodes[0].textContent = s.lblLoantype;
      document.getElementById('lbl-state').textContent = s.lblState;
      document.getElementById('lbl-price').textContent = s.lblPrice;
      document.getElementById('lbl-credit').childNodes[0].textContent = s.lblCredit;
      document.getElementById('lbl-downpay').childNodes[0].textContent = s.lblDownpay;
      document.getElementById('lbl-employment').childNodes[0].textContent = s.lblEmployment;
      document.getElementById('lbl-seyears').childNodes[0].textContent = s.lblSeyears;
      document.getElementById('lbl-source').textContent = s.lblSource;
      document.getElementById('lbl-notes').textContent = s.lblNotes;
      document.getElementById('submit-btn').textContent = s.submitBtn;
      document.getElementById('state-warning').textContent = s.stateWarning;
      document.getElementById('credit-warning').textContent = s.creditWarning;
      document.getElementById('se-warning').textContent = s.seWarning;
      document.getElementById('success-title').textContent = s.successTitle;
      document.getElementById('success-body').textContent = s.successBody;
      document.getElementById('calendly-btn').textContent = s.calendlyBtn;
      document.getElementById('disq-title').textContent = s.disqTitle;
      document.getElementById('disq-body').textContent = s.disqBody;
      document.getElementById('disq-sub').textContent = s.disqSub;
      document.getElementById('err-fullname').textContent = s.errName;
      document.getElementById('err-phone').textContent = s.errPhone;
      document.getElementById('err-loantype').textContent = s.errLoantype;
      document.getElementById('err-state').textContent = s.errState;
      document.getElementById('err-credit').textContent = s.errCredit;
      document.getElementById('err-down').textContent = s.errDown;
      document.getElementById('err-employment').textContent = s.errEmployment;

      document.getElementById('btn-en').classList.toggle('active', lang === 'en');
      document.getElementById('btn-ar').classList.toggle('active', lang === 'ar');
    };

    // ─── Conditional Logic ───────────────────────────────────────────────
    window.onLoanTypeChange = function() {
      // No special logic needed here yet — state handles it
    };

    window.onStateChange = function() {
      const state = document.getElementById('property_state').value;
      const loanType = document.querySelector('input[name="loan_type"]:checked')?.value;
      const warning = document.getElementById('state-warning');
      if (state === 'other') {
        warning.classList.add('visible');
      } else if ((state === 'NY' || state === 'CT') && loanType !== 'investment') {
        warning.classList.add('visible');
      } else {
        warning.classList.remove('visible');
      }
    };

    window.onCreditChange = function() {
      const score = document.getElementById('credit_score').value;
      const warning = document.getElementById('credit-warning');
      if (score === 'below620' || score === '620-679' || score === 'unknown') {
        warning.classList.add('visible');
      } else {
        warning.classList.remove('visible');
      }
    };

    window.onDownPaymentChange = function() {
      // No warning needed — all are acceptable with different products
    };

    window.onEmploymentChange = function() {
      const emp = document.querySelector('input[name="employment"]:checked')?.value;
      const seField = document.getElementById('selfemployed-years');
      if (emp === 'selfemployed') {
        seField.classList.add('visible');
      } else {
        seField.classList.remove('visible');
        document.getElementById('se-warning').classList.remove('visible');
      }
    };

    window.onSEYearsChange = function() {
      const years = document.getElementById('se_years').value;
      const warning = document.getElementById('se-warning');
      if (years === 'under1' || years === '1-2') {
        warning.classList.add('visible');
      } else {
        warning.classList.remove('visible');
      }
    };

    // ─── Qualification Logic ─────────────────────────────────────────────
    function isQualified(data) {
      // Auto-qualify if credit is good
      const goodCredit = ['760plus','720-759','680-719'].includes(data.credit_score);
      // Down payment check
      const downOk = ['20plus','10-19','5-9','3-4'].includes(data.down_payment);
      // Self-employed check
      const empOk = data.employment !== 'selfemployed' || data.se_years === '2plus';
      return goodCredit && downOk;
    }

    // ─── Validation ──────────────────────────────────────────────────────
    function validate() {
      let valid = true;

      const name = document.getElementById('fullname').value.trim();
      const nameErr = document.getElementById('err-fullname');
      if (!name || name.length < 2) {
        document.getElementById('fullname').classList.add('error');
        nameErr.classList.add('visible');
        valid = false;
      } else {
        document.getElementById('fullname').classList.remove('error');
        nameErr.classList.remove('visible');
      }

      const phone = document.getElementById('phone').value.trim();
      const phoneErr = document.getElementById('err-phone');
      if (!phone || phone.replace(/\\D/g,'').length < 10) {
        document.getElementById('phone').classList.add('error');
        phoneErr.classList.add('visible');
        valid = false;
      } else {
        document.getElementById('phone').classList.remove('error');
        phoneErr.classList.remove('visible');
      }

      const loanType = document.querySelector('input[name="loan_type"]:checked');
      const loanErr = document.getElementById('err-loantype');
      if (!loanType) {
        loanErr.classList.add('visible');
        valid = false;
      } else {
        loanErr.classList.remove('visible');
      }

      const state = document.getElementById('property_state').value;
      const stateErr = document.getElementById('err-state');
      if (!state) {
        document.getElementById('property_state').classList.add('error');
        stateErr.classList.add('visible');
        valid = false;
      } else {
        document.getElementById('property_state').classList.remove('error');
        stateErr.classList.remove('visible');
      }

      const credit = document.getElementById('credit_score').value;
      const creditErr = document.getElementById('err-credit');
      if (!credit) {
        document.getElementById('credit_score').classList.add('error');
        creditErr.classList.add('visible');
        valid = false;
      } else {
        document.getElementById('credit_score').classList.remove('error');
        creditErr.classList.remove('visible');
      }

      const down = document.getElementById('down_payment').value;
      const downErr = document.getElementById('err-down');
      if (!down) {
        document.getElementById('down_payment').classList.add('error');
        downErr.classList.add('visible');
        valid = false;
      } else {
        document.getElementById('down_payment').classList.remove('error');
        downErr.classList.remove('visible');
      }

      const emp = document.querySelector('input[name="employment"]:checked');
      const empErr = document.getElementById('err-employment');
      if (!emp) {
        empErr.classList.add('visible');
        valid = false;
      } else {
        empErr.classList.remove('visible');
      }

      return valid;
    }

    // ─── Form Submit ─────────────────────────────────────────────────────
    const form = document.getElementById('intake-form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!validate()) return;

        const btn = document.getElementById('submit-btn');
        btn.disabled = true;
        btn.textContent = currentLang === 'ar' ? 'جاري المعالجة...' : 'Processing...';

        const data = {
          fullname: document.getElementById('fullname').value.trim(),
          phone: document.getElementById('phone').value.trim(),
          email: document.getElementById('email').value.trim(),
          preferred_lang: document.querySelector('input[name="preferred_lang"]:checked')?.value,
          call_time: document.querySelector('input[name="call_time"]:checked')?.value,
          loan_type: document.querySelector('input[name="loan_type"]:checked')?.value,
          property_state: document.getElementById('property_state').value,
          loan_amount: document.getElementById('loan_amount').value,
          credit_score: document.getElementById('credit_score').value,
          down_payment: document.getElementById('down_payment').value,
          employment: document.querySelector('input[name="employment"]:checked')?.value,
          se_years: document.getElementById('se_years').value,
          lead_source: document.getElementById('lead_source').value,
          notes: document.getElementById('notes').value.trim(),
          submitted_at: new Date().toISOString(),
        };

        // Send to backend / webhook (replace URL below with your endpoint)
        // fetch('/api/leads', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) });

        setTimeout(() => {
          document.getElementById('form-section').style.display = 'none';
          if (isQualified(data)) {
            document.getElementById('success-section').classList.add('visible');
          } else {
            document.getElementById('disqualified-section').classList.add('visible');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 800);
      });
    }
    `;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --primary: #1a3c6e;
          --accent: #c8a84b;
          --success: #2e7d32;
          --danger: #c62828;
          --bg: #f5f7fa;
          --card: #ffffff;
          --text: #1a1a2e;
          --muted: #6b7280;
          --border: #d1d5db;
          --radius: 10px;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          padding: 20px;
        }

        .lang-toggle {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          max-width: 640px;
          margin: 0 auto 16px;
        }

        .lang-btn {
          padding: 6px 16px;
          border: 2px solid var(--primary);
          background: transparent;
          color: var(--primary);
          border-radius: 20px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .lang-btn.active {
          background: var(--primary);
          color: white;
        }

        .card {
          background: var(--card);
          border-radius: var(--radius);
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          max-width: 640px;
          margin: 0 auto;
          overflow: hidden;
        }

        .card-header {
          background: var(--primary);
          color: white;
          padding: 28px 32px;
          text-align: center;
        }

        .card-header h1 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .card-header p {
          font-size: 15px;
          opacity: 0.85;
        }

        .badge {
          display: inline-block;
          background: var(--accent);
          color: var(--primary);
          font-size: 12px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 20px;
          margin-top: 10px;
          letter-spacing: 0.5px;
        }

        .card-body {
          padding: 32px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 6px;
        }

        .required::after {
          content: " *";
          color: var(--danger);
        }

        input[type="text"],
        input[type="tel"],
        input[type="email"],
        input[type="number"],
        select,
        textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid var(--border);
          border-radius: var(--radius);
          font-size: 15px;
          color: var(--text);
          background: white;
          transition: border-color 0.2s;
          appearance: none;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(26,60,110,0.08);
        }

        .radio-group, .checkbox-group {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 4px;
        }

        .radio-option, .checkbox-option {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border: 1.5px solid var(--border);
          border-radius: var(--radius);
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
          flex: 1;
          min-width: 130px;
        }

        .radio-option:has(input:checked),
        .checkbox-option:has(input:checked) {
          border-color: var(--primary);
          background: rgba(26,60,110,0.06);
          color: var(--primary);
          font-weight: 600;
        }

        .radio-option input,
        .checkbox-option input {
          width: auto;
          accent-color: var(--primary);
        }

        .section-title {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--muted);
          margin: 28px 0 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border);
        }

        .conditional-field {
          display: none;
          animation: fadeIn 0.2s ease;
        }

        .conditional-field.visible {
          display: block;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .alert {
          padding: 14px 16px;
          border-radius: var(--radius);
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 20px;
          display: none;
        }

        .alert.visible { display: block; }
        .alert-warning { background: #fff8e1; border-left: 4px solid #f59e0b; color: #78350f; }
        .alert-info { background: #e8f4fd; border-left: 4px solid var(--primary); color: var(--primary); }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: var(--accent);
          color: var(--primary);
          border: none;
          border-radius: var(--radius);
          font-size: 17px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.3px;
          margin-top: 8px;
        }

        .submit-btn:hover {
          background: #b8942a;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(200,168,75,0.4);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .success-screen {
          display: none;
          text-align: center;
          padding: 40px 32px;
        }

        .success-screen.visible { display: block; }

        .success-icon {
          font-size: 56px;
          margin-bottom: 16px;
        }

        .success-screen h2 {
          font-size: 22px;
          color: var(--success);
          margin-bottom: 10px;
        }

        .success-screen p {
          color: var(--muted);
          margin-bottom: 24px;
          font-size: 15px;
          line-height: 1.6;
        }

        .calendly-btn {
          display: inline-block;
          padding: 14px 32px;
          background: var(--primary);
          color: white;
          text-decoration: none;
          border-radius: var(--radius);
          font-weight: 700;
          font-size: 16px;
          transition: all 0.2s;
        }

        .calendly-btn:hover {
          background: #0f2a52;
          transform: translateY(-1px);
        }

        .disqualified-screen {
          display: none;
          text-align: center;
          padding: 40px 32px;
        }

        .disqualified-screen.visible { display: block; }

        .disqualified-screen h2 {
          font-size: 20px;
          color: var(--primary);
          margin-bottom: 12px;
        }

        .disqualified-screen p {
          color: var(--muted);
          margin-bottom: 24px;
          font-size: 15px;
          line-height: 1.6;
        }

        .call-btn {
          display: inline-block;
          padding: 14px 32px;
          background: var(--accent);
          color: var(--primary);
          text-decoration: none;
          border-radius: var(--radius);
          font-weight: 700;
          font-size: 16px;
          margin: 0 8px 12px;
        }

        .nmls-footer {
          text-align: center;
          padding: 16px 32px;
          background: #f9fafb;
          border-top: 1px solid var(--border);
          font-size: 11px;
          color: var(--muted);
          line-height: 1.6;
        }

        .error-msg {
          color: var(--danger);
          font-size: 12px;
          margin-top: 4px;
          display: none;
        }

        .error-msg.visible { display: block; }

        input.error, select.error {
          border-color: var(--danger);
        }

        /* RTL support for Arabic */
        [dir="rtl"] {
          font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
        }

        [dir="rtl"] .lang-toggle {
          justify-content: flex-start;
        }

        [dir="rtl"] .alert {
          border-left: none;
          border-right: 4px solid;
        }

        [dir="rtl"] .alert-warning { border-right-color: #f59e0b; }
        [dir="rtl"] .alert-info { border-right-color: var(--primary); }
      `}} />

      <div className="lang-toggle">
        <button className="lang-btn active" onClick={() => window.setLang('en')} id="btn-en">English</button>
        <button className="lang-btn" onClick={() => window.setLang('ar')} id="btn-ar">عربي</button>
      </div>

      <div className="card">
        <div className="card-header">
          <h1 id="header-title">Get Pre-Approved Today</h1>
          <p id="header-sub">Same-day results · No credit impact · 100% free</p>
          <div className="badge" id="header-badge">⚡ Average response: under 1 hour</div>
        </div>

        {/* MAIN FORM */}
        <div className="card-body" id="form-section">
          <form id="intake-form" noValidate>

            {/* CONTACT */}
            <div className="section-title" id="sec-contact">Your Contact Info</div>

            <div className="form-group">
              <label htmlFor="fullname" className="required" id="lbl-name">Full Name</label>
              <input type="text" id="fullname" name="fullname" placeholder="Wael Abdullah" />
              <div className="error-msg" id="err-fullname">Please enter your full name.</div>
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="required" id="lbl-phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" placeholder="+1 (201) 555-0100" />
              <div className="error-msg" id="err-phone">Please enter a valid US phone number.</div>
            </div>

            <div className="form-group">
              <label htmlFor="email" id="lbl-email">Email Address</label>
              <input type="email" id="email" name="email" placeholder="you@email.com" />
            </div>

            <div className="form-group">
              <label id="lbl-lang">Preferred Language</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input type="radio" name="preferred_lang" value="english" defaultChecked /> English
                </label>
                <label className="radio-option">
                  <input type="radio" name="preferred_lang" value="arabic" /> عربي (Arabic)
                </label>
                <label className="radio-option">
                  <input type="radio" name="preferred_lang" value="both" id="lbl-both" /> Both
                </label>
              </div>
            </div>

            <div className="form-group">
              <label id="lbl-calltime">Best Time to Call</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input type="radio" name="call_time" value="morning" /> Morning (9am–12pm)
                </label>
                <label className="radio-option">
                  <input type="radio" name="call_time" value="afternoon" /> Afternoon (12–5pm)
                </label>
                <label className="radio-option">
                  <input type="radio" name="call_time" value="evening" /> Evening (5–8pm)
                </label>
              </div>
            </div>

            {/* LOAN TYPE */}
            <div className="section-title" id="sec-loan">Loan Details</div>

            <div className="form-group">
              <label className="required" id="lbl-loantype">What are you looking to do?</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input type="radio" name="loan_type" value="purchase" onChange={() => window.onLoanTypeChange()} /> Purchase a Home
                </label>
                <label className="radio-option">
                  <input type="radio" name="loan_type" value="refinance" onChange={() => window.onLoanTypeChange()} /> Refinance
                </label>
                <label className="radio-option">
                  <input type="radio" name="loan_type" value="investment" onChange={() => window.onLoanTypeChange()} /> Investment Property
                </label>
              </div>
              <div className="error-msg" id="err-loantype">Please select a loan type.</div>
            </div>

            <div className="form-group">
              <label className="required" id="lbl-state">Property State</label>
              <select id="property_state" name="property_state" onChange={() => window.onStateChange()}>
                <option value="">-- Select State --</option>
                <option value="NJ">New Jersey (NJ)</option>
                <option value="NY">New York (NY)</option>
                <option value="CT">Connecticut (CT)</option>
                <option value="other">Other State</option>
              </select>
              <div className="error-msg" id="err-state">Please select a state.</div>
            </div>

            <div className="alert alert-warning" id="state-warning">
              I'm currently licensed in NJ, and can assist with investment purchases in NY and CT. For other states, I'll connect you with a trusted partner lender.
            </div>

            <div className="form-group">
              <label id="lbl-price">Estimated Purchase Price / Loan Amount</label>
              <input type="number" id="loan_amount" name="loan_amount" placeholder="450000" min="50000" />
            </div>

            {/* QUALIFICATION */}
            <div className="section-title" id="sec-qual">Qualification Info</div>

            <div className="form-group">
              <label className="required" id="lbl-credit">Credit Score Range</label>
              <select id="credit_score" name="credit_score" onChange={() => window.onCreditChange()}>
                <option value="">-- Select Range --</option>
                <option value="760plus">760 or above (Excellent)</option>
                <option value="720-759">720–759 (Very Good)</option>
                <option value="680-719">680–719 (Good)</option>
                <option value="620-679">620–679 (Fair)</option>
                <option value="below620">Below 620</option>
                <option value="unknown">I don't know my score</option>
              </select>
              <div className="error-msg" id="err-credit">Please select your credit score range.</div>
            </div>

            <div className="alert alert-warning" id="credit-warning">
              No problem — I can still help you build a plan to get mortgage-ready. Let's talk.
            </div>

            <div className="form-group">
              <label className="required" id="lbl-downpay">Down Payment Available</label>
              <select id="down_payment" name="down_payment" onChange={() => window.onDownPaymentChange()}>
                <option value="">-- Select --</option>
                <option value="20plus">20% or more</option>
                <option value="10-19">10%–19%</option>
                <option value="5-9">5%–9%</option>
                <option value="3-4">3%–4.9% (FHA)</option>
                <option value="under3">Under 3%</option>
              </select>
              <div className="error-msg" id="err-down">Please select your down payment range.</div>
            </div>

            <div className="form-group">
              <label className="required" id="lbl-employment">Employment Type</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input type="radio" name="employment" value="w2" onChange={() => window.onEmploymentChange()} /> W-2 Employee
                </label>
                <label className="radio-option">
                  <input type="radio" name="employment" value="selfemployed" onChange={() => window.onEmploymentChange()} /> Self-Employed
                </label>
                <label className="radio-option">
                  <input type="radio" name="employment" value="retired" onChange={() => window.onEmploymentChange()} /> Retired
                </label>
                <label className="radio-option">
                  <input type="radio" name="employment" value="other" onChange={() => window.onEmploymentChange()} /> Other
                </label>
              </div>
              <div className="error-msg" id="err-employment">Please select your employment type.</div>
            </div>

            <div className="conditional-field" id="selfemployed-years">
              <div className="form-group">
                <label className="required" id="lbl-seyears">Years Self-Employed</label>
                <select id="se_years" name="se_years" onChange={() => window.onSEYearsChange()}>
                  <option value="">-- Select --</option>
                  <option value="2plus">2 or more years</option>
                  <option value="1-2">1–2 years</option>
                  <option value="under1">Less than 1 year</option>
                </select>
              </div>
              <div className="alert alert-info" id="se-warning">
                For self-employed borrowers with under 2 years, we may still have options. Let's discuss your situation.
              </div>
            </div>

            {/* HOW DID YOU HEAR */}
            <div className="form-group" style={{marginTop: '24px'}}>
              <label id="lbl-source">How did you hear about me?</label>
              <select id="lead_source" name="lead_source">
                <option value="">-- Select --</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook / Facebook Group</option>
                <option value="tiktok">TikTok</option>
                <option value="linkedin">LinkedIn</option>
                <option value="youtube">YouTube</option>
                <option value="referral_friend">Friend / Family Referral</option>
                <option value="referral_accountant">Accountant Referral</option>
                <option value="google">Google Search</option>
                <option value="website">Fintek Mortgage Website</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label id="lbl-notes">Anything else you'd like me to know?</label>
              <textarea id="notes" name="notes" rows="3" placeholder="e.g. I'm in contract and need to close by June 15..."></textarea>
            </div>

            <button type="submit" className="submit-btn" id="submit-btn">
              Get My Free Pre-Approval →
            </button>

          </form>
        </div>

        {/* SUCCESS SCREEN (qualified) */}
        <div className="success-screen" id="success-section">
          <div className="success-icon">🎉</div>
          <h2 id="success-title">You Qualify — Let's Book Your Call!</h2>
          <p id="success-body">
            Great news! Based on your information, you're a strong candidate for pre-approval.
            Book your free 30-minute call below and I'll have your pre-approval ready same day.
          </p>
          <a href="https://calendly.com/abualiwael/30min" target="_blank" rel="noopener noreferrer" className="calendly-btn" id="calendly-btn">
            📅 Book Your Free Call Now
          </a>
          <p style={{marginTop: '16px', fontSize: '13px', color: 'var(--muted)'}}>
            Or call/text directly: <strong><a href="tel:+19173040234" style={{color: 'var(--primary)'}}>+1 (917) 304-0234</a></strong>
          </p>
        </div>

        {/* DISQUALIFIED SCREEN (needs help) */}
        <div className="disqualified-screen" id="disqualified-section">
          <div style={{fontSize: '48px', marginBottom: '16px'}}>💬</div>
          <h2 id="disq-title">Let's Talk — I Can Still Help</h2>
          <p id="disq-body">
            You may not be ready for a mortgage today, but that doesn't mean we can't get you there.
            I work with clients at every stage and can build a free 90-day plan to get you mortgage-ready.
            No pressure — just a conversation.
          </p>
          <a href="https://calendly.com/abualiwael/30min" target="_blank" rel="noopener noreferrer" className="call-btn">📅 Book a Free Consultation</a>
          <br/>
          <p style={{fontSize: '13px', color: 'var(--muted)', marginTop: '8px'}} id="disq-sub">
            Questions? Send me a message on Instagram or Facebook @fintekwael
          </p>
        </div>

        {/* NMLS FOOTER */}
        <div className="nmls-footer">
          Wael Abd El Dayem | NMLS #2171794 | Barrett Financial Group<br/>
          Licensed Mortgage Loan Officer — State of New Jersey<br/>
          Investment property originations also available in New York & Connecticut.<br/>
          This is not a commitment to lend. All loans subject to credit approval.<br/>
          Equal Housing Lender 🏠
        </div>
      </div>
    </>
  );
};

export default ApplyPage;
