import {
  MaterialCommunityIcons,
  FontAwesome5,
  Fontisto,
  Entypo,
  MaterialIcons
} from '@expo/vector-icons';
import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import styles from './styles';

import {
  API,
  Auth,
  graphqlOperation,
} from 'aws-amplify'

import { createMessage } from "../../src/graphql/mutations";


const InputBox = (props) => {
  
  const {chatRoomID} = props;
  
  /* state variable holding the value in the text input box
     and a function to update the message (setMessage)*/
  const [message, setMessage] = useState('');
  const [myUserID, setMyUserID] = useState(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      
      const userInfo = await Auth.currentAuthenticatedUser();
      
      setMyUserID(userInfo.attributes.sub);
    }
    fetchUser();
  }, [])
  
  const onMicrophonePress = () => {
    console.warn(`Microphone`)
  }
  
  const onSendPress = async () => {
    
    try {
      await API.graphql(
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
      {/** Microphone button changes to a send icon if there is a value (message)
       * in the input box.
       */}
      
      <TouchableOpacity onPress={onPress}>
        <View style={styles.buttonContainer}>
          {!message
            ? <MaterialCommunityIcons name="microphone" size={28} color="white" />
            : <MaterialIcons name="send" size={28} color="white"/> }
        </View>
      </TouchableOpacity>
    
    </View>
  )
}

export default InputBox;
