'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Star,
  Package,
  Layers,
  Send,
  Loader2,
  MessageSquare,
  CornerDownRight,
} from 'lucide-react';
import { profileAssetUrl } from '@/lib/api/profile';
import { useReplyToReview } from '@/hooks/api/useReview';
import type { ICategoryReview, ICategoryReviewProduct } from '@/lib/api/review';

interface CategoryWiseReviewsProps {
  categoryReviews?: ICategoryReview[];
}

export default function CategoryWiseReviews({ categoryReviews = [] }: CategoryWiseReviewsProps) {
  // Store expanded category IDs (default first one expanded if exists)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    if (categoryReviews.length > 0) {
      return { [categoryReviews[0].categoryId]: true };
    }
    return {};
  });

  // Store expanded product IDs to view reviews
  const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({});

  // Reply inputs per review id
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const replyMutation = useReplyToReview();

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const toggleProduct = (productId: string) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleReplyChange = (reviewId: string, text: string) => {
    setReplyInputs((prev) => ({ ...prev, [reviewId]: text }));
  };

  const handleSendReply = (reviewId: string) => {
    const text = replyInputs[reviewId]?.trim();
    if (!text) return;

    replyMutation.mutate(
      { reviewId, replyText: text },
      {
        onSuccess: () => {
          setReplyInputs((prev) => ({ ...prev, [reviewId]: '' }));
        },
      }
    );
  };

  if (categoryReviews.length === 0) {
    return (
      <div className="w-full bg-white border border-[#e5e5e6] rounded-[4px] p-8 text-center text-[#848995] text-sm">
        No category review data available.
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-[#e5e5e6] rounded-[4px] p-[24px] flex flex-col gap-[20px]">
      {/* Section Header */}
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-[20px] text-black">Category Wise Reviews</h3>
        <p className="text-[13px] text-[#848995]">
          Click on each category to view product-level review counts, overall ratings, and customer comments.
        </p>
      </div>

      {/* Categories Accordion List */}
      <div className="flex flex-col gap-[14px] w-full">
        {categoryReviews.map((cat) => {
          const isCatExpanded = Boolean(expandedCategories[cat.categoryId]);

          return (
            <div
              key={cat.categoryId}
              className="border border-[#e5e5e6] rounded-[4px] overflow-hidden bg-white transition-all shadow-xs"
            >
              {/* Category Header Row (Clickable) */}
              <button
                type="button"
                onClick={() => toggleCategory(cat.categoryId)}
                className="w-full flex items-center justify-between px-5 py-4 bg-[#f9fafb] hover:bg-[#f2f4f7] transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-[3px] bg-[#ede7de] flex items-center justify-center text-black">
                    <Layers className="size-4 text-[#f09000]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[16px] text-black">
                        {cat.categoryName}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#e5e5e6] text-[#42454d]">
                        {cat.productsCount} {cat.productsCount === 1 ? 'Product' : 'Products'}
                      </span>
                    </div>
                    <p className="text-xs text-[#848995] mt-0.5">
                      Total {cat.totalReviews} customer {cat.totalReviews === 1 ? 'review' : 'reviews'} received
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Category Average Rating */}
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-white border border-[#e5e5e6]">
                    <Star className="size-4 text-[#f09000] fill-[#f09000]" />
                    <span className="text-sm font-semibold text-black">
                      {cat.averageRating.toFixed(1)}
                    </span>
                    <span className="text-xs text-[#848995]">/ 5</span>
                  </div>

                  {/* Reviews Count Badge */}
                  <div className="hidden sm:flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded bg-[#fcece6] text-[#ebaf0a]">
                    <MessageSquare className="size-3.5" />
                    <span>{cat.totalReviews} Reviews</span>
                  </div>

                  {/* Expand / Collapse Icon */}
                  <div className="size-8 rounded flex items-center justify-center text-[#42454d]">
                    {isCatExpanded ? (
                      <ChevronUp className="size-5" />
                    ) : (
                      <ChevronDown className="size-5" />
                    )}
                  </div>
                </div>
              </button>

              {/* Category Products Content */}
              {isCatExpanded && (
                <div className="p-4 border-t border-[#e5e5e6] flex flex-col gap-3 bg-white">
                  {cat.products.length === 0 ? (
                    <p className="py-4 text-center text-xs text-[#848995]">
                      No products found in this category.
                    </p>
                  ) : (
                    cat.products.map((product) => (
                      <ProductReviewCard
                        key={product.id}
                        product={product}
                        isExpanded={Boolean(expandedProducts[product.id])}
                        onToggle={() => toggleProduct(product.id)}
                        replyInputs={replyInputs}
                        onReplyChange={handleReplyChange}
                        onSendReply={handleSendReply}
                        isReplying={replyMutation.isPending}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Product Review Card Sub-Component
// ─────────────────────────────────────────────────────────────────────────────

interface ProductReviewCardProps {
  product: ICategoryReviewProduct;
  isExpanded: boolean;
  onToggle: () => void;
  replyInputs: Record<string, string>;
  onReplyChange: (reviewId: string, text: string) => void;
  onSendReply: (reviewId: string) => void;
  isReplying: boolean;
}

function ProductReviewCard({
  product,
  isExpanded,
  onToggle,
  replyInputs,
  onReplyChange,
  onSendReply,
  isReplying,
}: ProductReviewCardProps) {
  const imgSrc = profileAssetUrl(product.thumbnail);

  return (
    <div className="border border-[#e5e5e6] rounded-[3px] overflow-hidden bg-white">
      {/* Product Summary Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-3 bg-white hover:bg-gray-50/70 transition-colors">
        {/* Product Info */}
        <div className="flex items-center gap-3">
          <div className="size-11 rounded bg-[#f7f7f8] border border-[#e5e5e6] overflow-hidden shrink-0 flex items-center justify-center">
            {imgSrc ? (
              <img src={imgSrc} alt={product.name} className="size-full object-cover" />
            ) : (
              <Package className="size-5 text-[#848995]" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-black">{product.name}</h4>
            <div className="flex items-center gap-3 text-xs text-[#848995] mt-0.5">
              <span>Price: ${product.basePrice.toFixed(2)}</span>
              <span>•</span>
              <span>Units Sold: {product.unitsSold.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Reviews Stats & Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-4">
          {/* Total Reviews Count */}
          <div className="text-right">
            <span className="text-xs text-[#848995] block">Reviews Received</span>
            <span className="text-sm font-semibold text-black">
              {product.totalReviews} {product.totalReviews === 1 ? 'Review' : 'Reviews'}
            </span>
          </div>

          {/* Overall Product Rating */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fef7ee] border border-[#fae2c5] rounded">
            <Star className="size-4 text-[#f09000] fill-[#f09000]" />
            <span className="text-sm font-bold text-black">
              {product.overallRating.toFixed(1)}
            </span>
            <span className="text-xs text-[#848995]">/ 5</span>
          </div>

          {/* Toggle Reviews Button */}
          <button
            type="button"
            onClick={onToggle}
            className="flex items-center gap-1 text-xs font-medium text-[#165dd0] hover:underline px-2 py-1 rounded"
          >
            <span>{isExpanded ? 'Hide' : 'View'} ({product.reviews.length})</span>
            {isExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
          </button>
        </div>
      </div>

      {/* Individual Customer Reviews Drawer */}
      {isExpanded && (
        <div className="bg-[#fafbfc] border-t border-[#e5e5e6] p-4 flex flex-col gap-4">
          {product.reviews.length === 0 ? (
            <p className="text-xs text-[#848995] text-center py-2">
              No customer comments submitted for this product yet.
            </p>
          ) : (
            product.reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white border border-[#e5e5e6] rounded-[4px] p-4 flex flex-col gap-3 shadow-xs"
              >
                {/* Reviewer Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.reviewerAvatar || 'https://i.pravatar.cc/150?u=anon'}
                      alt={rev.reviewerName}
                      className="size-7 rounded-full object-cover border border-[#e5e5e6]"
                    />
                    <div>
                      <p className="text-xs font-semibold text-black">{rev.reviewerName}</p>
                      <p className="text-[10px] text-[#848995]">{rev.createdAt}</p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`size-3.5 ${
                          star <= rev.rating
                            ? 'text-[#f09000] fill-[#f09000]'
                            : 'text-[#e5e5e6] fill-[#e5e5e6]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Comment */}
                <p className="text-xs text-[#42454d] leading-relaxed ml-9">{rev.comment}</p>

                {/* Existing Store Reply */}
                {rev.replyText ? (
                  <div className="ml-9 p-3 rounded bg-[#f7f7f8] border-l-2 border-[#f09000] flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-black flex items-center gap-1">
                        <CornerDownRight className="size-3 text-[#f09000]" /> Store Response
                      </span>
                      {rev.replyDate && (
                        <span className="text-[10px] text-[#848995]">{rev.replyDate}</span>
                      )}
                    </div>
                    <p className="text-xs text-[#42454d]">{rev.replyText}</p>
                  </div>
                ) : (
                  /* Reply Input */
                  <div className="ml-9 flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={replyInputs[rev.id] || ''}
                      onChange={(e) => onReplyChange(rev.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') onSendReply(rev.id);
                      }}
                      placeholder="Write a response to this review..."
                      className="flex-1 h-8 px-3 text-xs border border-[#e5e5e6] rounded-[2px] outline-none focus:border-[#f09000] placeholder:text-[#848995]"
                    />
                    <button
                      type="button"
                      onClick={() => onSendReply(rev.id)}
                      disabled={isReplying || !replyInputs[rev.id]?.trim()}
                      className="h-8 px-3 rounded-[2px] bg-[#f09000] hover:bg-[#d98200] text-black text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      {isReplying ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Send className="size-3" />
                      )}
                      <span>Reply</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
