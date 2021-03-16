import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { isLoaded } from 'react-redux-firebase';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import { openCreateGatePassDialog } from '../../redux/actions/alertDialogActions';
import InputAdornment from '@material-ui/core/InputAdornment';
import GatePassPDF from '../pages/view/GatePassPDF';
import { pdf } from '@react-pdf/renderer';




export default function CreateGatePassDialog({ items }) {
    const { register, handleSubmit, errors, control } = useForm();
    const [state, setState] = React.useState({});
    const [warehouseName, setWarehouseName] = React.useState();
    const warehouse = useSelector((state) => state.firestore.ordered.warehouse);


    const dispatch = useDispatch();
    const { openCreateGatepass } = useSelector(
        (state) => state.alertState ? state.alertState : false
    );

    const handleClose = () => {
        dispatch(openCreateGatePassDialog(false));
        setWarehouseName('');
    };

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };


    const onSubmit = (data) => {
        // 
        let checkedItems = [];
        console.log("data", data)

        for (let [key, value] of Object.entries(data)) {
            if (state[key]) {
                checkedItems = [...checkedItems, { itemName: key, qty: value }]
            }
        }
        console.log(checkedItems);
        if (checkedItems.length > 0) {
            generatePdfDocument({ warehouseName, items: checkedItems });
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
                fullWidth={true} maxWidth="sm"
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create Gate Pass</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(data => console.log(data))}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <InputLabel id="select-warehouse-label">Select Warehouse</InputLabel>
                                <Select
                                    labelId="select-warehouse-label"
                                    id="select-warehouse"
                                    name="selectWarehouse"
                                    value={warehouseName}
                                    fullWidth
                                    inputRef={register({ required: true })}
                                    required
                                    onChange={(e) => setWarehouseName(e.target.value)}
                                >
                                    {isLoaded(warehouse) &&
                                        warehouse.map((item, index) => <MenuItem key={index} value={item.name}>{item.name}</MenuItem>)}

                                </Select>
                            </Grid>
                            {items.map(item => (
                                <div key={item.id}>
                                    <Grid item xs={6}>
                                        <label>{item.itemName}</label>
                                        <Controller
                                            name={item.itemName}
                                            control={control}
                                            render={(props) => (
                                                <Checkbox
                                                    onChange={(e) => props.onChange(e.target.checked)}
                                                    checked={props.value}
                                                    inputRef={props.ref}
                                                />
                                            )}
                                        />
                                        {/* <FormControlLabel
                                            control={<Checkbox name={item.itemName}
                                                onChange={(event) => handleChange(event)} />}
                                            label={item.itemName}
                                        /> */}
                                    </Grid>

                                    <Grid item xs={6}>
                                        <TextField
                                            label="Quantity from warehouse"
                                            name={item.itemName}
                                            inputRef={register({ required: false, minLength: 1 })}
                                            error={errors.qty && true}
                                            helperText={errors.qty && 'Invalid Input'}
                                            size="small"
                                            fullWidth
                                            variant="outlined"
                                            margin="dense"
                                            defaultValue={item.qty}
                                            required
                                            disabled={!state[item.itemName]}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        Ordered Quantity:
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </Grid>
                                </div>
                            ))}
                        </Grid>
                        <input type="submit" />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button disabled={Object.keys(state).length === 0} onClick={handleSubmit(onSubmit)} color="primary">
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
