import { getApiUrl } from "../utils/envUtils";

export const loginUser = async (email, password) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  };

  const result = await fetch(`${getApiUrl()}/auth/login`, options);
  const response = await result.json();
  //added herr
//   console.log(response)
// const token = response.data.token;
// const name = response.data.name;
// const dateJoined = response.data.dateJoined;
// const serverEmail = response.data.email;

// console.log(serverEmail + ' ' + name + ' ' + dateJoined);

// dispatch(setToken(token));
// dispatch(setLoggedIn(true));
// dispatch(setUser({ email: serverEmail, name, dateJoined }));
  return response;
};
