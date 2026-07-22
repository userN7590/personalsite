// The home page is intentionally just the persistent identity header + footer.
// The header carries the whole landing (intro open, plus a "start here" cue that
// points at Projects); this spacer keeps that cue clear of the footer.
export default function Home() {
  return <div className="home-gap" aria-hidden="true" />
}
