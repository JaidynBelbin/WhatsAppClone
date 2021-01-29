import React, {useEffect, useState} from 'react';
import {FlatList, ImageBackground, View} from 'react-native';

import {useRoute} from '@react-navigation/native';

import {
  API,
  Auth,
  graphqlOperation
} from 'aws-amplify';

import {messagesByChatRoom} from "../src/graphql/queries";

import chatRoomData from '../data/Chats';
import ChatMessage from '../components/ChatMessage';
import BG from '../assets/images/BG.png';
import InputBox from '../components/InputBox';


const ChatRoomScreen = () => {
  
  const [messages, setMessages] = useState([]);
  const [myID, setMyID]  = useState(null);
  
  const route = useRoute();
  console.log(route.params.id);
  
  useEffect(() => {
    
    const fetchMessages = async () => {
      const messagesData = await API.graphql(
        graphqlOperation(
          messagesByChatRoom, {
            chatRoomID: route.params.id,
            sortDirection: "DESC",
          }
        )
      )
      
      setMessages(messagesData.data.messagesByChatRoom.items);
      
    }
    
    fetchMessages();
  }, [])
  
  useEffect(() => {
    
    const getMyID = async () => {
      const userInfo = await Auth.currentAuthenticatedUser();
      setMyID(userInfo.attributes.sub);
    }
    
    getMyID();
  }, [])
  
  
  return (

      <ImageBackground style={{width: '100%', height: '100%'}} source={BG}>
          <View style={{
              flex: 1,
          }}>

              <FlatList
                  data={messages}
                  renderItem={({ item }) => <ChatMessage myID = {myID} message={item}/>}
                  inverted
              />

          </View>
          <InputBox chatRoomID = {route.params.id}/>
      </ImageBackground>

  )
}

export default ChatRoomScreen;
