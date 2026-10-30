/** Where the name comes from, tied to a line of Seneca from the same corpus "Ask the ancients" searches. */
export function NameCard() {
  return (
    <figure className="card relative overflow-hidden p-6 sm:p-8">
      <div className="hero-glow pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative grid gap-8 md:grid-cols-[auto_1fr] md:items-center">
        <div className="text-center md:text-left">
          <div className="gradient-text text-5xl font-extrabold sm:text-6xl" lang="el">
            Ευθύμιος
          </div>
          <div className="mt-2 text-sm text-soft">
            Efthimios, from <i lang="grc-Latn">euthymos</i>: of good spirit
          </div>
        </div>
        <div>
          <p className="text-lg leading-relaxed">
            The noun, <i lang="grc-Latn">euthymia</i>, was Democritus’s word for a calm, cheerful, settled mind. Four centuries
            later Seneca built an essay around it:
          </p>
          <blockquote className="mt-4 border-l-2 border-blue pl-4 text-lg leading-relaxed text-ink italic">
            “The Greeks call this calm steadiness of mind euthymia, and Democritus’s treatise upon it is excellently written: I
            call it peace of mind.”
          </blockquote>
          <figcaption className="mt-2 pl-4 text-sm text-soft">Seneca, Of Peace of Mind, tr. Aubrey Stewart (1889)</figcaption>
        </div>
      </div>
    </figure>
  );
}
