import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  as: Heading = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  /**
   * The heading level. Every page needs exactly one `h1` — search engines lean
   * on it and screen-reader users jump by it — so a page's leading heading
   * passes `as="h1"` and later sections keep the default `h2`.
   */
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-xs font-semibold tracking-[0.18em] text-saffron-deep uppercase">
          {eyebrow}
        </p>
      ) : null}
      <Heading className="text-balance-pretty mt-2 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
        {title}
      </Heading>
      {description ? (
        <p className="text-balance-pretty mt-3 text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      <div
        aria-hidden
        className={cn(
          "border-toran mt-5 h-3 w-28 opacity-60",
          align === "center" && "mx-auto",
        )}
      />
    </div>
  );
}
