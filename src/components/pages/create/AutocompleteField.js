import React from "react"
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { connectAutoComplete } from "react-instantsearch-dom";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useDispatch } from 'react-redux';

import {
    addItemInvoiceItem
} from '../../../redux/actions/itemInvoiceActions';



const AutocompleteField = ({ hits = [], refine }) => {
    const dispatch = useDispatch();

    return (
        <Autocomplete
            id="free-solo-demo"
            freeSolo
            options={hits}
            // onClose={(event, reason) => console.log(event, reason)}
            getOptionSelected={(option, value) => console.log(option, value)}
            getOptionLabel={(option) => option.itemName}
            onChange={(event, value) => dispatch(addItemInvoiceItem(value))}
            renderInput={(params) => (
                <TextField {...params} name="itemName" variant="outlined"
                    margin="dense" label="Item Name" />
            )}
            renderOption={(option) => {
                return (
                    <Grid container alignItems="center">

                        <Grid item xs>
                            {option.itemName}

                            <Typography variant="body2" color="textSecondary">
                                {option.displayName} Rate: ₹{option.sellingPrice}
                            </Typography>
                        </Grid>
                    </Grid>
                );
            }}

        />
    )
}
const CustomAutocomplete = connectAutoComplete(AutocompleteField);

export default CustomAutocomplete;