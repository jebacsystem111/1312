"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

/** Galeria produktu: miniatury przełączają duże zdjęcie. Fade 190 ms, bez ruchu na zdjęciu. */
export function Gallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-tile border border-line bg-ube-tint sm:aspect-[4/3] lg:aspect-[4/5]">
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={i === 0 ? alt : `${alt}, zdjęcie ${i + 1}`}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 46vw, 100vw"
            className={cn(
              "object-cover transition-opacity duration-[190ms] ease-[var(--ease-ui)]",
              i === active ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3" role="group" aria-label="Miniatury zdjęć">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Pokaż zdjęcie ${i + 1}`}
              aria-pressed={i === active}
              className={cn(
                "relative h-16 w-16 overflow-hidden rounded-card border bg-ube-tint sm:h-[74px] sm:w-[74px]",
                "transition-[border-color,transform] duration-[190ms] ease-[var(--ease-ui)] active:scale-[0.97]",
                i === active ? "border-ube" : "border-line hover:border-ube/50",
              )}
            >
              <Image src={src} alt="" fill sizes="74px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
