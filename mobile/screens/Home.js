import React from 'react';
import { SafeAreaView, View, Text, AsyncStorage } from 'react-native';
import CarItem from '../components/CarItem'
import { ScrollView } from 'react-native-gesture-handler';
import { FAB, Searchbar, TextInput } from 'react-native-paper'
import Icon from 'react-native-vector-icons/AntDesign';

const initialState = [
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
];

class HomeScreen extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      fabOpen: false,
      cars: null
    }
  }

  async componentDidMount() {
    this.load()
    this.props.navigation.addListener('focus', this.load)
  } 

  load = async () => {
    const cars = JSON.parse(await AsyncStorage.getItem("cars"))
    if(!cars){
      await AsyncStorage.setItem("cars", JSON.stringify(initialState))
      cars = initialState
    }
    this.setState({
      cars
    })
  }

  onChangeSearch = searchQuery => {
    const allCars = this.props.route.params.cars
    this.setState({
      cars: allCars.filter((item) => 
        (item.make+item.model+item.bodyType+item.year).toLowerCase()
        .indexOf(searchQuery.toLowerCase()) !== -1
      ),
      searchQuery
    })
  }

  openCar = id => {
    console.log('id', id)
    this.props.navigation.navigate('Current car', { id })
  }

  render(){
    const {
      cars,
      fabOpen,
      searchQuery,
    } = this.state
    return(
      <SafeAreaView style={{ flex: 1 }}>
        <Searchbar
          placeholder="Search"
          onChangeText={this.onChangeSearch}
          value={searchQuery}
          style={{
            shadowColor: "#000",
            shadowOffset: {
            	width: 0,
            	height: 0,
            },
            shadowOpacity: 0,
            shadowRadius: 0,
            borderColor: 'white',
            elevation: 1000,
            borderRadius: 0,
            marginTop: 0
          }}
        />
        <ScrollView>
          {
            cars && (
              cars.map((item) => 
                <CarItem
                  key={item.id}
                  make={item.make}
                  model={item.model}
                  bodyType={item.bodyType}
                  year={item.year}
                  image={item.image}
                  id={item.id}
                  onPress={this.openCar}
                />
              )
            )
          }
        </ScrollView>
        <FAB.Group
          open={fabOpen}
          icon={fabOpen ? 'close' : 'plus'}
          actions={[
            {
              icon: 'camera',
              label: 'Scan auto by camera',
              onPress: () => console.log('Pressed scan camera'),
            },
            {
              icon: 'circle-edit-outline',
              label: 'Add yourself',
              onPress: () => this.props.navigation.navigate("New Car"),
            },
          ]}
          onStateChange={({ open }) => this.setState({ fabOpen: open })}
        />
      </SafeAreaView>
    )
  }
}

export default HomeScreen;