import { Button, Modal, StyleSheet, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
import UserScreen from "./screens/UserScreen";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import Form from "./components/Form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "./components/Loading";
import { getUser } from "./api/users";

const Tab = createBottomTabNavigator();

export default function App() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const fetchData = async () => {
    try {
      const value = await AsyncStorage.getItem("@user_id");
      if (value !== null) {
        getUser(value).then((data) => {
          console.log(data);
          setUser(data);
        });
        return value;
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData()
      .then((data) => {
        if (data) {
          setFormSubmitted(true);
        }
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {formSubmitted && user ? (
        <NavigationContainer>
          <Tab.Navigator initialRouteName="Home" backBehavior="history">
            <Tab.Screen
              name="Home"
              children={() => <HomeScreen user={user} />}
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
              children={() => <UserScreen user={user} />}
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
          <Form setSubmittedForm={setFormSubmitted} setUser={setUser}/>
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
