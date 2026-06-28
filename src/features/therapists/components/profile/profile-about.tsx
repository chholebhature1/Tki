interface ProfileAboutProps {
  bio: string;
}

export function ProfileAbout({ bio }: ProfileAboutProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-text">About</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-text-secondary">
        {bio.split("\n\n").map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
