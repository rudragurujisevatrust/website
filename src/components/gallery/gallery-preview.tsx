import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/home/section-heading";
import { Button } from "@/components/ui/button";
import { galleryHighlights } from "@/lib/gallery";
import { type Locale, localePath } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

/**
 * Home-page gallery strip. A server component — these are plain links into the
 * gallery page rather than a second lightbox, which keeps the home page's
 * client bundle unchanged.
 */
export function GalleryPreview({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const href = localePath("/gallery", locale);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <SectionHeading
        eyebrow={dict.gallery.homeEyebrow}
        title={dict.gallery.homeTitle}
        description={dict.gallery.homeDescription}
      />

      {/*
       * Fixed aspect ratios here (unlike the masonry on the gallery page) so
       * the strip stays a tidy rectangle. The counts are chosen to pack exactly:
       * six equal squares fill 2 cols × 3 rows on mobile, and on desktop the
       * lead photo takes a 2×2 block which the other five complete into 3 × 3.
       */}
      <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {galleryHighlights.map((image, index) => {
          const caption = dict.gallery.captions[image.slug];
          const lead = index === 0;

          return (
            <Link
              key={image.slug}
              href={href}
              aria-label={caption}
              className={`group relative aspect-square overflow-hidden rounded-xl border border-gold/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
                lead ? "lg:col-span-2 lg:row-span-2" : ""
              }`}
            >
              <Image
                src={image.src}
                alt={caption}
                fill
                placeholder="blur"
                blurDataURL={image.blur}
                sizes={
                  lead
                    ? "(max-width: 1024px) 50vw, 45vw"
                    : "(max-width: 1024px) 50vw, 22vw"
                }
                className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-maroon/90 via-maroon/40 to-transparent p-3 pt-8 text-xs leading-snug font-medium text-sandal opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:text-sm">
                {caption}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-saffron/50 text-saffron-deep hover:bg-accent"
        >
          <Link href={href}>
            {dict.gallery.homeCta}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
