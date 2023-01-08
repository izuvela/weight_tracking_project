import { StyleSheet, Text, View, Button } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // clear error
  }
  console.log("Deleted.");
};

const UserScreen = () => {
  return (
    <>
      <View>
        <Text>UserScreen</Text>
        <Button title="Delete local storage" onPress={() => clearAll()} />
      </View>
    </>
  );
};

export default UserScreen;

const styles = StyleSheet.create({});
