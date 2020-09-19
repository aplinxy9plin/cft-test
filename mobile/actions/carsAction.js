import * as types from './actionTypes';

export const newCar = (payload) => {
  return {
    type: types.NEW_CAR,
    payload
  };
}

export const removeCar = (payload) => {
  return {
    type: types.REMOVE_CAR,
    payload
  };
}

export const editCar = (payload) => {
  return {
    type: types.EDIT_CAR,
    payload
  };
}

export const fromAsyncStorage = (payload) => {
  return {
    type: types.FROM_ASYNCSTORAGE,
    payload
  };
}

export const getCar = (payload) => {
  return {
    type: types.GET_CAR,
  };
}
