import styled from 'styled-components';

const ItemTable = styled.div`
  overflow: hidden;
  box-shadow: 4px 4px 16px 4px #3a3a3a0c;
  border-radius: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  max-width: 1450px;
  margin: 3rem 1rem 1rem;
  a {
    text-decoration: none;
    display: block;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    color: #3a3a3a;
    &:last-child {
      border-bottom: none;
    }
  }
`;
const TableHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  .invoice-heading {
    display: inline-block;
  }
  .add-item-link {
    padding: 0.5rem 2rem;
    font-size: 1.1rem;
    margin: 0 auto;
    display: block;
    @media screen and (max-width: 600px) {
      width: 100%;
      max-width: 100%;
    }
  }
  .heading-cta {
    display: inline-block;
    margin-left: auto;
    a {
      color: '#6772e5';
    }
  }
`;
const ItemList = styled.div`
  display: grid;
  grid-template-areas: 'number name name name displayName displayName rate option';
  grid-template-columns: repeat(7, 1fr) 0.4fr;
  width: 100%;
  gap: 1rem;
  padding: 0.5rem 1rem;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.02);
  }
  @media screen and (max-width: 768px) {
    font-size: 0.9rem;
    grid-template-areas:
      'name name name rate option'
      'displayName displayName displayName option';
    grid-template-columns: repeat(3, 1fr) 1.5fr 0.3fr;
    gap: 0.5rem;
  }
  .number {
    grid-area: number;
    @media screen and (max-width: 768px) {
      display: none;
    }
  }
  
  .name {
    grid-area: name;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .displayName {
    grid-area: displayName;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .rate {
    grid-area: rate;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .option {
    grid-area: option;
    color: #000;
  }
`;
const ItemListHead = styled(ItemList)`
  background-color: #f6f9fc;
  &:hover {
    cursor: default;
    background-color: #f6f9fc;
  }
`;
export { ItemTable, ItemList, ItemListHead, TableHeading };
