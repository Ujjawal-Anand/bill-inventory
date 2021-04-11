import React, { useEffect, useRef } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import { isLoaded } from 'react-redux-firebase';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import { pdf } from '@react-pdf/renderer';
import { nanoid } from 'nanoid';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';


import GatePassPDF from '../pages/view/GatePassPDF';
import { openCreateGatePassDialog } from '../../redux/actions/alertDialogActions';
import { addGatepass } from '../../redux/actions/invoiceActions';
import { updateStockInBatch } from '../../redux/actions/itemActions';




export default function CreateGatePassDialog({ invoice, invoiceId }) {
    const invoiceItems = invoice.items;
    const items = useSelector((state) => state.firestore.ordered.items);
    const warehouseItems = useRef([]);

    let defaultValues = {}

    // create default values for Order Quantity
    invoiceItems.map(item => {
        const qty = parseFloat(item.qty) - (invoice.orders &&
            invoice.orders[item.id] ?
            parseFloat(invoice.orders[item.id]) : 0);

        return defaultValues[`invoiceItems[${item.id}].qty`] = qty

    })
    console.log(defaultValues);


    const { handleSubmit, errors, setValue, watch, control } = useForm({ defaultValues });

    // watch for warehouseName change from select dropdown
    // this is similar two setState
    const warehouseName = watch("warehouseName", "");
    // fetch warehouse from firstore
    const warehouse = useSelector((state) => state.firestore.ordered.warehouse);

    const dispatch = useDispatch();
    const { openCreateGatepass } = useSelector(
        (state) => state.alertState ? state.alertState : false
    );

    useEffect(() => {
        if (warehouseName && warehouseName !== "Select Warehouse") {
            warehouseItems.current = items.filter(item =>
                invoiceItems.some(invoiceItem =>
                    item.id === invoiceItem.id &&
                    item.stock && item.stock[warehouseName] && item.stock[warehouseName] > 0));
            // reset(defaultValues)
            for (let [key, value] of Object.entries(defaultValues)) {
                setValue(key, value)
            }
        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [warehouseName])



    const handleClose = () => {
        dispatch(openCreateGatePassDialog(false));
    };

    const onSubmit = (data) => {
        // 
        let checkedItems = [];
        let orders = {};
        let warehouseStock = [];

        if (data.invoiceItems) {
            for (let [key, value] of Object.entries(data.invoiceItems)) {
                if (value.itemName) {
                    checkedItems = [...checkedItems, { ...value, id: key }]
                    orders[key] = parseFloat(value.qty) +
                        (invoice.orders && invoice.orders[key] ? parseFloat(invoice.orders[key]) : 0)
                    const stockItems = warehouseItems.current.find(warehouseItem =>
                        warehouseItem.id === key).stock
                    warehouseStock.push({
                        id: key, details: {
                            ...stockItems, [warehouseName]: parseFloat(stockItems[warehouseName]) - parseFloat(value.qty)
                        }
                    })

                }
            }
        }
        console.log("warehouseStock", warehouseStock);
        const id = nanoid(8);


        if (checkedItems.length > 0) {
            const gatePassData = {
                id,
                warehouseName: data.warehouseName,
                deliveryDate: typeof (data.deliveryDate) === "object"
                    && data.deliveryDate._d ? data.deliveryDate._d : new Date(),
                items: checkedItems,
                created_at: new Date(),
                fullfilled: false,
                created_by: ""
            }
            generatePdfDocument({
                companyName: invoice.companyName,
                companyAddress: invoice.companyAddress,
                ...gatePassData
            });
            dispatch(addGatepass(invoiceId, gatePassData, orders));
            dispatch(updateStockInBatch(warehouseStock))

            handleClose();
        }
    };

    const generatePdfDocument = async (gatePassData) => {
        const blob = await pdf((
            <GatePassPDF invoice={gatePassData} />
        )).toBlob();
        const file = new Blob([blob], { type: 'application/pdf' });
        window.open(window.URL.createObjectURL(file), '_blank');
    };




    return (
        <div>
            <Dialog open={openCreateGatepass} disableBackdropClick onClose={handleClose}
                fullWidth={true} maxWidth="sm" scroll="paper"
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create Gate Pass</DialogTitle>

                <DialogContent dividers={true}>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <Controller
                                as={
                                    <Select
                                        label="Select Warehouse"
                                        margin="dense"
                                        variant="outlined"
                                        error={errors.warehouseName && true}
                                        fullWidth
                                    >
                                        <MenuItem value="Select Warehouse" selected={true}>Select Warehouse</MenuItem>
                                        {isLoaded(warehouse) &&
                                            warehouse.map((item, index) => <MenuItem key={index} value={item.name}>{item.name}</MenuItem>)}
                                    </Select>
                                }
                                name="warehouseName"
                                rules={{ required: true }}
                                control={control}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <Controller
                                    name="deliveryDate"
                                    control={control}

                                    // rules={{ required: true }}
                                    render={({ ref, ...rest }) => (
                                        <KeyboardDatePicker
                                            id="date-picker-dialog"
                                            label="Select Delivery Date"
                                            format="DD/MM/yyyy"

                                            margin="dense"
                                            inputVariant="outlined"
                                            KeyboardButtonProps={{
                                                "aria-label": "change date"
                                            }}
                                            {...rest}
                                        />
                                    )}
                                />
                            </MuiPickersUtilsProvider>

                        </Grid>
                        {warehouseName && warehouseName !== "Select Warehouse" ? invoiceItems.map(item => {
                            const fieldName = `invoiceItems[${item.id}]`
                            const inStock = warehouseItems.current.find(warehouseItem =>
                                item.id === warehouseItem.id);
                            const stock = inStock ? inStock.stock[warehouseName] : 0;
                            return (
                                <React.Fragment key={fieldName}>
                                    <Grid item xs={6}>
                                        <Grid container alignItems="center">
                                            <Controller
                                                name={`${fieldName}.itemName`}
                                                control={control}
                                                render={(props) => (
                                                    <Checkbox
                                                        onChange={(e) => props.onChange(e.target.checked ? item.itemName : false)}
                                                        checked={props.value}
                                                        inputRef={props.ref}
                                                        disabled={defaultValues[`invoiceItems[${item.id}].qty`] <= 0 || !stock}
                                                    />
                                                )}
                                            />

                                            <Grid item xs>
                                                {item.itemName}

                                                <Typography variant="body2" color="textSecondary">
                                                    Quantity In Stock: {stock}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Controller render={({ ref, ...rest }) => (
                                            <TextField
                                                label="Quantity from warehouse"
                                                size="small"
                                                variant="outlined"
                                                margin="dense"
                                                defaultValue={item.qty}
                                                inputRef={ref}
                                                required
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            Max:
                                                        </InputAdornment>
                                                    )
                                                }}
                                                {...rest}
                                            />
                                        )}
                                            name={`${fieldName}.qty`} control={control}
                                            rules={{
                                                required: true,
                                                pattern: {
                                                    value: /^\d+$/,
                                                    message: "Must be a number"
                                                }
                                            }} />

                                    </Grid>
                                </React.Fragment>
                            )
                        }
                        ) : <label>Select Warehouse First</label>
                        }

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button disabled={!warehouseName || warehouseName === "Select Warehouse"} onClick={handleSubmit(onSubmit)} color="primary">
                        Create GatePass
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    );
}
