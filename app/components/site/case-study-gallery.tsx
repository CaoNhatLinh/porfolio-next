"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowLeft,
  ArrowRight,
  ArrowsOutSimple,
  X,
} from "@phosphor-icons/react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Locale } from "../../features/content/types";

type GalleryFrame = {
  src: string;
  alt: string;
};

function galleryImageSizes(isWide: boolean) {
  return isWide
    ? "(min-width: 1440px) 1360px, (min-width: 768px) calc(100vw - 5rem), calc(100vw - 2rem)"
    : "(min-width: 1440px) 670px, (min-width: 768px) calc((100vw - 6rem) / 2), calc(100vw - 2rem)";
}

export function CaseStudyGallery({
  items,
  locale,
}: {
  items: GalleryFrame[];
  locale: Locale;
}) {
  const copy = locale === "vi";
  const [requestedIndex, setRequestedIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
  });

  const syncSelectedIndex = useCallback(() => {
    if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", syncSelectedIndex);
    emblaApi.on("reInit", syncSelectedIndex);
    return () => {
      emblaApi.off("select", syncSelectedIndex);
      emblaApi.off("reInit", syncSelectedIndex);
    };
  }, [emblaApi, syncSelectedIndex]);

  useEffect(() => {
    if (emblaApi) emblaApi.scrollTo(requestedIndex, true);
  }, [emblaApi, requestedIndex]);

  return (
    <section className="page-width pb-24 md:pb-36">
      <div className="flex items-end justify-between gap-8 border-t border-white/15 pt-6">
        <div>
          <p className="editorial-kicker text-[var(--accent)]">
            {copy ? "Thư viện ảnh" : "Project gallery"}
          </p>
          <h2 className="display mt-5 text-5xl font-bold leading-[.84] md:text-7xl">
            {copy ? "Hình ảnh dự án." : "Project images."}
          </h2>
        </div>
        <span className="mono hidden text-xs text-white/40 md:block">
          {items.length} {copy ? "khung hình" : "frames"}
        </span>
      </div>

      <Dialog.Root>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {items.map((item, index) => {
            const isWide = index % 3 === 0;
            return (
              <Dialog.Trigger asChild key={item.src}>
                <button
                  type="button"
                  className={`focus-ring group text-left ${isWide ? "sm:col-span-2" : ""}`}
                  onClick={() => { setRequestedIndex(index); setSelectedIndex(index); }}
                  aria-label={
                    copy ? `Mở lớn ảnh ${index + 1}` : `Open image ${index + 1}`
                  }
                >
                  <figure className="overflow-hidden rounded-[14px] bg-white/5">
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes={galleryImageSizes(isWide)}
                        quality={100}
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.015]"
                      />
                      <span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-black/70 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <ArrowsOutSimple size={18} aria-hidden="true" />
                      </span>
                    </div>
                    <figcaption className="px-4 py-3 text-sm text-white/55">
                      {item.alt}
                    </figcaption>
                  </figure>
                </button>
              </Dialog.Trigger>
            );
          })}
        </div>

        <Dialog.Portal>
          <Dialog.Overlay className="case-gallery-overlay fixed inset-0 z-40 bg-black/85" />
          <Dialog.Content
            aria-describedby={undefined}
            data-lenis-prevent
            className="case-gallery-dialog fixed inset-4 z-50 grid max-h-[calc(100dvh-2rem)] grid-rows-[auto_1fr_auto] overflow-hidden rounded-[14px] border border-white/15 bg-[#151716] p-4 outline-none md:inset-8 md:p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <Dialog.Title className="mono text-xs tracking-[.1em] text-white/65">
                {selectedIndex + 1} / {items.length}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-black"
                  aria-label={copy ? "Đóng ảnh" : "Close image"}
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>

            <div ref={emblaRef} className="min-h-0 overflow-hidden py-4">
              <div className="flex h-full touch-pan-y">
                {items.map((item) => (
                  <div
                    key={item.src}
                    className="relative min-w-0 flex-[0_0_100%]"
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1024px) calc(100vw - 8rem), calc(100vw - 2rem)"
                      quality={100}
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <p className="max-w-2xl text-sm leading-relaxed text-white/60">
                {items[selectedIndex]?.alt}
              </p>
              {items.length > 1 && (
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-35"
                    onClick={() => emblaApi?.scrollPrev()}
                    disabled={!emblaApi?.canScrollPrev()}
                    aria-label={copy ? "Ảnh trước" : "Previous image"}
                  >
                    <ArrowLeft size={18} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-35"
                    onClick={() => emblaApi?.scrollNext()}
                    disabled={!emblaApi?.canScrollNext()}
                    aria-label={copy ? "Ảnh tiếp theo" : "Next image"}
                  >
                    <ArrowRight size={18} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
