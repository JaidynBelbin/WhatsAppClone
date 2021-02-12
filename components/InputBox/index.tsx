import {
  MaterialCommunityIcons,
  FontAwesome5,
  Fontisto,
  Entypo,
  MaterialIcons
} from '@expo/vector-icons';
import React, {useEffect, useState} from 'react';
import {View, Text, Platform, KeyboardAvoidingView} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import styles from './styles';

import {
  API,
  Auth,
  graphqlOperation,
} from 'aws-amplify'

import {createMessage, updateChatRoom} from "../../src/graphql/mutations";


const InputBox = (props) => {
  
  const {chatRoomID} = props;
  
  /* state variable holding the value in the text input box
     and a function to update the message (setMessage)*/
  const [message, setMessage] = useState('');
  const [myUserID, setMyUserID] = useState('');
  
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => setMyUserID(user.attributes.sub))
      .catch((error) => console.log(error));
  }, [])
  
  const onMicrophonePress = () => {
    console.warn(`Microphone`)
  }
  
  const updateChatRoomLastMessage = async (messageID: string) => {
    try {
      await API.graphql(
        graphqlOperation(
          updateChatRoom, {
            input: {
              id: chatRoomID,
              lastMessageID: messageID,
            }
          }
        )
      )
    } catch (e) {
      console.log(e);
    }
  }
  
  // Creating the new message, updating the DB with the most recent message
  const onSendPress = async () => {
    
    try {
      const newMessageData = await API.graphql(
        graphqlOperation(
          createMessage, {
            input: {
              content: message,
              userID: myUserID,
              chatRoomID,
            }
          }
        )
      )
      
      await updateChatRoomLastMessage(newMessageData.data.createMessage.id);
      
    } catch (e) {
      console.log(e);
    }
    
    setMessage('');
  }
  
  
  const onPress = () => {
    if (!message) {
      onMicrophonePress();
    } else {
      onSendPress();
    }
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      keyboardVerticalOffset={-170}
      style={{width: '100%'}}
    >
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <FontAwesome5 name="laugh-beam" size={24} color="grey"/>
          <TextInput
            placeholder={"Type a message"}
            style={styles.textInput}
            multiline
            value={message}
            onChangeText={setMessage}
          />
          <Entypo name="attachment" size={24} color="grey" style={styles.icons}/>
          {!message && <Fontisto name="camera" size={24} color="grey" style={styles.icons}/>}
        </View>
        
        <TouchableOpacity onPress={onPress}>
          <View style={styles.buttonContainer}>
            {!message
              ? <MaterialCommunityIcons name="microphone" size={28} color="white" />
              : <MaterialIcons name="send" size={28} color="white"/> }
          </View>
        </TouchableOpacity>
      
      </View>
    </KeyboardAvoidingView>
  )
}

export default InputBox;
