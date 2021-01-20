import { 
    MaterialCommunityIcons, 
    FontAwesome5,
    Fontisto, 
    Entypo,
    MaterialIcons
} from '@expo/vector-icons';
import React, { useState } from 'react';
import {View, Text} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import styles from './styles';



const InputBox = () => {

    /* state variable holding the value in the text input box 
       and a function to update the message (setMessage)*/
    const [message, setMessage] = useState('');

    const onMicrophonePress = () => {
        console.warn(`Microphone`)
    }

    const onSendPress = () => {
        console.warn(`Sending ${message}`)

        // Send the message to the backend

        // Resetting the value in the textbox
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
