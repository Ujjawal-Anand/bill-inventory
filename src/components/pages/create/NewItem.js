import React from 'react';
//Vendor
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Button } from '../../styledComponents/shared/Button';
import Grid from '@material-ui/core/Grid';
// import { isLoaded } from 'react-redux-firebase';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import nanoid from 'nanoid';


// Custom
import Header from '../../header/Header';
import { ItemContainer } from '../../styledComponents/newItem/NewItemContainer.js';
import { createItem } from '../../../redux/actions/itemActions';
// import CreatePageLoader from '../../loaders/create/CreatePageLoader';

// Component
function NewItem(props) {
    const { register, handleSubmit, errors } = useForm();
    const dispatch = useDispatch();
    const currency = '₹';


    const onSubmit = (data) => {
        data = {
            itemId: nanoid(6),
            createdAt: new Date(),
            editedAt: new Date(),
            ...data
        };
        dispatch(createItem(data));
        console.log(data)
    };

    return (
        <div>
            <Header title={'Add New Item'} />
            <ItemContainer>
                <h3>New Item</h3>
                <Grid
                    container
                    justify="center"
                    alignItems="center"
                    className="item-details"
                    spacing={2}
                >
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <div className="textfield-container">
                            <p className="item-title">Item Details</p>
                            <TextField
                                label="Item Name"
                                name="itemName"
                                inputRef={register({ required: true, minLength: 2 })}
                                error={errors.itemName && true}
                                helperText={errors.itemName && 'Invalid Input'}
                                size="small"
                                fullWidth
                                variant="outlined"
                                margin="dense"
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
                                margin="dense"
                            />


                        </div>
                    </Grid>

                    <Button

                        secondary
                        className="submit-btn"
                        name="submitBtn"
                        onClick={handleSubmit(onSubmit)}
                    >
                        ADD {<i className="tio-sync spin-load"></i>}
                    </Button>

                </Grid>
            </ItemContainer>
        </div>
    );
}

export default NewItem;
