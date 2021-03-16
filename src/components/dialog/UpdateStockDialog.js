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
        dispatch(editItem(item.id, { stock: data }));
        handleClose()
    };

    return item ? (
        <div>

            <Dialog open={openUpdateStock} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Update Stock</DialogTitle>
                <DialogContent>
                    {warehouse.map((warehpouseItem, index) => (
                        <TextField
                            key={index}
                            label={warehpouseItem.name}
                            name={warehpouseItem.name}
                            inputRef={register({ required: false, minLength: 1 })}
                            error={errors.itemName && true}
                            helperText={errors.itemName && 'Invalid Input'}
                            size="small"
                            fullWidth
                            defaultValue={item.stock && item.stock[warehpouseItem.name]}
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
