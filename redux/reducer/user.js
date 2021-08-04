const initialState = {
  dataUser: [],
  isLoading: false,
  isError: false,
  msg: "",
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case "GET_USER_BY_ID_PENDING":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "GET_USER_BY_ID_FULFILLED":
      return {
        ...state,
        isLoading: false,
        isError: false,
        dataUser: action.payload.data.data,
        msg: action.payload.data.msg,
      };
    case "GET_USER_BY_ID_REJECTED":
      return {
        ...state,
        isLoading: false,
        isError: true,
        dataUser: [],
        msg: action.payload.response.data.msg,
      };
    default:
      return state;
  }
};

export default user;
