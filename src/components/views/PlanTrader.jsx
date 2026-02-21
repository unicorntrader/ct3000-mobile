import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, Trash2, Play, Target, TrendingUp, Zap, BarChart3, Clock, DollarSign, Brain } from 'lucide-react';

// ─── Scoped styles injected once ───────────────────────────────────────────
const MODAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .pt-overlay {
    position:fixed; inset:0; z-index:1000;
    background:rgba(15,18,30,.5);
    backdrop-filter:blur(4px);
    display:flex; align-items:center; justify-content:center;
    padding:24px;
    animation:pt-fadeIn .2s ease;
  }
  @keyframes pt-fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes pt-slideUp {
    from{opacity:0;transform:translateY(18px) scale(.98)}
    to  {opacity:1;transform:translateY(0) scale(1)}
  }
  @keyframes pt-fadeInUp {
    from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)}
  }

  /* ── shell ── */
  .pt-modal {
    background:#fff; border:1px solid #e2e6ef; border-radius:20px;
    width:100%; max-width:620px; padding:36px;
    box-shadow:0 8px 40px rgba(0,0,0,.1);
    animation:pt-slideUp .38s cubic-bezier(.16,1,.3,1) forwards;
    max-height:90vh; overflow-y:auto;
  }

  /* ── header ── */
  .pt-header { display:flex; align-items:center; gap:12px; margin-bottom:24px; }
  .pt-icon {
    width:38px; height:38px; border-radius:10px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center; font-size:18px;
    background:rgba(59,130,246,.08); border:1px solid rgba(59,130,246,.25);
  }
  .pt-title { font-family:'Syne',sans-serif; font-size:22px; font-weight:700; letter-spacing:-.3px; color:#111827; }
  .pt-subtitle { font-family:'DM Mono',monospace; font-size:12px; color:#9ca3af; letter-spacing:.05em; margin-top:2px; }
  .pt-divider { height:1px; background:#e2e6ef; margin:0 0 24px; }

  /* ── form grid ── */
  .pt-grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; }
  .pt-group { display:flex; flex-direction:column; gap:7px; }
  .pt-group.full { grid-column:1/-1; }

  .pt-label {
    font-family:'DM Mono',monospace; font-size:11px; font-weight:500;
    letter-spacing:.08em; text-transform:uppercase; color:#6b7280;
  }
  .pt-label .req { color:#3b82f6; margin-left:2px; }

  /* ── inputs ── */
  .pt-input-wrap { position:relative; }
  .pt-input, .pt-select, .pt-textarea {
    width:100%; background:#fff; border:1px solid #e2e6ef; border-radius:10px;
    padding:11px 14px; font-family:'DM Sans',sans-serif;
    font-size:14px; color:#111827; outline:none;
    transition:border-color .2s, box-shadow .2s, background .2s;
    -webkit-appearance:none; appearance:none; box-sizing:border-box;
  }
  .pt-input::placeholder, .pt-textarea::placeholder { color:#9ca3af; }
  .pt-input:focus, .pt-select:focus, .pt-textarea:focus {
    border-color:#3b82f6; background:#f5f8ff;
    box-shadow:0 0 0 3px rgba(59,130,246,.14);
  }
  .pt-input:hover:not(:focus), .pt-select:hover:not(:focus) { border-color:#bcc4d8; }

  .pt-ticker { font-family:'DM Mono',monospace; font-size:15px; font-weight:500; letter-spacing:.05em; }
  .pt-badge {
    position:absolute; right:12px; top:50%; transform:translateY(-50%);
    font-family:'DM Mono',monospace; font-size:10px;
    background:rgba(59,130,246,.08); color:#3b82f6;
    border:1px solid rgba(59,130,246,.2); border-radius:5px; padding:2px 7px; pointer-events:none;
  }
  .pt-select-wrap { position:relative; }
  .pt-select-wrap::after {
    content:''; position:absolute; right:14px; top:50%; transform:translateY(-50%);
    border-left:4px solid transparent; border-right:4px solid transparent;
    border-top:5px solid #9ca3af; pointer-events:none;
  }
  .pt-input[type="number"] { font-family:'DM Mono',monospace; }
  .pt-input[type="number"]::-webkit-inner-spin-button { -webkit-appearance:none; }
  .pt-input[type="date"] { font-family:'DM Mono',monospace; font-size:13px; }
  .pt-prefix {
    position:absolute; left:12px; top:50%; transform:translateY(-50%);
    font-family:'DM Mono',monospace; font-size:13px; color:#9ca3af; pointer-events:none;
  }
  .pt-has-prefix .pt-input { padding-left:24px; }

  /* ── direction toggle ── */
  .pt-dir-toggle { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .pt-dir-btn {
    border:1px solid #e2e6ef; background:#fff; border-radius:10px; padding:10px 0;
    font-family:'DM Mono',monospace; font-size:13px; font-weight:500;
    letter-spacing:.06em; cursor:pointer; transition:all .15s;
    color:#6b7280; text-align:center;
  }
  .pt-dir-btn:hover { border-color:#bcc4d8; color:#111827; }
  .pt-dir-btn.long.active  { background:rgba(22,163,74,.08);  border-color:rgba(22,163,74,.35);  color:#16a34a; box-shadow:0 0 0 3px rgba(22,163,74,.07); }
  .pt-dir-btn.short.active { background:rgba(220,38,38,.08);  border-color:rgba(220,38,38,.35);  color:#dc2626; box-shadow:0 0 0 3px rgba(220,38,38,.07); }

  /* ── price row ── */
  .pt-price-row { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; }

  /* ── section label ── */
  .pt-section {
    font-family:'DM Mono',monospace; font-size:10px; letter-spacing:.1em;
    text-transform:uppercase; color:#9ca3af;
    display:flex; align-items:center; gap:8px; grid-column:1/-1;
  }
  .pt-section::after { content:''; flex:1; height:1px; background:#e2e6ef; }

  /* ── R:R pill ── */
  .pt-rr-pill {
    grid-column:1/-1; background:#f8f9fc; border:1px solid #e2e6ef;
    border-radius:10px; padding:12px 16px;
    display:flex; align-items:center; justify-content:space-between; gap:12px;
  }
  .pt-rr-item { display:flex; flex-direction:column; align-items:center; gap:3px; }
  .pt-rr-label { font-family:'DM Mono',monospace; color:#9ca3af; font-size:10px; letter-spacing:.08em; text-transform:uppercase; }
  .pt-rr-value { font-family:'DM Mono',monospace; color:#111827; font-size:13px; font-weight:500; }
  .pt-rr-sep { width:1px; height:28px; background:#e2e6ef; flex-shrink:0; }

  /* ── textarea ── */
  .pt-textarea { resize:none; height:68px; line-height:1.5; }

  /* ── options strip ── */
  .pt-opt-strip { grid-column:1/-1; display:flex; align-items:center; gap:10px; }
  .pt-opt-strip::before, .pt-opt-strip::after { content:''; flex:1; height:1px; background:#e2e6ef; }
  .pt-opt-btn {
    background:rgba(22,163,74,.07); border:1px solid rgba(22,163,74,.28);
    border-radius:8px; padding:7px 16px;
    font-family:'DM Mono',monospace; font-size:11px; font-weight:500;
    letter-spacing:.07em; color:#16a34a; cursor:pointer;
    transition:all .18s; white-space:nowrap;
  }
  .pt-opt-btn:hover { background:rgba(22,163,74,.13); border-color:rgba(22,163,74,.5); box-shadow:0 0 0 3px rgba(22,163,74,.08); }

  /* ── actions ── */
  .pt-actions { display:grid; grid-template-columns:1fr auto; gap:12px; margin-top:24px; align-items:center; }
  .pt-btn-save {
    background:#3b82f6; color:#fff; border:none; border-radius:10px; padding:13px 28px;
    font-family:'Syne',sans-serif; font-size:14px; font-weight:700; letter-spacing:.02em;
    cursor:pointer; transition:all .15s; box-shadow:0 4px 20px rgba(59,130,246,.25);
  }
  .pt-btn-save:hover:not(:disabled) { background:#2563eb; transform:translateY(-1px); box-shadow:0 6px 28px rgba(59,130,246,.35); }
  .pt-btn-save:disabled { background:#d1d5db; box-shadow:none; cursor:not-allowed; }
  .pt-btn-cancel {
    background:transparent; color:#6b7280; border:1px solid #e2e6ef; border-radius:10px;
    padding:13px 20px; font-family:'DM Sans',sans-serif; font-size:14px;
    cursor:pointer; transition:all .15s; white-space:nowrap;
  }
  .pt-btn-cancel:hover { border-color:#bcc4d8; color:#111827; }

  /* ══════════════════════════════════
     OPTIONS OVERLAY
  ══════════════════════════════════ */
  .pt-opt-overlay {
    position:fixed; inset:0; z-index:1100;
    background:rgba(15,18,30,.5); backdrop-filter:blur(4px);
    display:flex; align-items:center; justify-content:center; padding:24px;
    animation:pt-fadeIn .2s ease;
  }
  .pt-opt-modal {
    background:#fff; border:1px solid #e2e6ef; border-radius:20px;
    width:100%; max-width:620px; padding:36px;
    box-shadow:0 8px 40px rgba(0,0,0,.1);
    animation:pt-slideUp .38s cubic-bezier(.16,1,.3,1) forwards;
    max-height:90vh; overflow-y:auto;
  }

  /* ── strategy 2x2 ── */
  .pt-strat-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px; }
  .pt-strat-tile {
    border:1.5px solid #e2e6ef; background:#fff; border-radius:14px; padding:16px 14px;
    cursor:pointer; transition:all .18s; display:flex; flex-direction:column; gap:5px;
    text-align:left; position:relative; overflow:hidden;
  }
  .pt-strat-tile:hover { border-color:#bcc4d8; transform:translateY(-1px); }
  .pt-strat-badge {
    position:absolute; top:11px; right:11px;
    font-family:'DM Mono',monospace; font-size:9px; letter-spacing:.07em;
    padding:2px 6px; border-radius:4px; font-weight:500;
  }
  .pt-badge-bull { background:rgba(22,163,74,.1);  color:#16a34a; }
  .pt-badge-bear { background:rgba(220,38,38,.1);  color:#dc2626; }
  .pt-badge-neut { background:rgba(215,119,6,.1);  color:#d97706; }
  .pt-strat-emoji { font-size:20px; line-height:1; }
  .pt-strat-name  { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; color:#111827; transition:color .18s; }
  .pt-strat-desc  { font-size:12px; color:#9ca3af; line-height:1.4; }

  .pt-strat-tile.lc.active { border-color:rgba(59,130,246,.5);  background:rgba(59,130,246,.04);  box-shadow:0 0 0 3px rgba(59,130,246,.1); }
  .pt-strat-tile.lc.active .pt-strat-name { color:#3b82f6; }
  .pt-strat-tile.lp.active { border-color:rgba(147,51,234,.5);  background:rgba(147,51,234,.04);  box-shadow:0 0 0 3px rgba(147,51,234,.1); }
  .pt-strat-tile.lp.active .pt-strat-name { color:#9333ea; }
  .pt-strat-tile.sc.active { border-color:rgba(220,38,38,.5);   background:rgba(220,38,38,.04);   box-shadow:0 0 0 3px rgba(220,38,38,.1); }
  .pt-strat-tile.sc.active .pt-strat-name { color:#dc2626; }
  .pt-strat-tile.sp.active { border-color:rgba(22,163,74,.5);   background:rgba(22,163,74,.04);   box-shadow:0 0 0 3px rgba(22,163,74,.1); }
  .pt-strat-tile.sp.active .pt-strat-name { color:#16a34a; }

  /* ── hints ── */
  .pt-hint {
    border-radius:10px; padding:10px 14px; font-size:12px; line-height:1.5;
    margin-bottom:20px; display:none;
  }
  .pt-hint.show { display:block; animation:pt-fadeInUp .2s ease; }
  .pt-hint-lc { background:rgba(59,130,246,.06);  border:1px solid rgba(59,130,246,.2);  color:#1d4ed8; }
  .pt-hint-lp { background:rgba(147,51,234,.06);  border:1px solid rgba(147,51,234,.2);  color:#7e22ce; }
  .pt-hint-sc { background:rgba(220,38,38,.06);   border:1px solid rgba(220,38,38,.2);   color:#991b1b; }
  .pt-hint-sp { background:rgba(22,163,74,.06);   border:1px solid rgba(22,163,74,.2);   color:#14532d; }

  /* ── opt form ── */
  .pt-opt-form { display:none; }
  .pt-opt-form.show { display:grid; grid-template-columns:1fr 1fr; gap:18px; animation:pt-fadeInUp .25s ease; }

  /* ── coloured save btn ── */
  .pt-btn-save.lc { background:#3b82f6; box-shadow:0 4px 20px rgba(59,130,246,.25); }
  .pt-btn-save.lp { background:#9333ea; box-shadow:0 4px 20px rgba(147,51,234,.25); }
  .pt-btn-save.sc { background:#dc2626; box-shadow:0 4px 20px rgba(220,38,38,.25); }
  .pt-btn-save.sp { background:#16a34a; box-shadow:0 4px 20px rgba(22,163,74,.25); }
`;

function useInjectStyles(id, css) {
  useEffect(() => {
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = css;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);
}

// ─── New Plan Modal ────────────────────────────────────────────────────────
function NewPlanModal({ onSave, onClose }) {
  useInjectStyles('pt-modal-styles', MODAL_STYLES);

  const [dir, setDir]       = useState('long');
  const [ticker, setTicker] = useState('');
  const [strategy, setStrat]= useState('');
  const [entry, setEntry]   = useState('');
  const [target, setTarget] = useState('');
  const [stop, setStop]     = useState('');
  const [qty, setQty]       = useState('');
  const [notes, setNotes]   = useState('');
  const [showOpt, setShowOpt] = useState(false);

  // R:R calc
  const rr = useMemo(() => {
    const e = parseFloat(entry) || 0;
    const t = parseFloat(target) || 0;
    const s = parseFloat(stop) || 0;
    const q = parseFloat(qty) || 0;
    if (!e || !q) return null;
    const riskPer   = dir === 'long' ? e - s : s - e;
    const rewardPer = dir === 'long' ? t - e : e - t;
    const fmt = n => n >= 1000 ? '$' + n.toLocaleString('en-US', {maximumFractionDigits:0})
                               : '$' + n.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
    return {
      pos:    fmt(e * q),
      risk:   riskPer   > 0 ? fmt(riskPer   * q) : '—',
      reward: rewardPer > 0 ? fmt(rewardPer * q) : '—',
      ratio:  riskPer > 0 && rewardPer > 0 ? (rewardPer / riskPer) : null,
    };
  }, [entry, target, stop, qty, dir]);

  const rrColor = rr?.ratio ? (rr.ratio >= 2 ? '#16a34a' : rr.ratio >= 1 ? '#d97706' : '#dc2626') : '#111827';

  const isValid = ticker && entry && target && stop && qty &&
    parseFloat(entry) > 0 && parseFloat(target) > 0 &&
    parseFloat(stop) > 0 && parseFloat(qty) > 0;

  function handleSave() {
    onSave({ ticker, strategy, position: dir, entry, target, stopLoss: stop, quantity: qty, notes });
    onClose();
  }

  return (
    <>
      <div className="pt-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="pt-modal">
          {/* Header */}
          <div className="pt-header">
            <div className="pt-icon">📋</div>
            <div>
              <div className="pt-title">New Trade Plan</div>
              <div className="pt-subtitle">CT3000 · PLANNER</div>
            </div>
          </div>
          <div className="pt-divider" />

          {/* Form */}
          <div className="pt-grid">

            {/* Ticker */}
            <div className="pt-group full">
              <label className="pt-label">Ticker / Instrument <span className="req">*</span></label>
              <div className="pt-input-wrap">
                <input className="pt-input pt-ticker" type="text"
                  placeholder="AAPL, ES, EUR/USD…"
                  value={ticker}
                  onChange={e => setTicker(e.target.value.toUpperCase())} />
                <span className="pt-badge">SYM</span>
              </div>
            </div>

            {/* Strategy */}
            <div className="pt-group">
              <label className="pt-label">Strategy</label>
              <input className="pt-input" type="text" placeholder="e.g. Breakout, Scalp…"
                value={strategy} onChange={e => setStrat(e.target.value)} />
            </div>

            {/* Direction */}
            <div className="pt-group">
              <label className="pt-label">Direction <span className="req">*</span></label>
              <div className="pt-dir-toggle">
                <button className={`pt-dir-btn long ${dir === 'long' ? 'active' : ''}`}
                  onClick={() => setDir('long')}>▲ LONG</button>
                <button className={`pt-dir-btn short ${dir === 'short' ? 'active' : ''}`}
                  onClick={() => setDir('short')}>▼ SHORT</button>
              </div>
            </div>

            {/* Price levels */}
            <div className="pt-section">Price Levels</div>
            <div className="pt-group full">
              <div className="pt-price-row">
                <div className="pt-group">
                  <label className="pt-label">Entry <span className="req">*</span></label>
                  <div className="pt-input-wrap pt-has-prefix">
                    <span className="pt-prefix">$</span>
                    <input className="pt-input" type="number" placeholder="0.00" step="0.01"
                      value={entry} onChange={e => setEntry(e.target.value)} />
                  </div>
                </div>
                <div className="pt-group">
                  <label className="pt-label">Target</label>
                  <div className="pt-input-wrap pt-has-prefix">
                    <span className="pt-prefix">$</span>
                    <input className="pt-input" type="number" placeholder="0.00" step="0.01"
                      value={target} onChange={e => setTarget(e.target.value)} />
                  </div>
                </div>
                <div className="pt-group">
                  <label className="pt-label">Stop Loss</label>
                  <div className="pt-input-wrap pt-has-prefix">
                    <span className="pt-prefix">$</span>
                    <input className="pt-input" type="number" placeholder="0.00" step="0.01"
                      value={stop} onChange={e => setStop(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="pt-group">
              <label className="pt-label">Quantity <span className="req">*</span></label>
              <input className="pt-input" type="number" placeholder="0" min="1"
                value={qty} onChange={e => setQty(e.target.value)} />
            </div>

            {/* R:R pill */}
            <div className="pt-rr-pill">
              <div className="pt-rr-item">
                <span className="pt-rr-label">Position Size</span>
                <span className="pt-rr-value">{rr?.pos ?? '—'}</span>
              </div>
              <div className="pt-rr-sep" />
              <div className="pt-rr-item">
                <span className="pt-rr-label">Risk</span>
                <span className="pt-rr-value" style={{color:'#dc2626'}}>{rr?.risk ?? '—'}</span>
              </div>
              <div className="pt-rr-sep" />
              <div className="pt-rr-item">
                <span className="pt-rr-label">Reward</span>
                <span className="pt-rr-value" style={{color:'#16a34a'}}>{rr?.reward ?? '—'}</span>
              </div>
              <div className="pt-rr-sep" />
              <div className="pt-rr-item">
                <span className="pt-rr-label">R:R</span>
                <span className="pt-rr-value" style={{color: rrColor}}>
                  {rr?.ratio ? rr.ratio.toFixed(2) + 'R' : '—'}
                </span>
              </div>
            </div>

            {/* Options strip */}
            <div className="pt-opt-strip">
              <button className="pt-opt-btn" onClick={() => setShowOpt(true)}>🎯 OPTIONS TRADE</button>
            </div>

            {/* Notes */}
            <div className="pt-group full">
              <label className="pt-label">Thesis / Notes</label>
              <textarea className="pt-textarea"
                placeholder="Why are you taking this trade? Key levels, catalysts, invalidation…"
                value={notes} onChange={e => setNotes(e.target.value)} />
            </div>

          </div>

          <div className="pt-actions">
            <button className="pt-btn-save" disabled={!isValid} onClick={handleSave}>Save Plan</button>
            <button className="pt-btn-cancel" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>

      {/* Options overlay — rendered on top */}
      {showOpt && <OptionsOverlay onClose={() => setShowOpt(false)} onSave={plan => { onSave(plan); onClose(); }} />}
    </>
  );
}

// ─── Options Overlay ──────────────────────────────────────────────────────
const STRAT_META = {
  lc: { subtitle: 'LONG CALL · BULLISH' },
  lp: { subtitle: 'LONG PUT · BEARISH' },
  sc: { subtitle: 'SHORT CALL · BEARISH / NEUTRAL' },
  sp: { subtitle: 'SHORT PUT · BULLISH / NEUTRAL' },
};

function OptionsOverlay({ onClose, onSave }) {
  const [optStrat, setOptStrat] = useState(null);
  const [underlying, setUnderlying] = useState('');
  const [expiry, setExpiry] = useState('');
  const [strike, setStrike] = useState('');
  const [contracts, setContracts] = useState('');
  const [notes, setNotes] = useState('');

  const stratColors = { lc:'#3b82f6', lp:'#9333ea', sc:'#dc2626', sp:'#16a34a' };
  const saveColor = optStrat ? stratColors[optStrat] : '#3b82f6';

  const isValid = optStrat && underlying && expiry && strike && contracts;

  function handleSave() {
    onSave({
      ticker: underlying,
      strategy: `options-${optStrat}`,
      position: ['lc','sp'].includes(optStrat) ? 'long' : 'short',
      entry: strike, target: '', stopLoss: '', quantity: contracts, notes,
      optionType: optStrat, expiry,
    });
  }

  return (
    <div className="pt-opt-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="pt-opt-modal">

        {/* Header */}
        <div className="pt-header">
          <div className="pt-icon" style={{background:'rgba(22,163,74,.08)', border:'1px solid rgba(22,163,74,.25)'}}>🎯</div>
          <div>
            <div className="pt-title">Options Trade Plan</div>
            <div className="pt-subtitle">
              {optStrat ? `CT3000 · ${STRAT_META[optStrat].subtitle}` : 'CT3000 · SELECT A STRATEGY'}
            </div>
          </div>
        </div>
        <div className="pt-divider" />

        {/* 2×2 strategy picker */}
        <div className="pt-strat-grid">
          {[
            { id:'lc', emoji:'📈', name:'Long Call',  badge:'BULLISH',          badgeCls:'pt-badge-bull', desc:'Buy the right to purchase. Defined risk, unlimited upside.' },
            { id:'lp', emoji:'📉', name:'Long Put',   badge:'BEARISH',          badgeCls:'pt-badge-bear', desc:'Buy the right to sell. Defined risk, large downside capture.' },
            { id:'sc', emoji:'⚡', name:'Short Call', badge:'BEARISH / NEUTRAL', badgeCls:'pt-badge-neut', desc:'Sell the right to buy. Collect premium — uncapped risk.' },
            { id:'sp', emoji:'🛡', name:'Short Put',  badge:'BULLISH / NEUTRAL', badgeCls:'pt-badge-bull', desc:'Sell the right to sell. Collect premium — risk is assignment.' },
          ].map(s => (
            <button key={s.id}
              className={`pt-strat-tile ${s.id} ${optStrat === s.id ? 'active' : ''}`}
              onClick={() => setOptStrat(s.id)}>
              <span className={`pt-strat-badge ${s.badgeCls}`}>{s.badge}</span>
              <span className="pt-strat-emoji">{s.emoji}</span>
              <span className="pt-strat-name">{s.name}</span>
              <span className="pt-strat-desc">{s.desc}</span>
            </button>
          ))}
        </div>

        {/* Context hints */}
        <div className={`pt-hint pt-hint-lc ${optStrat === 'lc' ? 'show' : ''}`}>📞 <strong>Long Call</strong> — Max loss is the premium paid. Profitable if underlying closes above Strike + Premium at expiry.</div>
        <div className={`pt-hint pt-hint-lp ${optStrat === 'lp' ? 'show' : ''}`}>🛡 <strong>Long Put</strong> — Max loss is the premium paid. Profitable if underlying closes below Strike − Premium at expiry.</div>
        <div className={`pt-hint pt-hint-sc ${optStrat === 'sc' ? 'show' : ''}`}>⚠️ <strong>Short Call</strong> — Max gain is premium received. Theoretically unlimited loss if underlying surges. Always plan your stop.</div>
        <div className={`pt-hint pt-hint-sp ${optStrat === 'sp' ? 'show' : ''}`}>💰 <strong>Short Put</strong> — Max gain is premium received. Risk is being assigned shares at the strike. Best on stocks you'd hold anyway.</div>

        {/* Form */}
        <div className={`pt-opt-form ${optStrat ? 'show' : ''}`}>

          <div className="pt-group full">
            <label className="pt-label">Underlying <span className="req">*</span></label>
            <div className="pt-input-wrap">
              <input className="pt-input pt-ticker" type="text" placeholder="AAPL, SPY, QQQ…"
                value={underlying} onChange={e => setUnderlying(e.target.value.toUpperCase())} />
              <span className="pt-badge">UND</span>
            </div>
          </div>

          <div className="pt-group">
            <label className="pt-label">Expiry <span className="req">*</span></label>
            <input className="pt-input" type="date" value={expiry} onChange={e => setExpiry(e.target.value)} />
          </div>

          <div className="pt-group">
            <label className="pt-label">Strike <span className="req">*</span></label>
            <div className="pt-input-wrap pt-has-prefix">
              <span className="pt-prefix">$</span>
              <input className="pt-input" type="number" placeholder="0.00" step="0.50"
                value={strike} onChange={e => setStrike(e.target.value)} />
            </div>
          </div>

          <div className="pt-group">
            <label className="pt-label">Contracts <span className="req">*</span></label>
            <input className="pt-input" type="number" placeholder="1" min="1"
              value={contracts} onChange={e => setContracts(e.target.value)} />
          </div>

          <div className="pt-group full">
            <label className="pt-label">Thesis / Notes</label>
            <textarea className="pt-textarea"
              placeholder="Strike rationale, IV context, expected move, exit trigger…"
              value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

        </div>

        <div className="pt-actions" style={{marginTop:'24px'}}>
          <button className={`pt-btn-save ${optStrat || 'lc'}`}
            style={{background: saveColor}}
            disabled={!isValid}
            onClick={handleSave}>
            Save Options Plan
          </button>
          <button className="pt-btn-cancel" onClick={onClose}>← Back</button>
        </div>

      </div>
    </div>
  );
}

// ─── Main PlanTrader component ─────────────────────────────────────────────
export const PlanTrader = (props) => {
  const {
    tradePlans,
    newPlan,
    setNewPlan,
    addTradePlan,
    deleteTradePlan,
    executeTradePlan,
    isMobile
  } = props;

  const [showModal, setShowModal] = useState(false);

  // Save: pipe directly into setTradePlans if available, else use the ref/tick workaround
  const pendingRef = useRef(null);
  const [pendingTick, setPendingTick] = useState(0);

  function handleSave(planData) {
    if (props.setTradePlans) {
      props.setTradePlans(prev => [...prev, {
        id: Date.now(),
        ...planData,
        timestamp: new Date().toISOString(),
        status: 'planned',
      }]);
    } else {
      // Fallback: use setNewPlan + addTradePlan via effect
      pendingRef.current = planData;
      setNewPlan({
        ticker: planData.ticker,
        entry: planData.entry,
        target: planData.target,
        stopLoss: planData.stopLoss,
        quantity: planData.quantity,
        notes: planData.notes,
        position: planData.position,
        strategy: planData.strategy || '',
      });
      setPendingTick(t => t + 1);
    }
  }

  useEffect(() => {
    if (pendingTick > 0 && pendingRef.current) {
      addTradePlan();
      pendingRef.current = null;
    }
  }, [pendingTick]);

  const PlansList = () => (
    <div className="space-y-3">
      {tradePlans.map(plan => (
        <div key={plan.id} className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-400">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-2">
                <span className="font-bold text-lg">{plan.ticker}</span>
                {plan.strategy && (
                  <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-600">
                    {plan.strategy}
                  </span>
                )}
                <span className={`px-2 py-0.5 text-xs rounded ${plan.position === 'long' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {plan.position?.toUpperCase()}
                </span>
                <span className={`px-2 py-0.5 text-xs rounded ${plan.status === 'executed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {plan.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{new Date(plan.timestamp).toLocaleDateString()}</p>
              {plan.entry && (
                <p className="text-sm text-gray-600 mt-1">
                  Entry: ${plan.entry}
                  {plan.target   && ` · Target: $${plan.target}`}
                  {plan.stopLoss && ` · Stop: $${plan.stopLoss}`}
                  {plan.quantity && ` · Qty: ${plan.quantity}`}
                  {plan.expiry   && ` · Exp: ${plan.expiry}`}
                </p>
              )}
              {plan.notes && <p className="text-xs text-gray-500 mt-1 italic">{plan.notes}</p>}
            </div>
            <div className="flex space-x-2 ml-3">
              {plan.status === 'planned' && (
                <button onClick={() => executeTradePlan(plan.id)}
                  className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors">
                  <Play className="h-4 w-4" />
                </button>
              )}
              <button onClick={() => deleteTradePlan(plan.id)}
                className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
      {tradePlans.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No trade plans yet</p>
          <p className="text-sm">Hit the button above to create your first plan</p>
        </div>
      )};
      })}
      {tradePlans.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No trade plans yet</p>
          <p className="text-sm">Hit the button above to create your first plan</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Modal */}
      {showModal && <NewPlanModal onSave={handleSave} onClose={() => setShowModal(false)} />}

      {isMobile ? (
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Trade Plans</h2>
            <button onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium">
              <Plus className="h-4 w-4" />
              <span>New Plan</span>
            </button>
          </div>
          <PlansList />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Trade Plans</h2>
            <button onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center space-x-2 font-medium hover:bg-blue-700 transition-colors shadow-sm">
              <Plus className="h-5 w-5" />
              <span>New Plan</span>
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <PlansList />
          </div>
        </div>
      )}
    </>
  );
};
