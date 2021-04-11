import React from 'react';
//Vendor
import moment from 'moment';
import numWords from 'num-words';
import styled from '@react-pdf/styled-components';
import { Document, Font } from '@react-pdf/renderer';
import Noto from '../../../fonts/Yantramanav/Yantramanav-Regular.ttf';

Font.register({
  family: 'Noto Sans',
  format: 'truetype',
  src: Noto
});

const BillPage = styled.Page`
  padding: 10px 20px;
  font-family: 'Noto Sans';
`;

const BillDetails = styled.View`
  display: table;
  width: auto;
  margin: 0 auto;
  flex-direction: row;
`;

const BillColumnLeft = styled.View`
  width: 50%;
  padding-right: 40px;
  padding-left: 0px;

  text-align: left;
`;
const BillColumnRight = styled(BillColumnLeft)`
  padding-left: 50px;
  padding-right: 0px;
  text-align: right;
`;

const InvoiceHeading = styled.Text`
  font-size: 14px;
  font-weight: bolder;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: right;
  width: 100%;
`;
const InvoiceNumber = styled.Text`
  color: #444;
  font-size: 8px;
  text-transform: uppercase;
  font-weight: bolder;
`;

const Details = styled.Text`
  font-size: 10;
  padding: 2px 0;
  line-height: 1;
`;
const SmallDetails = styled.Text`
  font-size: 8;
  padding: 2px 0;
  line-height: 0.8;
`;

const Textt = styled.Text`
  padding: 2px 0;
`;

const BillTable = styled.View`
  display: table;
  width: 100%;
`;
const BillRow = styled.View`
  margin: 0 auto;
  flex-direction: row;
  padding: 2px 0;
`;
const BillRowHead = styled(BillRow)`
  font-size: 12px;
  border: 1px solid #4a4a4a;
  color: black;
`;
const BillDataText = styled.Text`
  width: 60%;
  padding: 0 5px;
  font-size: 10px;
`;
const BillDataNum = styled.Text`
  width: 15%;
  text-align: right;
  padding: 0 5px;
  font-size: 10px;
`;
const BillDataSerial = styled(BillDataNum)`
  width: 5%;
`;
const BillTotal = styled(BillColumnRight)`
  padding: 0;
`;

function InvoicePDF(props) {
  const {
    companyName,
    gstNumber,
    companyAddress,
    customerName,
    customerAddress,
    email,
    invoiceDate,
    dueDate,
    mobileNumber,
    invoiceNumber,
    currency,
    note = "Thank you for shopping!",
    taxEnable,
    taxType,
    taxPercent,
    items,
    amountPaid,
    totalAmount,
    totalExclusiveTax,
    totalInclusiveTax,
    totalWithExclusiveTax
  } = props.invoice;
  const currencySign = currency === 'usd' ? '$' : '₹';
  const amountDue = parseFloat(totalAmount) - parseFloat(amountPaid);
  const itemList = items.map(({ itemName, rate, qty, amount, id }, i) => (
    <BillRow key={id}>
      <BillDataSerial>{i + 1}</BillDataSerial>
      <BillDataText>{itemName} .</BillDataText>
      <BillDataNum>₹{rate.toFixed(2)}</BillDataNum>
      <BillDataNum style={{ width: '6%' }}>{qty}</BillDataNum>
      <BillDataNum>₹{amount.toFixed(2)}</BillDataNum>
    </BillRow>
  ));

  return (
    <Document>
      <BillPage>
        <BillDetails>
          <BillColumnLeft>
            <Textt>{companyName}</Textt>
            <SmallDetails>{companyAddress}</SmallDetails>
            <InvoiceNumber>{gstNumber && `GSTIN: ${gstNumber}`}</InvoiceNumber>
            <Details>
              Due Date : {moment(dueDate.toDate()).format('DD-MM-YYYY')}
            </Details>
          </BillColumnLeft>
          <BillColumnRight>
            <InvoiceHeading>INVOICE</InvoiceHeading>
            <InvoiceNumber># Inv/{invoiceNumber} Date: {invoiceDate}</InvoiceNumber>
            <Details style={{ marginTop: '2px' }}>Bill To</Details>
            <Details>{customerName}</Details>
            <Details>{customerAddress}</Details>
            <Details>{mobileNumber}</Details>
            {email && <Details>{email}</Details>}
          </BillColumnRight>
        </BillDetails>
        <BillTable>
          <BillRowHead>
            <BillDataSerial>Sr.</BillDataSerial>
            <BillDataText>
              Item Name
            </BillDataText>
            <BillDataNum>Rate</BillDataNum>
            <BillDataNum style={{ width: '6%' }}>Qty</BillDataNum>
            <BillDataNum>Amount</BillDataNum>
          </BillRowHead>
        </BillTable>
        {itemList}
        <BillDetails style={{ padding: '0 5px' }}>
          <BillColumnLeft>
            <Details style={{ marginTop: '10px', textTransform: 'capitalize' }}>Total Amount in words: {numWords(totalAmount)}</Details>
            <Details style={{ textTransform: 'capitalize' }}>Paid Amount in words: {numWords(amountPaid)}</Details>

            {note.length > 0 && (
              <Details style={{ marginTop: '30px' }}>Note : {note}</Details>
            )}
            <Details>सभी विवाद केवल पटना के अधिकार क्षेत्र के अधीन हैं है  </Details>
          </BillColumnLeft>
          <BillColumnRight>
            <BillDetails>
              <BillTotal>
                <Details>Sub Total:</Details>
                {taxType === 'exc' && <Details> GST {taxPercent}% : </Details>}

                <Details>Total: </Details>

                {taxEnable === 'true' && taxType === 'inc' && (
                  <Details style={{ marginLeft: '-50%' }}>
                    Includes GST {taxPercent}%:{' '}
                  </Details>
                )}
                <Details style={{ marginLeft: '-50%' }}>Paid:</Details>
                <Details style={{ marginLeft: '-50%' }}>Due:</Details>
              </BillTotal>
              <BillTotal>
                <Details>
                  {currencySign}{' '}
                  {totalAmount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </Details>
                {taxType === 'exc' && (
                  <>
                    <Details>
                      {totalExclusiveTax.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </Details>
                    <Details>
                      {currencySign}{' '}
                      {totalWithExclusiveTax.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </Details>
                  </>
                )}

                {taxEnable === 'true' && taxType === 'inc' && (
                  <>
                    <Details>
                      {currencySign}{' '}
                      {totalAmount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </Details>

                    <Details>
                      {currencySign}{' '}
                      {totalInclusiveTax.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </Details>
                  </>
                )}
                {taxEnable === 'false' && (
                  <Details>
                    {currencySign}{' '}
                    {totalAmount.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}

                  </Details>

                )}
                <Details>{currencySign}{' '}{amountPaid.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}</Details>
                <Details>{currencySign}{' '}{amountDue.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}</Details>
                <Details style={{ marginTop: '30px' }}>Signature</Details>


              </BillTotal>


            </BillDetails>
          </BillColumnRight>
        </BillDetails>
      </BillPage>
    </Document>
  );
}

export default InvoicePDF;
