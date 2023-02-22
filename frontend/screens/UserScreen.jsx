import { StyleSheet, Text, View, Button } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteUser, getWeightIndicators } from "../api/users";
import Divider from "../components/Divider";

const clearAll = async (user) => {
  try {
    const result = await deleteUser(user.id);
    await AsyncStorage.clear();
    // set state to null
    console.log(result);
  } catch (e) {
    console.log(e);
  }
  console.log("Deleted.");
};

const UserScreen = ({ user, route }) => {
  const [weightIndicators, setWeightIndicators] = useState(null);

  const fetchData = async () => {
    try {
      getWeightIndicators(user.id).then((data) => {
        setWeightIndicators(data.info);
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [route]);

  return (
    <>
      {weightIndicators && (
        <View style={styles.container}>
          <Text>Name: {user.name}</Text>
          <Text>Gender: {user.gender}</Text>
          <Text>Date of Birth: {user.date_of_birth}</Text>
          <Text>Height: {user.height}</Text>
          <Text>Weight: {user.weight}</Text>
          <Text>Goal Weight: {user.goal_weight}</Text>
          <Text>Physical Activity Level: {user.physical_activity_level}</Text>
          <Divider />
          <Text>BMI: {weightIndicators.bmi}</Text>
          <Text>BMR: {weightIndicators.bmr}</Text>
          <Text>
            Body Fat Percentage: {weightIndicators.body_fat_percentage}%
          </Text>
          <Divider />
          <Button title="Delete user" onPress={() => clearAll(user)} />
        </View>
      )}
    </>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
});
