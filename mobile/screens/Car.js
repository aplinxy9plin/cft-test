import React, { Component } from 'react'
import { SafeAreaView, View, Text, AsyncStorage } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Card, Title, Subheading, Button } from 'react-native-paper'

export class Car extends Component {
  state = {
    car: null
  }

  componentDidMount() {
    this.load()
    this.props.navigation.addListener('focus', this.load)
  }
  
  load = async () => {
    const cars = JSON.parse(await AsyncStorage.getItem("cars"))
    this.setState({
      car: cars.filter((item) => 
        item.id === this.props.route.params.id
      )[0]
    })
  }

  remove = async () => {
    const cars = JSON.parse(await AsyncStorage.getItem("cars"))
    cars.splice(cars.map((item) => 
      item.id
    ).indexOf(this.props.route.params.id), 1)
    await AsyncStorage.setItem("cars", JSON.stringify(cars))
    this.props.navigation.navigate("Auto list")
  }

  render() {
    const {
      car,
    } = this.state
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          {
            car && (
              <View>
                <Card.Cover source={{ uri: car.image }} />
                <View style={{
                  margin: 30,
                }}>
                  <Title>{car.make + " " + car.model}</Title>
                  <Subheading>Year: {car.year}</Subheading>
                  <Subheading>Body type: {car.bodyType}</Subheading>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Button
                    style={{ width: '80%', margin: 30 }}
                    mode="contained"
                    onPress={() => {
                      this.props.navigation.navigate("Edit", {
                        currentCar: this.state.car
                      })
                    }}
                  >Edit</Button>
                  <Button
                    style={{ width: '80%', margin: 30, marginTop: 0 }}
                    mode="outlined"
                    onPress={this.remove}
                  >Remove</Button>
                </View>
              </View>
            )
          }      
        </ScrollView>
      </SafeAreaView>
    )
  }
}

export default Car
