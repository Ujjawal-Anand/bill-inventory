export const confirmLogoutAction = (dispatch) => ({
  type: 'LOGOUT_CNF',
  payload: dispatch
});
export const confirmDeleteAction = (dispatch) => ({
  type: 'DELETE_CNF',
  payload: dispatch
});
export const confirmPaymentChangeAction = (dispatch) => ({
  type: 'PAYCHANGE_CNF',
  payload: dispatch
});
export const confirmSettingSaveAction = (dispatch) => ({
  type: 'SETTINGSAVE_CNF',
  payload: dispatch
});
export const confirmEmailReminder = (dispatch) => ({
  type: 'SENDEMAIL_CNF',
  payload: dispatch
});
export const closeDialog = (dispatch) => ({
  type: 'CLOSE_DIALOG',
  payload: dispatch
});
export const openAddItemDialog = (dispatch) => ({
  type: 'ADD_ITEM_CNF',
  payload: dispatch
});

export const openUpdateStockDialog = (dispatch) => ({
  type: 'UPDATE_STOCK_DIALOG',
  payload: dispatch
})

export const openCreateGatePassDialog = (dispatch) => ({
  type: 'CREATE_GATE_PASS',
  payload: dispatch
});
