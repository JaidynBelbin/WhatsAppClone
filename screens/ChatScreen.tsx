import * as React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import { Text, View} from '../components/Themed';
import ChatListItem from '../components/ChatListItem';

import chatRooms from '../data/ChatRooms';

export default function ChatScreen() {
    return (
        <View style={styles.container}>

            {/** A FlatList which uses the data from ChatRooms.ts 
             * The renderItem option is a function which renders each 
             * 
             */}
          <FlatList 
          style={{width: '100%'}}
          data = {chatRooms}
          renderItem = { ({item}) => <ChatListItem chatRoom={item}/> }
          keyExtractor = {(item) => item.id}
          />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
});
