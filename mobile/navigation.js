import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import * as carsAction from './actions/carsAction';
import { connect } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import NavBar from './components/NavBar'

// screens
import Home from './screens/Home';
import Car from './screens/Car';
import Edit from './screens/Edit';
import NewCar from './screens/NewCar';
import { AsyncStorage } from 'react-native';


const { Navigator, Screen } = createStackNavigator();

class AppNavigator extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const { state, actions } = this.props;
    return (
      <NavigationContainer>
        <Navigator initialRouteName="Auto list">
          {/* Auto List screen */}
          <Screen
            name='Auto list'
            component={Home}
            initialParams={{
              cars: state.cars,
              ...actions
            }}
          />
          <Screen
            name='Current car'
            component={Car}
            initialParams={{
              cars: state.cars,
              ...actions
            }}
          />
          <Screen
            name='Edit'
            component={Edit}
            initialParams={{
              cars: state.cars,
              ...actions
            }}
          />
          <Screen
            name='New Car'
            component={NewCar}
            initialParams={{
              cars: state.cars,
              ...actions
            }}
          />
        </Navigator>
      </NavigationContainer>
    );
  }
}

export default connect(state => ({
    state: state.cars
  }),
  (dispatch) => ({
    actions: bindActionCreators(carsAction, dispatch)
  })
)(AppNavigator);
