import React from 'react';
//Vendor
import styled from 'styled-components';
// Custom
import noitem from '../../../images/noItem.svg';
import { useDispatch } from 'react-redux';
import AddItemDialog from '../../dialog/AddItemDialog'
import {
  openAddItemDialog
} from '../../../redux/actions/alertDialogActions';



// Styled
const Loader = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20vh;
  div {
    width: 100%;
    max-width: 500px;
    text-align: center;
    padding: 2rem;
    img {
        width: 100%;
        display: block;
        margin: 2rem auto;
      }
  }
`;

// Component
const NoItem = ({ companyName }) => {
  const dispatch = useDispatch();

  return (
    <Loader>
      <div>

        <img src={noitem} alt="No item found, add some!"
          onClick={() => dispatch(openAddItemDialog({ open: true }))} />

      </div>
      {companyName && <AddItemDialog companyName={companyName} />}

    </Loader>
  );
}

export default NoItem;
