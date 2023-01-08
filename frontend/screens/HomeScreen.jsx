import { Button, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";

const HomeScreen = () => {
  const [calorieGoal, setCalorieGoal] = useState(0);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);

  return (
    <View style={styles.container}>
      <Text>HomeScreen</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
