import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import InputAdornment from '@material-ui/core/InputAdornment';

import { createItem, editItem } from '../../redux/actions/itemActions';
import { openAddItemDialog } from '../../redux/actions/alertDialogActions';


export default function AddItemDialog({ companyName }) {
    const { register, handleSubmit, errors } = useForm();
    const dispatch = useDispatch();
    const currency = '₹';
    const { open, item } = useSelector(
        (state) => state.alertState
    );


    const handleClose = () => {
        dispatch(openAddItemDialog({ open: false }));
    };

    const onSubmit = (data) => {

        data = {
            createdAt: new Date(),
            editedAt: new Date(),
            itemName: data.itemName,
            displayName: data.displayName,
            sellingPrice: data.sellingPrice,
            stock: { [companyName]: data[companyName] }
        };
        item ? dispatch(editItem(item.id, data)) : dispatch(createItem(data));
        handleClose()
    };


    return (
        <div>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add Item</DialogTitle>
                <DialogContent>

                    <TextField
                        autoFocus
                        label="Item Name"
                        name="itemName"
                        inputRef={register({ required: true, minLength: 2 })}
                        error={errors.itemName && true}
                        helperText={errors.itemName && 'Invalid Input'}
                        size="small"
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        defaultValue={item ? item.itemName : undefined}
                        required

                    />

                    <TextField
                        label="Selling Price"
                        name="sellingPrice"
                        inputRef={register({ required: true, minLength: 2 })}
                        error={errors.sellingPrice && true}
                        helperText={errors.sellingPrice && 'Invalid Input'}
                        size="small"
                        fullWidth
                        required
                        variant="outlined"
                        margin="dense"
                        defaultValue={item ? item.sellingPrice : undefined}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <b>{currency}</b>
                                </InputAdornment>
                            )
                        }}
                    />

                    <TextField
                        label="Display Name"
                        name="displayName"
                        error={errors.displayName && true}
                        inputRef={register({ required: false, minLength: 2 })}
                        helperText={errors.displayName && 'Invalid Input'}
                        size="small"
                        fullWidth
                        variant="outlined"
                        defaultValue={item ? item.displayName : undefined}
                        margin="dense"
                    />
                    <TextField
                        label="Stock In Shop"
                        name={companyName}
                        error={errors.stockInShop && true}
                        inputRef={register({ required: false, minLength: 1 })}
                        helperText={errors.stockInShop && 'Invalid Input'}
                        size="small"
                        defaultValue={item && item.stock ? item.stock[companyName] : 0}
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
