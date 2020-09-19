import React, { Component } from 'react'
import { Image, SafeAreaView, View, Alert, AsyncStorage } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { Card, TextInput, Menu, Divider, HelperText } from 'react-native-paper'
import BingImages from '../components/BingImages'

export class Edit extends Component {
  state = {
    car: null,
    openImageMenu: null,
    openBingImage: null,
  }

  componentDidMount() {
    this.setState({ car: this.props.route.params.currentCar })
    this.props.navigation.addListener('beforeRemove', async (e) => {
      console.log((Object.entries(this.state.car).filter((item) => item[1].length === 0)))
      if(Object.entries(this.state.car).filter((item) => item[1].length === 0).length > 0){
        e.preventDefault();
        Alert.alert(
          'Warning!',
          'You have empty text input.',
          [
            { text: "Ok", style: 'cancel', onPress: () => {} },
          ]
        );
      }else{
        const cars = JSON.parse(await AsyncStorage.getItem("cars"))
        const index = cars.map((item) =>
          item.id
        ).indexOf(this.state.car.id)
        cars[index] = this.state.car
        await AsyncStorage.setItem("cars", JSON.stringify(cars))
        return
      }
    })
  }

  render() {
    const {
      car,
      openImageMenu,
      openBingImage,
    } = this.state
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          {
            car && (
              Object.entries(car).map((item, index) => {
                if(item[0] === 'id'){
                  return null
                }else if(item[0] === 'image'){
                  return (
                    <Menu
                      key='image'
                      visible={openImageMenu}
                      onDismiss={() => {
                        this.setState({ openImageMenu: false })
                      }}
                      anchor={
                        <TouchableOpacity onPress={() => {
                          this.setState({ openImageMenu: true })
                        }}>
                          <Card.Cover source={{uri: item[1]}} style={{ margin: 10 }}/>
                        </TouchableOpacity>
                      }>
                      <Menu.Item onPress={() => {
                        this.setState({ openBingImage: true, openImageMenu: false })
                      }} title="Choose image from Bing" />
                      <Divider />
                      <Menu.Item onPress={() => {}} title="Choose image from gallery" />
                    </Menu>
                  )
                }else{
                 return (
                  <View style={{ margin: 10 }} key={index}>
                    <TextInput
                      maxLength={30}
                      mode='outlined'
                      label={item[0]}
                      value={String(item[1])}
                      onChangeText={(value) => {
                        let tmp = car
                        tmp[item[0]] = value
                        this.setState({
                          car: tmp
                        })
                      }}
                      keyboardType={
                        Number(item[1]) ? 
                        'decimal-pad' :
                        'default'
                      }
                    />
                    {
                      item[1].length === 0 && (
                        <HelperText type="error" visible={item[1].length === 0}>
                          {item[0]} can't be empty.
                        </HelperText>
                      )
                    }
                  </View>
                 ) 
                }
              })
            )
          }
        </ScrollView>
        {
          openBingImage && (
            <BingImages 
              visible={openBingImage}
              hideModal={() => this.setState({ openBingImage: false })}
              onChoose={(url) => {
                let tmp = car
                tmp.image = url
                this.setState({ car: tmp, openBingImage: false })
              }}
              search={car.make+" "+car.model+" "+car.bodyType+" "+car.year}
            />
          )
        }
      </SafeAreaView>
    )
  }
}

export default Edit
