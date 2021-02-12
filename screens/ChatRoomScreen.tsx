import React, {useEffect, useRef, useState} from 'react';
import {FlatList, ImageBackground, View, KeyboardAvoidingView, Platform} from 'react-native';

import {useRoute} from '@react-navigation/native';

import {
  API,
  Auth,
  graphqlOperation
} from 'aws-amplify';

import {messagesByChatRoom} from "../src/graphql/queries";


import ChatMessage from '../components/ChatMessage';
import InputBox from '../components/InputBox';
import {onCreateMessage} from "../src/graphql/subscriptions";


const ChatRoomScreen = () => {
  
  const [messages, setMessages] = useState([]);
  const [myID, setMyID]  = useState('');
  
  const route = useRoute();
  
  // Fetches all the messages in a given chat room
  const fetchMessages = async () => {
    const messages = await API.graphql(
      graphqlOperation(
        messagesByChatRoom, {
          chatRoomID: route.params.id,
          sortDirection: "DESC",
        }
      )
    )
    
    setMessages(messages.data.messagesByChatRoom.items);
  }
  
  // Function to fetch the ID of the currently signed in user
  const getMyID = () => {
    Auth.currentAuthenticatedUser()
      .then((user) => setMyID(user.attributes.sub))
      .catch(err => (console.log(err)));
  }
  
  useEffect(() => {
    getMyID();
    fetchMessages().then();
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
          fetchMessages().then();
        }
      });
    
    return () => {
      subscription.unsubscribe();
    }
    
  }, [])
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={{width: '100%', height: '100%'}}>
      <ImageBackground style={{width: '100%', height: '100%'}} source={require('../assets/images/BG.png')}>
        
          <FlatList
            extraData={messages}
            data={messages}
            renderItem={({ item }) => <ChatMessage myID = {myID} message={item}/>}
            inverted
          />
    
        <InputBox chatRoomID = {route.params.id}/>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

export default ChatRoomScreen;
