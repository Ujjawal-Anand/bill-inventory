import React from 'react';
//Vendor
import { isLoaded, isEmpty } from 'react-redux-firebase';
import moment from 'moment';

// Custom
import { Widget } from '../../../styledComponents/dashboard/Widget';
import SmallSummaryCard from '../../../loaders/dashboard/SmallSummaryCard';

// Component
function TodaySales({ invoices }) {
    let amount = 0;
    let paidAmount = 0;
    let amountDue = 0;
    const todayInvoices = invoices && invoices.filter((invoice) =>
        invoice.invoiceDate === moment(new Date()).format('DD-MM-YYYY'))


    if (isLoaded(todayInvoices) && !isEmpty(todayInvoices)) {
        todayInvoices.map(invoice => {
            amount += parseFloat(invoice.totalAmount);
            paidAmount += parseFloat(invoice.amountPaid ? invoice.amountPaid : 0);
            return null;
        })
        amountDue = amount - paidAmount;
    }

    if (!isLoaded(todayInvoices)) {
        return <SmallSummaryCard />;
    }

    return (
        <Widget color="#6772E5">
            <div className="icon">
                <i className="tio-receipt"></i>
            </div>
            <div className="widget-text">
                <h2>Today Sales: {todayInvoices.length}</h2>
                <p>Total Amount: ₹{amount}</p>
                <p style={{ color: '#24B47E' }}>Amount Paid: ₹{paidAmount}</p>
                <p style={{ color: '#F03738' }}>Amount Due: ₹{amountDue}</p>

            </div>
        </Widget>
    );
}

export default TodaySales;
