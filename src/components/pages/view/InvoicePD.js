import React from 'react';
//Vendor
import styled from 'styled-components';
import moment from 'moment';
import numWords from 'num-words';

// Styles
const BillDocument = styled.div`
  max-width: 100%;
  overflow: auto;
`;
const BillPage = styled.div`
  max-width: 900px;
  width: 900px;
  overflow: auto;
  margin: 2rem auto;
  padding: 6rem 4rem;
  box-shadow: 4px 4px 28px 10px rgba(240, 240, 240, 0.9);
`;
const BillDetails = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2rem auto;
`;
const BillColumn = styled.div`
  width: 40%;
  border: red 2px solidcolor;
`;
const InvoiceHeading = styled.h1`
  font-size: 32px;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const InvoiceNumber = styled.p`
  color: #444;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: bolder;
  margin-bottom: 2rem;
`;
const Date = styled.div`
  margin-top: 4rem;
`;
const BillRow = styled.div`
  display: grid;
  padding: 8px 0;

  grid-template-columns: 1fr 10fr 3fr 2fr 2fr 3fr;
`;
const BillHead = styled(BillRow)`
  background: #444;
  border-radius: 3px;
  color: white;
`;
const BillDataNum = styled.p`
  text-align: right;
  padding: 0 5px;
`;

function InvoicePDF(props) {
  const {
    companyName,
    gstNumber,
    companyAddress,
    customerName,
    customerAddress,
    mobileNumber,
    email,
    invoiceDate,
    dueDate,
    invoiceNumber,
    currency,
    note = "Thank you for shopping",
    taxEnable,
    taxType,
    taxPercent,
    items,
    amountPaid = 0,
    totalAmount,
    totalExclusiveTax,
    totalInclusiveTax,
    totalWithExclusiveTax,
    paidStatus
  } = props.invoice;
  const currencySign = currency === 'usd' ? '$' : '₹';
  const itemList = items.map(({ itemName, rate, qty, amount, id }, i) => (
    <BillRow key={id}>
      <BillDataNum>{i + 1}</BillDataNum>
      <p>{itemName}</p>
      <BillDataNum>{rate.toFixed(2)}</BillDataNum>
      <BillDataNum>{qty}</BillDataNum>
      <BillDataNum> </BillDataNum>
      <BillDataNum>{amount.toFixed(2)}</BillDataNum>
    </BillRow>
  ));
  return (
    <BillDocument>
      <BillPage>
        <BillDetails>
          <BillColumn>
            <h2>{companyName}</h2>
            <p>{companyAddress}</p>
            <InvoiceNumber>{gstNumber && `GSTIN: ${gstNumber}`}</InvoiceNumber>
            <Date>
              <p>
                Invoice Date :{' '}
                {invoiceDate}
              </p>
              <p>Due Date : {moment(dueDate.toDate()).format('DD-MM-YYYY')}</p>
              <p>
                Status :{' '}
                {paidStatus === 'full-paid' ? (
                  <span style={{ color: '#219735' }}>Fulfilled</span>
                ) : paidStatus === 'partial-paid' ? (<>
                  <span style={{ color: '#6772E5' }}>Partialy Paid</span> <br />
                  <span>Amount Paid: ₹{amountPaid} </span>
                </>
                ) : (
                  <span style={{ color: '#FD5665' }}>Pending</span>
                )}
              </p>
            </Date>
          </BillColumn>

          <BillColumn style={{ textAlign: 'right' }}>
            <InvoiceHeading>INVOICE</InvoiceHeading>
            <InvoiceNumber># Inv/{invoiceNumber}</InvoiceNumber>
            <p>Bill To</p>
            <h2>{customerName}</h2>
            <p>{customerAddress}</p>
            {mobileNumber && <p>Mobile : {mobileNumber}</p>}
            <p>{email}</p>
          </BillColumn>
        </BillDetails>
        <BillHead>
          <BillDataNum>#</BillDataNum>
          <p>Item Name</p>
          <BillDataNum>Rate</BillDataNum>
          <BillDataNum>Qty</BillDataNum>
          <BillDataNum> </BillDataNum>
          <BillDataNum>Amount</BillDataNum>
        </BillHead>
        {itemList}
        <BillDetails>

          <BillColumn>
            <Date style={{ textTransform: 'capitalize' }}>Total Amount in words: {numWords(totalAmount)}</Date>
            {note && <Date>Note: {note}</Date>}
          </BillColumn>
          <BillColumn>
            <BillDetails>
              <BillColumn style={{ textAlign: 'right' }}>
                <p>Sub Total: </p>
                {taxType === 'exc' && <p> GST {taxPercent}% : </p>}

                <p>Total: </p>

                {taxEnable === 'true' && taxType === 'inc' && (
                  <p style={{ marginLeft: '-50%' }}>
                    Includes GST {taxPercent}%:{' '}
                  </p>
                )}
              </BillColumn>
              <BillColumn style={{ textAlign: 'right' }}>
                <p>
                  {currencySign}{' '}
                  {totalAmount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
                {taxEnable === 'true' && taxType === 'exc' && (
                  <>
                    <p>
                      {totalExclusiveTax.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </p>
                    <p>
                      {currencySign}{' '}
                      {totalWithExclusiveTax.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </p>
                  </>
                )}
                {taxEnable === 'true' && taxType === 'inc' && (
                  <>
                    <p>
                      {currencySign}{' '}
                      {totalAmount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </p>

                    <p>
                      {currencySign}{' '}
                      {totalInclusiveTax.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </p>
                  </>
                )}
                {taxEnable === 'false' && (
                  <p>
                    {currencySign}{' '}
                    {totalAmount.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                )}
              </BillColumn>
            </BillDetails>
          </BillColumn>
        </BillDetails>
      </BillPage>
    </BillDocument>
  );
}

export default InvoicePDF;
