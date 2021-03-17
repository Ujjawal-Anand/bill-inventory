import React from 'react';
//Vendor
import styled from '@react-pdf/styled-components';
import { Document, Font } from '@react-pdf/renderer';
import Noto from '../../../fonts/Yantramanav/Yantramanav-Regular.ttf';

Font.register({
  family: 'Noto Sans',
  format: 'truetype',
  src: Noto
});

const BillPage = styled.Page`
  padding: 10px 30px;
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
  padding-right: 50px;
  padding-left: 0px;

  text-align: left;
`;
const BillColumnRight = styled(BillColumnLeft)`
  padding-left: 50px;
  padding-right: 0px;
  text-align: right;
`;

const GatePassHeading = styled.Text`
  font-size: 30px;
  font-weight: bolder;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: right;
  width: 100%;
`;

const Details = styled.Text`
  font-size: 12;
  padding: 5px 0;
  line-height: 1.2;
`;

const Textt = styled.Text`
  padding: 5px 0;
`;

const BillTable = styled.View`
  display: table;
  width: 100%;
`;
const BillRow = styled.View`
  margin: 0 auto;
  flex-direction: row;
  padding: 8px 0;
`;
const BillRowHead = styled(BillRow)`
  font-size: 15px;
  border: 1px solid #4a4a4a;
  color: black;
`;
const BillDataText = styled.Text`
  width: 80%;
  padding: 0 5px;
  font-size: 12px;
`;
const BillDataNum = styled.Text`
  width: 15%;
  text-align: right;
  padding: 0 5px;
  font-size: 12px;
`;
const BillDataSerial = styled(BillDataNum)`
  width: 5%;
`;

function GatePassPDF(props) {
  const {
    companyName = "Pooja Store",
    companyAddress = '',
    warehouseName = "1",
    warehouseAddress = "Patna City",
    deliveryDate = new Date(),
    items
  } = props.invoice;
  console.log("items", items)
  // eslint-disable-next-line array-callback-return
  const itemList = items.map(({ itemName, qty }, i) => {
    if (itemName)
      return (
        <BillRow key={i}>
          <BillDataSerial>{i + 1}</BillDataSerial>
          <BillDataText>{itemName} .</BillDataText>
          <BillDataNum>{qty}</BillDataNum>
        </BillRow>
      )
  });

  return (
    <Document>
      <BillPage>
        <BillDetails>
          <BillColumnLeft>
            <Textt>{companyName}</Textt>
            <Details>{companyAddress}</Details>
            <Details>
              GatePass Date : {new Date().toLocaleDateString()}
            </Details>
            <Details>Delivery Date : {new Date(deliveryDate).toLocaleDateString()} </Details>
          </BillColumnLeft>
          <BillColumnRight>
            <GatePassHeading>GatePass</GatePassHeading>
            <Details>Warehouse - {warehouseName}</Details>
            <Details>Address - {warehouseAddress}</Details>
          </BillColumnRight>
        </BillDetails>
        <BillTable>
          <BillRowHead>
            <BillDataSerial>Sr.</BillDataSerial>
            <BillDataText>Item Name</BillDataText>
            <BillDataNum>Quantity</BillDataNum>
          </BillRowHead>
        </BillTable>
        {itemList}
        <BillDetails>
          <BillColumnRight>
            <Details style={{ marginTop: '20px' }}>Signature</Details>
          </BillColumnRight>
        </BillDetails>
      </BillPage>
    </Document>
  );
}

export default GatePassPDF;
