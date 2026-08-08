"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { useLightbox } from "@/hooks/use-lightbox";
import {
  galleryCategories,
  type GalleryCategory,
  type GalleryImage,
} from "@/lib/gallery";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { cn } from "@/lib/utils";

type GalleryStrings = Dictionary["gallery"];

const ALL = "all";

/**
 * Masonry gallery with a filter and a full-screen lightbox.
 *
 * CSS columns rather than a grid: the photographs are a mix of portrait and
 * square, and columns let each keep its own aspect ratio without cropping or
 * leaving gaps. Reading order runs down each column, which is why the tiles are
 * `break-inside-avoid`.
 */
export function GalleryGrid({
  images,
  strings,
}: {
  images: GalleryImage[];
  strings: GalleryStrings;
}) {
  const [active, setActive] = useState<GalleryCategory | typeof ALL>(ALL);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const counts = useMemo(() => {
    const map = new Map<GalleryCategory, number>();
    for (const image of images) {
      map.set(image.category, (map.get(image.category) ?? 0) + 1);
    }
    return map;
  }, [images]);

  const visible = useMemo(
    () =>
      active === ALL
        ? images
        : images.filter((image) => image.category === active),
    [images, active],
  );

  const caption = useCallback(
    (image: GalleryImage) => strings.captions[image.slug],
    [strings],
  );

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (delta: number) =>
      setLightbox((current) =>
        current === null
          ? null
          : (current + delta + visible.length) % visible.length,
      ),
    [visible.length],
  );

  const dialogRef = useLightbox({
    isOpen: lightbox !== null,
    onClose: close,
    onStep: step,
  });

  const current = lightbox === null ? null : visible[lightbox];

  return (
    <div className="space-y-8">
      <div
        role="group"
        aria-label={strings.filterLabel}
        className="flex flex-wrap justify-center gap-2"
      >
        <FilterChip
          active={active === ALL}
          onClick={() => setActive(ALL)}
          label={strings.all}
          count={images.length}
        />
        {galleryCategories.map((category) => (
          <FilterChip
            key={category}
            active={active === category}
            onClick={() => setActive(category)}
            label={strings.categories[category]}
            count={counts.get(category) ?? 0}
          />
        ))}
      </div>

      <div className="columns-2 gap-3 sm:gap-4 lg:columns-3">
        {visible.map((image, index) => (
          <button
            key={image.slug}
            type="button"
            onClick={() => setLightbox(index)}
            aria-label={strings.open.replace("{caption}", caption(image))}
            className={cn(
              "group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl border border-gold/30 sm:mb-4",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            )}
          >
            <Image
              src={image.src}
              alt={caption(image)}
              width={image.width}
              height={image.height}
              placeholder="blur"
              blurDataURL={image.blur}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 30vw"
              className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.04]"
            />
            {/* Caption rises on hover; always readable on touch via the gradient. */}
            <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-maroon/90 via-maroon/50 to-transparent p-3 pt-8 text-left text-xs leading-snug font-medium text-sandal opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:text-sm">
              {caption(image)}
            </span>
          </button>
        ))}
      </div>

      {current ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={strings.viewer}
          tabIndex={-1}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/92 p-4 focus:outline-none"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label={strings.close}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
          >
            <X className="size-5" />
          </button>

          {visible.length > 1 ? (
            <>
              <button
                type="button"
                aria-label={strings.prev}
                onClick={(event) => {
                  event.stopPropagation();
                  step(-1);
                }}
                className="absolute left-2 z-10 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 sm:left-6"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                aria-label={strings.next}
                onClick={(event) => {
                  event.stopPropagation();
                  step(1);
                }}
                className="absolute right-2 z-10 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 sm:right-6"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          ) : null}

          <figure
            className="flex max-h-full flex-col items-center gap-4"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={current.src}
              alt={caption(current)}
              width={current.width}
              height={current.height}
              placeholder="blur"
              blurDataURL={current.blur}
              sizes="100vw"
              priority
              className="max-h-[78svh] w-auto rounded-lg object-contain"
            />
            <figcaption className="max-w-xl text-center text-sm text-white/85">
              {caption(current)}
              <span className="mt-1 block text-xs text-white/50">
                {lightbox! + 1} / {visible.length}
              </span>
            </figcaption>
          </figure>
        </div>
      ) : null}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-auto rounded-full border py-1.5 whitespace-normal transition-colors",
        active
          ? "border-transparent bg-saffron text-white hover:bg-saffron-deep hover:text-white"
          : "border-gold/40 bg-card/70 text-foreground hover:bg-accent",
      )}
    >
      {label}
      <span
        className={cn(
          "ml-1.5 rounded-full px-1.5 py-0.5 text-[11px] leading-none",
          active ? "bg-white/25 text-white" : "bg-muted text-muted-foreground",
        )}
      >
        {count}
      </span>
    </Button>
  );
}
