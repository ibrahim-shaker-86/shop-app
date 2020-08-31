import { AsyncStorage } from "react-native";

export const AUTHENTICATE = "AUTHENTICATE";

export const authenticate = (token, userId) => {
  return { type: AUTHENTICATE, token, userId };
};

export const signup = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDzVMdMpN-gs-fiMdNTcYb4JWrFNdVILZY",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      let message = "Something went wrong!";
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      if (errorId === "EMAIL_EXISTS") {
        message = "This email is exist already!";
      }
      throw new Error(message);
    }

    const resData = await response.json();

    dispatch(authenticate(resData.idToken, resData.localId));
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    ).toISOString();
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDzVMdMpN-gs-fiMdNTcYb4JWrFNdVILZY",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      let message = "Something went wrong!";
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      if (errorId === "EMAIL_NOT_FOUND") {
        message = "Your email is incorrect!";
      } else if (errorId === "INVALID_PASSWORD") {
        message = "Invalid Password";
      }
      throw new Error(message);
    }

    const resData = await response.json();

    dispatch(authenticate(resData.idToken, resData.localId));
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    ).toISOString();
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token,
      userId,
      expirationDate,
    })
  );
};
