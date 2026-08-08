import type { Metadata } from "next";

import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { SectionHeading } from "@/components/home/section-heading";
import { galleryImages } from "@/lib/gallery";
import { isLocale } from "@/lib/i18n/config";
import { getCurrentDictionary, getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/gallery">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.nav.gallery,
    description: dict.meta.galleryDescription,
  };
}

export default async function GalleryPage() {
  const dict = await getCurrentDictionary();

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
      <SectionHeading
        as="h1"
        eyebrow={dict.gallery.eyebrow}
        title={dict.gallery.title}
        description={dict.gallery.description}
      />

      <div className="mt-12">
        <GalleryGrid images={galleryImages} strings={dict.gallery} />
      </div>
    </div>
  );
}
