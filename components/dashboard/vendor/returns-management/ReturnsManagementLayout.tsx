/**
 * @fileoverview Main Layout container for the Vendor Returns Management layout.
 * Integrates the ReturnsTable list and provides structured page alignment.
 *
 * @module components/dashboard/vendor/returns-management/ReturnsManagementLayout
 */

'use client';

import { VENDOR_RETURNS } from '@/lib/vendor-data';
import ReturnsTable from './ReturnsTable';

export default function ReturnsManagementLayout() {
  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full max-w-[1760px] mx-auto pb-12">
      {/* ── Return Requests Listing Section ── */}
      <section aria-label="Vendor Return Requests">
        <ReturnsTable initialReturns={VENDOR_RETURNS} />
      </section>
    </div>
  );
}
