import React, {useEffect, useState} from 'react';
import { ChatRoom, User } from '../../types';
import { Image, TouchableWithoutFeedback} from 'react-native';
import { Text, View} from '../Themed';
import styles from './style';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import {Auth,} from "aws-amplify";

/** Allowing multiple related properties to be kept together */
export type ChatListItemProps = {
    chatRoom: ChatRoom;
}


/** Component for each item in the list of chats. */
const ChatListItem = (props: ChatListItemProps) => {
    
    const {chatRoom} = props;
    
    const[otherUser, setOtherUser] = useState(null);
    
    /** Hook to navigate to the new screen when clicking on each chat list item */
    const navigation = useNavigation();
    
    // Getting the other user in the chat room with us, to ensure that we
    // do not display our own name on the ChatRoom header.
    useEffect(() => {
        
        const getOtherUser = async () => {
            
            const userInfo = await Auth.currentAuthenticatedUser();
            
            // If the first user is the authenticated one, ie. me
            if (chatRoom.chatRoomUsers.items[0].user.id === userInfo.attributes.sub) {
                setOtherUser(chatRoom.chatRoomUsers.items[1].user);
            } else {
                setOtherUser(chatRoom.chatRoomUsers.items[0].user)
            }
        }
        
        getOtherUser();
        
    }, [])
   
    /** The first argument is the 'route' or the name of the screen you are navigating to,
     *  the second argument is the list of params that you send along with the route, and
     *  can access them in the next screen.
     */
    const onClick = () => {
        navigation.navigate('ChatRoom', {
            id: chatRoom.id,
            name: otherUser.name,
        });
    }
    
    if (!otherUser) {
        return null;
    }

/*  Displays the users avatar, their name
    the last sent message, and a timestamp. */
    return (
        <TouchableWithoutFeedback onPress={onClick}>
            <View style={styles.container}>
        
                <View style={styles.leftContainer}>
                    <Image source={{ uri: otherUser.imageUri}} style={styles.avatar}/>

                    <View style={styles.midContainer}>
                        <Text style={styles.userName}>{otherUser.name}</Text>
                        <Text numberOfLines={2} style={styles.lastMessage}>{chatRoom.lastMessage ? chatRoom.lastMessage.content : ""}</Text>
                    </View>

                </View>

                {/** Styling the message date using the Moment module */}
                <Text style={styles.time}>
                    {chatRoom.lastMessage && moment(chatRoom.lastMessage.createdAt).format("DD/MM/YYYY")}
                </Text>
    
            </View>

        </TouchableWithoutFeedback>
    )

};

export default ChatListItem;
