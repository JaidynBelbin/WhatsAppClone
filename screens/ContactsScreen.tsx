import * as React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import { Text, View} from '../components/Themed';

import users from '../data/Users';

import ContactListItem from '../components/ContactListItem';
import {useEffect, useState} from "react";
import {Auth, API, graphqlOperation} from "aws-amplify";
import {listUsers} from "../src/graphql/queries";

export default function Contacts() {
  
  // State array holding the User data fetched from the database.
  const [users, setUsers] = useState([]);
  
  // Gets the registered users from the database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await API.graphql(
          graphqlOperation(
            listUsers
          )
        )
        
        const usersArray = userData.data.listUsers.items;
        const registeredUser = await Auth.currentAuthenticatedUser();
  
        // Removing the registered user from the array based on the matching id.
        const removeIndex = usersArray.map(item => item.id)
          .indexOf(registeredUser.attributes.sub);
        
        ~removeIndex && usersArray.splice(removeIndex, 1);
        
        
        setUsers(usersArray);
        
      } catch (e) {
      
      }
    }
    
    fetchUsers()
  }, [])
  
  
    return (
        <View style={styles.container}>

            {/** A FlatList which uses the data from ChatRooms.ts
             * The renderItem option is a function which renders each
             *
             */}
          <FlatList
          style={{width: '100%'}}
          data = {users}
          renderItem = { ({item}) => <ContactListItem user={item}/> }
          keyExtractor = {(item) => item.id}
          />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
});
