import React, { Component } from 'react'
import { SafeAreaView, View, Alert, AsyncStorage } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { Portal, TextInput, Menu, Divider, Dialog, Button, RadioButton, Card } from 'react-native-paper'
import BingImages from '../components/BingImages'

export class Edit extends Component {
  state = {
    car:  {
      make: '',
      model: '',
      bodyType: '',
      year: 2020,
      image: ''
    },
    bodyTypes: [
      "sedan",
      "hatchback",
      "coupe",
      "convertible",
      "wagon",
      "pickup",
      "van/minivan",
      "suv",
    ],
    carHelper: false,
    bodyTypeDialog: null,
    openImageMenu: null,
    openBingImage: null,
  }

  componentDidMount() {
    fetch('https://cft-test.herokuapp.com/api/bodyTypes')
    .then(response => response.json())
    .then(data => {
      if(data.type === 'ok'){
        console.log(data.result)
        this.setState({ bodyTypes: data.result })
      }
    })
    // this.props.navigation.addListener('beforeRemove', (e) => {
    //   console.log((Object.entries(this.state.car).filter((item) => item[1].length === 0)))
    //   if(Object.entries(this.state.car).filter((item) => item[1].length === 0).length > 0){
    //     e.preventDefault();
    //     Alert.alert(
    //       'Warning!',
    //       'You have empty text input.',
    //       [
    //         { text: "Ok", style: 'cancel', onPress: () => {} },
    //       ]
    //     );
    //   }else{
    //     return
    //   }
    // })
  }
  
  onChange = (data) => {
    console.log(data)
  }

  carHelp = value => {
    let tmp = this.state.car
    tmp.make = value
    this.setState({ car: tmp })
    fetch('https://cft-test.herokuapp.com/api/cars?search='+value)
    .then(response => response.json())
    .then(data => {
      if(data.type === 'ok'){
        this.setState({ carHelper: data.result })
      }
    })
  }

  chooseFoundCar = car => {
    let tmp = this.state.car
    tmp.make = car.split(" ")[0].charAt(0).toUpperCase() + car.split(" ")[0].slice(1)
    let tmpCar = car.split(" ")
    const bodyType = tmpCar[tmpCar.length-1]
    tmpCar.splice(0, 1)
    tmpCar.splice(tmpCar.length-1, 1)
    tmp.model = tmpCar.join(" ")
    tmp.bodyType = bodyType
    this.setState({ car: tmp, carHelper: false })
  }

  save = async () => {
    const cars = JSON.parse(await AsyncStorage.getItem("cars"))
    cars.push(this.state.car)
    await AsyncStorage.setItem("cars", JSON.stringify(cars))
    this.props.navigation.navigate("Auto list")
  }

  render() {
    const {
      car,
      openImageMenu,
      openBingImage,
      bodyTypes,
      bodyTypeDialog,
      carHelper,
    } = this.state
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
        {
            car && (
              Object.entries(car).map((item, index) => {
                if(item[0] === 'image'){
                  if(item[1]){
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
                      <View style={{ margin: 10 }} key='chooseImage'>
                         <Button
                          disabled={car.make+car.model === ''}
                          icon="camera"
                          mode="contained"
                          onPress={() => {
                            if(car.make+car.model !== ''){
                              this.setState({ openBingImage: true })
                            }
                          }}
                        >Add image</Button>
                      </View>
                    )
                  }
                }else if(item[0] === 'bodyType'){
                  return (
                    <View style={{ margin: 10 }} key='bodyType'>
                      <Button
                        onPress={() => this.setState({ bodyTypeDialog: true })}
                        mode="outlined"
                      >
                        {item[1] ? `Body type: ${item[1]}` : 'Choose body type'}
                      </Button>
                    </View>
                  )
                }else if(item[0] === 'make'){
                  return (
                    <Menu
                      key='make'
                      style={{
                        marginTop: 80
                      }}
                      visible={carHelper}
                      onDismiss={() => {
                        this.setState({
                          carHelper: false
                        })
                      }}
                      anchor={
                        <View style={{ margin: 10 }} key={index}>
                          <TextInput
                            maxLength={50}
                            mode='outlined'
                            label={item[0]}
                            value={String(item[1])}
                            onChangeText={this.carHelp}
                            keyboardType={
                              Number(item[1]) ? 
                              'decimal-pad' :
                              'default'
                            }
                          />
                        </View>
                      }>
                        {
                          carHelper && (
                            carHelper.map((foundCar) => 
                              <Menu.Item onPress={() => 
                                this.chooseFoundCar(foundCar)
                              } title={foundCar} />
                            )
                          )
                        }
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
                  </View>
                 ) 
                }
              })
            )
          }
          <Button
            disabled={
              (Object.entries(this.state.car).filter((item) => item[1].length === 0).length > 0)
            }
            onPress={this.save}
            mode="contained"
            style={{
              width: '80%',
              marginLeft: '10%'      
            }}
          >Save car</Button>
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
        <Portal>
          <Dialog visible={bodyTypeDialog} onDismiss={() => {
            this.setState({ bodyTypeDialog: false })
          }}>
            <Dialog.Title>Alert</Dialog.Title>
            <Dialog.Content>
              {
                bodyTypes && (
                  <RadioButton.Group onValueChange={(bodyType) => {
                    let tmp = car
                    tmp.bodyType = bodyType
                    this.setState({ car: tmp, bodyTypeDialog: false })
                  }}
                  value={car.bodyType}>
                    {bodyTypes.map((item) => 
                      <RadioButton.Item label={item} value={item} />
                    )}
                  </RadioButton.Group>
                )
              }
            </Dialog.Content>
          </Dialog>
        </Portal>
      </SafeAreaView>
    )
  }
}

export default Edit
