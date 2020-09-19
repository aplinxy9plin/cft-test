import React from 'react'
import { List, Divider } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Image } from 'react-native';

export default function CarItem({ make, model, bodyType, year, image, id, onPress }) {
  return (
    <TouchableOpacity onPress={() => {
      onPress(id)
    }}>
      <Divider />
      <List.Item
        title={`${make} ${model} ${year} year`}
        description={`Body: ${bodyType}`}
        left={props => <Image source={{ uri: image }} style={{ width: 50, height: 50 }} />}
      />
    </TouchableOpacity>
  )
}
