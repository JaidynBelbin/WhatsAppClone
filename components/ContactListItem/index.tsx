import React from 'react';
import { ChatRoom, User } from '../../types';
import { Image, TouchableWithoutFeedback} from 'react-native';
import { Text, View} from '../Themed';
import styles from './styles';

import {useNavigation} from '@react-navigation/native';

import {
  API,
  graphqlOperation,
  Auth
} from 'aws-amplify';

import {
  createChatRoom,
  createChatRoomUser
} from '../../src/graphql/mutations';


export type ContactListItemProps = {
  user: User;
}


const ContactListItem = (props: ContactListItemProps) => {
  
  const {user} = props;
  const name = user.name;
  
  // Hook to navigate to the new screen when clicking on each chat list item
  const navigation = useNavigation();
  
  // Creates a new ChatRoom with the selected user and the authenticated user.
  // TODO: Check to make sure a ChatRoom already exists between this user and me
  const onClick = async () => {
    try {
      
      // Create new chat room
      const newChatRoomData = await API.graphql(
        graphqlOperation(
          createChatRoom, {
            input: {}
          }
        )
      )
      
      if (!newChatRoomData.data) {
        console.log("Failed to create the chat room.")
        return;
      }
      
      const newChatRoom = newChatRoomData.data.createChatRoom;
      
      console.log(newChatRoom);
      
      // Adding selected user to chat room
      await API.graphql(
        graphqlOperation(
          createChatRoomUser, {
            input: {
              userID: user.id,
              chatRoomID: newChatRoom.id,
            }
          }
        )
      )
      
      // Adding authenticated user to chat room
      const authenticatedUserInfo = await Auth.currentAuthenticatedUser();
      await API.graphql(
        graphqlOperation(
          createChatRoomUser, {
            input: {
              userID: authenticatedUserInfo.attributes.sub,
              chatRoomID: newChatRoom.id,
            }
          }
        )
      )
      
      navigation.navigate('ChatRoom', {
        id: newChatRoom.id,
        name: "Hardcoded Name"
      })
      
    } catch (e) {
      console.log(e);
    }
  }
  
  /*  Displays the users avatar, their name
      the last sent message, and a timestamp. */
  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View style={styles.container}>
        
        <View style={styles.leftContainer}>
          <Image source={{ uri: user.imageUri}} style={styles.avatar}/>
          
          <View style={styles.midContainer}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.status}>{user.status}</Text>
          </View>
        
        </View>
      </View>
    
    </TouchableWithoutFeedback>
  )
  
};

export default ContactListItem;
