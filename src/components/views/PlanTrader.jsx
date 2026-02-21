<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CT3000 – New Trade Plan</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f0f2f7;
    --surface: #fff;
    --card: #fff;
    --border: #e2e6ef;
    --border-hover: #bcc4d8;
    --accent: #3b82f6;
    --accent-glow: rgba(59,130,246,.14);
    --accent-dim: rgba(59,130,246,.08);
    --green: #16a34a;
    --red: #dc2626;
    --amber: #d97706;
    --purple: #9333ea;
    --text-primary: #111827;
    --text-secondary: #6b7280;
    --text-muted: #9ca3af;
    --mono: 'DM Mono', monospace;
    --sans: 'DM Sans', sans-serif;
    --display: 'Syne', sans-serif;
  }

  body {
    background: var(--bg);
    font-family: var(--sans);
    color: var(--text-primary);
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    background-image:
      radial-gradient(ellipse at 20% 50%, rgba(59,130,246,.05) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 20%, rgba(99,102,241,.04) 0%, transparent 50%);
  }

  /* ── Modal shell ── */
  .modal {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    width: 100%; max-width: 620px;
    padding: 36px;
    box-shadow: 0 8px 40px rgba(0,0,0,.08), 0 1px 3px rgba(0,0,0,.05);
    animation: slideUp .38s cubic-bezier(.16,1,.3,1) forwards;
  }

  @keyframes slideUp {
    from { opacity:0; transform:translateY(18px) scale(.98); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }

  .modal-header { display:flex; align-items:center; gap:12px; margin-bottom:24px; }

  .modal-icon {
    width:38px; height:38px; border-radius:10px;
    display:flex; align-items:center; justify-content:center; font-size:18px;
    background:var(--accent-dim); border:1px solid rgba(59,130,246,.25);
    transition: background .25s, border-color .25s;
  }

  .modal-title { font-family:var(--display); font-size:22px; font-weight:700; letter-spacing:-.3px; }
  .modal-subtitle { font-size:12px; color:var(--text-muted); font-family:var(--mono); letter-spacing:.05em; margin-top:2px; }

  .divider { height:1px; background:var(--border); margin:0 0 24px; }

  /* ── Form grid ── */
  .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; }
  .form-group { display:flex; flex-direction:column; gap:7px; }
  .form-group.full { grid-column:1/-1; }

  label {
    font-size:11px; font-family:var(--mono); font-weight:500;
    letter-spacing:.08em; text-transform:uppercase; color:var(--text-secondary);
  }
  label span.req { color:var(--accent); margin-left:2px; }

  /* ── Inputs ── */
  .input-wrap { position:relative; }

  input, select {
    width:100%; background:var(--surface);
    border:1px solid var(--border); border-radius:10px;
    padding:11px 14px; font-family:var(--sans);
    font-size:14px; color:var(--text-primary); outline:none;
    transition:border-color .2s, box-shadow .2s, background .2s;
    -webkit-appearance:none; appearance:none;
  }
  input::placeholder { color:var(--text-muted); }
  input:focus, select:focus { border-color:var(--accent); background:#f5f8ff; box-shadow:0 0 0 3px var(--accent-glow); }
  input:hover:not(:focus), select:hover:not(:focus) { border-color:var(--border-hover); }

  .ticker-input { font-family:var(--mono); font-size:15px; font-weight:500; letter-spacing:.05em; }

  .ticker-badge {
    position:absolute; right:12px; top:50%; transform:translateY(-50%);
    font-family:var(--mono); font-size:10px;
    background:var(--accent-dim); color:var(--accent);
    border:1px solid rgba(59,130,246,.2); border-radius:5px; padding:2px 7px; pointer-events:none;
  }

  .select-wrap { position:relative; }
  .select-wrap::after {
    content:''; position:absolute; right:14px; top:50%; transform:translateY(-50%);
    border-left:4px solid transparent; border-right:4px solid transparent;
    border-top:5px solid var(--text-muted); pointer-events:none;
  }

  input[type="number"] { font-family:var(--mono); }
  input[type="number"]::-webkit-inner-spin-button { -webkit-appearance:none; }
  input[type="date"], input[type="month"] { font-family:var(--mono); font-size:13px; }

  .input-prefix {
    position:absolute; left:12px; top:50%; transform:translateY(-50%);
    font-family:var(--mono); font-size:13px; color:var(--text-muted); pointer-events:none;
  }
  .has-prefix input { padding-left:24px; }

  /* ── Direction toggle ── */
  .dir-toggle { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .dir-btn {
    border:1px solid var(--border); background:var(--surface);
    border-radius:10px; padding:10px 0;
    font-family:var(--mono); font-size:13px; font-weight:500;
    letter-spacing:.06em; cursor:pointer; transition:all .15s;
    color:var(--text-secondary); text-align:center;
  }
  .dir-btn:hover { border-color:var(--border-hover); color:var(--text-primary); }
  .dir-btn.long.active  { background:rgba(22,163,74,.08);  border-color:rgba(22,163,74,.35);  color:var(--green); box-shadow:0 0 0 3px rgba(22,163,74,.07); }
  .dir-btn.short.active { background:rgba(220,38,38,.08);  border-color:rgba(220,38,38,.35);  color:var(--red);   box-shadow:0 0 0 3px rgba(220,38,38,.07); }

  /* ── Price row ── */
  .price-row { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; }

  /* ── Section label ── */
  .section-label {
    font-family:var(--mono); font-size:10px; letter-spacing:.1em;
    text-transform:uppercase; color:var(--text-muted);
    display:flex; align-items:center; gap:8px; grid-column:1/-1;
  }
  .section-label::after { content:''; flex:1; height:1px; background:var(--border); }

  /* ── R:R pill ── */
  .risk-pill {
    grid-column:1/-1;
    background:#f8f9fc; border:1px solid var(--border);
    border-radius:10px; padding:12px 16px;
    display:flex; align-items:center; justify-content:space-between; gap:12px;
  }
  .risk-item { display:flex; flex-direction:column; align-items:center; gap:3px; }
  .risk-label { font-family:var(--mono); color:var(--text-muted); font-size:10px; letter-spacing:.08em; text-transform:uppercase; }
  .risk-value { font-family:var(--mono); color:var(--text-primary); font-size:13px; font-weight:500; }
  .risk-sep { width:1px; height:28px; background:var(--border); flex-shrink:0; }

  /* ── Textarea ── */
  textarea {
    width:100%; background:var(--surface); border:1px solid var(--border);
    border-radius:10px; padding:11px 14px;
    font-family:var(--sans); font-size:13px; color:var(--text-primary);
    outline:none; resize:none; height:68px;
    transition:border-color .2s, box-shadow .2s; line-height:1.5;
  }
  textarea::placeholder { color:var(--text-muted); }
  textarea:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-glow); }

  /* ── Actions ── */
  .actions { display:grid; grid-template-columns:1fr auto; gap:12px; margin-top:24px; align-items:center; }

  .btn-save {
    background:var(--accent); color:#fff; border:none;
    border-radius:10px; padding:13px 28px;
    font-family:var(--display); font-size:14px; font-weight:700;
    letter-spacing:.02em; cursor:pointer; transition:all .15s;
    box-shadow:0 4px 20px rgba(59,130,246,.25);
  }
  .btn-save:hover { background:#2563eb; transform:translateY(-1px); box-shadow:0 6px 28px rgba(59,130,246,.35); }
  .btn-save:active { transform:translateY(0); }

  .btn-cancel {
    background:transparent; color:var(--text-secondary);
    border:1px solid var(--border); border-radius:10px;
    padding:13px 20px; font-family:var(--sans); font-size:14px;
    cursor:pointer; transition:all .15s; white-space:nowrap;
  }
  .btn-cancel:hover { border-color:var(--border-hover); color:var(--text-primary); }

  /* ── OPTIONS strip ── */
  .options-strip {
    grid-column:1/-1;
    display:flex; align-items:center; gap:10px;
  }
  .options-strip::before, .options-strip::after {
    content:''; flex:1; height:1px; background:var(--border);
  }
  .btn-options {
    background:rgba(22,163,74,.07);
    border:1px solid rgba(22,163,74,.28);
    border-radius:8px; padding:7px 16px;
    font-family:var(--mono); font-size:11px; font-weight:500;
    letter-spacing:.07em; color:var(--green);
    cursor:pointer; transition:all .18s; white-space:nowrap;
  }
  .btn-options:hover {
    background:rgba(22,163,74,.13);
    border-color:rgba(22,163,74,.5);
    box-shadow:0 0 0 3px rgba(22,163,74,.08);
  }

  /* ════════════════════════════════
     OPTIONS OVERLAY
  ════════════════════════════════ */
  .overlay {
    position:fixed; inset:0;
    background:rgba(15,18,30,.45);
    backdrop-filter:blur(3px);
    display:flex; align-items:center; justify-content:center;
    padding:24px; z-index:100;
    opacity:0; pointer-events:none;
    transition:opacity .25s;
  }
  .overlay.open { opacity:1; pointer-events:all; }

  .opt-modal {
    background:var(--card); border:1px solid var(--border);
    border-radius:20px; width:100%; max-width:620px; padding:36px;
    box-shadow:0 8px 40px rgba(0,0,0,.1);
    animation:slideUp .38s cubic-bezier(.16,1,.3,1) forwards;
    max-height:90vh; overflow-y:auto;
  }

  /* Strategy 2×2 */
  .strat-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px; }

  .strat-tile {
    border:1.5px solid var(--border); background:var(--surface);
    border-radius:14px; padding:16px 14px;
    cursor:pointer; transition:all .18s;
    display:flex; flex-direction:column; gap:5px;
    text-align:left; position:relative; overflow:hidden;
  }
  .strat-tile:hover { border-color:var(--border-hover); transform:translateY(-1px); }

  .strat-badge {
    position:absolute; top:11px; right:11px;
    font-family:var(--mono); font-size:9px; letter-spacing:.07em;
    padding:2px 6px; border-radius:4px; font-weight:500;
  }
  .badge-bull { background:rgba(22,163,74,.1);   color:var(--green); }
  .badge-bear { background:rgba(220,38,38,.1);   color:var(--red); }
  .badge-neut { background:rgba(215,119,6,.1);   color:var(--amber); }

  .strat-emoji { font-size:20px; line-height:1; }
  .strat-name  { font-family:var(--display); font-size:15px; font-weight:700; color:var(--text-primary); transition:color .18s; }
  .strat-desc  { font-size:12px; color:var(--text-muted); line-height:1.4; }

  /* tile active states */
  .strat-tile.lc.active { border-color:rgba(59,130,246,.5);  background:rgba(59,130,246,.04);  box-shadow:0 0 0 3px rgba(59,130,246,.1); }
  .strat-tile.lc.active .strat-name { color:var(--accent); }
  .strat-tile.lp.active { border-color:rgba(147,51,234,.5);  background:rgba(147,51,234,.04);  box-shadow:0 0 0 3px rgba(147,51,234,.1); }
  .strat-tile.lp.active .strat-name { color:var(--purple); }
  .strat-tile.sc.active { border-color:rgba(220,38,38,.5);   background:rgba(220,38,38,.04);   box-shadow:0 0 0 3px rgba(220,38,38,.1); }
  .strat-tile.sc.active .strat-name { color:var(--red); }
  .strat-tile.sp.active { border-color:rgba(22,163,74,.5);   background:rgba(22,163,74,.04);   box-shadow:0 0 0 3px rgba(22,163,74,.1); }
  .strat-tile.sp.active .strat-name { color:var(--green); }

  /* context hint */
  .strat-hint {
    border-radius:10px; padding:10px 14px;
    font-size:12px; line-height:1.5;
    margin-bottom:20px; display:none;
  }
  .strat-hint.show { display:block; animation:fadeIn .2s ease; }
  @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }

  .hint-lc { background:rgba(59,130,246,.06);  border:1px solid rgba(59,130,246,.2);  color:#1d4ed8; }
  .hint-lp { background:rgba(147,51,234,.06);  border:1px solid rgba(147,51,234,.2);  color:#7e22ce; }
  .hint-sc { background:rgba(220,38,38,.06);   border:1px solid rgba(220,38,38,.2);   color:#991b1b; }
  .hint-sp { background:rgba(22,163,74,.06);   border:1px solid rgba(22,163,74,.2);   color:#14532d; }

  /* Options form (revealed after strategy pick) */
  .opt-form { display:none; }
  .opt-form.show { display:grid; grid-template-columns:1fr 1fr; gap:18px; animation:fadeIn .25s ease; }

  /* coloured left-bar pill for options */
  .opt-pill {
    grid-column:1/-1;
    border-radius:10px; border:1px solid var(--border);
    padding:12px 16px; position:relative; overflow:hidden;
    display:flex; align-items:center; justify-content:space-between; gap:12px;
  }
  .opt-pill::before {
    content:''; position:absolute; left:0; top:0; bottom:0; width:3px; border-radius:10px 0 0 10px;
  }
  .opt-pill.lc { background:rgba(59,130,246,.04); border-color:rgba(59,130,246,.2); }
  .opt-pill.lc::before { background:var(--accent); }
  .opt-pill.lp { background:rgba(147,51,234,.04); border-color:rgba(147,51,234,.2); }
  .opt-pill.lp::before { background:var(--purple); }
  .opt-pill.sc { background:rgba(220,38,38,.04);  border-color:rgba(220,38,38,.2); }
  .opt-pill.sc::before { background:var(--red); }
  .opt-pill.sp { background:rgba(22,163,74,.04);  border-color:rgba(22,163,74,.2); }
  .opt-pill.sp::before { background:var(--green); }

  /* save button colours */
  .btn-save.lc { background:var(--accent); box-shadow:0 4px 20px rgba(59,130,246,.25); }
  .btn-save.lp { background:var(--purple); box-shadow:0 4px 20px rgba(147,51,234,.25); }
  .btn-save.sc { background:var(--red);    box-shadow:0 4px 20px rgba(220,38,38,.25); }
  .btn-save.sp { background:var(--green);  box-shadow:0 4px 20px rgba(22,163,74,.25); }
  .btn-save.lc:hover { background:#2563eb; }
  .btn-save.lp:hover { background:#7e22ce; }
  .btn-save.sc:hover { background:#b91c1c; }
  .btn-save.sp:hover { background:#15803d; }
</style>
</head>
<body>

<!-- ══════════════════════════════════
     MAIN MODAL
══════════════════════════════════ -->
<div class="modal">
  <div class="modal-header">
    <div class="modal-icon">📋</div>
    <div>
      <div class="modal-title">New Trade Plan</div>
      <div class="modal-subtitle">CT3000 · PLANNER</div>
    </div>
  </div>
  <div class="divider"></div>

  <div class="form-grid">

    <div class="form-group full">
      <label>Ticker / Instrument <span class="req">*</span></label>
      <div class="input-wrap">
        <input class="ticker-input" type="text" placeholder="AAPL, ES, EUR/USD…" autocomplete="off">
        <span class="ticker-badge">SYM</span>
      </div>
    </div>

    <div class="form-group">
      <label>Strategy</label>
      <input type="text" placeholder="e.g. Breakout, Scalp…">
    </div>

    <div class="form-group">
      <label>Direction <span class="req">*</span></label>
      <div class="dir-toggle">
        <button class="dir-btn long active" onclick="setDir(this,'long')">▲ LONG</button>
        <button class="dir-btn short" onclick="setDir(this,'short')">▼ SHORT</button>
      </div>
    </div>

    <div class="section-label">Price Levels</div>

    <div class="form-group full">
      <div class="price-row">
        <div class="form-group">
          <label>Entry <span class="req">*</span></label>
          <div class="input-wrap has-prefix">
            <span class="input-prefix">$</span>
            <input type="number" id="m-entry" placeholder="0.00" step="0.01" oninput="mainCalc()">
          </div>
        </div>
        <div class="form-group">
          <label>Target</label>
          <div class="input-wrap has-prefix">
            <span class="input-prefix">$</span>
            <input type="number" id="m-target" placeholder="0.00" step="0.01" oninput="mainCalc()">
          </div>
        </div>
        <div class="form-group">
          <label>Stop Loss</label>
          <div class="input-wrap has-prefix">
            <span class="input-prefix">$</span>
            <input type="number" id="m-stop" placeholder="0.00" step="0.01" oninput="mainCalc()">
          </div>
        </div>
      </div>
    </div>

    <div class="form-group">
      <label>Quantity <span class="req">*</span></label>
      <input type="number" id="m-qty" placeholder="0" min="1" oninput="mainCalc()">
    </div>

    <!-- R:R Pill -->
    <div class="risk-pill">
      <div class="risk-item">
        <span class="risk-label">Position Size</span>
        <span class="risk-value" id="m-pos">—</span>
      </div>
      <div class="risk-sep"></div>
      <div class="risk-item">
        <span class="risk-label">Risk</span>
        <span class="risk-value" id="m-risk" style="color:var(--red)">—</span>
      </div>
      <div class="risk-sep"></div>
      <div class="risk-item">
        <span class="risk-label">Reward</span>
        <span class="risk-value" id="m-reward" style="color:var(--green)">—</span>
      </div>
      <div class="risk-sep"></div>
      <div class="risk-item">
        <span class="risk-label">R:R</span>
        <span class="risk-value" id="m-rr">—</span>
      </div>
    </div>

    <!-- OPTIONS button -->
    <div class="options-strip">
      <button class="btn-options" onclick="openOpt()">🎯 OPTIONS TRADE</button>
    </div>

    <div class="form-group full">
      <label>Thesis / Notes</label>
      <textarea placeholder="Why are you taking this trade? Key levels, catalysts, invalidation…"></textarea>
    </div>

  </div>

  <div class="actions">
    <button class="btn-save">Save Plan</button>
    <button class="btn-cancel">Cancel</button>
  </div>
</div>


<!-- ══════════════════════════════════
     OPTIONS OVERLAY
══════════════════════════════════ -->
<div class="overlay" id="opt-overlay">
<div class="opt-modal">

  <div class="modal-header">
    <div class="modal-icon" id="opt-icon" style="background:rgba(22,163,74,.08);border-color:rgba(22,163,74,.25);">🎯</div>
    <div>
      <div class="modal-title">Options Trade Plan</div>
      <div class="modal-subtitle" id="opt-subtitle">CT3000 · SELECT A STRATEGY</div>
    </div>
  </div>
  <div class="divider"></div>

  <!-- 2×2 Strategy picker -->
  <div class="strat-grid">
    <button class="strat-tile lc" onclick="pickStrat('lc',this)">
      <span class="strat-badge badge-bull">BULLISH</span>
      <span class="strat-emoji">📈</span>
      <span class="strat-name">Long Call</span>
      <span class="strat-desc">Buy the right to purchase. Defined risk, unlimited upside.</span>
    </button>
    <button class="strat-tile lp" onclick="pickStrat('lp',this)">
      <span class="strat-badge badge-bear">BEARISH</span>
      <span class="strat-emoji">📉</span>
      <span class="strat-name">Long Put</span>
      <span class="strat-desc">Buy the right to sell. Defined risk, large downside capture.</span>
    </button>
    <button class="strat-tile sc" onclick="pickStrat('sc',this)">
      <span class="strat-badge badge-neut">BEARISH / NEUTRAL</span>
      <span class="strat-emoji">⚡</span>
      <span class="strat-name">Short Call</span>
      <span class="strat-desc">Sell the right to buy. Collect premium — uncapped risk.</span>
    </button>
    <button class="strat-tile sp" onclick="pickStrat('sp',this)">
      <span class="strat-badge badge-bull">BULLISH / NEUTRAL</span>
      <span class="strat-emoji">🛡</span>
      <span class="strat-name">Short Put</span>
      <span class="strat-desc">Sell the right to sell. Collect premium — risk is assignment.</span>
    </button>
  </div>

  <!-- Context hints -->
  <div class="strat-hint hint-lc" id="hint-lc">📞 <strong>Long Call</strong> — Max loss is the premium paid. Profitable if underlying closes above Strike + Premium at expiry.</div>
  <div class="strat-hint hint-lp" id="hint-lp">🛡 <strong>Long Put</strong> — Max loss is the premium paid. Profitable if underlying closes below Strike − Premium at expiry.</div>
  <div class="strat-hint hint-sc" id="hint-sc">⚠️ <strong>Short Call</strong> — Max gain is premium received. Theoretically unlimited loss if underlying surges. Always plan your stop.</div>
  <div class="strat-hint hint-sp" id="hint-sp">💰 <strong>Short Put</strong> — Max gain is premium received. Risk is being assigned shares at the strike. Best on stocks you'd hold anyway.</div>

  <!-- Options form — shown after strategy selected -->
  <div class="opt-form" id="opt-form">

    <div class="form-group full">
      <label>Underlying <span class="req">*</span></label>
      <div class="input-wrap">
        <input class="ticker-input" type="text" placeholder="AAPL, SPY, QQQ…">
        <span class="ticker-badge">UND</span>
      </div>
    </div>

    <div class="form-group">
      <label>Expiry <span class="req">*</span></label>
      <input type="date">
    </div>

    <div class="form-group">
      <label>Strike <span class="req">*</span></label>
      <div class="input-wrap has-prefix">
        <span class="input-prefix">$</span>
        <input type="number" placeholder="0.00" step="0.50">
      </div>
    </div>

    <div class="form-group">
      <label>Contracts <span class="req">*</span></label>
      <input type="number" placeholder="1" min="1">
    </div>

    <div class="form-group full">
      <label>Thesis / Notes</label>
      <textarea placeholder="Strike rationale, IV context, expected move, exit trigger…"></textarea>
    </div>

  </div><!-- /opt-form -->

  <div class="actions" style="margin-top:24px;">
    <button class="btn-save lc" id="o-save">Save Options Plan</button>
    <button class="btn-cancel" onclick="closeOpt()">← Back</button>
  </div>

</div>
</div><!-- /overlay -->

<script>
  /* ── Main modal ── */
  let mainDir = 'long';

  function setDir(btn, dir) {
    mainDir = dir;
    document.querySelectorAll('.dir-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    mainCalc();
  }

  function fmt(n) {
    if (!n || isNaN(n) || n === 0) return '—';
    const abs = Math.abs(n);
    return '$' + (abs >= 1000
      ? abs.toLocaleString('en-US', {maximumFractionDigits:0})
      : abs.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}));
  }

  function mainCalc() {
    const entry  = parseFloat(document.getElementById('m-entry').value)  || 0;
    const target = parseFloat(document.getElementById('m-target').value) || 0;
    const stop   = parseFloat(document.getElementById('m-stop').value)   || 0;
    const qty    = parseFloat(document.getElementById('m-qty').value)    || 0;

    document.getElementById('m-pos').textContent = (entry && qty) ? fmt(entry * qty) : '—';

    const riskPer   = mainDir === 'long' ? entry - stop   : stop - entry;
    const rewardPer = mainDir === 'long' ? target - entry : entry - target;

    document.getElementById('m-risk').textContent   = (riskPer   > 0 && qty) ? fmt(riskPer   * qty) : '—';
    document.getElementById('m-reward').textContent = (rewardPer > 0 && qty) ? fmt(rewardPer * qty) : '—';

    const rrEl = document.getElementById('m-rr');
    if (riskPer > 0 && rewardPer > 0) {
      const rr = rewardPer / riskPer;
      rrEl.textContent = rr.toFixed(2) + 'R';
      rrEl.style.color = rr >= 2 ? 'var(--green)' : rr >= 1 ? 'var(--amber)' : 'var(--red)';
    } else { rrEl.textContent = '—'; rrEl.style.color = 'var(--text-primary)'; }
  }

  /* ── Options overlay ── */
  const stratMeta = {
    lc: { subtitle:'LONG CALL · BULLISH' },
    lp: { subtitle:'LONG PUT · BEARISH' },
    sc: { subtitle:'SHORT CALL · BEARISH / NEUTRAL' },
    sp: { subtitle:'SHORT PUT · BULLISH / NEUTRAL' },
  };

  function openOpt()  { document.getElementById('opt-overlay').classList.add('open'); }
  function closeOpt() { document.getElementById('opt-overlay').classList.remove('open'); }

  document.getElementById('opt-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('opt-overlay')) closeOpt();
  });

  function pickStrat(type, btn) {
    const m = stratMeta[type];

    document.querySelectorAll('.strat-tile').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    document.getElementById('opt-subtitle').textContent = 'CT3000 · ' + m.subtitle;

    ['hint-lc','hint-lp','hint-sc','hint-sp'].forEach(id => document.getElementById(id).classList.remove('show'));
    document.getElementById('hint-' + type).classList.add('show');

    document.getElementById('opt-form').classList.add('show');
    document.getElementById('o-save').className = 'btn-save ' + type;
  }
</script>
</body>
</html>
