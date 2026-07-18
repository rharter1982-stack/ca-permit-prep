(function () {
  "use strict";

  const STORAGE_KEY = "ca_permit_prep_v1";

  // ---------------- Storage helpers ----------------
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { attempts: [], categoryStats: {} };
      const parsed = JSON.parse(raw);
      return { attempts: parsed.attempts || [], categoryStats: parsed.categoryStats || {} };
    } catch (e) {
      return { attempts: [], categoryStats: {} };
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

  // ---------------- Home checklist ----------------
  const CHECKLIST_ITEMS = [
    "Completed Driver's License/ID application (submitted online via MyDMV)",
    "Parent or guardian's MyDMV approval on file",
    "Proof of identity (passport, certified birth certificate, or permanent resident card)",
    "Social Security number",
    "Two proofs of California residency (unless already on file)",
    "Driver Education completion certificate — unless you are 17½ or older",
    "Parent/guardian present to sign in person",
    "Application fee",
    "Glasses or contacts if you need them for the vision exam",
  ];
  (function renderChecklist() {
    const ul = document.getElementById("checklist");
    CHECKLIST_ITEMS.forEach(text => {
      const li = document.createElement("li");
      li.textContent = text;
      ul.appendChild(li);
    });
  })();

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
    const questions = pickRealisticExamSet();
    buildQuizRunner({
      containerRunning: examRunning,
      containerResults: examResults,
      questions,
      passThreshold: 38,
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
    const bestExam = examAttempts.reduce((best, a) => (!best || a.score > best.score ? a : best), null);
    const passCount = examAttempts.filter(a => a.passed).length;
    summary.innerHTML = `
      <div class="fact-card"><div class="fact-num">${attempts.length}</div><div class="fact-label">Total sessions</div></div>
      <div class="fact-card"><div class="fact-num">${examAttempts.length}</div><div class="fact-label">Full practice exams</div></div>
      <div class="fact-card"><div class="fact-num">${passCount}</div><div class="fact-label">Exams passed (38+/46)</div></div>
      <div class="fact-card"><div class="fact-num">${bestExam ? bestExam.score + "/46" : "—"}</div><div class="fact-label">Best exam score</div></div>`;

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
