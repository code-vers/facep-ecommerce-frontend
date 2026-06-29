/**
 * @fileoverview Returns & Refunds Page.
 * Implements the Figma design for nodes 2134-2635, 2142-4369, 2149-3445,
 * and 2149-3977. Displays a multi-step return/refund request wizard within
 * the profile layout.
 *
 * @module app/profile/refunds/page
 */

'use client';

import React from 'react';
import RefundFlow from '@/components/profile/refunds/RefundFlow';

/**
 * ProfileRefundsPage — entry point for the returns & refunds section
 * of the user profile. Renders the multi-step refund wizard.
 */
export default function ProfileRefundsPage() {
  return (
    <div className="w-full text-left">
      <RefundFlow />
    </div>
  );
}
