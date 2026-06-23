"use client";

import { useState } from "react";

const testimonials = [
  {
    quote: "The dashboard is extremely easy to use and helped us scale our online sales quickly.",
    author: "Lauren W.",
  },
  {
    quote: "The dashboard is extremely easy to use and helped us scale our online sales quickly.",
    author: "Lauren W.",
  },
  {
    quote: "The dashboard is extremely easy to use and helped us scale our online sales quickly.",
    author: "Lauren W.",
  },
];

const carouselTestimonials = [...testimonials, ...testimonials];

function QuoteIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#f09000" strokeWidth="2">
      <path d="M10 11H6V7h5v5c0 4-2 6-5 7" />
      <path d="M21 11h-4V7h5v5c0 4-2 6-5 7" />
    </svg>
  );
}

export default function SellerTestimonials() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="w-full bg-white">
      <div className="flex w-full flex-col items-center gap-16 px-20 py-25">
        <div className="flex flex-col items-center gap-6 text-center not-italic">
          <h2 className="font-[Arial] text-[48px] leading-[1.1] font-bold tracking-[-0.96px] text-black">
            What Other Sellers Say
          </h2>
          <p className="font-[Arial] text-[24px] leading-[1.2] text-[#4a5565]">
            See how businesses are increasing sales and reaching more customers.
          </p>
        </div>

        <div className="flex w-[1760px] flex-col items-center gap-12 overflow-hidden">
          <div
            className="w-full overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="testimonial-carousel-track flex w-max items-center gap-6"
              style={{ animationPlayState: isPaused ? "paused" : "running" }}
            >
              {carouselTestimonials.map((testimonial, index) => (
                <article
                  key={`${testimonial.author}-${index}`}
                  className="w-195.75 shrink-0 rounded-md border border-[#e5e5e6] bg-[#f2f2f3] px-6 py-12 shadow-[0px_2px_7.5px_rgba(0,0,0,0.1)]"
                >
                  <div className="flex flex-col items-start gap-6">
                    <QuoteIcon />
                    <div className="flex w-full flex-col items-start gap-4 font-sans leading-[1.2]">
                      <p className="w-full text-[22px] text-black">{testimonial.quote}</p>
                      <p className="w-full text-[16px] text-[#848995]">-{testimonial.author}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="flex h-2.5 w-11.5 items-center justify-between">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f09000]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#dec33a]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#f09000]" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .testimonial-carousel-track {
          animation: seller-testimonials-marquee 24s linear infinite;
        }

        @keyframes seller-testimonials-marquee {
          from {
            transform: translate3d(0, 0, 0);
          }

          to {
            transform: translate3d(calc(-50% - 12px), 0, 0);
          }
        }
      `}</style>
    </section>
  );
}
