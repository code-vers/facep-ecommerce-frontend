"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_SLIDES } from "@/lib/homepage-data";
import { cn } from "@/lib/utils";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section 
      className={cn(
        "relative w-full h-[320px] sm:h-[450px] md:h-[600px] lg:h-[700px] xl:h-[794px] overflow-hidden transition-all duration-700 ease-in-out",
        slide.bgColor
      )}
    >
      {/* Slide Content Container */}
      <div className="mx-auto flex h-full max-w-[1760px] flex-col items-center justify-between px-4 sm:px-6 lg:px-10 md:flex-row relative">
        
        {/* Text Area */}
        <div className="mt-8 flex flex-col items-start gap-2 md:mt-0 md:w-[45%] md:gap-6 z-10 md:mb-16 lg:mb-24 xl:mb-32">
          <p className="font-sans text-[20px] sm:text-[32px] md:text-[40px] lg:text-[48px] font-bold leading-[1.1] tracking-tight text-black capitalize">
            {slide.title}
          </p>
          <h2 className="font-sans text-[24px] sm:text-[40px] md:text-[52px] lg:text-[64px] font-bold leading-[1.1] tracking-tight text-black max-w-[600px]">
            {slide.subtitle}
          </h2>
        </div>

        {/* Image Area */}
        <div className="relative w-full h-[50%] md:h-full md:w-[55%] pointer-events-none select-none">
          <div className="absolute inset-0 md:inset-y-0 md:right-0 overflow-hidden">
            <Image 
              alt={slide.subtitle} 
              fill
              sizes="(max-width: 640px) 100vw, 55vw"
              className="object-cover object-center md:h-[105%] md:w-[105%] md:-right-4"
              src={slide.imageSrc} 
              unoptimized
            />
          </div>
        </div>
      </div>

      {/* Navigation Chevrons */}
      <button 
        type="button"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-[#dec33a] text-black shadow-md cursor-pointer hover:bg-[#c9b034] active:bg-[#b49a2e] z-20 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>

      <button 
        type="button"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-[#dec33a] text-black shadow-md cursor-pointer hover:bg-[#c9b034] active:bg-[#b49a2e] z-20 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              currentSlide === index ? "w-6 bg-[#dec33a]" : "w-2 bg-gray-300"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Bottom Blur/Fade Blending Overlay - blends Hero into the body background #F4F4F5 */}
      <div className="absolute bottom-0 left-0 right-0 h-[100px] sm:h-[150px] bg-gradient-to-t from-[#F4F4F5] to-transparent pointer-events-none z-10" />
    </section>
  );
}
