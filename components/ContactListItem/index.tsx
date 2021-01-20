import React from 'react';
import { ChatRoom, User } from '../../types';
import { Image, TouchableWithoutFeedback} from 'react-native';
import { Text, View} from '../Themed';
import styles from './styles';

import {useNavigation} from '@react-navigation/native';

/** Allowing multiple related properties to be kept together */
export type ContactListItemProps = {
    user: User; /** for example */
}


const ContactListItem = (props: ContactListItemProps) => {

    const {user} = props;
    const name = user.name;

    /** Hook to navigate to the new screen when clicking on each chat list item */
    const navigation = useNavigation();

    /** The first argument is the 'route' or the name of the screen you are navigating to,
     *  the second argument is the list of params that you send along with the route, and 
     *  can access them in the next screen.
     */
    const onClick = () => {
        // navigate to chat room with this user
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