"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What are the rules about selling restricted products?",
    answer:
      "Some categories require approval before listing, and restricted items must follow marketplace compliance, safety, and documentation rules.",
  },
  {
    question: "How do I optimize my product listings?",
    answer:
      "Use clear titles, complete product details, strong images, and competitive pricing so customers can find and trust your listing quickly.",
  },
  {
    question: "What are the shipping options for sellers?",
    answer:
      "You can ship orders yourself or use fulfillment support depending on the product type, delivery region, and service level you want to offer.",
  },
  {
    question: "How do I handle customer returns?",
    answer:
      "Returns are managed through your seller tools, where you can review requests, approve resolutions, and track refund or replacement status.",
  },
  {
    question: "What are the payment options for sellers?",
    answer:
      "Seller payouts are typically transferred to your registered bank account based on your payment schedule and account verification status.",
  },
  {
    question: "How do I track my sales performance?",
    answer:
      "Use your seller dashboard to monitor sales, traffic, conversion, and order trends so you can improve listings and forecast growth.",
  },
];

function ChevronDownIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`h-5 w-5 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
      fill="none"
      stroke="#42454d"
      strokeWidth="2"
    >
      <path d="m4 7 8 8 8-8" />
    </svg>
  );
}

export default function SellerFaq() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(faqs[0]?.question ?? null);

  const handleToggle = (question: string) => {
    setOpenQuestion((currentQuestion) => (currentQuestion === question ? null : question));
  };

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
          {faqs.map((faq) => {
            const isOpen = openQuestion === faq.question;

            return (
              <div key={faq.question} className="w-full border-b border-[#e5e5e6]">
                <button
                  type="button"
                  onClick={() => handleToggle(faq.question)}
                  className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left"
                >
                  <p className="font-sans text-[22px] leading-[1.2] text-black">{faq.question}</p>
                  <ChevronDownIcon isOpen={isOpen} />
                </button>

                {isOpen ? (
                  <div className="px-6 pb-6">
                    <p className="max-w-300 font-sans text-[18px] leading-normal text-[#42454d]">{faq.answer}</p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
