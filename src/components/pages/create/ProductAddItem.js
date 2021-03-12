import React, { useState, memo, useEffect } from 'react';
//Vendor
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { InstantSearch } from 'react-instantsearch-dom';
import Grid from '@material-ui/core/Grid';
import { useForm } from 'react-hook-form';
import nanoid from 'nanoid';
// Custom
import { Button } from '../../styledComponents/shared/Button';
import searchClient from '../../../others/algoliaSearchClient'
import CustomAutocomplete from './AutocompleteField';
import { useSelector } from 'react-redux';



//Component
function ProductAddItem(props) {
  const { register, handleSubmit, errors } = useForm();
  const [form, setForm] = useState({ itemName: '', rate: '', qty: 1 });
  const item = useSelector(
    (state) => state.invoiceItem
  );
  console.log(item);
  const updateFrom = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value, rate: item.sellingPrice });
  };

  useEffect(() => {
    setForm({
      ...form,
      rate: item.sellingPrice,
      itemName: item.itemName,
      displayName: item.displayName,
      id: item.id
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]
  )

  const currency = props.currency === 'usd' ? '$' : '₹';

  const onSubmit = (data) => {
    data = { id: nanoid(4), ...data };
    props.handleAdd({ ...data, itemName: item.displayName });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4} lg={4}>
        <InstantSearch indexName="ITEM_LIST" searchClient={searchClient()}>
          <CustomAutocomplete />
        </InstantSearch>
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
