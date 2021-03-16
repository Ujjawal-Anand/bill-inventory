import React from 'react';
//Vendor
import { isLoaded } from 'react-redux-firebase';
// Custom
import { Widget } from '../../../styledComponents/dashboard/Widget';
import SmallSummaryCard from '../../../loaders/dashboard/SmallSummaryCard';

// Component
function FulfilledInvoice({ invoices }) {
  const paidInvoices = invoices && invoices.filter(
    (invoice) => invoice.paidStatus === "full-paid").length

  const partialPaidInvoices = invoices && invoices.filter(
    (invoice) => invoice.paidStatus === "partial-paid").length

  if (!isLoaded(paidInvoices)) {
    return <SmallSummaryCard />;
  }

  return (
    <Widget color="#24B47E">
      <div className="icon">
        <i className="tio-checkmark_circle_outlined"></i>
      </div>
      <div className="widget-text">
        <h2>Paid Invoices</h2>
        <p>Full Paid: {paidInvoices}</p>
        <p>Partial Paid: {partialPaidInvoices}</p>

      </div>
    </Widget>
  );
}

export default FulfilledInvoice;
