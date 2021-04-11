import React, { useState } from 'react'
import styles from './Invoice.module.scss'

import LineItems from './LineItems'

import uuidv4 from 'uuid/v4'

const Invoice = () => {

    const locale = 'en-IN'
    const currency = 'INR'



    const [taxRate, setTaxRate] = useState(0.00)
    const [lineItems, setLineItems] = useState([{
        id: 'initial',      // react-beautiful-dnd unique key
        name: '',
        quantity: 1,
        rate: 0.00,
    },])



    const handleLineItemChange = (elementIndex) => (event) => {
        let items = lineItems.map((item, i) => {
            if (elementIndex !== i) return item
            return { ...item, [event.target.name]: event.target.value }
        })
        setLineItems([...items])
    }

    const handleLineItemNameChange = (elementIndex, itemDetail) => {
        let items = lineItems.map((item, i) => {
            if (elementIndex !== i) return item
            return {
                ...item,
                name: itemDetail.itemName,
                displayName: itemDetail.displayName ? itemDetail.displayName : itemDetail.itemName,
                rate: parseFloat(itemDetail.sellingPrice), id: itemDetail.id,
                item: itemDetail
            }
        })
        setLineItems([...items])
    }

    console.log(lineItems)

    const handleAddLineItem = (event) => {
        setLineItems(
            // use optimistic uuid for drag drop; in a production app this could be a database id
            lineItems.concat(
                [{ id: uuidv4(), name: '', quantity: 1, rate: 0.00 }]
            )
        )
    }

    const handleRemoveLineItem = (elementIndex) => (event) => {
        setLineItems(lineItems.filter((item, i) => {
            return elementIndex !== i
        })
        )
    }

    const handleReorderLineItems = (newLineItems) => {
        setLineItems(newLineItems)
    }

    const handleFocusSelect = (event) => {
        event.target.select()
    }

    const handlePayButtonClick = () => {
        alert('Not implemented')
    }

    const formatCurrency = (amount) => {
        return (new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount))
    }

    // const calcTaxAmount = (c) => {
    //     return c * (taxRate / 100)
    // }

    const calcLineItemsTotal = () => {
        return lineItems.reduce((prev, cur) => (prev + (cur.quantity * cur.rate)), 0)
    }

    const calcTaxTotal = () => {
        return calcLineItemsTotal() * (taxRate / 100)
    }

    const calcGrandTotal = () => {
        return calcLineItemsTotal() + calcTaxTotal()
    }


    return (

        <div className={styles.invoice}>
            <h2>Invoice</h2>

            <div className={styles.addresses}>
                <div className={`${styles.valueTable} ${styles.to}`}>

                    <div className={styles.row}>
                        <div className={styles.label}>Invoice #</div>
                        <div className={styles.value}>123456</div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.label}>Date</div>
                        <div className={`${styles.value} ${styles.date}`}>2019-01-01</div>
                    </div>
                </div>
                <div>
                    <div className={`${styles.valueTable} ${styles.to}`}>
                        <div className={styles.row}>
                            <div className={styles.label}>Customer #</div>
                            <div className={styles.value}>123456</div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.label}>Invoice #</div>
                            <div className={styles.value}>123456</div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.label}>Date</div>
                            <div className={`${styles.value} ${styles.date}`}>2019-01-01</div>
                        </div>
                    </div>
                </div>
            </div>
            <h2>Items</h2>

            <LineItems
                items={lineItems}
                currencyFormatter={formatCurrency}
                addHandler={handleAddLineItem}
                changeHandler={handleLineItemChange}
                nameChangeHandler={handleLineItemNameChange}
                focusHandler={handleFocusSelect}
                deleteHandler={handleRemoveLineItem}
                reorderHandler={handleReorderLineItems}
            />

            <div className={styles.totalContainer}>
                <form>
                    <div className={styles.valueTable}>
                        <div className={styles.row}>
                            <div className={styles.label}>Tax Rate (%)</div>
                            <div className={styles.value}><input name="taxRate" type="number" step="0.01" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} onFocus={handleFocusSelect} /></div>
                        </div>
                    </div>
                </form>
                <form>
                    <div className={styles.valueTable}>
                        <div className={styles.row}>
                            <div className={styles.label}>Subtotal</div>
                            <div className={`${styles.value} ${styles.currency}`}>{formatCurrency(calcLineItemsTotal())}</div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.label}>Tax ({taxRate}%)</div>
                            <div className={`${styles.value} ${styles.currency}`}>{formatCurrency(calcTaxTotal())}</div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.label}>Total Due</div>
                            <div className={`${styles.value} ${styles.currency}`}>{formatCurrency(calcGrandTotal())}</div>
                        </div>
                    </div>
                </form>
            </div>

            <div className={styles.pay}>
                <button className={styles.payNow} onClick={handlePayButtonClick}>Pay Now</button>
            </div>

        </div>

    )


}

export default Invoice
