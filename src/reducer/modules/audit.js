import {
  FETCH_AUDIT_ICONS,
  UPDATE_AUDIT_ICONS,
  SELECT_AUDIT_ICON,
  PASSED_AUDIT_ICON,
} from '../../constants/actionTypes';

const initialState = {
  icons: [],
  selcIndex: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_AUDIT_ICONS: {
      return {
        ...state,
        icons: action.payload.data,
      };
    }
    case UPDATE_AUDIT_ICONS: {
      return {
        ...state,
        icons: action.payload,
      };
    }
    case SELECT_AUDIT_ICON: {
      return {
        ...state,
        selcIndex: action.payload,
      };
    }
    case PASSED_AUDIT_ICON: {
      return {
        ...state,
        icons: action.payload,
      };
    }
    default:
      return state;
  }
};
