import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import { isLoaded } from 'react-redux-firebase';
import InputLabel from '@material-ui/core/InputLabel';
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




export default function CreateGatePassDialog({ invoice, invoiceId }) {
    const items = invoice.items;
    let defaultValues = { warehouseName: "", deliveryDate: new Date() }
    items.map(item => {

        return defaultValues[`items[${item.id}].qty`] = item.qty
    })


    const { handleSubmit, errors, control } = useForm({ defaultValues });
    const warehouse = useSelector((state) => state.firestore.ordered.warehouse);


    const dispatch = useDispatch();
    const { openCreateGatepass } = useSelector(
        (state) => state.alertState ? state.alertState : false
    );

    const handleClose = () => {
        dispatch(openCreateGatePassDialog(false));
    };

    const onSubmit = (data) => {
        // 
        let checkedItems = [];

        for (let [key, value] of Object.entries(data.items)) {
            if (value.itemName) {
                checkedItems = [...checkedItems, { ...value, id: key }]
            }
        }
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
            console.log("gate pass data", gatePassData)
            generatePdfDocument({
                companyName: invoice.companyName,
                companyAddress: invoice.companyAddress,
                ...gatePassData
            });
            dispatch(addGatepass(invoiceId, gatePassData));

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
            <Dialog open={openCreateGatepass} onClose={handleClose}
                fullWidth={true} maxWidth="sm" scroll="paper"
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create Gate Pass</DialogTitle>

                <DialogContent dividers={true}>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <InputLabel htmlFor="select-warehouse-label">Select Warehouse</InputLabel>
                            <Controller
                                as={
                                    <Select
                                        label="Select Warehouse"
                                        margin="dense"
                                        variant="outlined"
                                        error={errors.warehouseName && true}
                                        fullWidth
                                        inputProps={{
                                            name: 'warehouseName',
                                            id: 'select-warehouse-label',
                                        }}
                                    >
                                        <option aria-label="None" value="" />
                                        {isLoaded(warehouse) &&
                                            warehouse.map((item, index) => <option key={index} value={item.name}>{item.name}</option>)}
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
                                            fullWidth
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
                        {items.map(item => {
                            const fieldName = `items[${item.id}]`
                            return (
                                <React.Fragment key={fieldName}>
                                    <Grid item xs={6}>
                                        <Controller
                                            name={`${fieldName}.itemName`}
                                            control={control}
                                            render={(props) => (
                                                <Checkbox
                                                    onChange={(e) => props.onChange(e.target.checked ? item.itemName : false)}
                                                    checked={props.value}
                                                    inputRef={props.ref}
                                                />
                                            )}
                                        />
                                        <label>{item.itemName}</label>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Controller as={
                                            <TextField
                                                label="Quantity from warehouse"
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                margin="dense"
                                                defaultValue={item.qty}
                                                required
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            Ordered Quantity:
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        }
                                            name={`${fieldName}.qty`} control={control} />

                                    </Grid>
                                </React.Fragment>
                            )
                        }
                        )
                        }
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit(onSubmit)} color="primary">
                        Create GatePass
                    </Button>
                    {/* {gatePassData && ready && <PDFDownloadLink
                        document={<GatePassPDF invoice={gatePassData} />}
                        fileName="gatepass.pdf"
                        style={{
                            textDecoration: "none",
                            padding: "10px",
                            color: "#4a4a4a",
                            backgroundColor: "#f2f2f2",
                            border: "1px solid #4a4a4a"
                        }}
                    >
                        {({ blob, url, loading, error }) =>
                            loading ? "Loading document..." : "Download Pdf"
                        }
                    </PDFDownloadLink>} */}
                </DialogActions>
            </Dialog>
        </div >
    );
}
