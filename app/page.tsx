import Training from "./training";

export default function Page() {
  return (
    <main>
      <div className="eyebrow">Kunz Hackerspace</div>
      <h1>Who trains what.</h1>
      <p className="lede">Some tools need training first. Tell us what you know, what you want to learn, and whether you&apos;d teach.</p>
      <Training />
      <footer>
        Open source, MIT. <a href="/api/responses?export=1">Download all answers</a>
      </footer>
    </main>
  );
}
