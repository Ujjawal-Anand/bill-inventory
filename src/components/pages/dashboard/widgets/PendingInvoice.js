import React from 'react';
//Vendor
import { isLoaded } from 'react-redux-firebase';
// Custom
import { Widget } from '../../../styledComponents/dashboard/Widget';
import SmallSummaryCard from '../../../loaders/dashboard/SmallSummaryCard';

// Component
function PendingInvoice({ invoices }) {
  const pendingInvoices = invoices && invoices.filter(
    (invoice) => invoice.paidStatus === "unpaid").length


  if (!isLoaded(pendingInvoices)) {
    return <SmallSummaryCard />;
  }

  return (
    <Widget color="#F03738">
      <div className="icon">
        <i className="tio-time"></i>
      </div>
      <div className="widget-text">
        <h2>Pending</h2>
        <p>Invoices: {pendingInvoices}</p>
      </div>
    </Widget>
  );
}

export default PendingInvoice;
