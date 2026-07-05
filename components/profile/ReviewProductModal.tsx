import React, { useState, useRef } from 'react';
import { Star, ImageUp, X } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface ReviewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewProductModal({ isOpen, onClose }: ReviewProductModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    // Simulate API call
    toast.success('Review submitted successfully!');
    
    // Reset state
    setRating(0);
    setReviewText('');
    setSelectedImage(null);
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white border border-[#e5e5e6] flex flex-col items-start p-[40px] relative rounded-[6px] w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-black cursor-pointer transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col gap-[24px] items-start w-full text-left">
          {/* Header */}
          <div className="w-full">
            <h2 className="font-['Open_Sans'] font-semibold text-[20px] text-black leading-[1.2]">
              Review This Product
            </h2>
          </div>

          {/* Rating Section */}
          <div className="flex flex-col gap-[8px] items-start w-full">
            <p className="font-['Open_Sans'] font-normal text-[16px] text-black leading-[1.2]">
              Rate the product
            </p>
            <div className="flex items-center gap-[16px]">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="w-[40px] h-[40px] flex items-center justify-center cursor-pointer focus:outline-none"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star 
                      className="w-[32px] h-[32px] transition-colors" 
                      fill={(hoverRating || rating) >= star ? '#dec33a' : 'transparent'} 
                      stroke={(hoverRating || rating) >= star ? '#dec33a' : '#cacbce'} 
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
              </div>
              <p className="font-['Open_Sans'] font-normal text-[14px] text-black leading-[1.3]">
                {rating} out of 5
              </p>
            </div>
          </div>

          {/* Textarea Section */}
          <div className="flex flex-col gap-[8px] items-start w-full">
            <p className="font-['Open_Sans'] font-normal text-[16px] text-black leading-[1.2]">
              Write your review
            </p>
            <textarea 
              className="bg-white border border-[#e5e5e6] w-full h-[154px] rounded-[2px] p-[12px] font-['Open_Sans'] text-[14px] text-black placeholder:text-[#848995] focus:outline-none focus:border-[#dec33a] resize-none"
              placeholder="Write your review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>
          </div>

          {/* Image Upload Section */}
          <div className="flex flex-col gap-[8px] items-start w-full">
            <p className="font-['Open_Sans'] font-normal text-[16px] text-black leading-[1.2]">
              Add image
            </p>
            <div 
              className="border border-[#cacbce] border-dashed flex flex-col gap-[12px] h-[154px] items-center justify-center rounded-[6px] w-full bg-gray-50/50 hover:bg-gray-50 cursor-pointer transition-colors relative overflow-hidden"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
              />
              {selectedImage ? (
                <Image src={selectedImage} width={150} height={150} alt="Review upload" className="w-full h-full object-cover" />
              ) : (
                <>
                  <div className="w-[36px] h-[36px] flex items-center justify-center text-gray-500">
                    <ImageUp className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col items-center gap-[2px] text-[14px] font-['Aptos']">
                    <p className="text-[#42454d]">Drag and drop your image here</p>
                    <p className="text-[#42454d]">or</p>
                    <p className="text-[#165dd0] underline cursor-pointer hover:text-blue-700">Upload from computer</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-center gap-4 w-full pt-4">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 rounded-[2px] font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              className="bg-[#dec33a] hover:bg-[#c9b030] px-6 py-2.5 rounded-[2px] font-semibold text-black transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={rating === 0}
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
