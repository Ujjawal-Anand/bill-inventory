import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { openUpdateStockDialog } from '../../redux/actions/alertDialogActions';
import { editItem } from '../../redux/actions/itemActions';


export default function UpdateStockDialog({ warehouse }) {
    const NOT_LISTED = "NotListed";
    const { openUpdateStock, item } = useSelector(
        (state) => state.alertState
    );
    const defaultValues = item && item.stock;
    const { register, handleSubmit, errors } = useForm({ defaultValues });
    const dispatch = useDispatch();

    console.log(defaultValues);


    const handleClose = () => {
        dispatch(openUpdateStockDialog({ openUpdateStock: false }));
    };

    const onSubmit = (data) => {
        let dataToSubmit = {};
        //filter key's which has value of "Not Listed"
        for (let [key, value] of Object.entries(data)) {
            if (value !== NOT_LISTED) {
                dataToSubmit[key] = parseFloat(value);
            }
        }
        console.log("data To Submit", dataToSubmit);
        dispatch(editItem(item.id, { stock: dataToSubmit }));
        handleClose()
    };

    return item ? (
        <div>

            <Dialog open={openUpdateStock} onClose={handleClose} disableBackdropClick aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Update Stock</DialogTitle>
                <DialogContent>
                    {warehouse.map((warehpouseItem, index) => (
                        <TextField
                            key={index}
                            label={warehpouseItem.name}
                            name={warehpouseItem.name}
                            inputRef={register({
                                required: true,
                                pattern: {
                                    value: /^(\d+|NotListed)$/,
                                    message: "Must be a number"
                                }
                            })}
                            error={errors[warehpouseItem.name] && true}
                            helperText={errors.itemName && 'Invalid Input'}
                            size="small"
                            fullWidth
                            defaultValue={item.stock && item.stock[warehpouseItem.name] ? item.stock[warehpouseItem.name] : NOT_LISTED}
                            variant="outlined"
                            margin="dense"
                            required

                        />
                    ))}



                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit(onSubmit)} color="primary">
                        Add
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    ) : <></>
}
