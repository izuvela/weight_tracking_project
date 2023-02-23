import {
  StyleSheet,
  Text,
  View,
  Button,
  Modal,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteUser, getWeightIndicators } from "../api/users";
import Divider from "../components/Divider";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
  const [deleteModal, setDeleteModal] = useState(false);

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
        <View style={styles.mainContainer}>
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
          <Button title='Delete user' onPress={() => setDeleteModal(true)} />
        </View>
      )}
      {deleteModal && (
        <Modal animationType='slide'>
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => setDeleteModal(false)}
              style={styles.closeIcon}
            >
              <MaterialCommunityIcons name='close' size={30} color='#000' />
            </TouchableOpacity>
            <Text style={styles.text}>
              Are you sure you want to delete your account?
            </Text>
            <Button title='Yes' onPress={() => clearAll(user)} />
          </View>
        </Modal>
      )}
    </>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  mainContainer: {
    padding: 30,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  closeIcon: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 10,
  },
  text: {
    textAlign: "center",
    marginBottom: 20,
  },
});
