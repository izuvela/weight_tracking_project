import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // clear error
  }
  console.log("Deleted.");
};

const HomeScreen = () => {
  return (
    <View>
      <Text>HomeScreen</Text>
      <Button title="Delete local storage" onPress={() => clearAll()} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
