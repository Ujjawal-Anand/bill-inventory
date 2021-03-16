import React, { useState } from 'react';
// Vendor
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { isLoaded } from 'react-redux-firebase';
import { PDFDownloadLink } from '@react-pdf/renderer';
// Custom
import Header from '../../header/Header';
import InvoicePD from './InvoicePD';
import InvoicePDF from './InvoicePDF';
import { Button } from '../../styledComponents/shared/Button';
import { ButtonDiv } from '../../styledComponents/incvoiceDetails/InvoiceDetailButtons';
import {
  openAddItemDialog,
  openCreateGatePassDialog
} from '../../../redux/actions/alertDialogActions';
import AppLoader from '../../loaders/app/AppLoader';
import PaymentChangeDialog from '../../dialog/PaymentChangeDialog';
import CreateGatePassDialog from '../../dialog/CreateGatePassDialog';

// Component
function InvoiceDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [pdfUrl, setPdfUrl] = useState();
  const invoice = useSelector(
    (state) =>
      state.firestore.data.invoices && state.firestore.data.invoices[id]
  );
  const loadingState = useSelector((state) => state.loadingState.emailSendBtn);

  if (!isLoaded(invoice)) return <AppLoader />;


  const handlePaymentStatus = () => {
    dispatch(openAddItemDialog({ open: true }))
  };

  return (
    <div>
      <Header title={'Invoice Details'} />
      <InvoicePD invoice={invoice} />
      <ButtonDiv>
        <Button
          onClick={handlePaymentStatus}
          disabled={loadingState}
          color="#fda734"
        >
          <i
            className={
              invoice.paidStatus
                ? 'tio-help_outlined'
                : 'tio-checkmark_circle_outlined'
            }
          ></i>{' '}
          Add Payment
          {loadingState && <i className="tio-sync spin-load"></i>}
        </Button>

        <Button
          onClick={() => dispatch(openCreateGatePassDialog(true))}
          disabled={loadingState}
        >
          <i className="tio-send"></i> Create GatePass
        </Button>

        <Button
          as={PDFDownloadLink}
          secondary
          document={<InvoicePDF invoice={invoice} />}
          fileName={invoice.invoiceNumber}
        >
          {({ blob, url, loading, error }) => (
            <>
              {!loading && setPdfUrl(url)}
              <i className="tio-download_to"></i>{' '}
              {loading ? 'Loading...' : 'Download'}
            </>
          )}
        </Button>

        <Button as="a" href={pdfUrl} target="_blank" secondary>
          <i className="tio-print"></i> Print
        </Button>
        {/* <Button color="#FD5665" onClick={handleDeleteInvoice}>
          <i className="tio-delete"></i> Delete
        </Button> */}
      </ButtonDiv>
      <PaymentChangeDialog
        invoiceId={id}
        totalAmount={
          invoice.taxEnable === 'true' ?
            invoice.totalWithExclusiveTax.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }) :
            invoice.totalAmount.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })
        }
        lastPaid={parseFloat(invoice.amountPaid)} />
      <CreateGatePassDialog items={invoice.items} />
    </div>
  );
}

export default InvoiceDetails;
