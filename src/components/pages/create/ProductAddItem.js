import React, { useState, memo } from 'react';
//Vendor
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import { useForm } from 'react-hook-form';
// Custom
import { Button } from '../../styledComponents/shared/Button';
import { useSelector, useDispatch } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Typography from '@material-ui/core/Typography';
import { editItem } from '../../../redux/actions/itemActions';



//Component
function ProductAddItem(props) {
  const dispatch = useDispatch();
  const { register, handleSubmit, errors } = useForm();
  const [form, setForm] = useState({ itemName: '', rate: '', qty: 1 });
  const items = useSelector((state) => state.firestore.ordered.items);
  const [rate, setRate] = useState(0);

  const updateFrom = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const currency = props.currency === 'usd' ? '$' : '₹';

  const onSubmit = (data) => {
    console.log(data)
    console.log(form)
    // update rate
    if (data.rate && rate !== 0 &&
      parseFloat(data.rate) !== 0 &&
      parseFloat(rate) !== parseFloat(data.rate)) {
      // change rate
      dispatch(editItem(form.id, { sellingPrice: data.rate }))
    }
    props.handleadd({ ...form, orderedQty: 0, ...data });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4} lg={4}>

        <Autocomplete
          {...props}
          id="free-solo-demo"
          freeSolo
          options={items}
          getOptionLabel={(option) => option.itemName}
          renderInput={(params) => (
            <TextField {...params} name="name" variant="outlined"
              inputRef={register({ required: true, min: 0 })}
              error={errors.name && true}
              helperText={errors.name && 'Item Name is required'}

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
          onChange={(event, value) => {
            value && setRate(value.sellingPrice);
            value && setForm({
              ...form,
              itemName: value.displayName ? value.displayName : value.itemName,
              rate: value.sellingPrice,
              id: value.id
            })
          }}
        />
      </Grid>
      <Grid item xs={8} md={2} lg={2}>
        <TextField
          size="small"
          type="number"
          variant="outlined"
          margin="dense"
          label="Rate"
          name="rate"
          onChange={updateFrom}
          value={form.rate}
          inputRef={register({ required: true, min: 0 })}
          fullWidth
          error={errors.rate && true}
          helperText={errors.rate && 'Invalid Input'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <b>{currency}</b>
              </InputAdornment>
            )
          }}
        />
      </Grid>

      <Grid item xs={4} md={2} lg={2}>
        <TextField
          size="small"
          type="number"
          label="Qty"
          name="qty"
          value={form.qty}
          onChange={updateFrom}
          inputRef={register({ required: true, min: 0, max: 999 })}
          variant="outlined"
          margin="dense"
          fullWidth
          error={errors.qty && true}
          helperText={errors.qty && 'Invalid'}
        />
      </Grid>
      <Grid item xs={8} md={2} lg={2}>
        <TextField
          size="small"
          type="number"
          variant="outlined"
          margin="dense"
          label="Amount"
          name="amount"
          onChange={updateFrom}
          value={(form.rate * form.qty).toFixed(2)}
          inputRef={register({ required: true, min: 0 })}
          error={errors.amount && true}
          helperText={errors.amount && 'Something Wrong'}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <b>{currency}</b>
              </InputAdornment>
            )
          }}
        />
      </Grid>
      <Grid item xs={12} md={2} lg={2}>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          style={{ height: '100%' }}
        >
          <Button secondary onClick={handleSubmit(onSubmit)}>
            ADD
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default memo(ProductAddItem);
