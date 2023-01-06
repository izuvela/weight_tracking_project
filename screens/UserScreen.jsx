import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";

const UserScreen = () => {
  const [formSubmitted, setFormSubmitted] = useState(true);

  return <>
    {formSubmitted && (
      <View>
        <Text>UserScreen</Text>
      </View>
    )}
  </>;
};

export default UserScreen;

const styles = StyleSheet.create({});
