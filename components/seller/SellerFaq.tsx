const faqs = [
  "What are the rules about selling restricted products?",
  "How do I optimize my product listings?",
  "What are the shipping options for sellers?",
  "How do I handle customer returns?",
  "What are the payment options for sellers?",
  "How do I track my sales performance?",
];

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#42454d" strokeWidth="2">
      <path d="m4 7 8 8 8-8" />
    </svg>
  );
}

export default function SellerFaq() {
  return (
    <section className="w-full bg-white">
      <div className="flex w-full flex-col items-center gap-16 px-20 py-25">
        <div className="flex flex-col items-center gap-6 text-center not-italic">
          <h2 className="font-[Arial] text-[48px] leading-[1.1] font-bold tracking-[-0.96px] text-black">
            Frequently Asked Questions
          </h2>
          <p className="font-[Arial] text-[24px] leading-[1.2] text-[#42454d]">Everything you need to know</p>
        </div>

        <div className="flex w-full flex-col items-start">
          {faqs.map((question) => (
            <div
              key={question}
              className="flex w-full items-center justify-between border-b border-[#e5e5e6] px-6 py-6"
            >
              <p className="font-sans text-[22px] leading-[1.2] text-black">{question}</p>
              <ChevronDownIcon />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
