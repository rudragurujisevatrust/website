"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";

import { useLightbox } from "@/hooks/use-lightbox";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { cn } from "@/lib/utils";

export type GalleryStrings = Dictionary["events"];

/** Fills {n} / {total} placeholders in a translated template. */
function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in values ? String(values[key]) : match,
  );
}

/**
 * Media block for an event. One image renders full-width; several render as a
 * mosaic where the first photo leads. Clicking any photo opens a lightbox with
 * keyboard navigation.
 */
export function EventGallery({
  images,
  title,
  strings,
}: {
  images: string[];
  title: string;
  strings: GalleryStrings;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const close = useCallback(() => setLightboxIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setLightboxIndex((current) =>
        current === null
          ? null
          : (current + delta + images.length) % images.length,
      ),
    [images.length],
  );

  const dialogRef = useLightbox({
    isOpen: lightboxIndex !== null,
    onClose: close,
    onStep: step,
  });

  if (images.length === 0) return null;

  const isSingle = images.length === 1;
  // Beyond four thumbnails we show a "+N" overlay on the last visible tile.
  const visible = isSingle ? images : images.slice(0, 4);
  const overflowCount = images.length - visible.length;

  const photoAlt = (index: number) =>
    `${title} — ${fill(strings.photoAlt, { n: index + 1 })}`;

  return (
    <>
      <div
        className={cn(
          "grid gap-1.5 overflow-hidden rounded-xl border border-gold/30",
          isSingle ? "grid-cols-1" : "grid-cols-2",
        )}
      >
        {visible.map((src, index) => {
          const isLastVisible = index === visible.length - 1;
          const showOverflow = overflowCount > 0 && isLastVisible;

          return (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setLightboxIndex(index)}
              aria-label={fill(strings.viewImage, {
                n: index + 1,
                total: images.length,
              })}
              className={cn(
                "group relative overflow-hidden bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                isSingle ? "aspect-[16/10]" : "aspect-square",
                // With exactly three photos the first one spans the full row.
                !isSingle && images.length === 3 && index === 0
                  ? "col-span-2 aspect-[16/9]"
                  : null,
              )}
            >
              <Image
                src={src}
                alt={photoAlt(index)}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {showOverflow ? (
                <span className="absolute inset-0 flex items-center justify-center bg-maroon/70 font-heading text-2xl text-sandal">
                  +{overflowCount}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {lightboxIndex !== null ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — ${strings.photoViewer}`}
          tabIndex={-1}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4 focus:outline-none"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label={strings.closeViewer}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
          >
            <X className="size-5" />
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                aria-label={strings.prevPhoto}
                onClick={(event) => {
                  event.stopPropagation();
                  step(-1);
                }}
                className="absolute left-2 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 sm:left-6"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                aria-label={strings.nextPhoto}
                onClick={(event) => {
                  event.stopPropagation();
                  step(1);
                }}
                className="absolute right-2 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 sm:right-6"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          ) : null}

          <div
            className="relative h-[80svh] w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={photoAlt(lightboxIndex)}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          <p className="absolute bottom-5 text-sm text-white/70">
            {lightboxIndex + 1} / {images.length}
          </p>
        </div>
      ) : null}
    </>
  );
}
