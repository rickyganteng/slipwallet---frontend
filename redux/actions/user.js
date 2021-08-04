import axiosApiIntances from "utils/axios";

export const user = (id) => {
  return {
    type: "GET_USER_BY_ID",
    payload: axiosApiIntances.get(`/user/${id}`),
  };
};
