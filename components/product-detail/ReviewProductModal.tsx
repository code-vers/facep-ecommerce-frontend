'use client';

import { ImageUp, Star } from 'lucide-react';
import { useState } from 'react';

type ReviewProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ReviewProductModal({ isOpen, onClose }: ReviewProductModalProps) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className='fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-[rgba(155,155,155,0.72)] px-4 py-6 sm:py-8 xl:px-10'
      onClick={onClose}
    >
      <div
        className='relative w-full max-w-318 rounded-[6px] border border-[#E5E5E6] bg-white p-4 sm:p-6 lg:p-8 xl:p-10'
        onClick={(event) => event.stopPropagation()}
      >
        <div className='flex w-full flex-col gap-6'>
          <div className='flex w-full items-start'>
            <h2 className='flex-1 text-[20px] font-semibold leading-[1.2] text-black'>
              Review This Product
            </h2>
          </div>

          <div className='flex w-full items-start'>
            <div className='flex min-w-0 flex-1 flex-col gap-2'>
              <div className='flex w-full items-start'>
                <p className='flex-1 text-[16px] leading-[1.2] text-black'>Rate the product</p>
              </div>

              <div className='flex flex-wrap items-center gap-px'>
                {Array.from({ length: 5 }, (_, index) => {
                  const filled = index < rating;

                  return (
                    <button
                      key={index}
                      type='button'
                      onClick={() => setRating(index + 1)}
                      className='flex h-8 w-8 items-center justify-center sm:h-10 sm:w-10'
                      aria-label={`Rate ${index + 1} out of 5`}
                    >
                      <Star
                        size={32}
                        strokeWidth={1.5}
                        fill={filled ? '#DEC33A' : 'none'}
                        className='text-[#DEC33A]'
                        style={{
                          width: 'clamp(32px, 4vw, 40px)',
                          height: 'clamp(32px, 4vw, 40px)',
                        }}
                      />
                    </button>
                  );
                })}
              </div>

              <p className='text-[12px] leading-[1.3] text-black'>{rating} out of 5</p>
            </div>
          </div>

          <div className='flex w-full flex-col gap-2'>
            <div className='flex w-full items-start'>
              <p className='flex-1 text-[16px] leading-[1.2] text-black'>Write your review</p>
            </div>

            <div className='flex w-full items-center'>
              <textarea
                value={reviewText}
                onChange={(event) => setReviewText(event.target.value)}
                placeholder='Write your review'
                className='h-38.5 w-full resize-none overflow-hidden rounded-xs border border-[#E5E5E6] bg-white px-3 py-2.5 text-[14px] leading-[1.3] text-black outline-none placeholder:text-[#848995]'
              />
            </div>
          </div>

          <div className='flex w-full flex-col gap-2'>
            <div className='flex w-full items-start'>
              <p className='flex-1 text-[16px] leading-[1.2] text-black'>Add image</p>
            </div>

            <div className='flex h-38.5 w-full flex-col items-center justify-center gap-3 rounded-[6px] border border-dashed border-[#CACBCE] p-4 sm:p-6'>
              <ImageUp size={36} strokeWidth={1.6} className='text-[#848995]' />

              <div
                className='flex flex-col items-center gap-0.5 text-[14px] leading-tight'
                style={{ fontFamily: 'Aptos, Arial, sans-serif' }}
              >
                <p className='text-[#42454D]'>Drag and drop your Logo here</p>
                <p className='text-[#42454D]'>or</p>
                <button
                  type='button'
                  className='text-[#165DD0] underline [text-underline-position:from-font]'
                >
                  Upload from computer
                </button>
              </div>
            </div>
          </div>

          <div className='flex w-full justify-end'>
            <button
              type='button'
              className='h-12 w-full rounded-xs border border-[#DEC33A] bg-[#DEC33A] px-4 text-[16px] leading-[1.2] text-black sm:min-w-52.75 sm:w-auto'
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
