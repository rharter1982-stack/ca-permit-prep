(function () {
  "use strict";

  const STORAGE_KEY = "ca_permit_prep_v1";

  // ---------------- Storage helpers ----------------
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { attempts: [], categoryStats: {}, age: "teen" };
      const parsed = JSON.parse(raw);
      return {
        attempts: parsed.attempts || [],
        categoryStats: parsed.categoryStats || {},
        age: parsed.age || "teen",
      };
    } catch (e) {
      return { attempts: [], categoryStats: {}, age: "teen" };
    }
  }
  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  let state = loadState();

  function recordCategoryResult(category, correct) {
    if (!state.categoryStats[category]) state.categoryStats[category] = { correct: 0, total: 0 };
    state.categoryStats[category].total += 1;
    if (correct) state.categoryStats[category].correct += 1;
  }
  function recordAttempt(mode, score, total, passed) {
    state.attempts.unshift({
      mode, score, total, passed,
      date: new Date().toISOString(),
    });
    state.attempts = state.attempts.slice(0, 30);
    saveState(state);
  }

  // ---------------- Navigation ----------------
  const tabs = document.querySelectorAll(".tab");
  const views = document.querySelectorAll(".view");
  function showView(name) {
    views.forEach(v => v.classList.toggle("active", v.id === "view-" + name));
    tabs.forEach(t => t.classList.toggle("active", t.dataset.view === name));
    document.getElementById("tabs").classList.remove("open");
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    if (name === "progress") renderProgress();
  }
  tabs.forEach(t => t.addEventListener("click", () => showView(t.dataset.view)));
  document.querySelectorAll("[data-goto]").forEach(btn => {
    btn.addEventListener("click", () => showView(btn.dataset.goto));
  });
  document.getElementById("menuBtn").addEventListener("click", () => {
    document.getElementById("tabs").classList.toggle("open");
  });

  // ---------------- Age profiles ----------------
  const MINOR_CHECKLIST = [
    "Completed Driver's License/ID application (submitted online via MyDMV)",
    "Parent or guardian's MyDMV approval on file",
    "Proof of identity (passport, certified birth certificate, or permanent resident card)",
    "Social Security number",
    "Two proofs of California residency (unless already on file)",
    "Driver Education completion certificate",
    "Parent/guardian present to sign in person",
    "Application fee",
    "Glasses or contacts if you need them for the vision exam",
  ];

  const AGE_PROFILES = {
    under: {
      label: "Under 15½",
      note: "Not eligible for a permit yet — but this is the perfect prep window. Everything you learn here applies the day you turn 15½.",
      subtitle: "The path ahead for a future applicant (under 15½).",
      exam: { total: 46, pass: 38, who: "applicants under 18" },
      callout: {
        title: "Use the wait to get ahead",
        html: "<p>The minimum age to apply for a California instruction permit is <strong>15½</strong>. You can't apply yet — but you <strong>can</strong> complete Driver Education early so the certificate is ready the day you're eligible, and you can master the knowledge test material now.</p><p>Everything in the Study Guide, Signs, and Practice Exam sections is exactly what you'll face at the DMV.</p>",
      },
      roadmap: [
        { h: "Master the handbook now", p: "Work through the Study Guide and Practice Exams here. The knowledge test is the same one you'll take at 15½ — 46 questions, 38 correct to pass." },
        { h: "Complete Driver Education early", p: "The classroom/online Driver Ed course can be finished before you turn 15½, so your completion certificate is ready for your application." },
        { h: "At 15½: start your application", p: "You and a parent/guardian create MyDMV accounts, submit the application with parent approval, and book your DMV appointment. From there, follow the 15½–17½ path." },
      ],
      facts: [
        { num: "15½", label: "Minimum age to apply for a permit" },
        { num: "46", label: "Questions on the knowledge test you'll take" },
        { num: "38/46", label: "Correct answers needed to pass (≈83%)" },
        { num: "Now", label: "Best time to finish Driver Ed and start studying" },
      ],
      checklist: MINOR_CHECKLIST,
    },
    teen: {
      label: "15½ – 17½",
      note: "The standard teen path: Driver Ed before the permit, then driver training, 50 practice hours, and a 6-month permit hold before the drive test.",
      subtitle: "The standard path for a teen applicant (15½ to 17½).",
      exam: { total: 46, pass: 38, who: "applicants under 18" },
      callout: {
        title: "Driver Ed comes first",
        html: "<p>At this age, you must complete <strong>Driver Education</strong> (classroom or online) and present the completion certificate <strong>before</strong> you can get your instruction permit.</p><p>After the permit: <strong>6 hours</strong> of professional driver training, <strong>50 hours</strong> of supervised practice (10 at night), and a minimum <strong>6-month</strong> permit hold before you can take the drive test.</p>",
      },
      roadmap: [
        { h: "Complete Driver Education", p: "Finish the classroom or online course and get your completion certificate — required before the permit at this age." },
        { h: "Create MyDMV accounts (you + a parent/guardian)", p: "You each create a separate MyDMV account. Your parent/guardian must approve your application online before the appointment." },
        { h: "Start the DL application & schedule your appointment", p: "Fill out the application online, upload proof of identity, California residency, and your Social Security number, then book a field office visit." },
        { h: "Attend your appointment with a parent/guardian", p: "Thumbprint, vision exam, photo, application fee, and the knowledge test — 46 questions, 38 correct (≈83%) to pass. 3 attempts, 7-day wait between retakes." },
        { h: "Practice — 50 supervised hours (10 at night)", p: "Drive only with a licensed adult 25 or older in the front passenger seat. Complete 6 hours of professional driver training, and log 50 practice hours certified by your parent/guardian." },
        { h: "Hold your permit at least 6 months", p: "The DMV requires a minimum 6-month holding period before you're eligible for the behind-the-wheel test." },
        { h: "Pass the behind-the-wheel drive test", p: "Bring a registered, insured, mechanically sound vehicle and a licensed driver 25+. 3 attempts allowed, 14-day wait between retakes, retest fee applies." },
        { h: "Drive on a provisional license (first 12 months)", p: "No driving 11 p.m.–5 a.m. and no passengers under 20 unless a licensed driver 25+ rides along (documented school/work/medical exceptions exist). No cell phone use at all, even hands-free." },
      ],
      facts: [
        { num: "15½", label: "Minimum age for a permit" },
        { num: "46", label: "Questions on the minor's written test" },
        { num: "38/46", label: "Correct answers needed to pass (≈83%)" },
        { num: "3", label: "Attempts before you must reapply" },
        { num: "6 mo", label: "Minimum permit holding period" },
        { num: "50 hrs", label: "Supervised practice required (10 at night)" },
        { num: "25+", label: "Minimum age of your supervising driver" },
        { num: "12 mo", label: "Provisional curfew & passenger restrictions" },
      ],
      checklist: MINOR_CHECKLIST,
    },
    shortcut: {
      label: "17½ – 18",
      note: "A special window: you can get the permit with no Driver Ed/Training — but the license itself still needs them, or your 18th birthday.",
      subtitle: "The shortcut window for applicants between 17½ and 18.",
      exam: { total: 46, pass: 38, who: "applicants under 18" },
      callout: {
        title: "The 17½ rule — why this window matters",
        html: "<p>If you are <strong>at least 17½ years old</strong>, the DMV lets you get your <strong>instruction permit without completing Driver Education or Driver Training</strong> first. That's a real shortcut most people don't know about.</p><p>The catch: to actually get your <strong>driver's license</strong> before turning 18, you'll still need to show proof of completed Driver Ed &amp; Training — <strong>or</strong> simply wait until your 18th birthday, when that requirement disappears entirely. Many 17½ applicants choose to wait for 18 rather than take driver's ed, since the permit itself never requires it at this age.</p>",
      },
      roadmap: [
        { h: "Create a MyDMV account (you + a parent/guardian)", p: "You and a parent or guardian each create a separate MyDMV account. They must approve your application online before your appointment." },
        { h: "Start the DL/ID application & schedule your appointment", p: "Fill out the Driver License/ID application online, upload required documents (proof of identity, California residency, Social Security number), and book a DMV field office appointment." },
        { h: "Attend your appointment with a parent/guardian", p: "Bring your documents. You'll give a thumbprint, pass a vision exam, get your photo taken, pay the application fee, and take the knowledge test — 46 questions, 38 correct (≈83%) to pass. 3 attempts with a 7-day wait between retakes." },
        { h: "Practice — 50 supervised hours (10 at night)", p: "With your permit, drive only with a licensed adult who is 25 or older in the front passenger seat. Log at least 50 hours of practice, including 10 at night, certified by your parent/guardian." },
        { h: "Hold your permit / meet the driver's-ed requirement", p: "Under 18, you generally need 6 months holding your permit, plus completed Driver Ed & Training, before testing. At 17½+, you can skip driver ed/training on the permit — but you'll need it (or to simply turn 18) before the actual license." },
        { h: "Pass the behind-the-wheel drive test", p: "Bring a registered, insured, mechanically sound vehicle and a licensed driver 25+. 3 attempts allowed, 14-day wait between retakes, retest fee applies." },
        { h: "Drive on a provisional license (first 12 months)", p: "No driving 11 p.m.–5 a.m. and no passengers under 20, unless a licensed driver 25+ rides along — with documented exceptions for school, work, or medical needs. No cell phone use at all, even hands-free." },
      ],
      facts: [
        { num: "17½", label: "Permit with no Driver Ed required" },
        { num: "46", label: "Questions on the minor's written test" },
        { num: "38/46", label: "Correct answers needed to pass (≈83%)" },
        { num: "3", label: "Attempts before you must reapply" },
        { num: "50 hrs", label: "Supervised practice required (10 at night)" },
        { num: "25+", label: "Minimum age of your supervising driver" },
        { num: "0.01%", label: "Zero-tolerance BAC limit under 21" },
        { num: "18", label: "Age when the Driver Ed requirement disappears" },
      ],
      checklist: [
        "Completed Driver's License/ID application (submitted online via MyDMV)",
        "Parent or guardian's MyDMV approval on file",
        "Proof of identity (passport, certified birth certificate, or permanent resident card)",
        "Social Security number",
        "Two proofs of California residency (unless already on file)",
        "Driver Education certificate NOT required — you're 17½ or older",
        "Parent/guardian present to sign in person",
        "Application fee",
        "Glasses or contacts if you need them for the vision exam",
      ],
    },
    adult: {
      label: "18+",
      note: "The adult path is the shortest: no Driver Ed, no parent approval, no holding period — and a shorter 36-question test.",
      subtitle: "The streamlined path for adult applicants (18 and older).",
      exam: { total: 36, pass: 30, who: "adult (18+) first-time applicants" },
      callout: {
        title: "The adult path — fewer requirements",
        html: "<p>At 18+, you need <strong>no Driver Education, no Driver Training, and no parent/guardian approval</strong>. There's no mandatory permit holding period and no 50-hour practice log — you take the drive test whenever you're ready.</p><p>The knowledge test is also shorter: <strong>36 questions, 30 correct to pass</strong>. One thing that doesn't change: if you're under 21, California's zero-tolerance alcohol law (0.01% BAC) still applies to you.</p>",
      },
      roadmap: [
        { h: "Create a MyDMV account & complete the application", p: "Fill out the Driver License/ID application online and upload proof of identity, California residency, and your Social Security number. No parent approval needed." },
        { h: "Attend your DMV appointment", p: "Thumbprint, vision exam, photo, application fee, and the knowledge test — 36 questions, 30 correct to pass. 3 attempts with a 7-day wait between retakes." },
        { h: "Practice with your permit as needed", p: "An accompanying licensed driver 18 or older must be in the front seat while you practice. There's no minimum holding period or required hour log for adults." },
        { h: "Pass the behind-the-wheel drive test", p: "Schedule it whenever you feel ready. Bring a registered, insured, mechanically sound vehicle. 3 attempts allowed, 14-day wait between retakes." },
        { h: "Get your full license", p: "No provisional curfew or passenger restrictions apply at 18+. Under 21? The 0.01% zero-tolerance BAC limit and alcohol transport rules still apply until your 21st birthday." },
      ],
      facts: [
        { num: "18+", label: "No Driver Ed or parent approval required" },
        { num: "36", label: "Questions on the adult written test" },
        { num: "30/36", label: "Correct answers needed to pass (≈83%)" },
        { num: "3", label: "Attempts before you must reapply" },
        { num: "None", label: "Required permit holding period" },
        { num: "18+", label: "Minimum age of your accompanying driver" },
        { num: "0.01%", label: "Zero-tolerance BAC if you're under 21" },
        { num: "12 mo", label: "Application validity window" },
      ],
      checklist: [
        "Completed Driver's License/ID application (submitted online via MyDMV)",
        "Proof of identity (passport, certified birth certificate, or permanent resident card)",
        "Social Security number",
        "Two proofs of California residency (unless already on file)",
        "Application fee",
        "Glasses or contacts if you need them for the vision exam",
      ],
    },
  };

  function currentProfile() {
    return AGE_PROFILES[state.age] || AGE_PROFILES.teen;
  }

  function setAge(age) {
    if (!AGE_PROFILES[age]) return;
    state.age = age;
    saveState(state);
    renderAgeUI();
  }

  function renderAgeUI() {
    const p = currentProfile();

    document.querySelectorAll(".age-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.age === state.age);
    });
    document.getElementById("ageNote").textContent = p.note;
    document.getElementById("navExamDesc").textContent =
      `A full simulated DMV knowledge test: ${p.exam.total} questions, ${p.exam.pass} to pass — the real format for ${p.exam.who}.`;

    // Rules view
    document.getElementById("rulesSubtitle").textContent = p.subtitle;
    document.getElementById("rulesCallout").innerHTML = `
      <div class="callout callout-key">
        <div class="callout-icon">★</div>
        <div>
          <h3>${p.callout.title}</h3>
          ${p.callout.html}
        </div>
      </div>`;
    document.getElementById("rulesTimeline").innerHTML = p.roadmap.map((step, i) => `
      <li>
        <div class="tl-dot">${i + 1}</div>
        <div class="tl-body">
          <h4>${step.h}</h4>
          <p>${step.p}</p>
        </div>
      </li>`).join("");
    document.getElementById("rulesFacts").innerHTML = p.facts.map(f => `
      <div class="fact-card"><div class="fact-num">${f.num}</div><div class="fact-label">${f.label}</div></div>`).join("");
    const ul = document.getElementById("checklist");
    ul.innerHTML = "";
    p.checklist.forEach(text => {
      const li = document.createElement("li");
      li.textContent = text;
      ul.appendChild(li);
    });
    document.getElementById("rulesExamCta").textContent = `Start a realistic ${p.exam.total}-question exam`;

    // Exam intro
    document.getElementById("examIntroDesc").innerHTML =
      `Simulates the real DMV knowledge test given to ${p.exam.who}: <strong>${p.exam.total} questions</strong>, ` +
      `drawn at random from every topic, in the same style as the in-office computer terminal — you'll see whether ` +
      `each answer is right or wrong immediately, and you can't go back once you answer.`;
    document.getElementById("examIntroRules").innerHTML = `
      <li>${p.exam.total} multiple-choice questions, one at a time</li>
      <li>Pass score: <strong>${p.exam.pass} correct (≈83%)</strong> — matching the real test for ${p.exam.who}</li>
      <li>No skipping back, no handbook, no notes — just like the real terminal</li>
      <li>Full score breakdown and topic-by-topic review at the end</li>`;
  }

  document.querySelectorAll(".age-btn").forEach(btn => {
    btn.addEventListener("click", () => setAge(btn.dataset.age));
  });
  renderAgeUI();

  // ---------------- Study guide ----------------
  const STUDY_INTROS = {
    signs: "Shape and color carry meaning on their own — you should be able to identify a sign's category even from a distance or when it's partly obscured.",
    signals: "Traffic lights, arrows, and pavement markings tell you exactly what's legal in the lane you're in.",
    row: "Right-of-way is never something you 'have' — it's something other drivers and pedestrians give you when it's safe.",
    speed: "The posted limit is a ceiling, not a target. California's Basic Speed Law requires driving at a speed that's safe for current conditions, which is sometimes lower.",
    turning: "Signal early, stay in your lane, and know exactly where you're and aren't allowed to cross a line.",
    parking: "Curb colors and distance rules (hydrants, crosswalks) show up often on the test.",
    railroad: "Trains can't stop quickly — the rules assume you're the one who has to yield.",
    schoolbus: "Flashing lights on a school bus override normal traffic flow in both directions on most roads.",
    alcohol: "As a driver under 21, California's Zero Tolerance Law applies to you specifically — the rules are stricter than for adult drivers.",
    safety: "Seat belts, car seats, and phone rules apply every time you're behind the wheel, not just during the test.",
    sharing: "Bicyclists, motorcyclists, pedestrians, and large trucks all interact with your vehicle differently — know each one's blind spots and rights.",
    adverse: "Weather and vehicle emergencies are where defensive driving habits actually get used.",
    provisional: "These are the rules that apply to you personally for your first 12 months of licensed driving.",
    process: "The exact numbers here — question counts, wait periods, fees — are asked directly on the test and matter for your own appointment.",
  };

  function renderStudyGuide() {
    const container = document.getElementById("studyAccordion");
    const byCategory = {};
    QUESTION_BANK.forEach(q => {
      if (!byCategory[q.category]) byCategory[q.category] = [];
      byCategory[q.category].push(q);
    });
    Object.keys(CATEGORY_LABELS).forEach(cat => {
      const items = byCategory[cat] || [];
      const acc = document.createElement("div");
      acc.className = "acc-item";
      const uniqueFacts = [];
      const seen = new Set();
      items.forEach(q => {
        if (!seen.has(q.exp)) { seen.add(q.exp); uniqueFacts.push(q.exp); }
      });
      acc.innerHTML = `
        <button class="acc-head" type="button">
          <span>${CATEGORY_LABELS[cat]}</span>
          <span class="chev">▾</span>
        </button>
        <div class="acc-body">
          <div class="acc-body-inner">
            <p class="muted">${STUDY_INTROS[cat] || ""}</p>
            <ul>${uniqueFacts.map(f => `<li>${f}</li>`).join("")}</ul>
          </div>
        </div>`;
      acc.querySelector(".acc-head").addEventListener("click", () => {
        acc.classList.toggle("open");
      });
      container.appendChild(acc);
    });
  }
  renderStudyGuide();

  // ---------------- Signs ----------------
  function svgForShape(shape, color) {
    const stroke = "rgba(0,0,0,.18)";
    switch (shape) {
      case "octagon":
        return `<svg viewBox="0 0 100 100"><polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="${color}" stroke="${stroke}" stroke-width="2"/></svg>`;
      case "triangle-down":
        return `<svg viewBox="0 0 100 100"><polygon points="5,10 95,10 50,95" fill="${color}" stroke="${stroke}" stroke-width="2"/></svg>`;
      case "diamond":
        return `<svg viewBox="0 0 100 100"><polygon points="50,5 95,50 50,95 5,50" fill="${color}" stroke="${stroke}" stroke-width="2"/></svg>`;
      case "pentagon":
        return `<svg viewBox="0 0 100 100"><polygon points="50,5 95,40 78,95 22,95 5,40" fill="${color}" stroke="${stroke}" stroke-width="2"/></svg>`;
      case "circle":
        return `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="${color}" stroke="${stroke}" stroke-width="2"/></svg>`;
      case "rect-v":
        return `<svg viewBox="0 0 100 100"><rect x="20" y="5" width="60" height="90" rx="4" fill="${color}" stroke="${stroke}" stroke-width="2"/></svg>`;
      case "rect-h":
        return `<svg viewBox="0 0 100 100"><rect x="5" y="25" width="90" height="50" rx="4" fill="${color}" stroke="${stroke}" stroke-width="2"/></svg>`;
      case "pennant":
        return `<svg viewBox="0 0 100 100"><polygon points="5,15 95,50 5,85" fill="${color}" stroke="${stroke}" stroke-width="2"/></svg>`;
      default:
        return `<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="${color}"/></svg>`;
    }
  }

  function renderSignFlashcards() {
    const grid = document.getElementById("signFlash");
    grid.innerHTML = "";
    SIGN_CARDS.forEach(card => {
      const el = document.createElement("div");
      el.className = "sign-card";
      el.innerHTML = `
        ${svgForShape(card.shape, card.color)}
        <div class="sign-label">${card.label}</div>
        <div class="sign-meaning">${card.meaning}</div>
        <div class="flip-hint">tap to flip</div>`;
      el.addEventListener("click", () => el.classList.toggle("flipped"));
      grid.appendChild(el);
    });
  }
  renderSignFlashcards();

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  let signQuizState = null;
  function startSignQuiz() {
    const pool = shuffle(SIGN_CARDS).slice(0, Math.min(10, SIGN_CARDS.length));
    signQuizState = { pool, idx: 0, correct: 0 };
    renderSignQuizQuestion();
  }
  function renderSignQuizQuestion() {
    const box = document.getElementById("signQuiz");
    if (signQuizState.idx >= signQuizState.pool.length) {
      box.innerHTML = `
        <div class="result-hero ${signQuizState.correct >= signQuizState.pool.length * 0.7 ? "pass" : "fail"}">
          <div class="result-score">${signQuizState.correct} / ${signQuizState.pool.length}</div>
          <div class="result-verdict">signs identified correctly</div>
        </div>
        <button class="btn btn-primary" id="signQuizAgain">Try Again</button>`;
      document.getElementById("signQuizAgain").addEventListener("click", startSignQuiz);
      return;
    }
    const card = signQuizState.pool[signQuizState.idx];
    const distractors = shuffle(SIGN_CARDS.filter(c => c.label !== card.label)).slice(0, 3).map(c => c.meaning);
    const choices = shuffle([card.meaning, ...distractors]);
    box.innerHTML = `
      <div class="q-meta"><span>Sign ${signQuizState.idx + 1} of ${signQuizState.pool.length}</span><span>Score: ${signQuizState.correct}</span></div>
      <div class="q-card" style="text-align:center;">
        <div style="width:110px;height:110px;margin:0 auto 14px;">${svgForShape(card.shape, card.color)}</div>
        <p class="q-text">What does this sign mean?</p>
        <div class="choice-list" id="signChoiceList"></div>
        <div id="signFeedback"></div>
      </div>`;
    const list = document.getElementById("signChoiceList");
    choices.forEach(choice => {
      const b = document.createElement("button");
      b.className = "choice";
      b.textContent = choice;
      b.addEventListener("click", () => {
        const correct = choice === card.meaning;
        Array.from(list.children).forEach(c => {
          c.disabled = true;
          if (c.textContent === card.meaning) c.classList.add("correct");
          else if (c === b && !correct) c.classList.add("incorrect");
        });
        if (correct) signQuizState.correct++;
        document.getElementById("signFeedback").innerHTML = `
          <div class="feedback ${correct ? "correct" : "incorrect"}">${correct ? "Correct!" : "Not quite."} ${card.meaning}</div>
          <div class="next-row"><button class="btn btn-primary" id="signNextBtn">Next</button></div>`;
        document.getElementById("signNextBtn").addEventListener("click", () => {
          signQuizState.idx++;
          renderSignQuizQuestion();
        });
      });
      list.appendChild(b);
    });
  }

  document.querySelectorAll("[data-signmode]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-signmode]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const mode = btn.dataset.signmode;
      document.getElementById("signFlash").classList.toggle("hidden", mode !== "flash");
      document.getElementById("signQuiz").classList.toggle("hidden", mode !== "quiz");
      if (mode === "quiz") startSignQuiz();
    });
  });

  // ---------------- Shared quiz engine ----------------
  function pickRealisticExamSet() {
    // Mirrors rough topic weighting of the real 46-question minor's test.
    const weights = {
      signs: 8, signals: 4, row: 6, speed: 4, turning: 4, parking: 3,
      railroad: 2, schoolbus: 2, alcohol: 5, safety: 3, sharing: 3, adverse: 3,
      provisional: 4, process: 2,
    };
    const byCategory = {};
    QUESTION_BANK.forEach(q => {
      (byCategory[q.category] = byCategory[q.category] || []).push(q);
    });
    let picked = [];
    Object.keys(weights).forEach(cat => {
      const pool = shuffle(byCategory[cat] || []);
      picked = picked.concat(pool.slice(0, Math.min(weights[cat], pool.length)));
    });
    picked = shuffle(picked);
    // Top up to 46 if some categories were short, drawing from the full remaining pool.
    if (picked.length < 46) {
      const usedIds = new Set(picked.map(q => q.id));
      const remaining = shuffle(QUESTION_BANK.filter(q => !usedIds.has(q.id)));
      picked = picked.concat(remaining.slice(0, 46 - picked.length));
    }
    return picked.slice(0, 46);
  }

  function buildQuizRunner(opts) {
    // opts: { containerRunning, containerResults, questions, passThreshold, mode, onFinish }
    const { containerRunning, containerResults, questions, passThreshold, mode } = opts;
    const runState = { idx: 0, correct: 0, missed: [], locked: false };

    function renderQuestion() {
      if (runState.idx >= questions.length) return finish();
      const q = questions[runState.idx];
      const choiceOrder = shuffle(q.choices.map((c, i) => ({ text: c, correct: i === q.a })));
      containerRunning.innerHTML = `
        <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${(runState.idx / questions.length) * 100}%"></div></div>
        <div class="q-meta"><span>Question ${runState.idx + 1} of ${questions.length}</span><span>Correct so far: ${runState.correct}</span></div>
        <div class="q-card">
          <span class="q-cat-tag">${CATEGORY_LABELS[q.category] || q.category}</span>
          <p class="q-text">${q.q}</p>
          <div class="choice-list runner-choices"></div>
          <div class="runner-feedback"></div>
        </div>`;
      const list = containerRunning.querySelector(".runner-choices");
      const feedbackBox = containerRunning.querySelector(".runner-feedback");
      choiceOrder.forEach(opt => {
        const b = document.createElement("button");
        b.className = "choice";
        b.textContent = opt.text;
        b.addEventListener("click", () => {
          if (runState.locked) return;
          runState.locked = true;
          Array.from(list.children).forEach(c => (c.disabled = true));
          const isCorrect = opt.correct;
          Array.from(list.children).forEach((c, i) => {
            if (choiceOrder[i].correct) c.classList.add("correct");
            else if (choiceOrder[i] === opt && !isCorrect) c.classList.add("incorrect");
          });
          if (isCorrect) runState.correct++;
          else runState.missed.push(q);
          recordCategoryResult(q.category, isCorrect);
          feedbackBox.innerHTML = `
            <div class="feedback ${isCorrect ? "correct" : "incorrect"}">
              ${isCorrect ? "Correct" : "Incorrect"}
              <div class="feedback-exp">${q.exp}</div>
            </div>
            <div class="next-row"><button class="btn btn-primary runner-next">${runState.idx + 1 >= questions.length ? "See Results" : "Next Question"}</button></div>`;
          feedbackBox.querySelector(".runner-next").addEventListener("click", () => {
            runState.locked = false;
            runState.idx++;
            renderQuestion();
          });
        });
        list.appendChild(b);
      });
    }

    function finish() {
      containerRunning.classList.add("hidden");
      containerResults.classList.remove("hidden");
      const total = questions.length;
      const passed = passThreshold != null ? runState.correct >= passThreshold : null;
      recordAttempt(mode, runState.correct, total, passed);
      const pct = Math.round((runState.correct / total) * 100);
      let html = `
        <div class="result-hero ${passed === false ? "fail" : "pass"}">
          <div class="result-score">${runState.correct} / ${total}</div>
          <div class="result-verdict">${pct}%${passThreshold != null ? (passed ? " — PASS" : " — did not pass (need " + passThreshold + ")") : ""}</div>
        </div>`;
      if (runState.missed.length) {
        html += `<h2 class="section-title">Review missed questions</h2>`;
        runState.missed.forEach(q => {
          html += `
            <div class="review-item">
              <div class="rq">${q.q}</div>
              <div class="ra right">Correct answer: ${q.choices[q.a]}</div>
              <div class="rexp">${q.exp}</div>
            </div>`;
        });
      } else {
        html += `<p class="empty-note">Perfect run — no missed questions.</p>`;
      }
      html += `<div class="cta-row"><button class="btn btn-primary runner-restart">${mode === "exam" ? "Start New Exam" : "New Quiz"}</button></div>`;
      containerResults.innerHTML = html;
      containerResults.querySelector(".runner-restart").addEventListener("click", opts.onRestart);
    }

    containerRunning.classList.remove("hidden");
    containerResults.classList.add("hidden");
    containerResults.innerHTML = "";
    renderQuestion();
  }

  // ---------------- Practice Exam ----------------
  const examIntro = document.getElementById("examIntro");
  const examRunning = document.getElementById("examRunning");
  const examResults = document.getElementById("examResults");

  function startExam() {
    examIntro.classList.add("hidden");
    examResults.classList.add("hidden");
    const profile = currentProfile();
    const questions = pickRealisticExamSet().slice(0, profile.exam.total);
    buildQuizRunner({
      containerRunning: examRunning,
      containerResults: examResults,
      questions,
      passThreshold: profile.exam.pass,
      mode: "exam",
      onRestart: () => {
        examResults.classList.add("hidden");
        examIntro.classList.remove("hidden");
        examRunning.classList.add("hidden");
      },
    });
  }
  document.getElementById("startExamBtn").addEventListener("click", startExam);

  // ---------------- Quick Quiz ----------------
  const quizSetup = document.getElementById("quizSetup");
  const quizRunning = document.getElementById("quizRunning");
  const quizResults = document.getElementById("quizResults");
  const quizCategorySelect = document.getElementById("quizCategory");

  Object.keys(CATEGORY_LABELS).forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = CATEGORY_LABELS[cat];
    quizCategorySelect.appendChild(opt);
  });

  document.getElementById("startQuizBtn").addEventListener("click", () => {
    const cat = quizCategorySelect.value;
    const len = parseInt(document.getElementById("quizLength").value, 10);
    let pool = cat === "all" ? QUESTION_BANK.slice() : QUESTION_BANK.filter(q => q.category === cat);
    pool = shuffle(pool).slice(0, Math.min(len, pool.length));
    quizSetup.classList.add("hidden");
    quizResults.classList.add("hidden");
    buildQuizRunner({
      containerRunning: quizRunning,
      containerResults: quizResults,
      questions: pool,
      passThreshold: null,
      mode: "quiz",
      onRestart: () => {
        quizResults.classList.add("hidden");
        quizSetup.classList.remove("hidden");
        quizRunning.classList.add("hidden");
      },
    });
  });

  // ---------------- Progress ----------------
  function renderProgress() {
    const summary = document.getElementById("progressSummary");
    const attempts = state.attempts;
    const examAttempts = attempts.filter(a => a.mode === "exam");
    const bestExam = examAttempts.reduce((best, a) => (!best || a.score / a.total > best.score / best.total ? a : best), null);
    const passCount = examAttempts.filter(a => a.passed).length;
    summary.innerHTML = `
      <div class="fact-card"><div class="fact-num">${attempts.length}</div><div class="fact-label">Total sessions</div></div>
      <div class="fact-card"><div class="fact-num">${examAttempts.length}</div><div class="fact-label">Full practice exams</div></div>
      <div class="fact-card"><div class="fact-num">${passCount}</div><div class="fact-label">Exams passed</div></div>
      <div class="fact-card"><div class="fact-num">${bestExam ? bestExam.score + "/" + bestExam.total : "—"}</div><div class="fact-label">Best exam score</div></div>`;

    const barList = document.getElementById("progressBars");
    const cats = Object.keys(CATEGORY_LABELS).filter(c => state.categoryStats[c] && state.categoryStats[c].total > 0);
    if (!cats.length) {
      barList.innerHTML = `<p class="empty-note">Answer some questions in Quick Quiz or Practice Exam to see topic accuracy here.</p>`;
    } else {
      barList.innerHTML = cats.map(c => {
        const s = state.categoryStats[c];
        const pct = Math.round((s.correct / s.total) * 100);
        return `<div class="bar-row">
          <div class="bar-name">${CATEGORY_LABELS[c]}</div>
          <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
          <div class="bar-pct">${pct}%</div>
        </div>`;
      }).join("");
    }

    const historyEl = document.getElementById("progressHistory");
    if (!attempts.length) {
      historyEl.innerHTML = `<p class="empty-note">No attempts yet.</p>`;
    } else {
      historyEl.innerHTML = attempts.slice(0, 15).map(a => {
        const d = new Date(a.date);
        const label = a.mode === "exam" ? "Practice Exam" : "Quick Quiz";
        const cls = a.passed === true ? "pass" : a.passed === false ? "fail" : "";
        return `<div class="history-item">
          <span>${label} — ${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          <span class="hist-score ${cls}">${a.score}/${a.total}${a.passed === true ? " · PASS" : a.passed === false ? " · FAIL" : ""}</span>
        </div>`;
      }).join("");
    }
  }

  document.getElementById("resetProgressBtn").addEventListener("click", () => {
    if (confirm("Reset all saved progress on this device?")) {
      state = { attempts: [], categoryStats: {} };
      saveState(state);
      renderProgress();
    }
  });

  // Respect OS theme by default; no manual toggle needed since CSS handles prefers-color-scheme.
})();
