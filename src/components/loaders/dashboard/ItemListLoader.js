import React from 'react';
// Vendor
import styled from 'styled-components';
// Custom
import { ItemList } from '../../styledComponents/items/itemTables';

// Overwriting Styled Component for Loader
const Loader = styled(ItemList)`
  p {
    padding: 0.8rem;
    background: #f6f7f8;
    background-image: -webkit-gradient(
      linear,
      left center,
      right center,
      from(#f6f7f8),
      color-stop(0.2, #edeef1),
      color-stop(0.4, #f6f7f8),
      to(#f6f7f8)
    );
    background-image: -webkit-linear-gradient(
      left,
      #f6f7f8 0%,
      #edeef1 20%,
      #f6f7f8 40%,
      #f6f7f8 100%
    );
    background-size: 300%;
    border-radius: 5px;
    animation: placeHolderShimmer 10s linear infinite forwards;
    @keyframes placeHolderShimmer {
      0% {
        background-position: -490px 0;
      }
      100% {
        background-position: 490px 0;
      }
    }
  }
  padding: 1rem;
`;

// Component
function ItemListLoader() {
    return (
        <Loader>
            <p className="number"></p>           
            <p className="name"></p>
            <p className="displayName"></p>
            <p className="rate"></p>
            <p className="option"></p>
        </Loader>
    );
}

export default ItemListLoader;
