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
import {onCreateMessage} from "../src/graphql/subscriptions";


const ChatRoomScreen = () => {
  
  const [messages, setMessages] = useState([]);
  const [myID, setMyID]  = useState(null);
  
  const route = useRoute();
  
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
  
  
  useEffect(() => {
    
    const getMyID = async () => {
      const userInfo = await Auth.currentAuthenticatedUser();
      setMyID(userInfo.attributes.sub);
    }
    
    getMyID();
  }, [])
  
  // Fetching the messages initially upon rendering the UI
  useEffect(() => {
    fetchMessages();
  }, [])
  
  useEffect(() => {
  
  }, [])
  
  // Handles subscribing to the messages in the DB, needs some work
  // with the Observables in the state
  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage)
    ).subscribe({
        next: (data) => {
          const newMessage = data.value.data.onCreateMessage;
          
          // The new message is not in this chat room
          if (newMessage.chatRoomID !== route.params.id) {
            console.log("Message is in another room!")
            return;
          }
  
          // TODO: Fix the need to refetch all messages when one is sent
          
          fetchMessages();
        }
      });
    
    return () => subscription.unsubscribe();
    
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
