// LOEN LULLABY — entrypoint
// Wires sections together, manages tweaks (hero variation + palette).

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "hero": "pleinair",
  "palette": "sand-surf"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply palette on every change (incl. initial)
  React.useEffect(() => {
    const p = LL_PALETTES[t.palette] || LL_PALETTES['sand-surf'];
    applyPalette(p);
  }, [t.palette]);

  const paletteOptions = Object.keys(LL_PALETTES).map((k) => ({
    value: k,
    chip: paletteToChip(LL_PALETTES[k]),
  }));

  return (
    <>
      <LLNav />
      <LLHero variation={t.hero} />
      <LLRenderings />
      <LLFloorPlans />
      <LLNeighborhood />
      <LLTransitionVideo />
      <LLInvestorBand />
      <LLVibeVideo />
      <LLVisit />
      <LLFooter />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Hero" />
        <TweakRadio
          label="Layout"
          value={t.hero}
          options={[
            { value: 'pleinair',  label: 'Plein Air' },
            { value: 'editorial', label: 'Editorial' },
            { value: 'postcard',  label: 'Postcard' },
          ]}
          onChange={(v) => setTweak('hero', v)}
        />

        <TweakSection label="Palette" />
        <TweakColor
          label="Color"
          value={paletteToChip(LL_PALETTES[t.palette] || LL_PALETTES['sand-surf'])}
          options={paletteOptions.map((o) => o.chip)}
          onChange={(chip) => {
            const match = paletteOptions.find((o) => JSON.stringify(o.chip) === JSON.stringify(chip));
            if (match) setTweak('palette', match.value);
          }}
        />
        <div style={{
          fontSize: 11, color: 'rgba(41,38,27,.55)',
          lineHeight: 1.5, marginTop: 4,
        }}>
          {LL_PALETTES[t.palette]?.label}
        </div>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
