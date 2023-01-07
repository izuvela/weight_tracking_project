import { Button, Modal, StyleSheet, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
import UserScreen from "./screens/UserScreen";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import Form from "./components/Form";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from "./components/Loading";

const Tab = createBottomTabNavigator();

export default function App() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('@user_name')
    if(value !== null) {
      // value previously stored
      return value;
    }
  } catch(e) {
   console.log(e);
  }
}

  useEffect(() => {
    getData().then((data) => {
      if (data) {
        console.log(data);
        setFormSubmitted(true);
      }
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  
  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {formSubmitted ? (
        <NavigationContainer>
          <Tab.Navigator initialRouteName="Home" backBehavior="history">
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons
                    name="home"
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="User"
              component={UserScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons
                    name="human"
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      ) : (
        <Modal visible={true} animationType="slide">
          <Form setSubmittedForm={setFormSubmitted} />
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
