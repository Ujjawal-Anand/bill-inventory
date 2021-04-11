import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Autocomplete from '@material-ui/lab/Autocomplete';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import styles from './LineItem.module.scss'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const LineItem = (props) => {

  const items = useSelector((state) => state.firestore.ordered.items);
  console.log(items)


  const { index, name, quantity, rate, item = { itemName: '', displayName: '', sellingPrice: 0, id: 'initial' } } = props
  const [itemName, setItemName] = useState(name)

  const currency = '₹';
  console.log("Name", name)


  return (
    <div className={styles.lineItem}>
      <div>{index + 1}</div>
      <Autocomplete
        id="free-solo-demo"
        value={item}
        inputValue={itemName}
        onInputChange={(event, newInputValue) => {
          setItemName(newInputValue)
        }}
        freeSolo
        options={items}
        getOptionLabel={(option) => option.itemName}
        renderInput={(params) => (
          <TextField {...params} name="name"
            variant="outlined"
            size="small"
            fullWidth
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
          if (value) {
            props.nameChangeHandler(index, value);
          }
        }}
      />

      <TextField
        className={styles.currency}
        size="small"
        type="number"
        variant="outlined"
        margin="dense"
        name="rate"
        onChange={props.changeHandler(index)}
        value={rate}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <b>{currency}</b>
            </InputAdornment>
          )
        }}
      />
      <TextField
        className={styles.currency}
        size="small"
        type="number"
        // name="qty"
        // value={form.qty}
        // onChange={updateFrom}
        // inputRef={register({ required: true, min: 0, max: 999 })}
        variant="outlined"
        margin="dense"
        fullWidth
        value={quantity}
        name="quantity"
        onChange={props.changeHandler(index)}
      // error={errors.qty && true}
      // helperText={errors.qty && 'Invalid'}
      />


      {/* <div><input name="name" type="text" value={name} onChange={props.changeHandler(index)} /></div> */}
      {/* <div className={styles.currency}><input name="rate" type="number" step="0.01"
       min="0.00" max="9999999.99" value={rate} onChange={props.changeHandler(index)}
        onFocus={props.focusHandler} /></div> */}
      {/* <div><input name="quantity" type="number" step="1" value={quantity} onChange={props.changeHandler(index)} onFocus={props.focusHandler} /></div> */}
      <div className={styles.currency}>{props.currencyFormatter(quantity * rate)}</div>
      <div>
        <button type="button"
          className={styles.deleteItem}
          onClick={props.deleteHandler(index)}
        ><DeleteForeverIcon size="1.25em" /></button>
      </div>
    </div>
  )

}

export default LineItem

LineItem.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string,
  description: PropTypes.string,
  quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}


