import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';

import { createWarehouse } from '../../redux/actions/warehouseActions';
import { openAddItemDialog } from '../../redux/actions/alertDialogActions';


export default function AddWarehouseDialog() {
    const { register, handleSubmit, errors } = useForm();
    const dispatch = useDispatch();
    const { open } = useSelector(
        (state) => state.alertState ? state.alertState : false
    );


    const handleClose = () => {
        dispatch(openAddItemDialog({ open: false }));
    };

    const onSubmit = (data) => {

        data = {
            createdAt: new Date(),
            editedAt: new Date(),
            ...data
        };
        dispatch(createWarehouse(data));
        handleClose()
    };


    return (
        <div>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add Warehouse</DialogTitle>
                <DialogContent>

                    <TextField
                        autoFocus
                        label="Warehouse Name"
                        name="name"
                        inputRef={register({ required: true, minLength: 1 })}
                        error={errors.name && true}
                        helperText={errors.name && 'Invalid Input'}
                        size="small"
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        required

                    />

                    <TextField
                        label="Address"
                        name="address"
                        inputRef={register({ required: true, minLength: 5 })}
                        error={errors.address && true}
                        helperText={errors.address && 'Invalid Input'}
                        size="small"
                        fullWidth
                        required
                        variant="outlined"
                        margin="dense"
                    />

                    <TextField
                        label="Mobile"
                        name="mobile"
                        error={errors.mobile && true}
                        inputRef={register({ required: false, minLength: 10 })}
                        helperText={errors.mobile && 'Invalid Mobile Number'}
                        size="small"
                        fullWidth
                        variant="outlined"
                        margin="dense"
                    />
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
    );
}
