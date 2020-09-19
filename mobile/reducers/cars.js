import * as types from '../actions/actionTypes';
import { AsyncStorage } from 'react-native';

const initialState = {
  cars: [
    {
      id: 0,
      make: 'Acura',
      model: 'ILX',
      bodyType: 'sedan',
      year: 2020,
      image: 'https://assets.newcars.com/images/car-pictures/original/2020-Acura-ILX-Sedan-Base-4dr-Sedan-Exterior-2.png'
    },
    {
      id: 1,
      make: 'Kia',
      model: 'nira',
      bodyType: 'wagon',
      year: 2020,
      image: 'https://www.leithcars.com/blogs/1421/wp-content/uploads/2019/04/2020-KIA-STINGER-GT-WAGON-CONCEPT-LEITHCARS.COM-Zero-to-60.png'
    },
    {
      id: 2,
      make: 'Tesla',
      model: 'model Y',
      bodyType: 'SUV',
      year: 2020,
      image: 'https://i.ytimg.com/vi/XdMGV4M2Lfg/maxresdefault.jpg'
    },
  ],
};

const func = async () => {
  // const data = await AsyncStorage.getItem("cars")
  // console.log(data)
  // if(!data){
  //   await AsyncStorage.setItem("cars", JSON.stringify(initialState.cars))
  // }else{
  //   state = {
  //     cars: JSON.parse(data)
  //   }
  // }
  return data
}

export default function cars(state = initialState, action = {}) {
  console.log(action.type)
  switch (action.type) {
    case types.NEW_CAR:
      action.payload.id = state.cars[state.cars.length-1].id+1
      state.cars.push(action.payload)
       AsyncStorage.setItem("cars", JSON.stringify(state.cars))
      return {
        ...state,
        cars: state.cars
      };
    case types.REMOVE_CAR:
      state.cars.splice(state.cars.map((item) => 
        item.id
      ).indexOf(action.payload), 1)
       AsyncStorage.setItem("cars", JSON.stringify(state.cars))
      return {
        ...state,
        cars: state.cars
      };
    case types.EDIT_CAR:
      console.log('action', action.payload)
      const index = state.cars.map((item) =>
        item.id
      ).indexOf(action.payload.id)
      state.cars[index] = action.payload
       AsyncStorage.setItem("cars", JSON.stringify(state.cars))
      return {
        ...state,
        cars: state.cars
      };
    case types.FROM_ASYNCSTORAGE:
      return {
        ...state,
        cars: action.payload
      };
    default:
      return state;
  }
}
