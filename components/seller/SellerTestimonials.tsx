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
      <div className="mx-auto flex w-full max-w-[1760px] flex-col items-center gap-10 px-4 py-12 sm:px-6 md:px-8 lg:gap-12 lg:px-10 lg:py-18 xl:gap-16 xl:px-16 xl:py-25 2xl:px-20">
        <div className="flex flex-col items-center gap-4 text-center not-italic sm:gap-5 xl:gap-6">
          <h2 className="font-[Arial] text-[32px] leading-[1.1] font-bold tracking-[-0.6px] text-black sm:text-[40px] md:text-[44px] xl:text-[48px] xl:tracking-[-0.96px]">
            What Other Sellers Say
          </h2>
          <p className="max-w-225 font-[Arial] text-[18px] leading-[1.35] text-[#4a5565] sm:text-[20px] md:text-[22px] xl:text-[24px] xl:leading-[1.2]">
            See how businesses are increasing sales and reaching more customers.
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-8 overflow-hidden xl:gap-12">
          <div
            className="w-full overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="testimonial-carousel-track flex w-max items-stretch gap-4 sm:gap-5 xl:gap-6"
              style={{ animationPlayState: isPaused ? "paused" : "running" }}
            >
              {carouselTestimonials.map((testimonial, index) => (
                <article
                  key={`${testimonial.author}-${index}`}
                  className="w-70 shrink-0 rounded-md border border-[#e5e5e6] bg-[#f2f2f3] px-5 py-8 shadow-[0px_2px_7.5px_rgba(0,0,0,0.1)] sm:w-90 sm:px-6 sm:py-10 lg:w-110 xl:w-140 xl:py-12 2xl:w-195.75"
                >
                  <div className="flex flex-col items-start gap-5 xl:gap-6">
                    <QuoteIcon />
                    <div className="flex w-full flex-col items-start gap-4 font-sans leading-[1.2]">
                      <p className="w-full text-[18px] leading-[1.45] text-black sm:text-[20px] xl:text-[22px] xl:leading-[1.2]">
                        {testimonial.quote}
                      </p>
                      <p className="w-full text-[15px] text-[#848995] sm:text-[16px]">-{testimonial.author}</p>
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
            transform: translate3d(calc(-50% - 8px), 0, 0);
          }
        }

        @media (min-width: 640px) {
          @keyframes seller-testimonials-marquee {
            from {
              transform: translate3d(0, 0, 0);
            }

            to {
              transform: translate3d(calc(-50% - 10px), 0, 0);
            }
          }
        }

        @media (min-width: 1280px) {
          @keyframes seller-testimonials-marquee {
            from {
              transform: translate3d(0, 0, 0);
            }

            to {
              transform: translate3d(calc(-50% - 12px), 0, 0);
            }
          }
        }
      `}</style>
    </section>
  );
}
