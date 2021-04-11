import React, { useState, useEffect } from 'react';
//Vendor
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import { isLoaded } from 'react-redux-firebase';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';

// Custom
import Header from '../../header/Header';
import { InvoiceContainer } from '../../styledComponents/newInvoice/NewInvoiceContainer';
import ProductList from './ProductList';
import { createInvoice } from '../../../redux/actions/invoiceActions';
import CreatePageLoader from '../../loaders/create/CreatePageLoader';

// Component
function NewInvoice(props) {
  const { register, handleSubmit, errors } = useForm();
  const dispatch = useDispatch();
  const settings = useSelector(
    (state) => state.firebase.profile && state.firebase.profile.settings
  );
  const invoiceNum = useSelector(
    (state) => state.firebase.profile && state.firebase.profile.currentInvoice
  );

  //Format Invoice Num and Append Zeros to is
  const invNum =
    invoiceNum && invoiceNum.toString().length < 4
      ? '0'.repeat(4 - invoiceNum.toString().length) + invoiceNum
      : invoiceNum;

  const [invoiceMeta, setInvoiceMeta] = useState({
    invoiceDate: new Date(),
    dueDate: new Date(),
    billableType: 'product',
    mobileNumber: '',
    taxType: 'exc',
    taxPercent: '18',
    taxEnable: 'false',
    currency: 'inr',
    companyAddress: '',
    companyName: '',
    gstNumber: ''
  });

  // Set Default Form State
  useEffect(() => {
    if (isLoaded(settings))
      setInvoiceMeta({
        ...invoiceMeta,
        currency: settings.currency,
        billableType: settings.billableType,
        taxType: settings.taxType,
        taxPercent: settings.taxPercent,
        taxEnable: settings.taxEnable,
        companyAddress: settings.companyAddress,
        companyName: settings.companyName,
        gstNumber: settings.gstNumber
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  //Loader For Create Full Page
  if (!isLoaded(settings)) return <CreatePageLoader />;

  // Controlling Some Inputs
  const handleDueDateChange = (e) => {
    setInvoiceMeta({ ...invoiceMeta, dueDate: e._d });
  };
  const handleInvoiceDateChange = (e) => {
    setInvoiceMeta({ ...invoiceMeta, invoiceDate: e._d });
  };

  // Submiting Invoice Details
  const handleInvoiceSubmit = (metaData) => {
    const handleDataSubmit = (data) => {
      const finalObj = {
        ...data,
        ...metaData,
        amountPaid: 0,
        companyAddress: settings.companyAddress,
        companyName: settings.companyName,
        gstNumber: settings.gstNumber,
        dueDate: invoiceMeta.dueDate,
        invoiceDate: moment(invoiceMeta.invoiceDate).format('DD-MM-YYYY'),
        paidStatus: 'unpaid',
        remindedAt: new Date()
      };
      console.log("final Object", finalObj)
      dispatch(createInvoice(finalObj));
      console.log(finalObj)
    };

    handleSubmit(handleDataSubmit)();
  };

  return (
    <div>
      <Header title={'Add New Invoice'} />
      <InvoiceContainer>

        <Grid
          container
          justify="center"
          alignItems="center"
          className="invoice-details"

        >

          <div className="textfield-container">
            <p className="invoice-title">Customer Details</p>

            <TextField
              label="Customer Name"
              name="customerName"
              inputRef={register({ required: true, minLength: 2 })}
              error={errors.customerName && true}
              helperText={errors.customerName && 'Invalid Input'}
              size="small"
              fullWidth
              required
              variant="outlined"
              margin="dense"
            />
            <TextField
              label="Address"
              name="customerAddress"
              inputRef={register({ required: false, minLength: 2 })}
              error={errors.customerAddress && true}
              helperText={errors.customerAddress && 'Invalid Input'}
              size="small"
              fullWidth
              variant="outlined"
              margin="dense"
            />
            <TextField
              label="Mobile Number"
              name="mobileNumber"
              inputRef={register({
                required: false,
                minLength: 10,
                pattern: /^[6-9]\d{9}/
              })}
              error={errors.email && true}
              helperText={errors.mobileNumber && 'Invalid Input'}
              size="small"
              type="email"
              fullWidth
              variant="outlined"
              margin="dense"
            />
          </div>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <div className="textfield-container">
              <p className="invoice-title">Invoice Details</p>

              <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardDatePicker
                  margin="dense"
                  id="date-picker-dialog"
                  label="Date"
                  inputRef={register}
                  error={errors.itemName && true}
                  helperText={errors.itemName && 'Invalid Input'}
                  size="small"
                  fullWidth
                  inputVariant="outlined"
                  format="DD/MM/YYYY"
                  value={invoiceMeta.invoiceDate}
                  onChange={handleInvoiceDateChange}
                  name="invoiceDate"
                  KeyboardButtonProps={{
                    'aria-label': 'change date'
                  }}
                />
                <KeyboardDatePicker
                  margin="dense"
                  id="due-date-picker-dialog"
                  label="Due Date"
                  inputRef={register}
                  size="small"
                  fullWidth
                  inputVariant="outlined"
                  format="DD/MM/YYYY"
                  value={invoiceMeta.dueDate}
                  onChange={handleDueDateChange}
                  name="dueDate"
                  KeyboardButtonProps={{
                    'aria-label': 'change date'
                  }}
                />
              </MuiPickersUtilsProvider>
              <TextField
                label="# Invoice Number"
                name="invoiceNumber"
                inputRef={register({
                  required: true,
                  minLength: 2
                })}
                error={errors.invoiceNumber && true}
                helperText={errors.invoiceNumber && 'Invalid Input'}
                size="small"
                fullWidth
                variant="outlined"
                margin="dense"
                value={invNum}
              />
            </div>
          </Grid>
        </Grid>
        {/* Product List */}
        <ProductList
          invoiceMeta={invoiceMeta}
          handleInvoiceSubmit={handleInvoiceSubmit}
        />
      </InvoiceContainer>
    </div>
  );
}

export default NewInvoice;
