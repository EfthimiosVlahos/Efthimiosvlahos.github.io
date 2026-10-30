/** Where the name comes from, tied to a line of Seneca from the same corpus "Ask the ancients" searches. */
export function NameCard() {
  return (
    <figure className="card relative mx-auto max-w-[46rem] overflow-hidden p-6 text-center sm:p-8">
      <p className="text-lg leading-relaxed">
        <span lang="el" className="font-semibold">
          Ευθύμιος
        </span>{" "}
        comes from <i lang="grc-Latn">euthymos</i>, “of good spirit”. Its noun, <i lang="grc-Latn">euthymia</i>, was
        Democritus’s word for a calm, settled mind, and four centuries later Seneca built an essay around it:
      </p>
      <blockquote className="mt-5 text-lg leading-relaxed text-ink italic">
        “The Greeks call this calm steadiness of mind euthymia, and Democritus’s treatise upon it is excellently written: I
        call it peace of mind.”
      </blockquote>
      <figcaption className="mt-3 text-sm text-soft">Seneca, Of Peace of Mind, tr. Aubrey Stewart (1889)</figcaption>
    </figure>
  );
}
