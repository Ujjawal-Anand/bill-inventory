import React, { useState, memo } from 'react';
//Vendor
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import { useForm } from 'react-hook-form';
// Custom
import { Button } from '../../styledComponents/shared/Button';
import { useSelector } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Typography from '@material-ui/core/Typography';



//Component
function ProductAddItem(props) {
  const { register, handleSubmit, errors } = useForm();
  const [form, setForm] = useState({ itemName: '', rate: '', qty: 1 });
  const items = useSelector((state) => state.item.items)

  const updateFrom = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const currency = props.currency === 'usd' ? '$' : '₹';

  const onSubmit = (data) => {
    console.log(data)
    // here update the rate
    props.handleAdd({ ...form, ...data });
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
          onChange={(event, value) => setForm({
            ...form,
            itemName: value.displayName ? value.displayName : value.itemName,
            rate: value.sellingPrice,
            id: value.id
          })}
        />
        {/* <TextField
          size="small"
          fullWidth
          label="Item Name"
          name="itemName"
          variant="outlined"
          margin="dense"
          onChange={updateFrom}
          value={form.inputName}
          inputRef={register({ required: true, minLength: 2 })}
          error={errors.itemName && true}
          helperText={errors.itemName && 'Invalid Input'}
        /> */}
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
      {/* <Grid item xs={4} md={1} lg={1}>
        <TextField
          size="small"
          type="number"
          variant="outlined"
          margin="dense"
          label="Disc"
          name="disc"
          value={form.disc}
          onChange={updateFrom}
          inputRef={register({ required: true, min: 0, max: 100 })}
          fullWidth
          error={errors.disc && true}
          helperText={errors.disc && 'Invalid'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <b>%</b>
              </InputAdornment>
            )
          }}
        />
      </Grid> */}
      <Grid item xs={4} md={1} lg={1}>
        <TextField
          size="small"
          type="number"
          label="Qty"
          name="qty"
          onChange={updateFrom}
          value={form.qty}
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
