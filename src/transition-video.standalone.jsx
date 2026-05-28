// Reusable video section component.
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
}) {
  const [src, setSrc] = React.useState(null);
  const [origin, setOrigin] = React.useState('idle'); // 'file' | 'local'
  const [drag, setDrag] = React.useState(false);
  const [playing, setPlaying] = React.useState(true);
  const videoRef = React.useRef(null);
  const inputRef = React.useRef(null);

  const defaults = React.useMemo(() => {
    const lifted =
      (typeof window !== 'undefined' && window.__resources && window.__resources['video_' + slug])
      || null;
    if (lifted) return [lifted];
    return [
      `uploads/${slug}.mp4`,
      `uploads/${slug}.webm`,
      `uploads/${slug}.mov`,
    ];
  }, [slug]);

  React.useEffect(() => {
    (async () => {
      for (const url of defaults) {
        if (await probeVideo(url)) {
          setSrc(url);
          setOrigin('file');
          return;
        }
      }
    })();
  }, [defaults]);

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
    />
  );
}

Object.assign(window, { LLVideoSection, LLTransitionVideo, LLVibeVideo });
