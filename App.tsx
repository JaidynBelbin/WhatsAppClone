import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import { getUser } from './src/graphql/queries';
import { createUser } from './src/graphql/mutations';


import { withAuthenticator } from 'aws-amplify-react-native';
import Amplify, {Auth, API, graphqlOperation} from "aws-amplify";
import awsExports from './src/aws-exports';
Amplify.configure(awsExports);

const randomImages = [
  'https://hieumobile.com/wp-content/uploads/avatar-among-us-2.jpg',
  'https://hieumobile.com/wp-content/uploads/avatar-among-us-2.jpg',
  'https://hieumobile.com/wp-content/uploads/avatar-among-us-2.jpg',
  'https://hieumobile.com/wp-content/uploads/avatar-among-us-2.jpg',
]

function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const getRandomImage = () => {
    return randomImages[Math.floor(Math.random()*randomImages.length)];
  }

  useEffect(() => {

    const fetchUser = async() => {

      // Get authenticated User from Auth
      const userInfo = await Auth.currentAuthenticatedUser({bypassCache: true});

      // If there is a currently authenticated user, query the database for the
      // user with the matching 'sub' ID.
      if (userInfo) {
        const userData = await API.graphql(
          graphqlOperation(
            getUser,
            {id: userInfo.attributes.sub}
          )
        )

        // If there is a user created, let me know
        if (userData.data.getUser) {
          console.log("User is already registered in the database");
          return;
        }

        // Otherwise, create a new user and run the GraphQL query
        const newUser = {
          id: userInfo.attributes.sub,
          name: userInfo.username,
          imageUri: getRandomImage(),
          status: 'Hey, I am using WhatsAppClone!'
        }
      
        await API.graphql(
          graphqlOperation(
            createUser,
            { input: newUser }
          )
        )
      }
      
      // Get user from backend with the user id from the
      // authentication done in the app.

      // If no matching user, need to register one
    }
    fetchUser();

  }, [])


  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}

// Wrapping the App in the authentication check from AWS, so only logged
// in users can access the following screens
export default withAuthenticator(App);
