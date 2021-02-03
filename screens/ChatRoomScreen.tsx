import React, {useEffect, useRef, useState} from 'react';
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
import {onCreateMessage} from "../src/graphql/subscriptions";


const ChatRoomScreen = () => {
  
  const [messages, setMessages] = useState([]);
  const [myID, setMyID]  = useState(null);
  
  const route = useRoute();
  
  // Fetches all the messages in a given chat room
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
  
  const getMyID = async () => {
    const userInfo = await Auth.currentAuthenticatedUser();
    setMyID(userInfo.attributes.sub);
  }
  
  useEffect(() => {
    getMyID();
  }, [])
  
  useEffect(() => {
    fetchMessages();
  }, [])
  
  
  //
  //  Handles subscribing to new messages
  //
  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage)
    ).subscribe({
        next: (data) => {
          
          const newMessage = data.value.data.onCreateMessage;
          
          // Checking if the message is in this chat room
          if (newMessage.chatRoomID !== route.params.id) {
            console.log("Message is in another room!")
            return;
          }
         
          // TODO: Figure out how to optimise the fetching of messages.
          fetchMessages();
        }
      });
    
    return () => {
      subscription.unsubscribe();
    }
    
  }, [])
  
  
  return (

      <ImageBackground style={{width: '100%', height: '100%'}} source={BG}>
          <View style={{
              flex: 1,
          }}>

              <FlatList
                extraData={messages}
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
