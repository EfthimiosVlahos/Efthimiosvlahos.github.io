import Link from "next/link";

export default function NotFound() {
  return (
    <section className="hero-glow">
      <div className="sheet flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <p className="gradient-text text-7xl font-extrabold">404</p>
        <h1 className="mt-4 text-3xl">This page doesn’t exist</h1>
        <p className="mt-3 max-w-[32rem] text-soft">
          The link may be from an older version of this site. Everything moved to the pages below.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Go home
          </Link>
          <Link href="/projects" className="btn btn-quiet">
            See projects
          </Link>
        </div>
      </div>
    </section>
  );
}
