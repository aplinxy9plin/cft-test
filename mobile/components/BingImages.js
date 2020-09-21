import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import { Button, Card, Modal, ProgressBar, Title } from 'react-native-paper'
import { Col, Row, Grid } from "react-native-easy-grid";
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class BingImages extends Component {
  state = {
    state: null,
    loading: true
  }
  componentDidMount() {
    this.load()
  }
  
  load = () => {
    const { search } = this.props
    if(search){
      console.log(search)
      fetch("https://bing-image-search1.p.rapidapi.com/images/search?safeSearch=Strict&count=9&q="+search, {
      	"method": "GET",
      	"headers": {
      		"x-rapidapi-host": "bing-image-search1.p.rapidapi.com",
      		"x-rapidapi-key": "{rapidApiKey}"
      	}
      })
      .then(response => response.json())
      .then(data => {
        if(data.value){
          this.setState({
            loading: false,
            search,
            state: data.value.reduce((memo, value, index) => {
              if (index % 3 === 0 && index !== 0) memo.push([])
              memo[memo.length - 1].push(value)
              return memo
            }, [[]])
          })
        }
      })
      .catch(err => {
      	console.log(err);
      });
    }
  }

  render(){
    const { visible, hideModal, onChoose } = this.props
    const { loading, state } = this.state
    return (
      <Modal visible={visible} onDismiss={hideModal}>
        <View style={{
          backgroundColor: 'white',
          width: '80%',
          height: '80%',
          padding: 20,
          marginLeft: '10%',
          // flex: 1,
          // alignItems: 'center'
          // marginRight: 30
        }}>
          {
            loading ? (
              <View>
                <Text>Loading images...</Text>
                <ProgressBar indeterminate />
              </View>
            ) : (
              <Title>Choose image</Title>
            )
          }
          <Grid>
            {
              state && (
                state.map((item, i) => 
                  <Row key={i}>
                    {
                      item.map((car, index) => 
                        <Col key={index}>
                          <TouchableOpacity onPress={() => onChoose(car.contentUrl)}>
                            <Image style={{
                              height: 100
                            }} resizeMode="contain" source={{ uri: car.contentUrl }}/>
                          </TouchableOpacity>
                        </Col> 
                      )
                    }
                  </Row>
                )   
              )
            }
          </Grid>
          <Button mode="outlined" onPress={hideModal}>Close modal</Button>
        </View>
      </Modal>
    )
  }
}
