// LOEN LULLABY — section components
// Globals provided: React, LL_PALETTES, applyPalette

// ── Shared atoms ───────────────────────────────────────────────────────────

const llSectionStyle = {
  position: 'relative',
  padding: '120px 6vw',
};

function EyebrowLine({ children, color }) {
  return (
    <div className="mono" style={{
      color: color || 'var(--ink-soft)',
      display: 'flex', alignItems: 'center', gap: 14,
      opacity: .85,
    }}>
      <span style={{
        width: 28, height: 1, background: 'currentColor', opacity: .55,
      }} />
      <span>{children}</span>
    </div>
  );
}

function Rule({ color, margin = '0' }) {
  return <div style={{
    height: 1, background: color || 'var(--rule)', width: '100%', margin,
  }} />;
}

// ── Nav ────────────────────────────────────────────────────────────────────

function LLNav() {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const on = () => setScrolled(window.scrollY > 60);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <nav className="ll-nav" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: scrolled ? '14px 4vw' : '22px 4vw',
      transition: 'padding .3s ease, background .3s ease, backdrop-filter .3s ease',
      background: scrolled ? 'rgba(239,230,211,.78)' : 'transparent',
      backdropFilter: scrolled ? 'blur(14px) saturate(140%)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(14px) saturate(140%)' : 'none',
      borderBottom: scrolled ? '1px solid var(--rule)' : '1px solid transparent',
      color: 'var(--ink)',
    }}>
      <div className="mono" style={{ letterSpacing: '.22em', fontSize: 11 }}>
        LOEN&nbsp;LULLABY
      </div>
      <div className="ll-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
        {['Renderings', 'Plans', 'Visit'].map((s) => (
          <a key={s} className="mono" href={`#${s.toLowerCase()}`}
             style={{ fontSize: 10.5, opacity: .8 }}>{s}</a>
        ))}
      </div>
      <a href="#visit" className="ll-nav-cta" style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '10px 18px', borderRadius: 999,
          background: 'var(--ink)', color: 'var(--cream)',
          fontSize: 13, fontWeight: 500, letterSpacing: '.02em',
          whiteSpace: 'nowrap',
        }}>
          <span className="ll-nav-cta-label">Book a private visit</span>
          <span className="ll-nav-cta-short" style={{ display: 'none' }}>Visit</span>
          <span style={{
            display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
            background: 'var(--accent)',
          }} />
        </a>
    </nav>
  );
}

// ── Hero — three variations ────────────────────────────────────────────────

// Floats above a full-bleed image-slot so its Replace/Remove (which the
// component anchors at top:100%, off-screen here) is still reachable.
// Proxies clicks into the slot's open shadow-DOM buttons + hidden file input.
function FullBleedSlotControls({ slotRef }) {
  const [filled, setFilled] = React.useState(false);
  React.useEffect(() => {
    const el = slotRef.current;
    if (!el) return;
    const check = () => setFilled(el.hasAttribute('data-filled'));
    check();
    const mo = new MutationObserver(check);
    mo.observe(el, { attributes: true, attributeFilter: ['data-filled'] });
    return () => mo.disconnect();
  }, [slotRef]);

  const fire = (act) => {
    const el = slotRef.current;
    if (!el || !el.shadowRoot) return;
    const btn = el.shadowRoot.querySelector(`button[data-act="${act}"]`);
    if (btn) btn.click();
  };

  if (!filled) return null;
  return (
    <div style={{
      position: 'absolute', bottom: 22, right: 22, zIndex: 5,
      display: 'flex', gap: 8,
    }}>
      <button onClick={() => fire('replace')} style={ctrlBtn}>Replace</button>
      <button onClick={() => fire('clear')} style={ctrlBtn}>Remove</button>
    </div>
  );
}
const ctlMonoStyle = "JetBrains Mono, ui-monospace, monospace";
const ctrlBtn = {
  appearance: 'none', border: 0,
  padding: '8px 14px', borderRadius: 999,
  background: 'rgba(0,0,0,.55)', color: '#F7F0DF',
  fontFamily: ctlMonoStyle, fontSize: 10.5, letterSpacing: '.14em',
  textTransform: 'uppercase',
  backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
  cursor: 'pointer',
};

function HeroPleinAir() {
  const slotRef = React.useRef(null);
  return (
    <section data-screen-label="Hero" className="ll-section" style={{
      position: 'relative', minHeight: '100vh', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      padding: '0 0 8vh',
    }}>
      <image-slot
        ref={slotRef}
        id="hero-pleinair"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        shape="rect"
        placeholder="Hero rendering — exterior elevation, golden hour"
      ></image-slot>
      <FullBleedSlotControls slotRef={slotRef} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(30,37,40,.32) 0%, rgba(30,37,40,0) 28%, rgba(30,37,40,0) 50%, rgba(30,37,40,.62) 100%)',
      }} />

      <div style={{ position: 'relative', padding: '0 6vw', color: '#F7F0DF', pointerEvents: 'none' }}>
        <div className="mono" style={{ opacity: .9, marginBottom: 26, color: '#F7F0DF' }}>
          NORTH BEACH · MIAMI BEACH · MMXXVI
        </div>
        <h1 className="display" style={{
          fontSize: 'clamp(72px, 14vw, 220px)',
          margin: 0, lineHeight: .9, letterSpacing: '-.01em',
          color: '#F7F0DF',
        }}>
          Loen Lullaby
        </h1>
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginTop: 36, gap: 40, flexWrap: 'wrap',
        }}>
          <p style={{
            maxWidth: 480, margin: 0, fontSize: 17, lineHeight: 1.55,
            color: 'rgba(247,240,223,.92)',
          }}>
            Four duplex residences on Byron Avenue, two blocks from the Atlantic.
            Three bedrooms, three terraces, a rooftop solarium — quietly Miami.
          </p>
          <div className="mono" style={{ color: 'rgba(247,240,223,.7)', whiteSpace: 'nowrap' }}>
            ↓ Scroll
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroEditorial() {
  return (
    <section data-screen-label="Hero" className="ll-2col ll-section" style={{
      minHeight: '100vh', padding: '14vh 6vw 6vh',
      display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: '6vw',
      alignItems: 'center',
    }}>
      <div>
        <EyebrowLine>An Address · North Beach · Miami</EyebrowLine>
        <h1 className="display" style={{
          fontSize: 'clamp(72px, 11vw, 180px)',
          margin: '18px 0 0', lineHeight: .92, letterSpacing: '-.012em',
          textWrap: 'balance',
        }}>
          Loen<br/>Lullaby
        </h1>
        <Rule margin="48px 0 28px" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, maxWidth: 520 }}>
          <div>
            <div className="mono" style={{ color: 'var(--ink-soft)', marginBottom: 6 }}>The Building</div>
            <div style={{ fontSize: 15.5, color: 'var(--ink-soft)' }}>
              Four duplex residences across four storeys + parking. Three
              bedrooms, three terraces, two parking spaces each.
            </div>
          </div>
          <div>
            <div className="mono" style={{ color: 'var(--ink-soft)', marginBottom: 6 }}>Delivery</div>
            <div style={{ fontSize: 15.5, color: 'var(--ink-soft)' }}>
              Reservations open · groundbreaking Q1 2026.
            </div>
          </div>
        </div>
        <a href="#visit" style={{
          display: 'inline-flex', alignItems: 'center', gap: 14, marginTop: 48,
          padding: '14px 22px 14px 26px', borderRadius: 999,
          background: 'var(--ink)', color: 'var(--cream)',
          fontSize: 14, letterSpacing: '.02em',
        }}>
          Book a private visit
          <span style={{
            width: 26, height: 26, borderRadius: '50%',
            background: 'var(--accent)', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center', color: 'var(--cream)',
          }}>→</span>
        </a>
      </div>

      <div style={{ position: 'relative' }}>
        <image-slot
          id="hero-editorial"
          class="ll-hero-editorial-img"
          style={{ width: '100%', aspectRatio: '4 / 5', display: 'block' }}
          shape="rounded" radius="2"
          placeholder="Hero rendering — portrait, exterior or interior moment"
        ></image-slot>
        <div className="mono" style={{
          position: 'absolute', bottom: -28, right: 0,
          color: 'var(--ink-soft)',
        }}>
          PL.01 — STUDY OF FAÇADE AT 4:42 PM
        </div>
      </div>
    </section>
  );
}

function HeroPostcard() {
  return (
    <section data-screen-label="Hero" className="ll-section" style={{
      minHeight: '100vh', padding: '12vh 6vw 6vh',
      display: 'flex', flexDirection: 'column', gap: 48,
    }}>
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        gap: 40, flexWrap: 'wrap',
      }}>
        <div>
          <EyebrowLine>A Boutique Address · North Beach</EyebrowLine>
          <h1 className="display" style={{
            fontSize: 'clamp(72px, 14vw, 220px)',
            margin: '14px 0 0', lineHeight: .9, letterSpacing: '-.014em',
          }}>
            Loen Lullaby
          </h1>
        </div>
        <div style={{ textAlign: 'right', minWidth: 200 }}>
          <div className="mono" style={{ color: 'var(--ink-soft)', marginBottom: 6 }}>
            25.86° N · 80.12° W
          </div>
          <div style={{ fontSize: 15.5, color: 'var(--ink-soft)', maxWidth: 280 }}>
            A small landmark, written in warm stone and water.
          </div>
        </div>
      </div>

      <image-slot
        id="hero-postcard"
        style={{ width: '100%', aspectRatio: '21 / 9', display: 'block' }}
        shape="rounded" radius="2"
        placeholder="Hero rendering — wide exterior, postcard format"
      ></image-slot>

      <div className="ll-hero-postcard-stats" style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 24, borderTop: '1px solid var(--rule)', paddingTop: 22,
      }}>
        {[
          ['GROUNDBREAKING', 'Q1 2026'],
          ['RESIDENCES', 'Four Duplexes'],
          ['STORIES', 'Four + Parking'],
          ['TO THE OCEAN', '2 Blocks'],
        ].map(([k, v]) => (
          <div key={k}>
            <div className="mono" style={{ color: 'var(--ink-soft)', marginBottom: 8 }}>{k}</div>
            <div className="display" style={{ fontSize: 26 }}>{v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LLHero({ variation }) {
  if (variation === 'editorial') return <HeroEditorial />;
  if (variation === 'postcard')  return <HeroPostcard />;
  return <HeroPleinAir />;
}

// ── Vision ─────────────────────────────────────────────────────────────────

function LLVision() {
  return (
    <section id="vision" data-screen-label="Vision" style={{
      ...llSectionStyle,
      padding: '160px 6vw 140px',
      background: 'var(--cream)',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '8vw',
        maxWidth: 1480, margin: '0 auto',
      }}>
        <div>
          <EyebrowLine>Chapter One</EyebrowLine>
          <h2 className="display" style={{
            fontSize: 'clamp(48px, 6vw, 92px)',
            margin: '20px 0 0', lineHeight: .98, letterSpacing: '-.008em',
          }}>
            A quiet rise on the cusp of a new North Beach.
          </h2>
          <div style={{ marginTop: 40, maxWidth: 360 }}>
            <image-slot
              id="vision-detail"
              style={{ width: '100%', aspectRatio: '4 / 5', display: 'block' }}
              shape="rounded" radius="2"
              placeholder="Material study — travertine, teak, brass"
            ></image-slot>
            <div className="mono" style={{
              color: 'var(--ink-soft)', marginTop: 12,
            }}>
              FIG. A — A study in warm stone & banded wood
            </div>
          </div>
        </div>

        <div style={{ paddingTop: 12 }}>
          <p style={{
            fontSize: 22, lineHeight: 1.45, margin: 0,
            color: 'var(--ink)', textWrap: 'pretty',
            fontWeight: 300,
          }}>
            North Beach is changing — slowly, then all at once. New parkland at
            Ocean Terrace, a renewed Oceanside, and a quiet wave of small,
            considered buildings replacing what came before.
          </p>
          <p style={{
            marginTop: 28, fontSize: 16.5, lineHeight: 1.7,
            color: 'var(--ink-soft)', maxWidth: 620,
          }}>
            Loen Lullaby sits inside that change without raising its voice.
            Thirty-two residences across eight floors, each oriented to the
            Atlantic and the dawn light off Collins. Travertine the color of
            wet sand. Teak that softens with the salt. Brass that is allowed
            to wear honestly. A small lobby, a quiet pool, a roof you can hear
            the surf from.
          </p>

          <div style={{
            marginTop: 56, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36,
            maxWidth: 620,
          }}>
            {[
              ['Architecture', 'A study in mid-century proportion, recast for the salt and sun of Miami Beach.'],
              ['Materials', 'Honest, warm, and quietly aged. Travertine, teak, unlacquered brass, raw linen.'],
              ['Site', 'Two blocks from the ocean, one block from the new park, an unhurried walk to dinner.'],
              ['Rhythm', 'Four residences per floor. Two corners. One lullaby.'],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="display" style={{
                  fontSize: 26, marginBottom: 8, color: 'var(--ink)',
                }}>{k}</div>
                <div style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Renderings gallery ─────────────────────────────────────────────────────

function LLRenderings() {
  return (
    <section id="renderings" data-screen-label="Renderings" className="ll-section ll-section-py" style={{
      ...llSectionStyle,
      padding: '140px 6vw 120px',
      background: 'var(--sand)',
    }}>
      <div style={{ maxWidth: 1480, margin: '0 auto' }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          gap: 40, marginBottom: 64, flexWrap: 'wrap',
        }}>
          <div>
            <EyebrowLine>Chapter Two — Renderings</EyebrowLine>
            <h2 className="display" style={{
              fontSize: 'clamp(48px, 6vw, 88px)', margin: '20px 0 0', lineHeight: 1,
            }}>
              The building, imagined.
            </h2>
          </div>
          <div style={{ maxWidth: 360, color: 'var(--ink-soft)', fontSize: 15 }}>
            A small portfolio of the residences and shared spaces, rendered from the
            current studies. Final selections at hand-over.
          </div>
        </div>

        {/* Asymmetric editorial grid */}
        <div className="ll-render-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridAutoRows: '100px',
          gap: 18,
        }}>
          <div style={{ gridColumn: 'span 8', gridRow: 'span 5' }}>
            <RGSlot id="r1" caption="PL.02 — The Living Room" />
          </div>
          <div style={{ gridColumn: 'span 4', gridRow: 'span 5' }}>
            <RGSlot id="r2" caption="PL.03 — The Façade, at golden hour" />
          </div>
          <div style={{ gridColumn: 'span 4', gridRow: 'span 4' }}>
            <RGSlot id="r3" caption="PL.04 — The Sitting Room" />
          </div>
          <div style={{ gridColumn: 'span 5', gridRow: 'span 4' }}>
            <RGSlot id="r4" caption="PL.05 — The Kitchen" />
          </div>
          <div style={{ gridColumn: 'span 3', gridRow: 'span 4' }}>
            <RGSlot id="r5" caption="PL.06 — The Patio" />
          </div>
        </div>
      </div>
    </section>
  );
}

function RGSlot({ id, caption }) {
  return (
    <figure style={{ margin: 0, height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <image-slot
        id={`render-${id}`}
        style={{ flex: 1, width: '100%', display: 'block' }}
        shape="rounded" radius="2"
        placeholder={caption}
      ></image-slot>
      <figcaption className="mono" style={{ color: 'var(--ink-soft)' }}>
        {caption}
      </figcaption>
    </figure>
  );
}

// ── Floor plans ────────────────────────────────────────────────────────────

const PLAN_LIST = [
  { id: 'A', name: 'Residence 01',  area: '181.2 m²', bb: '3 BR · 3 BA · 2 parking', exp: 'Type A',           note: 'The Type A duplex — kitchen, dining and living on the entry level, three bedrooms above. A front terrace, rear terrace and rooftop solarium bring outdoor space to 34% of the home.' },
  { id: 'B', name: 'Residence 02',  area: '181.2 m²', bb: '3 BR · 3 BA · 2 parking', exp: 'Type A · reverse', note: 'The Type A plan, mirrored. The same two-storey, three-bedroom layout — living below, bedrooms above — with front, rear and rooftop terraces and two parking spaces.' },
  { id: 'C', name: 'Residence 03',  area: '181.2 m²', bb: '3 BR · 3 BA · 2 parking', exp: 'Type A',           note: 'The Type A duplex — kitchen, dining and living on the entry level, three bedrooms above. A front terrace, rear terrace and rooftop solarium bring outdoor space to 34% of the home.' },
  { id: 'D', name: 'Residence 04',  area: '181.2 m²', bb: '3 BR · 3 BA · 2 parking', exp: 'Type A · reverse', note: 'The Type A plan, mirrored. The same two-storey, three-bedroom layout — living below, bedrooms above — with front, rear and rooftop terraces and two parking spaces.' },
];

function LLFloorPlans() {
  const [active, setActive] = React.useState('A');
  const plan = PLAN_LIST.find((p) => p.id === active);

  return (
    <section id="plans" data-screen-label="Floor Plans" className="ll-section ll-section-py" style={{
      ...llSectionStyle,
      padding: '140px 6vw 140px',
      background: 'var(--cream)',
    }}>
      <div style={{ maxWidth: 1480, margin: '0 auto' }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          gap: 40, marginBottom: 64, flexWrap: 'wrap',
        }}>
          <div>
            <EyebrowLine>Chapter Three — Plans</EyebrowLine>
            <h2 className="display" style={{
              fontSize: 'clamp(48px, 6vw, 88px)', margin: '20px 0 0', lineHeight: 1,
            }}>
              Four ways to live here.
            </h2>
          </div>
          <div style={{ maxWidth: 380, color: 'var(--ink-soft)', fontSize: 15 }}>
            Four duplex homes, each ≈ 181 m² — 118 m² of interior living plus 62 m² of
            front, rear and rooftop terraces. Two parking spaces apiece.
          </div>
        </div>

        <div className="ll-2col" style={{ display: 'grid', gridTemplateColumns: '1.25fr 1.75fr', gap: 64 }}>
          {/* List */}
          <div>
            {PLAN_LIST.map((p) => {
              const on = p.id === active;
              return (
                <button
                  key={p.id}
                  onClick={() => setActive(p.id)}
                  style={{
                    width: '100%', textAlign: 'left',
                    background: 'transparent', border: 0,
                    padding: '22px 0',
                    borderTop: '1px solid var(--rule)',
                    cursor: 'pointer',
                    display: 'grid', gridTemplateColumns: '32px 1fr auto',
                    alignItems: 'baseline', gap: 16,
                    color: on ? 'var(--ink)' : 'var(--ink-soft)',
                    transition: 'color .2s',
                  }}
                >
                  <span className="mono" style={{ color: on ? 'var(--accent)' : 'var(--ink-soft)' }}>
                    0{PLAN_LIST.indexOf(p) + 1}
                  </span>
                  <span className="display" style={{
                    fontSize: 24,
                    textDecoration: on ? 'underline' : 'none',
                    textDecorationColor: 'var(--accent)',
                    textUnderlineOffset: 6,
                    textDecorationThickness: '1px',
                  }}>
                    {p.name}
                  </span>
                  <span className="mono" style={{ color: 'var(--ink-soft)' }}>{p.area}</span>
                </button>
              );
            })}
            <div style={{ borderTop: '1px solid var(--rule)' }} />

            <div style={{ marginTop: 40, maxWidth: 360 }}>
              <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                {plan.note}
              </p>
              <div className="ll-form-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 24 }}>
                <div>
                  <div className="mono" style={{ color: 'var(--ink-soft)', marginBottom: 6 }}>Layout</div>
                  <div style={{ fontSize: 14 }}>{plan.bb}</div>
                </div>
                <div>
                  <div className="mono" style={{ color: 'var(--ink-soft)', marginBottom: 6 }}>Plan type</div>
                  <div style={{ fontSize: 14 }}>{plan.exp}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Plan rendering — slot per plan, only the active shows */}
          <div style={{ position: 'relative' }}>
            <div className="ll-plan-canvas" style={{ position: 'relative', aspectRatio: '4 / 3', background: 'var(--sand)' }}>
              {PLAN_LIST.map((p) => (
                <div key={p.id} style={{
                  position: 'absolute', inset: 0,
                  opacity: p.id === active ? 1 : 0,
                  transition: 'opacity .35s ease',
                  pointerEvents: p.id === active ? 'auto' : 'none',
                }}>
                  <image-slot
                    id={`plan-${p.id}`}
                    style={{ width: '100%', height: '100%', display: 'block' }}
                    shape="rect"
                    fit="contain"
                    placeholder={`Floor plan — Residence ${p.id}`}
                  ></image-slot>
                </div>
              ))}
            </div>
            <div className="mono" style={{
              color: 'var(--ink-soft)', marginTop: 14,
              display: 'flex', justifyContent: 'space-between',
            }}>
              <span>PLAN {plan.id} · {plan.area}</span>
              <span>NORTH BEACH · MIAMI BEACH</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Quiet investor band ────────────────────────────────────────────────────

function LLInvestorBand() {
  return (
    <section data-screen-label="Investor" className="ll-section ll-section-py" style={{
      padding: '110px 6vw',
      background: 'var(--ink)', color: 'var(--cream)',
    }}>
      <div style={{ maxWidth: 1480, margin: '0 auto' }}>
        <EyebrowLine color="rgba(247,240,223,.7)">The neighborhood, and the building</EyebrowLine>
        <h2 className="display" style={{
          fontSize: 'clamp(40px, 5vw, 72px)',
          margin: '20px 0 32px', lineHeight: 1, maxWidth: 900,
          color: 'var(--cream)',
        }}>
          A quiet home on a neighborhood becoming itself.
        </h2>
        <p style={{
          maxWidth: 760, fontSize: 17, lineHeight: 1.6,
          color: 'rgba(247,240,223,.78)', margin: '0 0 56px',
        }}>
          A four-storey family building of four duplex residences on Byron
          Avenue — near a school, the parks and the Atlantic, and fifteen to
          twenty minutes from the bustle of South Beach. Modest streets are
          quietly becoming Miami, and Lullaby Residences is meant to belong
          to both.
        </p>

        <div className="ll-stats-4" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40,
        }}>
          {[
            ['A quiet four-storey\nfamily building', '4 Duplexes', 'Three bedrooms · three terraces · two parking each'],
            ['Walk to\nAtlantic Ocean', '2 Blocks', 'A few minutes from the front door'],
            ['Drive to\nSouth Beach', '15–20 min', 'Quiet here — lively a few miles south'],
            ['Outdoor\nLiving', '34%', 'Of every residence — terrace & solarium'],
          ].map(([k, v, sub]) => (
            <div key={k} style={{ borderTop: '1px solid rgba(247,240,223,.18)', paddingTop: 22 }}>
              <div className="mono" style={{ color: 'rgba(247,240,223,.6)', whiteSpace: 'pre-line', marginBottom: 20 }}>
                {k}
              </div>
              <div className="display" style={{
                fontSize: 'clamp(40px, 4.4vw, 64px)', lineHeight: 1,
                color: 'var(--accent)',
              }}>
                {v}
              </div>
              <div style={{ fontSize: 12.5, color: 'rgba(247,240,223,.6)', marginTop: 14, lineHeight: 1.5 }}>
                {sub}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 56, fontSize: 12, color: 'rgba(247,240,223,.45)', maxWidth: 720 }}>
          Areas are approximate — each residence is ≈ 181 m² (≈ 1,950 sf), comprising
          118.5 m² of interior living and 62.5 m² of front, rear and rooftop terraces.
          Investment materials and full pro‑forma available on request.
        </div>
      </div>
    </section>
  );
}

// ── Visit (contact + map) ──────────────────────────────────────────────────

function LLVisit() {
  const [submitted, setSubmitted] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', email: '', phone: '', date: '', interest: 'B' });
  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <section id="visit" data-screen-label="Visit" className="ll-section ll-section-py" style={{
      ...llSectionStyle,
      padding: '140px 6vw 100px',
      background: 'var(--sand-deep)',
    }}>
      <div style={{ maxWidth: 1480, margin: '0 auto' }}>
        <div style={{ marginBottom: 64, maxWidth: 820 }}>
          <EyebrowLine>Chapter Five — Visit</EyebrowLine>
          <h2 className="display" style={{
            fontSize: 'clamp(48px, 6.5vw, 96px)',
            margin: '20px 0 0', lineHeight: .98, letterSpacing: '-.008em',
          }}>
            Come stand on the corner with us.
          </h2>
          <p style={{
            marginTop: 28, fontSize: 17, lineHeight: 1.6,
            color: 'var(--ink-soft)', maxWidth: 620,
          }}>
            Private visits to the site and to the furnished model duplex are
            held on Wednesdays and Saturdays by appointment. Allow about ninety
            minutes; we'll walk you through the building, the park, and the plans.
          </p>
        </div>

        <div className="ll-2col ll-visit-grid" style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 56 }}>
          {/* Form */}
          <div style={{
            background: 'var(--cream)',
            padding: '44px 44px 40px',
            borderRadius: 2,
            border: '1px solid var(--rule)',
          }}>
            {submitted ? (
              <div style={{ minHeight: 380, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <EyebrowLine>Received</EyebrowLine>
                <div className="display" style={{ fontSize: 44, lineHeight: 1.05, margin: '14px 0 18px' }}>
                  Thank you, {form.name.split(' ')[0] || 'friend'}.
                </div>
                <p style={{ color: 'var(--ink-soft)', maxWidth: 420, fontSize: 15.5 }}>
                  Our sales team will reach you within one business day to
                  confirm a time. We'll send the investor packet to {form.email}.
                </p>
                <button onClick={() => setSubmitted(false)} className="mono" style={{
                  marginTop: 28, alignSelf: 'flex-start',
                  background: 'transparent', border: 0, padding: 0,
                  color: 'var(--accent)', cursor: 'pointer',
                }}>
                  ← Submit another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                <div className="mono" style={{ color: 'var(--ink-soft)' }}>Private Visit · Inquiry</div>

                <LLField label="Your name" value={form.name} onChange={update('name')} placeholder="Anaïs Greene" />
                <div className="ll-form-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
                  <LLField label="Email" type="email" value={form.email} onChange={update('email')} placeholder="you@studio.com" />
                  <LLField label="Phone" value={form.phone} onChange={update('phone')} placeholder="+1 (305) 000-0000" />
                </div>

                <div>
                  <div className="mono" style={{ color: 'var(--ink-soft)', marginBottom: 10 }}>Residence of interest</div>
                  <div className="ll-interest-pills" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {PLAN_LIST.map((p) => {
                      const on = form.interest === p.id;
                      return (
                        <button type="button" key={p.id}
                                onClick={() => setForm({ ...form, interest: p.id })}
                                style={{
                                  padding: '8px 14px', borderRadius: 999,
                                  border: '1px solid ' + (on ? 'var(--ink)' : 'var(--rule)'),
                                  background: on ? 'var(--ink)' : 'transparent',
                                  color: on ? 'var(--cream)' : 'var(--ink)',
                                  fontSize: 13, cursor: 'pointer',
                                  fontFamily: 'inherit',
                                }}>
                          {p.id} · {p.name.split('·')[1] ? p.name.split('·')[1].trim() : p.name.replace('Penthouse — ', '')}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <LLField label="Preferred date" type="date" value={form.date} onChange={update('date')} />

                <button type="submit" style={{
                  marginTop: 8, alignSelf: 'flex-start',
                  display: 'inline-flex', alignItems: 'center', gap: 14,
                  padding: '14px 20px 14px 26px', borderRadius: 999,
                  background: 'var(--ink)', color: 'var(--cream)',
                  border: 0, fontSize: 14, cursor: 'pointer',
                  letterSpacing: '.02em',
                }}>
                  Request a private visit
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: 'var(--accent)', display: 'inline-flex',
                    alignItems: 'center', justifyContent: 'center', color: 'var(--cream)',
                  }}>→</span>
                </button>
              </form>
            )}
          </div>

          {/* Map + address card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{
              position: 'relative', width: '100%', aspectRatio: '4 / 3',
              borderRadius: 2, overflow: 'hidden', border: '1px solid var(--rule)',
              background: 'var(--cream)',
            }}>
              <iframe
                title="LOEN LULLABY location"
                src="https://www.google.com/maps?q=7920+Byron+Ave,+Miami+Beach,+FL+33141&t=&z=16&ie=UTF8&iwloc=&output=embed"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, filter: 'grayscale(.35) contrast(.95) saturate(.85)' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div style={{
              background: 'var(--cream)',
              padding: '24px 28px',
              border: '1px solid var(--rule)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' }}>
                <div>
                  <div className="mono" style={{ color: 'var(--ink-soft)', marginBottom: 8 }}>Sales Gallery</div>
                  <div className="display" style={{ fontSize: 26, lineHeight: 1.15 }}>
                    North Beach · Miami Beach
                  </div>
                  <div style={{ marginTop: 10, fontSize: 14, color: 'var(--ink-soft)' }}>
                    7920 Byron Avenue<br/>
                    Miami Beach, Florida 33141
                  </div>
                </div>
                <a href="https://www.google.com/maps/place/7920+Byron+Ave,+Miami+Beach,+FL+33141" target="_blank" rel="noreferrer"
                   className="mono" style={{
                  color: 'var(--accent)',
                  borderBottom: '1px solid var(--accent)',
                  paddingBottom: 2, fontSize: 10.5,
                  whiteSpace: 'nowrap',
                }}>
                  Open in Maps ↗
                </a>
              </div>
              <div className="ll-form-2" style={{ borderTop: '1px solid var(--rule)', marginTop: 22, paddingTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <div>
                  <div className="mono" style={{ color: 'var(--ink-soft)', marginBottom: 6 }}>Sales</div>
                  <div style={{ fontSize: 14 }}>sales@loenlullaby.com</div>
                </div>
                <div>
                  <div className="mono" style={{ color: 'var(--ink-soft)', marginBottom: 6 }}>By phone</div>
                  <div style={{ fontSize: 14 }}>+1 (305) 555 0142</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LLField({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span className="mono" style={{ color: 'var(--ink-soft)' }}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          appearance: 'none', border: 0, borderBottom: '1px solid var(--rule)',
          background: 'transparent', padding: '8px 0 10px',
          fontFamily: 'inherit', fontSize: 16, color: 'var(--ink)',
          outline: 'none', borderRadius: 0,
        }}
        onFocus={(e) => e.target.style.borderBottomColor = 'var(--accent)'}
        onBlur={(e) => e.target.style.borderBottomColor = 'var(--rule)'}
      />
    </label>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────

function LLFooter() {
  return (
    <footer style={{
      padding: '60px 6vw 36px',
      background: 'var(--ink)', color: 'rgba(247,240,223,.7)',
      fontSize: 12,
    }}>
      <div style={{ maxWidth: 1480, margin: '0 auto' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 24, flexWrap: 'wrap',
        }}>
          <div className="mono" style={{ letterSpacing: '.22em' }}>
            LOEN&nbsp;LULLABY · MMXXVI
          </div>
          <div style={{ display: 'flex', gap: 24 }} className="mono">
            <span>7920 BYRON AVE</span>
            <span>MIAMI BEACH</span>
            <span>FL 33141</span>
          </div>
          <div className="mono" style={{ opacity: .55 }}>
            Designed at the edge of the Atlantic
          </div>
        </div>

        <div style={{
          marginTop: 36, paddingTop: 24,
          borderTop: '1px solid rgba(247,240,223,.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 24, flexWrap: 'wrap',
        }}>
          <div className="mono" style={{ opacity: .55, letterSpacing: '.18em' }}>
            For the press &amp; marketing team
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <a
              href="Pedicel x Loen Lullaby - Pitch.html"
              className="mono"
              style={{
                color: 'var(--cream)',
                borderBottom: '1px solid var(--accent)',
                paddingBottom: 2,
                letterSpacing: '.18em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              Pitch Deck
              <span aria-hidden="true">↗</span>
            </a>
            <a
              href="Social Templates.html"
              className="mono"
              style={{
                color: 'var(--cream)',
                borderBottom: '1px solid var(--accent)',
                paddingBottom: 2,
                letterSpacing: '.18em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              Social Templates
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  LLNav, LLHero, LLVision, LLRenderings, LLFloorPlans,
  LLInvestorBand, LLVisit, LLFooter,
});
