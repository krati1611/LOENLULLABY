54// Reusable video section component.
// Two ways to load a video:
//   1) Upload to the slug paths (uploads/<slug>.mp4 / .webm / .mov) — persists.
//   2) Drag-and-drop / click to pick locally — in-memory only.

function probeVideo(url) {
  return new Promise((resolve) => {
    const v = document.createElement('video');
    v.preload = 'metadata';
    v.muted = true;
    const done = (ok) => { v.src = ''; resolve(ok); };
    v.onloadedmetadata = () => done(true);
    v.onerror = () => done(false);
    v.src = url;
    setTimeout(() => done(false), 2500);
  });
}

const llVideoCtrlBtn = {
  appearance: 'none', border: 0,
  padding: '8px 14px', borderRadius: 999,
  background: 'rgba(0,0,0,.55)', color: '#F7F0DF',
  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
  fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase',
  backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
  cursor: 'pointer',
};

function LLVideoSection({
  slug,                 // basename used for uploads/<slug>.{mp4,webm,mov}
  screenLabel,
  eyebrow,
  heading,
  blurb,
  caption,
  aspect = '16 / 9',
  bg = 'var(--sand)',
  emptyTitle = 'Drop the film here.',
  emptyKicker = 'FILM · 16:9 · MP4 / WEBM / MOV',
  youtubeId = null,     // YouTube video ID — used as fallback when no local file
  children,
}) {
  const [src, setSrc] = React.useState(null);
  const [origin, setOrigin] = React.useState('idle'); // 'file' | 'local' | 'youtube'
  const [drag, setDrag] = React.useState(false);
  const [playing, setPlaying] = React.useState(true);
  const videoRef = React.useRef(null);
  const inputRef = React.useRef(null);

  const defaults = React.useMemo(() => ([
    `uploads/${slug}.mp4`,
    `uploads/${slug}.webm`,
    `uploads/${slug}.mov`,
    window.__resources?.[`uploads/${slug}.mp4`],
    window.__resources?.[`uploads/${slug}.webm`],
    window.__resources?.[`uploads/${slug}.mov`],
  ].filter(Boolean)), [slug]);

  React.useEffect(() => {
    (async () => {
      for (const url of defaults) {
        if (await probeVideo(url)) {
          setSrc(url);
          setOrigin('file');
          return;
        }
      }
      // No local file found — fall back to YouTube embed if an ID is provided
      if (youtubeId) {
        setSrc(null);
        setOrigin('youtube');
      }
    })();
  }, [defaults, youtubeId]);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('video/')) return;
    const url = URL.createObjectURL(file);
    setSrc(url);
    setOrigin('local');
  };
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };
  const onDrop = (e) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) handleFile(f);
  };

  return (
    <section data-screen-label={screenLabel} className="ll-section ll-section-py" style={{
      padding: '120px 6vw 140px',
      background: bg,
    }}>
      <div style={{ maxWidth: 1480, margin: '0 auto' }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          gap: 40, marginBottom: 56, flexWrap: 'wrap',
        }}>
          <div>
            <EyebrowLine>{eyebrow}</EyebrowLine>
            <h2 className="display" style={{
              fontSize: 'clamp(44px, 5.6vw, 84px)', margin: '20px 0 0',
              lineHeight: 1.02, letterSpacing: '-.008em', maxWidth: 800,
            }}>
              {heading}
            </h2>
          </div>
          <div style={{ maxWidth: 360, color: 'var(--ink-soft)', fontSize: 15 }}>
            {blurb}
          </div>
        </div>

        <div
          className="ll-video-shell"
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: aspect,
            background: 'var(--ink)',
            overflow: 'hidden',
            borderRadius: 2,
            outline: drag ? '2px solid var(--accent)' : '1px solid var(--rule)',
            outlineOffset: drag ? -2 : -1,
            transition: 'outline-color .2s',
          }}
        >
          {src ? (
            <>
              <video
                ref={videoRef}
                src={src}
                autoPlay muted loop playsInline
                style={{
                  width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                }}
              />
              <div style={{
                position: 'absolute', left: 0, right: 0, bottom: 0, height: '40%',
                pointerEvents: 'none',
                background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.55) 100%)',
              }} />
              <div className="mono" style={{
                position: 'absolute', left: 22, bottom: 22, color: '#F7F0DF', opacity: .85,
              }}>
                {caption}
              </div>
              <div style={{
                position: 'absolute', top: 22, right: 22, display: 'flex', gap: 8,
              }}>
                <button onClick={togglePlay} style={llVideoCtrlBtn}>
                  {playing ? '⏸ Pause' : '▶ Play'}
                </button>
                <button onClick={() => inputRef.current?.click()} style={llVideoCtrlBtn}>
                  Replace
                </button>
              </div>
            </>
          ) : origin === 'youtube' && youtubeId ? (
            window.location.protocol === 'file:' ? (
              // file:// — YouTube iframes are blocked; show clickable thumbnail instead
              <a
                href={`https://www.youtube.com/watch?v=${youtubeId}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  position: 'absolute', inset: 0,
                  display: 'block', textDecoration: 'none',
                }}
              >
                <img
                  src={`https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`}
                  onError={(e) => { e.target.src = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`; }}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.32)' }} />
                <div style={{
                  position: 'absolute', left: 0, right: 0, bottom: 0, height: '40%',
                  background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.6) 100%)',
                }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'rgba(255,255,255,.92)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 32px rgba(0,0,0,.35)',
                  }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="#1E2528">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <div className="mono" style={{
                  position: 'absolute', left: 22, bottom: 22, color: '#F7F0DF', opacity: .85,
                }}>
                  {caption}
                </div>
                <div className="mono" style={{
                  position: 'absolute', top: 22, right: 22,
                  background: 'rgba(0,0,0,.55)', color: '#F7F0DF',
                  padding: '8px 14px', borderRadius: 999,
                  fontSize: 10.5, letterSpacing: '.14em',
                  backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                }}>
                  Watch on YouTube ↗
                </div>
              </a>
            ) : (
              // http/https — embed plays inline
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&modestbranding=1&rel=0&playsinline=1`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  border: 0, display: 'block',
                }}
              />
            )
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              color: 'rgba(247,240,223,.85)', textAlign: 'center', padding: 28,
              background:
                'radial-gradient(ellipse at center, rgba(247,240,223,.05), rgba(0,0,0,0) 60%)',
            }}>
              <div className="mono" style={{ opacity: .6, marginBottom: 18 }}>
                {emptyKicker}
              </div>
              <div className="display" style={{
                fontSize: 'clamp(28px, 3vw, 44px)', lineHeight: 1.1, marginBottom: 14,
                color: '#F7F0DF',
              }}>
                {emptyTitle}
              </div>
              <div style={{
                fontSize: 14, lineHeight: 1.55, color: 'rgba(247,240,223,.7)',
                maxWidth: 480,
              }}>
                Or upload as{' '}
                <span className="mono" style={{ color: 'var(--accent)' }}>
                  uploads/{slug}.mp4
                </span>{' '}
                and it'll appear here automatically on next reload.
              </div>
              <button onClick={() => inputRef.current?.click()} style={{
                ...llVideoCtrlBtn, marginTop: 26, padding: '12px 22px', fontSize: 11,
              }}>
                Choose a file
              </button>
            </div>
          )}

          <input
            ref={inputRef} type="file" accept="video/*"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        {origin === 'local' && (
          <div className="mono" style={{
            color: 'var(--ink-soft)', marginTop: 14, opacity: .8,
          }}>
            ⓘ Loaded from your computer · upload to{' '}
            <span style={{ color: 'var(--accent)' }}>uploads/{slug}.mp4</span>{' '}
            to persist across reloads.
          </div>
        )}

        {children}
      </div>
    </section>
  );
}

// — Specific instances ———————————————————————————————————————————————

function LLTransitionVideo() {
  return (
    <LLVideoSection
      slug="transition"
      screenLabel="Transition"
      eyebrow="Interlude — From line to lullaby"
      heading="The plan, lifted into the air."
      blurb="A short film, from drafting line to finished form. Best with sound."
      caption="PL.07 — Plan → Building"
      bg="var(--sand)"
      youtubeId="g_cgeN-uAF0"
    />
  );
}

function LLVibeVideo() {
  return (
    <LLVideoSection
      slug="vibe"
      screenLabel="Vibe"
      eyebrow="Interlude — A morning, slowly"
      heading="The hours move differently here."
      blurb="Linen curtains, salt on the air, the slow shadow of a teak ceiling at 4 PM."
      caption="PL.08 — A day inside the house"
      bg="var(--cream)"
      emptyTitle="Drop the mood film here."
      youtubeId="h5-nbJJPc34"
    >
      <div style={{
        marginTop: 64,
        display: 'flex',
        justifyContent: 'center',
        gap: 24,
        flexWrap: 'wrap'
      }}>
        {[
          { label: 'Sales Deck', href: 'Loen%20Lullaby%20-%20Sales%20Deck.html' },
          { label: 'Pitch Deck', href: 'Pedicel%20x%20Loen%20Lullaby%20-%20Pitch.html' },
          { label: 'Social Templates', href: 'Social%20Templates.html' },
        ].map((link) => (
          <a
            key={link.label}
            className="mono"
            href={link.href}
            target="_blank"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 16,
              padding: '18px 36px',
              borderRadius: '999px',
              background: 'transparent',
              color: 'var(--ink)',
              border: '1.5px solid var(--rule)',
              fontSize: 11.5,
              fontWeight: 500,
              letterSpacing: '.18em',
              textTransform: 'uppercase',
              transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(30,37,40,0.02)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--ink)';
              e.currentTarget.style.color = 'var(--cream)';
              e.currentTarget.style.borderColor = 'var(--ink)';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 16px 32px -12px rgba(30,37,40,0.3)';
              const arrow = e.currentTarget.querySelector('.cta-arrow');
              if (arrow) arrow.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--ink)';
              e.currentTarget.style.borderColor = 'var(--rule)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(30,37,40,0.02)';
              const arrow = e.currentTarget.querySelector('.cta-arrow');
              if (arrow) arrow.style.transform = 'translateX(0)';
            }}
          >
            <span>{link.label}</span>
            <span
              className="cta-arrow"
              style={{
                fontSize: 14,
                transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                display: 'inline-block'
              }}
            >
              →
            </span>
          </a>
        ))}
      </div>
    </LLVideoSection>
  );
}

Object.assign(window, { LLVideoSection, LLTransitionVideo, LLVibeVideo });
