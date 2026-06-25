import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CategoryGridData } from "@/lib/homepage-data";
import { cn } from "@/lib/utils";

interface CategoryGridCardProps {
  data: CategoryGridData;
  className?: string;
}

export default function CategoryGridCard({ data, className }: CategoryGridCardProps) {
  return (
    <article 
      className={cn(
        "flex flex-col justify-between bg-white p-6 rounded-[4px] border border-[#E5E5E6] shadow-sm hover:shadow-md transition-all duration-200 h-full",
        className
      )}
    >
      <div>
        {/* Title */}
        <h3 className="text-[20px] font-bold leading-[1.2] text-black mb-4 truncate" title={data.title}>
          {data.title}
        </h3>

        {/* 2x2 Category Grid */}
        <div className="grid grid-cols-2 gap-4">
          {data.items.map((item, idx) => (
            <Link 
              key={idx} 
              href={`${data.exploreHref}&sub=${encodeURIComponent(item.label)}`}
              className="group flex flex-col items-start focus-visible:outline-none"
            >
              {/* Image Container with precise 179:200 aspect ratio */}
              <div className="relative aspect-[179/200] w-full overflow-hidden rounded-[4px] bg-gray-100">
                <Image
                  src={item.imageSrc}
                  alt={item.label}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
              </div>
              
              {/* Label */}
              <span className="mt-2 text-[14px] font-normal leading-[1.3] text-[#1e293b] group-hover:text-[#165DD0] transition-colors truncate w-full">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Explore Link */}
      <div className="mt-6">
        <Link
          href={data.exploreHref}
          className="inline-flex items-center gap-1.5 text-[14px] font-normal text-[#165DD0] hover:text-[#0f4494] transition-colors group"
        >
          <span>{data.exploreLabel || "Explore All"}</span>
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
