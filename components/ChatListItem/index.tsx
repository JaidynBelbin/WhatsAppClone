import React from 'react';
import { ChatRoom, User } from '../../types';
import { View, Text, Image, TouchableWithoutFeedback} from 'react-native';
import styles from './style';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';

/** Allowing multiple related properties to be kept together */
export type ChatListItemProps = {
    chatRoom: ChatRoom;
    user: User; /** for example */
}

/** example component showing the use of the second prop in ChatListItemProps */
const UserListItem = (props: ChatListItemProps) => {

    const name = props.user.name;

    return (
        <View>
            {/** */}
        </View>
    )
}

/** Component for each item in the list of chats. */
const ChatListItem = (props: ChatListItemProps) => {

    /** Destructuring the chatRoom object from props into a variable so 
     * we can access the id, users[], and lastMessage.
     */
    const {chatRoom} = props;
    const user = chatRoom.users[1];

    /** Hook to navigate to the new screen when clicking on each chat list item */
    const navigation = useNavigation();

    /** The first argument is the 'route' or the name of the screen you are navigating to,
     *  the second argument is the list of params that you send along with the route, and 
     *  can access them in the next screen.
     */
    const onClick = () => {
        navigation.navigate('ChatRoom', {
            id: chatRoom.id,
            name: user.name,
            image: user.imageUri,
        });
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
                        <Text numberOfLines={1} style={styles.lastMessage}>{chatRoom.lastMessage.content}</Text>
                    </View>

                </View>

                {/** Styling the message date using the Moment module */}
                <Text style={styles.time}>
                    {moment(chatRoom.lastMessage.createdAt).format("DD/MM/YYYY")}
                </Text>
    
            </View>

        </TouchableWithoutFeedback>
    )

};

export default ChatListItem;