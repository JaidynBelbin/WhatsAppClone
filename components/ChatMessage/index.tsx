import moment from 'moment';
import React from 'react';
import {Text, View} from 'react-native';
import styles from './styles';
import {Message} from '../../types';


export type ChatMessageProps = {
  message: Message;
  myID: String,
}

const ChatMessage = (props: ChatMessageProps) => {
  
  const {message, myID} = props;
  
  const isMyMessage = () => {
    return message.user.id === myID;
  }
  
  return (
    <View style={styles.container}>
      
      {/**
       * Implementing conditional styling for the messageBox depending on the result
       * of isMyMessage
       */}
      
      <View style={[
        styles.messageBox, {
          backgroundColor: isMyMessage() ? '#dcf8c5' : 'white',
          marginLeft: isMyMessage() ? 50 : 0,
          marginRight: isMyMessage() ? 0 : 50,
        }
      ]}>
        
        {/**
         * Conditionally rendering the username only if the message is
         * not from me. */}
        
        {!isMyMessage() && <Text style = {styles.name}>{message.user.name}</Text>}
        <Text style = {styles.message}>{message.content}</Text>
        <Text style = {styles.time}>{moment(message.createdAt).fromNow()}</Text>
      </View>
    </View>
  )
}

export default ChatMessage;
