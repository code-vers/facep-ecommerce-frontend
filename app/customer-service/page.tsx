/**
 * @fileoverview Customer Service Page.
 * Implements the Figma design for node 2077:2222.
 * Features a neon hero section, responsive category help cards, and a contact inquiry form.
 *
 * @module app/customer-service/page
 */

"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import img from '../../public/customerservice.png'
import {
  Undo2,
  LogIn,
  CircleDollarSign,
  ShieldCheck,
  MessageCircleQuestion,
  ShieldQuestion,
  Send,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HelpCategory {
  id: string;
  label: string;
  iconName: "undo-2" | "log-in" | "circle-dollar-sign" | "shield-check" | "message-circle-question" | "shield-question";
}

const HELP_CATEGORIES: HelpCategory[] = [
  { id: "returns", label: "Delivery or order return", iconName: "undo-2" },
  { id: "login", label: "Help with sign in", iconName: "log-in" },
  { id: "payment", label: "Payment & charges", iconName: "circle-dollar-sign" },
  { id: "security", label: "Security & privacy - policy", iconName: "shield-check" },
  { id: "other", label: "Something else", iconName: "message-circle-question" },
  { id: "report", label: "Report something", iconName: "shield-question" },
];

/**
 * Returns the matching Lucide icon for a given design name.
 */
function CategoryIcon({ name }: { name: string }) {
  const iconProps = { className: "w-6 h-6 text-black group-hover:rotate-12 transition-transform duration-300" };
  switch (name) {
    case "undo-2":
      return <Undo2 {...iconProps} />;
    case "log-in":
      return <LogIn {...iconProps} />;
    case "circle-dollar-sign":
      return <CircleDollarSign {...iconProps} />;
    case "shield-check":
      return <ShieldCheck {...iconProps} />;
    case "message-circle-question":
      return <MessageCircleQuestion {...iconProps} />;
    case "shield-question":
      return <ShieldQuestion {...iconProps} />;
    default:
      return null;
  }
}

export default function CustomerServicePage() {
  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleReset = () => {
    setFullName("");
    setEmail("");
    setContactNumber("");
    setMessage("");
    setIsSuccess(false);
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* ── 1. Hero Banner Section ── */}
      <section className="relative w-full h-[320px] sm:h-[400px] md:h-[500px] flex items-center overflow-hidden">
        <Image
          src={img}
          alt="Neon Shaking Hands Banner"
          fill
          priority
          unoptimized
          className="object-cover object-center select-none"
        />
        {/* Modern dark gradient overlay for visual depth and text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />

        <div className="relative mx-auto w-full max-w-[1760px] px-6 sm:px-10 md:px-16 lg:px-20 z-10">
          <h1 className="font-sans text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] font-bold leading-none tracking-tight text-white capitalize max-w-[650px] drop-shadow-md">
            How can we <span className="text-[#dec33a] drop-shadow-[0_0_10px_rgba(222,195,58,0.3)]">help you</span>
          </h1>
        </div>
      </section>

      {/* ── 2. Help Options Section ── */}
      <section className="mx-auto flex w-full max-w-[1760px] flex-col gap-12 sm:gap-16 items-center px-6 sm:px-10 md:px-16 lg:px-20 py-16 sm:py-20 md:py-24">
        {/* Headings */}
        <div className="flex flex-col gap-3 items-center text-center max-w-[800px]">
          <h2 className="text-[#0a0a0a] font-sans text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] font-bold tracking-tight capitalize">
            Welcome to our customer service
          </h2>
          <p className="text-[#4a5565] font-sans text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] leading-relaxed">
            We can help you figure out most of the things here, just sign in and get started
          </p>
        </div>

        {/* 6-Card Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1400px]">
          {HELP_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              className="group bg-[#f2f2f2] border border-[#e5e5e6] hover:border-[#dec33a] hover:bg-gray-50 active:bg-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 rounded p-6 flex items-center gap-5 cursor-pointer text-left w-full"
            >
              <div className="bg-[#dec33a] group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(222,195,58,0.4)] rounded shrink-0 w-[50px] h-[50px] flex items-center justify-center transition-all duration-300">
                <CategoryIcon name={category.iconName} />
              </div>
              <span className="text-[#0a0a0a] font-sans text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-bold leading-[1.2] transition-colors group-hover:text-black">
                {category.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── 3. Inquiry Form Section ── */}
      <section className="bg-[#f2f2f3] w-full py-16 sm:py-20 md:py-24 border-t border-[#e5e5e6]">
        <div className="mx-auto max-w-[1760px] px-6 sm:px-10 md:px-16 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* Form Header Info (Left) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h2 className="text-[#0a0a0a] font-sans text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] font-bold tracking-tight">
              Send an Inquiry
            </h2>
            <p className="text-[#4a5565] font-sans text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] leading-relaxed">
              Fill out the form below and our team will get back to you as soon as possible.
            </p>
          </div>

          {/* Form Fields (Right) */}
          <div className="lg:col-span-8 w-full max-w-[800px]">
            {isSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 sm:p-8 text-emerald-950 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                  <h3 className="text-[20px] sm:text-[24px] font-bold text-emerald-900">
                    Inquiry Submitted Successfully!
                  </h3>
                </div>
                <p className="text-[15px] sm:text-[17px] leading-relaxed">
                  Thank you for reaching out, <strong className="font-semibold">{fullName}</strong>. We have received your inquiry regarding support and our customer service team will get back to you at <strong className="font-semibold">{email}</strong> shortly.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-2 text-emerald-700 font-semibold underline hover:text-emerald-900 transition-colors cursor-pointer text-left w-fit"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="fullName" className="text-black text-[15px] sm:text-[16px] font-bold">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alexander von Berg"
                    className="w-full bg-white border border-[#e5e5e6] rounded px-4 py-3 text-[14px] sm:text-[16px] text-black placeholder-[#848995] focus:outline-none focus:border-[#dec33a] focus:ring-1 focus:ring-[#dec33a] transition-all"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-black text-[15px] sm:text-[16px] font-bold">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alexander@domain.com"
                    className="w-full bg-white border border-[#e5e5e6] rounded px-4 py-3 text-[14px] sm:text-[16px] text-black placeholder-[#848995] focus:outline-none focus:border-[#dec33a] focus:ring-1 focus:ring-[#dec33a] transition-all"
                  />
                </div>

                {/* Contact Number */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="contactNumber" className="text-black text-[15px] sm:text-[16px] font-bold">
                    Contact Number
                  </label>
                  <input
                    id="contactNumber"
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="+41 00 000 00 00"
                    className="w-full bg-white border border-[#e5e5e6] rounded px-4 py-3 text-[14px] sm:text-[16px] text-black placeholder-[#848995] focus:outline-none focus:border-[#dec33a] focus:ring-1 focus:ring-[#dec33a] transition-all"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-black text-[15px] sm:text-[16px] font-bold">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your Inquiry..."
                    rows={6}
                    className="w-full bg-white border border-[#e5e5e6] rounded px-4 py-3 text-[14px] sm:text-[16px] text-black placeholder-[#848995] focus:outline-none focus:border-[#dec33a] focus:ring-1 focus:ring-[#dec33a] transition-all resize-y"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#dec33a] hover:bg-[#c9b034] active:bg-[#b49a2e] disabled:opacity-50 text-black font-bold text-[16px] px-8 py-3 rounded transition-all w-full sm:w-[211px] h-12 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow active:shadow-none"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                </button>
              </form>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}
