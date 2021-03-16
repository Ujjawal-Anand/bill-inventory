const initState = {
  alert: false,
  open: false,
  openCreateGatepass: false,
  openUpdateStock: false,
  item: {}
};

const alertReducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOGOUT_CNF':
      return {
        alert: true,
        alertTitle: 'Logout',
        alertText: 'Do you want to logout?',
        yesBtn: 'Logout',
        noBtn: 'Cancel',
        alertFn: action.payload
      };

    case 'DELETE_CNF':
      return {
        alert: true,
        alertTitle: 'Delete Invoice',
        alertText: 'Do you want to delete this invoice?',
        yesBtn: 'Delete Invoice',
        noBtn: 'Cancel',
        alertFn: action.payload
      };

    case 'ADD_ITEM_CNF':
      return {
        open: action.payload.open,
        item: action.payload.item
      };

    case 'UPDATE_STOCK_DIALOG':
      return {
        openUpdateStock: action.payload.openUpdateStock,
        item: action.payload.item
      }
    case 'PAYCHANGE_CNF':
      return {
        alert: true,
        alertTitle: 'Change Payment Status',
        alertText: 'Do you want to change payment status?',
        yesBtn: 'Change Status',
        noBtn: 'Cancel',
        alertFn: action.payload
      };
    case 'SETTINGSAVE_CNF':
      return {
        alert: true,
        alertTitle: 'Save Settings',
        alertText: 'Do you want to save this settings?',
        yesBtn: 'Save',
        noBtn: 'Cancel',
        alertFn: action.payload
      };
    case 'SENDEMAIL_CNF':
      return {
        alert: true,
        alertTitle: 'Send Reminder',
        alertText: 'Do you want to send Email reminder to this Customer?',
        yesBtn: 'Send Reminder',
        noBtn: 'Cancel',
        alertFn: action.payload
      };
    case 'CREATE_GATE_PASS':
      return {
        openCreateGatepass: action.payload
      };
    case 'CLOSE_DIALOG':
      return {
        alert: false
      };

    default:
      return state;
  }
};
export default alertReducer;
