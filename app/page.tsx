import Training from "./training";

export default function Page() {
  return (
    <main>
      <h1>who trains what</h1>
      <p className="dim">some tools at kunz need training before you use them. tell us what you know, what you want to learn, and whether you&apos;d teach. takes a minute.</p>
      <Training />
      <footer>
        open source, MIT. data export: <a href="/api/responses?export=1">json</a>. tool list lives in lib/training.ts.
      </footer>
    </main>
  );
}
