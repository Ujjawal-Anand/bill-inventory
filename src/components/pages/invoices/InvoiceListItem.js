import React from 'react';
//Vendor
import { Link } from 'react-router-dom';
// Custom
import { InvoiceListItem as InvoiceList } from '../../styledComponents/invoices/invoiceTables';


// Component
function InvoiceListItem(props) {
  const { invoice } = props;
  const currencySign = invoice.currency === 'usd' ? '$' : '₹';


  return (
    <Link to={`/invoice/${invoice.id}`}>
      <InvoiceList>
        <p className="number">{invoice.invoiceNumber}</p>
        <p className="date">
          {invoice.invoiceDate}
        </p>
        <p className="name">{invoice.customerName}</p>

        <p className="amount">
          {invoice.taxType === 'inc' &&
            invoice.taxEnable === 'true' &&
            currencySign +
            invoice.totalAmount.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          {invoice.taxType === 'exc' &&
            invoice.taxEnable === 'true' &&
            currencySign +
            invoice.totalWithExclusiveTax.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          {invoice.taxEnable === 'false' &&
            currencySign +
            invoice.totalAmount.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
        </p>
        <p className="status">
          {invoice.paidStatus === 'full-paid' ? (
            <span style={{ color: '#219735' }}>Fulfilled</span>
          ) : invoice.paidStatus === 'partial-paid' ? (<>
            <span style={{ color: '#6772E5' }}>Partialy</span> <br />
            <span>Paid: ₹{invoice.amountPaid} </span>
          </>
          ) : (
            <span style={{ color: '#FD5665' }}>Pending</span>
          )}
        </p>

      </InvoiceList>
    </Link>
  );
}

export default InvoiceListItem;
