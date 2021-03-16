import React from 'react';
//Vendor
import { Doughnut } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';
import { GraphWidget } from '../../../styledComponents/dashboard/Widget';
// Custom
import PieLoader from '../../../loaders/dashboard/PieLoader';

// Component
function PieGraph() {
  const invoices = useSelector((state) => state.firestore.ordered.invoices);

  if (!isLoaded(invoices)) {
    return <PieLoader />;
  }

  if (isLoaded(invoices)) {
    const paidInvoice = invoices.filter((invoice) => invoice.paidStatus === "full-paid").length;
    const partialPaidInvoice = invoices.filter((invoice) => invoice.paidStatus === "partial-paid").length;
    const pendingInvoice = invoices.filter((invoice) => invoice.paidStatus === "unpaid")
      .length;

    const chartData = {
      labels: ['Fulfilled Invoice', 'Partially Paid', 'Pending Invoices'],
      datasets: [
        {
          label: 'Rahu',
          data: [paidInvoice, partialPaidInvoice, pendingInvoice],
          backgroundColor: ['#24B47E3a', '#6772E53a', '#F037383a'],
          borderColor: ['#24B47E', '#6772E5', '#F03738'],
          borderWidth: 1
        }
      ]
    };

    return (
      <GraphWidget>
        <h3>Summary</h3>
        <Doughnut data={chartData} width={500} height={500} />
      </GraphWidget>
    );
  }
  return null;
}

export default PieGraph;
