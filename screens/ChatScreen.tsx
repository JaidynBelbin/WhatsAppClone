import * as React from 'react';
import {StyleSheet} from 'react-native';
import { Text, View} from '../components/Themed';
import ChatListItem from '../components/ChatListItem';

import chatRooms from '../data/ChatRooms';

export default function ChatScreen() {
    return (
        <View style={styles.container}>
          <ChatListItem chatRoom = {chatRooms[0]} />
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
