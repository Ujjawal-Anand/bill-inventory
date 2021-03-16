import React from 'react';
//Vendor
import { isLoaded, isEmpty } from 'react-redux-firebase';
import moment from 'moment';

// Custom
import { GraphWidget } from '../../../styledComponents/dashboard/Widget';
import PieLoader from '../../../loaders/dashboard/PieLoader';

// Component
function ItemSoldList({ invoices }) {
    let itemDict = {};
    let items = [];
    const todayInvoices = invoices && invoices.filter((invoice) =>
        invoice.invoiceDate === moment(new Date()).format('DD-MM-YYYY'))

    if (isLoaded(todayInvoices) && !isEmpty(todayInvoices)) {
        todayInvoices.map(invoice => {
            invoice.items.map(item => {
                itemDict[item.itemName] !== undefined ?
                    itemDict[item.itemName] = itemDict[item.itemName] + item.qty :
                    itemDict[item.itemName] = item.qty;
                return null;
            })
            return null;
        })
        items = Object.keys(itemDict).map(function (key) {
            return [key, itemDict[key]];
        });
        items.sort(function (first, second) {
            return second[1] - first[1];
        });
    }

    if (!isLoaded(todayInvoices) || Object.keys(itemDict).length === 0) {
        return <PieLoader />;
    }

    return (
        <GraphWidget color="#6772E5">
            <h3>Items Sold</h3>
            <br />
            {
                items.map((item, index) => <p key={index}>{item[0]} : {item[1]}</p>
                )}
        </GraphWidget>
    );
}

export default ItemSoldList;
