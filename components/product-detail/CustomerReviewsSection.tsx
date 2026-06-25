import Image from "next/image";
import { Star } from "lucide-react";

const reviewerAvatar =
  "https://www.figma.com/api/mcp/asset/c3e9cc45-a921-44b6-939a-41a022f3aedc";

const ratingBreakdown = [
  { label: "5 star", percentage: "20%", width: 105 },
  { label: "4 star", percentage: "10%", width: 58 },
  { label: "3 star", percentage: "20%", width: 99 },
  { label: "2 star", percentage: "30%", width: 136 },
  { label: "1 star", percentage: "12%", width: 82 },
] as const;

type Review = {
  id: string;
  name: string;
  text: string;
  date: string;
  attachmentCount?: number;
};

const reviews: Review[] = [
  {
    id: "review-1",
    name: "Dianne Russell",
    text: "Exactly what I needed. All ports work perfectly and it's very compact.",
    date: "2025-06-16",
    attachmentCount: 4,
  },
  {
    id: "review-2",
    name: "Dianne Russell",
    text: "Exactly what I needed. All ports work perfectly and it's very compact.",
    date: "2025-06-16",
    attachmentCount: 4,
  },
  {
    id: "review-3",
    name: "John Doe",
    text: "Great product! The quality is exceptional and it fits perfectly in my setup.",
    date: "2025-06-18",
  },
  {
    id: "review-4",
    name: "Emma Johnson",
    text: "Compact design and all ports function seamlessly. Highly recommend it!",
    date: "2025-06-19",
  },
  {
    id: "review-5",
    name: "Dianne Russell",
    text: "Exactly what I needed. All ports work perfectly and it's very compact.",
    date: "2025-06-16",
    attachmentCount: 3,
  },
  {
    id: "review-6",
    name: "Sophia Brown",
    text: "Impressive build quality. It's easy to carry around and very reliable.",
    date: "2025-06-21",
  },
  {
    id: "review-7",
    name: "James Wilson",
    text: "Absolutely love it! It has transformed my workspace for the better.",
    date: "2025-06-22",
  },
];

function RatingSummaryCard() {
  return (
    <div className="flex w-full max-w-[359px] flex-col gap-4 xl:shrink-0">
      <div className="flex w-full flex-col gap-6 border border-[#E5E5E6] bg-[#F2F2F3] p-6">
        <div className="flex flex-col gap-3">
          <h3 className="text-[22px] leading-[1.2] text-black">Customer Rating</h3>

          <div className="flex items-center gap-px">
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                size={40}
                strokeWidth={1.5}
                fill="#DEC33A"
                className="text-[#DEC33A]"
              />
            ))}
          </div>

          <p className="text-[18px] leading-[1.2] text-black">4.1 out of 5</p>
        </div>

        <div className="flex w-full flex-col gap-4">
          {ratingBreakdown.map((item) => (
            <div key={item.label} className="flex w-full items-center gap-3">
              <p className="w-[52px] shrink-0 text-[18px] leading-[1.2] text-black">{item.label}</p>
              <div className="relative h-2 w-[203px] shrink-0 rounded-[2px] bg-[#EDE7DE]">
                <div
                  className="absolute inset-y-0 left-0 rounded-[2px] bg-[#DEC33A]"
                  style={{ width: `${item.width}px` }}
                />
              </div>
              <p className="text-[18px] leading-[1.2] text-black">{item.percentage}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="h-12 w-full rounded-[2px] border border-[#DEC33A] bg-[#DEC33A] text-[16px] leading-[1.2] text-black"
      >
        Review This Product
      </button>
    </div>
  );
}

function ReviewAttachments({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-3">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="h-[60px] w-[60px] shrink-0 bg-white" />
      ))}
    </div>
  );
}

function ReviewRow({ review }: { review: Review }) {
  return (
    <article className="flex w-full flex-col border-b border-[#E5E5E6] p-5">
      <div className="flex w-full items-start gap-4">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
          <Image
            src={reviewerAvatar}
            alt={`${review.name} avatar`}
            fill
            unoptimized
            className="object-cover"
            sizes="40px"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex w-full items-center justify-between gap-4">
            <p className="w-[136px] text-[16px] font-semibold leading-[1.3] text-black">
              {review.name}
            </p>

            <div className="flex items-center gap-px">
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  size={12}
                  strokeWidth={1.7}
                  fill="#DEC33A"
                  className="text-[#DEC33A]"
                />
              ))}
            </div>
          </div>

          <div className="flex w-full items-center justify-between gap-4">
            <p className="text-[14px] leading-[1.3] text-[#42454D]">{review.text}</p>
            <p
              className="shrink-0 text-right text-[12px] leading-[1.3] text-[#42454D]"
              style={{ fontFamily: "Roboto, Arial, sans-serif" }}
            >
              {review.date}
            </p>
          </div>

          {review.attachmentCount ? <ReviewAttachments count={review.attachmentCount} /> : null}
        </div>
      </div>
    </article>
  );
}

export default function CustomerReviewsSection() {
  return (
    <section className="w-full px-5 py-8 lg:px-10 xl:px-20 xl:py-[50px]">
      <div className="mx-auto flex max-w-[1920px] flex-col gap-4 rounded-[4px] border border-[#E5E5E6] bg-white px-5 py-8 lg:px-10 xl:px-20 xl:py-[50px]">
        <div className="flex w-full items-center justify-center pb-[10px]">
          <h2 className="w-full text-[22px] leading-[1.2] text-black">Customer Reviews</h2>
        </div>

        <div className="flex flex-col gap-9 xl:flex-row xl:items-start">
          <RatingSummaryCard />

          <div className="flex min-w-0 flex-1 flex-col">
            {reviews.map((review) => (
              <ReviewRow key={review.id} review={review} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
