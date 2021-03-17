import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import { nanoid } from 'nanoid';


import { updatePaymentStatus } from '../../redux/actions/invoiceActions';
import { openCreateGatePassDialog } from '../../redux/actions/alertDialogActions';


export default function PaymentChangeDialog({ totalAmount, invoiceId, lastPaid = 0 }) {
    const formatNum = (num) =>
        num.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    const totalAmountLeftToPay = parseFloat(totalAmount) - parseFloat(lastPaid);
    const fullAmountLable = `Full Payment ₹${formatNum(totalAmountLeftToPay)}`
    const { register, handleSubmit, errors } = useForm();
    const [value, setValue] = useState('full-paid');

    const dispatch = useDispatch();
    const { open } = useSelector(
        (state) => state.alertState ? state.alertState : false
    );

    const handleClose = () => {
        dispatch(openCreateGatePassDialog(false));
    };

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const onSubmit = (data) => {
        const amount = parseFloat(value === "full-paid" ? totalAmount : data.amount)
        const id = nanoid(8);

        const paymentData = {
            invoiceId,
            status: amount >= totalAmountLeftToPay ? 'full-paid' : value,
            amountPaid: amount + lastPaid,
            paymentHistory: { id, paidAt: new Date(), amount, createdBy: "" }
        };
        console.log(data);
        dispatch(updatePaymentStatus(paymentData));
        handleClose()
    };


    return (
        <div>
            <Dialog open={open} onClose={handleClose} maxWidth="lg" aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Change Payment Status</DialogTitle>
                <DialogContent>

                    <FormControl component="fieldset">
                        <FormLabel component="legend">Payment Status</FormLabel>
                        <RadioGroup aria-label="payment" name="payment1" value={value} onChange={handleChange}>
                            <FormControlLabel value="full-paid" control={<Radio />} label={fullAmountLable} />
                            <FormControlLabel value="partial-paid" control={<Radio />} label="Partial Payment" />
                        </RadioGroup>
                        {value === 'partial-paid' && <TextField
                            autoFocus
                            label="Amount Paid"
                            name="amount"
                            inputRef={register({ required: true, minLength: 1 })}
                            error={errors.amount && true}
                            helperText={errors.name && 'Invalid Input'}
                            size="small"
                            fullWidth
                            variant="outlined"
                            margin="dense"
                            disabled={value === 'full-paid'}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <b>₹</b>
                                    </InputAdornment>
                                )
                            }}

                        />}
                    </FormControl>
                    <p>Total Amount to be paid: ₹{formatNum(totalAmountLeftToPay)}</p>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit(onSubmit)} color="primary">
                        Change Payment Status
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
