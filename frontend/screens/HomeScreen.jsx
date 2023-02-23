import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { getDiary, getPlan } from "../api/users";
import Divider from "../components/Divider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { deleteMeal, getMeals } from "../api/meals";

const HomeScreen = ({ user, route }) => {
  const [waterGoal, setWaterGoal] = useState(null);
  const [caloriesGoal, setCaloriesGoal] = useState(null);
  const [proteinGoal, setProteinGoal] = useState(null);
  const [waterConsumed, setWaterConsumed] = useState(null);
  const [caloriesConsumed, setCaloriesConsumed] = useState(null);
  const [proteinConsumed, setProteinConsumed] = useState(null);
  const [mealsScreen, setMealsScreen] = useState(false);
  const [meals, setMeals] = useState(null);
  const [addMealsScreen, setAddMealsScreen] = useState(false);

  const fetchData = async () => {
    try {
      getPlan(user.id).then((data) => {
        setWaterGoal(data.water_goal);
        setCaloriesGoal(data.calories_goal);
        setProteinGoal(data.protein_goal);
      });
      getDiary(user.id).then((data) => {
        setWaterConsumed(data.water_consumed);
        setCaloriesConsumed(data.calories_consumed);
        setProteinConsumed(data.protein_consumed);
      });
      getMeals(user.id).then((data) => {
        setMeals(data);
        console.log(data);
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
    console.log("uspjeh");
  }, [route, mealsScreen]);

  return (
    <>
      {waterGoal && caloriesGoal && proteinGoal && (
        <View style={styles.container}>
          <Text>Calories goal: {caloriesGoal}</Text>
          <Text>Protein goal: {proteinGoal} g</Text>
          <Text>Water goal: {waterGoal} L</Text>
          <Divider />
          <Text>Calories consumed: {caloriesConsumed}</Text>
          <Text>Protein consumed: {proteinConsumed} g</Text>
          <Text>Water consumed: {waterConsumed} L</Text>
          <Divider />
          <Button title='Meals' onPress={() => setMealsScreen(true)} />
        </View>
      )}
      {mealsScreen && (
        <Modal animationType='slide'>
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => setMealsScreen(false)}
              style={styles.closeIcon}
            >
              <MaterialCommunityIcons name='close' size={30} color='#000' />
            </TouchableOpacity>
            <View style={styles.listOfMeals}>
              <Button
                title='Add a meal'
                onPress={() => setAddMealsScreen(true)}
              />
              <Divider />
              <FlatList
                data={meals}
                renderItem={({ item }) => (
                  <View style={styles.item}>
                    <Text>Name: {item.info.name}</Text>
                    <Text>Meal: {item.type_of_meal}</Text>
                    <Text>Calories: {item.info.calories}</Text>
                    <Text>Carbohydrates: {item.info.carbohydrates} g</Text>
                    <Text>Fat: {item.info.fat} g</Text>
                    <Text>Protein: {item.info.protein} g</Text>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => {
                        deleteMeal(item.meal_id);
                        fetchData();
                      }}
                    >
                      <MaterialCommunityIcons
                        name='delete'
                        size={24}
                        color='red'
                      />
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item) => item.meal_id}
              />
            </View>
          </View>
        </Modal>
      )}
      {addMealsScreen && (
        <Modal animationType='slide'>
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => setAddMealsScreen(false)}
              style={styles.closeIcon}
            >
              <MaterialCommunityIcons name='close' size={30} color='#000' />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
  closeIcon: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 10,
  },
  listOfMeals: {
    marginTop: 50,
  },
  item: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  deleteButton: {
    position: "absolute",
    right: 20,
    top: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
});
