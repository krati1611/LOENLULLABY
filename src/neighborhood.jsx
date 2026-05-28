// LOEN LULLABY — Neighborhood / Market section
// Draws from the Marketing Intelligence Brief (May 2026):
//  · pre-gentrification narrative (pillar #2)
//  · market momentum numbers (price/SF, YoY growth, pipeline)
//  · neighborhood snapshot (school, parks, transit, demographics)
//  · competitive landscape mini-table
// Globals provided: React, EyebrowLine (defined in sections.jsx)

function LLNeighborhood() {
  return (
    <section
      id="neighborhood"
      data-screen-label="Neighborhood"
      className="ll-section ll-section-py"
      style={{
        padding: '140px 6vw 140px',
        background: 'var(--cream)',
      }}
    >
      <div style={{ maxWidth: 1480, margin: '0 auto' }}>
        {/* ── Header ────────────────────────────────────────────────── */}
        <div
          className="ll-2col"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.15fr',
            gap: '8vw',
            marginBottom: 96,
          }}
        >
          <div>
            <EyebrowLine>Chapter Four — The Neighborhood</EyebrowLine>
            <h2
              className="display"
              style={{
                fontSize: 'clamp(48px, 6vw, 92px)',
                margin: '20px 0 0',
                lineHeight: .98,
                letterSpacing: '-.008em',
                textWrap: 'balance',
              }}
            >
              The last quiet place on Miami Beach.
            </h2>
          </div>
          <div style={{ paddingTop: 16 }}>
            <p
              style={{
                fontSize: 21,
                lineHeight: 1.5,
                margin: 0,
                color: 'var(--ink)',
                fontWeight: 300,
                textWrap: 'pretty',
              }}
            >
              North Beach is the final coastal neighborhood on Miami Beach that
              still feels like a real community — where families live, kids bike
              to school, and weekends are a beach and a park, not a velvet rope.
            </p>
            <p
              style={{
                marginTop: 22,
                fontSize: 16,
                lineHeight: 1.7,
                color: 'var(--ink-soft)',
                maxWidth: 560,
              }}
            >
              Every great Miami address had a window before the world arrived.
              South of Fifth in 2005. Mid-Beach in 2015. With more than two
              billion dollars of development now breaking ground inside a mile,
              that window is North Beach — and it is open today.
            </p>
          </div>
        </div>

        {/* ── Market momentum stats ─────────────────────────────────── */}
        <div style={{ marginBottom: 110 }}>
          <div
            className="mono"
            style={{
              color: 'var(--ink-soft)',
              marginBottom: 28,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <span style={{ width: 28, height: 1, background: 'currentColor', opacity: .55 }} />
            <span>I — Market Momentum · North Beach · Q4 2025</span>
          </div>

          <div
            className="ll-stats-4"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 40,
            }}
          >
            {[
              ['Avg Price / SF', '$858', '+25.3% YoY · all condos'],
              ['Luxury Price / SF', '$1,165', '+27% YoY · luxury median'],
              ['Luxury Sales', '+50%', 'YoY · Q4 → Q4'],
              ['Development Pipeline', '$2B+', 'breaking ground within 1 mile'],
            ].map(([k, v, sub]) => (
              <div
                key={k}
                style={{
                  borderTop: '1px solid var(--rule)',
                  paddingTop: 22,
                }}
              >
                <div
                  className="mono"
                  style={{
                    color: 'var(--ink-soft)',
                    marginBottom: 18,
                  }}
                >
                  {k}
                </div>
                <div
                  className="display"
                  style={{
                    fontSize: 'clamp(44px, 4.6vw, 68px)',
                    lineHeight: 1,
                    color: 'var(--accent)',
                  }}
                >
                  {v}
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: 'var(--ink-soft)',
                    marginTop: 14,
                    lineHeight: 1.5,
                  }}
                >
                  {sub}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 28,
              fontSize: 12,
              color: 'var(--ink-soft)',
              opacity: .65,
              maxWidth: 720,
            }}
          >
            Modern-stock rents lead legacy by 72% ($3,884/mo vs $2,262) — the
            rent gap reads as immediate equity for early owners. New
            construction commands a 12–18% premium over comparable resales.
          </div>
        </div>

        {/* ── Neighborhood snapshot ─────────────────────────────────── */}
        <div
          className="ll-2col"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.4fr',
            gap: '8vw',
            marginBottom: 110,
          }}
        >
          <div>
            <div
              className="mono"
              style={{
                color: 'var(--ink-soft)',
                marginBottom: 18,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <span style={{ width: 28, height: 1, background: 'currentColor', opacity: .55 }} />
              <span>II — Within a Short Walk</span>
            </div>
            <h3
              className="display"
              style={{
                fontSize: 'clamp(36px, 4vw, 56px)',
                margin: 0,
                lineHeight: 1,
                letterSpacing: '-.005em',
              }}
            >
              A quiet block, close to most things.
            </h3>
            <p
              style={{
                marginTop: 22,
                fontSize: 15.5,
                lineHeight: 1.65,
                color: 'var(--ink-soft)',
                maxWidth: 380,
              }}
            >
              7920 Byron Avenue sits a short walk from a top-rated IB
              elementary, two blocks from the Atlantic, and adjacent to a
              neighborhood park. South Beach dining is fifteen to twenty
              minutes south; the airport is half an hour west.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              borderTop: '1px solid var(--rule)',
            }}
          >
            {[
              ['Biscayne Beach Elementary', '0.3 mi', 'IB World School · A-rated'],
              ['Tatum Park', 'Adjacent', '8050 Byron Avenue'],
              ['Oceanside Park & Beach', '2 blocks', '28 acres · Bark Beach'],
              ['Bal Harbour Shops', '5 min', 'by car'],
              ['South Beach', '15–20 min', 'Lincoln Road · Sunset Harbor'],
              ['Bus Route 79', '24 hours', 'Hialeah ↔ South Beach'],
            ].map(([k, v, sub]) => (
              <div
                key={k}
                style={{
                  padding: '24px 24px 26px 0',
                  borderBottom: '1px solid var(--rule)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div
                  className="mono"
                  style={{ color: 'var(--ink-soft)' }}
                >
                  {k}
                </div>
                <div
                  className="display"
                  style={{
                    fontSize: 30,
                    lineHeight: 1,
                    color: 'var(--ink)',
                  }}
                >
                  {v}
                </div>
                <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
                  {sub}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Competitive landscape ─────────────────────────────────── */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 40,
              flexWrap: 'wrap',
              marginBottom: 36,
            }}
          >
            <div>
              <div
                className="mono"
                style={{
                  color: 'var(--ink-soft)',
                  marginBottom: 18,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <span style={{ width: 28, height: 1, background: 'currentColor', opacity: .55 }} />
                <span>III — Where Lullaby Sits</span>
              </div>
              <h3
                className="display"
                style={{
                  fontSize: 'clamp(36px, 4vw, 56px)',
                  margin: 0,
                  lineHeight: 1,
                  letterSpacing: '-.005em',
                }}
              >
                A small project in a big pipeline.
              </h3>
            </div>
            <div style={{ maxWidth: 360, color: 'var(--ink-soft)', fontSize: 14.5, lineHeight: 1.6 }}>
              New construction in North Beach is either micro-studios or
              ultra-luxury towers. Loen Lullaby occupies the medium-quality
              family duplex niche — and nothing else does.
            </div>
          </div>

          <CompTable />
        </div>
      </div>
    </section>
  );
}

// Competitive landscape table — neighbouring new-build projects
function CompTable() {
  const rows = [
    { name: 'Ocean Terrace Residences', type: 'Ultra-luxury tower',  pps: '$3,800–4,500', buyer: 'Ultra HNWI',     status: 'Pre-sales · 2029' },
    { name: 'The Perigon',              type: 'Boutique ultra-luxury', pps: '~$4,600',    buyer: 'Collectors',     status: '90% sold' },
    { name: 'Ella Miami Beach',         type: 'Boutique condos',     pps: '$1,642 avg',   buyer: 'Investors',      status: '70% sold · 2027' },
    { name: '72 Park',                  type: 'Luxury high-rise',    pps: '$976–1,979',   buyer: 'Mixed',          status: 'Completed' },
    { name: '7200 Collins',             type: 'Short-term rental',   pps: 'from $625K',   buyer: 'Investors',      status: 'Ground broken' },
    { name: 'IRIS on the Bay',          type: 'Townhomes',           pps: '$738 avg',     buyer: 'Families',       status: 'Active sales' },
  ];

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <div
        role="table"
        style={{
          minWidth: 880,
          display: 'grid',
          gridTemplateColumns: '1.5fr 1.3fr 1fr 1fr 1fr',
          fontSize: 14,
          color: 'var(--ink)',
        }}
      >
        {/* Header */}
        {['Project', 'Type', 'Price / SF', 'Buyer', 'Status'].map((h) => (
          <div
            key={h}
            className="mono"
            style={{
              color: 'var(--ink-soft)',
              padding: '14px 18px 14px 0',
              borderBottom: '1px solid var(--rule)',
              fontSize: 11,
            }}
          >
            {h}
          </div>
        ))}

        {/* Rows */}
        {rows.map((r) => (
          <React.Fragment key={r.name}>
            <div style={cell}><span style={{ fontWeight: 500 }}>{r.name}</span></div>
            <div style={{ ...cell, color: 'var(--ink-soft)' }}>{r.type}</div>
            <div style={{ ...cell, fontFeatureSettings: '"tnum"' }}>{r.pps}</div>
            <div style={{ ...cell, color: 'var(--ink-soft)' }}>{r.buyer}</div>
            <div style={{ ...cell, color: 'var(--ink-soft)' }}>{r.status}</div>
          </React.Fragment>
        ))}

        {/* Lullaby — highlighted */}
        <div style={{ ...lullCell, paddingLeft: 14, borderLeft: '2px solid var(--accent)' }}>
          <span className="display" style={{ fontSize: 22 }}>Loen Lullaby</span>
        </div>
        <div style={lullCell}>Duplex · 4 units</div>
        <div style={lullCell}>By request</div>
        <div style={lullCell}>Families · HNWI</div>
        <div style={{ ...lullCell, color: 'var(--accent)', fontWeight: 500 }}>
          Reservations open
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          fontSize: 12,
          color: 'var(--ink-soft)',
          opacity: .65,
          maxWidth: 880,
        }}
      >
        Pricing reflects publicly reported pre-sale or closed values; Loen
        Lullaby pricing released to qualified inquiries. Source: project
        marketing materials and Miami-Dade County records, May 2026.
      </div>
    </div>
  );
}

const cell = {
  padding: '18px 18px 18px 0',
  borderBottom: '1px solid var(--rule)',
};

const lullCell = {
  padding: '22px 18px 22px 0',
  background: 'var(--sand)',
  borderBottom: '1px solid var(--rule)',
};

Object.assign(window, { LLNeighborhood });
