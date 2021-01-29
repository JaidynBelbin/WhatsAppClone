import React from 'react';
import {FlatList, ImageBackground, View} from 'react-native';

import {useRoute} from '@react-navigation/native';

import chatRoomData from '../data/Chats';
import ChatMessage from '../components/ChatMessage';
import BG from '../assets/images/BG.png';
import InputBox from '../components/InputBox';

const ChatRoomScreen = () => {

    const route = useRoute();
    
    

    return (

        <ImageBackground style={{width: '100%', height: '100%'}} source={BG}>
            <View style={{
                flex: 1,
            }}>

                <FlatList
                    data={chatRoomData.messages}
                    renderItem={({ item }) => <ChatMessage message={item}/>}
                    inverted
                />

            </View>
            <InputBox chatRoomID = {route.params.id}/>
        </ImageBackground>

    )
}

export default ChatRoomScreen;
