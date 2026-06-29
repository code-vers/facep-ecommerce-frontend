'use client';

import React from 'react';
import { Star, Send } from 'lucide-react';

const mockReviews = [
  {
    id: 1,
    name: 'Dianne Russell',
    date: '2025-06-16',
    rating: 5,
    text: "Exactly what I needed. All ports work perfectly and it's very compact.",
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=64&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=64&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=64&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=64&auto=format&fit=crop',
    ],
    avatar: 'https://i.pravatar.cc/150?u=1',
    showReplyInput: true,
  },
  {
    id: 2,
    name: 'Dianne Russell',
    date: '2025-06-16',
    rating: 5,
    text: "Exactly what I needed. All ports work perfectly and it's very compact.",
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=64&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=64&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=64&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=64&auto=format&fit=crop',
    ],
    avatar: 'https://i.pravatar.cc/150?u=2',
    reply: {
      name: 'Store name',
      date: '2025-06-18',
      text: 'Thanks a lot for the honest review!',
      avatar: 'https://i.pravatar.cc/150?u=10',
    }
  },
  {
    id: 3,
    name: 'John Doe',
    date: '2025-06-18',
    rating: 5,
    text: "Great product! The quality is exceptional and it fits perfectly in my setup.",
    avatar: 'https://i.pravatar.cc/150?u=3',
  },
  {
    id: 4,
    name: 'Emma Johnson',
    date: '2025-06-19',
    rating: 5,
    text: "Compact design and all ports function seamlessly. Highly recommend it!",
    avatar: 'https://i.pravatar.cc/150?u=4',
  },
  {
    id: 5,
    name: 'Dianne Russell',
    date: '2025-06-16',
    rating: 5,
    text: "Exactly what I needed. All ports work perfectly and it's very compact.",
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=64&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=64&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=64&auto=format&fit=crop',
    ],
    avatar: 'https://i.pravatar.cc/150?u=5',
  },
  {
    id: 6,
    name: 'Sophia Brown',
    date: '2025-06-21',
    rating: 5,
    text: "Impressive build quality. It's easy to carry around and very reliable.",
    avatar: 'https://i.pravatar.cc/150?u=6',
  },
  {
    id: 7,
    name: 'James Wilson',
    date: '2025-06-22',
    rating: 5,
    text: "Absolutely love it! It has transformed my workspace for the better.",
    avatar: 'https://i.pravatar.cc/150?u=7',
  }
];

export default function RecentReviews() {
  return (
    <div className="w-full bg-white border border-[#e5e5e6] rounded-[4px] p-[24px] flex flex-col gap-[24px]">
      
      {/* Header */}
      <h3 className="font-semibold text-[20px] text-black">Recent Reviews</h3>

      {/* Reviews List */}
      <div className="flex flex-col w-full">
        {mockReviews.map((review, idx) => (
          <div key={review.id} className={`flex flex-col py-[24px] ${idx !== mockReviews.length - 1 ? 'border-b border-[#e5e5e6]' : ''}`}>
            
            <div className="flex items-start justify-between w-full mb-[12px]">
              <div className="flex items-center gap-[12px]">
                <img src={review.avatar} alt={review.name} className="size-[32px] rounded-full object-cover" />
                <p className="text-[14px] font-semibold text-black">{review.name}</p>
              </div>
              
              <div className="flex flex-col items-end gap-[4px]">
                <div className="flex items-center gap-[2px]">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`size-[14px] ${i < review.rating ? 'text-[#f09000] fill-[#f09000]' : 'text-[#e5e5e6] fill-[#e5e5e6]'}`} 
                    />
                  ))}
                </div>
                <p className="text-[10px] text-[#848995]">{review.date}</p>
              </div>
            </div>

            <p className="text-[12px] text-[#42454d] mb-[12px] ml-[44px]">
              {review.text}
            </p>

            {/* Images */}
            {review.images && (
              <div className="flex items-center gap-[8px] ml-[44px] mb-[12px]">
                {review.images.map((img, i) => (
                  <div key={i} className="size-[40px] rounded-[2px] overflow-hidden border border-[#e5e5e6]">
                    <img src={img} alt="Review attachment" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input (if active) */}
            {review.showReplyInput && (
              <div className="flex flex-col ml-[44px] mt-[8px]">
                <p className="text-[12px] text-[#42454d] mb-[8px]">Respond to the review</p>
                <div className="relative w-full">
                  <input 
                    type="text" 
                    placeholder="Reply" 
                    className="w-full h-[40px] border border-[#e5e5e6] rounded-[2px] pl-[12px] pr-[40px] text-[12px] text-black outline-none placeholder:text-[#848995]"
                  />
                  <button className="absolute right-[12px] top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer hover:opacity-80">
                    <Send className="size-[16px] text-[#f09000]" />
                  </button>
                </div>
              </div>
            )}

            {/* Store Reply */}
            {review.reply && (
              <div className="flex flex-col ml-[44px] mt-[16px]">
                <div className="flex items-start justify-between w-full mb-[8px]">
                  <div className="flex items-center gap-[12px]">
                    <img src={review.reply.avatar} alt={review.reply.name} className="size-[24px] rounded-full object-cover" />
                    <p className="text-[14px] font-semibold text-black">{review.reply.name}</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-[4px]">
                    <div className="flex items-center gap-[2px]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="size-[14px] text-[#f09000] fill-[#f09000]" />
                      ))}
                    </div>
                    <p className="text-[10px] text-[#848995]">{review.reply.date}</p>
                  </div>
                </div>
                <p className="text-[12px] text-[#42454d] ml-[36px]">
                  {review.reply.text}
                </p>
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
}
