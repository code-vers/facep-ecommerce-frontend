const testimonials = [
  "The dashboard is extremely easy to use and helped us scale our online sales quickly.",
  "The dashboard is extremely easy to use and helped us scale our online sales quickly.",
  "The dashboard is extremely easy to use and helped us scale our online sales quickly.",
];

function QuoteIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#f09000" strokeWidth="2">
      <path d="M10 11H6V7h5v5c0 4-2 6-5 7" />
      <path d="M21 11h-4V7h5v5c0 4-2 6-5 7" />
    </svg>
  );
}

export default function SellerTestimonials() {
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
          <div className="flex w-full items-center gap-6">
            {testimonials.map((testimonial, index) => (
              <article
                key={index}
                className={`shrink-0 rounded-md border border-[#e5e5e6] bg-[#f2f2f3] px-6 py-12 shadow-[0px_2px_7.5px_rgba(0,0,0,0.1)] ${
                  index < 2 ? "w-195.75" : "w-195.75"
                }`}
              >
                <div className="flex flex-col items-start gap-6">
                  <QuoteIcon />
                  <div className="flex w-full flex-col items-start gap-4 font-sans leading-[1.2]">
                    <p className="w-full text-[22px] text-black">{testimonial}</p>
                    <p className="w-full text-[16px] text-[#848995]">-Lauren W.</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="flex h-2.5 w-11.5 items-center justify-between">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f09000]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#dec33a]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#f09000]" />
          </div>
        </div>
      </div>
    </section>
  );
}
