import React from 'react';
import { ChatRoom, User } from '../../types';
import { View, Text, Image} from 'react-native';
import styles from './style';
import moment from 'moment';

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

/*  Displays the users avatar, their name
    the last sent message, and a timestamp. */
    return (
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
    )

};

export default ChatListItem;