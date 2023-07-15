import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { getDiary, getPlan, updateDiary } from "../api/users";
import Divider from "../components/Divider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { deleteMeal, getMeals, createMeal, updateMeal } from "../api/meals";
import { deleteExercise, getExercises, createExercise } from "../api/exercises";

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

  const [name, setName] = useState("");
  const [typeOfMeal, setTypeOfMeal] = useState("");
  const [calories, setCalories] = useState("");
  const [carbohydrates, setCarbohydrates] = useState("");
  const [fat, setFat] = useState("");
  const [protein, setProtein] = useState("");
  const [message, setMessage] = useState("");

  const [newWaterIntake, setNewWaterIntake] = useState(null);

  const [exercisesScreen, setExercisesScreen] = useState(false);
  const [exercises, setExercises] = useState(null);
  const [addExercisesScreen, setAddExercisesScreen] = useState(false);

  const [exerciseName, setExerciseName] = useState("");
  const [duration, setDuration] = useState("");
  const [caloriesSpent, setCaloriesSpent] = useState("");

  const [updateMealId, setUpdateMealId] = useState(null);
  const [updateMealData, setUpdateMealData] = useState(null);
  const [updateMealScreen, setUpdateMealScreen] = useState(false);

  const handleUpdateMeal = (id) => {
    const meal = meals.find((meal) => meal.meal_id === id);
    console.log(meal);
    setUpdateMealId(id);
    setUpdateMealData(meal);
    setUpdateMealScreen(true);
  };

  const handleUpdateMealSubmit = async () => {
    const {
      info: { name, calories, protein, fat, carbohydrates },
      type_of_meal,
    } = updateMealData;

    try {
      const data = await updateMeal(updateMealId, {
        info: {
          name,
          calories,
          protein,
          fat,
          carbohydrates,
        },
        type_of_meal,
      });

      if (data.success) {
        setMessage("Meal updated successfully");
        fetchData(); // fetch data again after update to get the latest meals
        setTimeout(() => {
          setUpdateMealScreen(false);
          setMessage("");
        }, 1000);
      } else {
        setMessage("There was a problem updating the meal");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("There was a problem updating the meal");
    }
  };

  const handleSubmitExercise = () => {
    const exerciseData = {
      info: {
        name: exerciseName,
        duration: parseInt(duration),
        calories_spent: parseInt(caloriesSpent),
      },
    };
    createExercise(user.id, exerciseData)
      .then((response) => {
        console.log(response);
        if (response.success) {
          setMessage("Success");
          // Reset all fields to blank after submitting
          setExerciseName("");
          setDuration("");
          setCaloriesSpent("");
          setTimeout(() => {
            setAddExercisesScreen(false);
            setExercisesScreen(false);
            setMessage("");
          }, 1000);
        } else {
          setMessage("Error");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleUpdateWaterIntake = () => {
    const updatedDiary = {
      protein_consumed: proteinConsumed,
      calories_consumed: caloriesConsumed,
      water_consumed: newWaterIntake,
      notes: "", // or get notes from state if you have it
    };
    updateDiary(user.id, updatedDiary)
      .then((response) => {
        console.log(response);
        if (response.success) {
          setWaterConsumed(newWaterIntake);
          setNewWaterIntake(""); // reset new water intake
        } else {
          // Handle error
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSubmitMeal = () => {
    const mealData = {
      info: {
        name: name,
        calories: parseInt(calories),
        carbohydrates: parseInt(carbohydrates),
        fat: parseInt(fat),
        protein: parseInt(protein),
      },
      type_of_meal: typeOfMeal,
    };
    createMeal(user.id, mealData)
      .then((response) => {
        console.log(response);
        if (response.success) {
          setMessage("Success");
          // Reset all fields to blank after submitting
          setName("");
          setTypeOfMeal("");
          setCalories("");
          setCarbohydrates("");
          setFat("");
          setProtein("");
          setTimeout(() => {
            setAddMealsScreen(false);
            setMealsScreen(false);
            setMessage("");
          }, 1000);
        } else {
          setMessage("Error");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
      });
      getExercises(user.id).then((data) => {
        setExercises(data);
        console.log(data);
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
    console.log("uspjeh");
  }, [route, mealsScreen, exercisesScreen]);

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
          <Divider />
          <Button title='Exercises' onPress={() => setExercisesScreen(true)} />
          <Divider />
          <TextInput
            placeholder='Enter new water intake'
            value={newWaterIntake}
            onChangeText={(text) => setNewWaterIntake(text)}
          />
          <Button
            title='Update Water Intake'
            onPress={handleUpdateWaterIntake}
          />
        </View>
      )}
      {mealsScreen && (
        <Modal animationType='slide'>
          <View style={[styles.container, { flex: 1 }]}>
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
                      style={styles.updateButton}
                      onPress={() => handleUpdateMeal(item.meal_id)}
                    >
                      <MaterialCommunityIcons
                        name='pencil'
                        size={24}
                        color='green'
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={async () => {
                        await deleteMeal(item.meal_id);
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
            <View style={styles.inputContainer}>
              <TextInput
                placeholder='Meal Name'
                value={name}
                onChangeText={(text) => setName(text)}
              />
              <TextInput
                placeholder='Type of Meal'
                value={typeOfMeal}
                onChangeText={(text) => setTypeOfMeal(text)}
              />
              <TextInput
                placeholder='Calories'
                value={calories}
                onChangeText={(text) => setCalories(text)}
              />
              <TextInput
                placeholder='Carbohydrates'
                value={carbohydrates}
                onChangeText={(text) => setCarbohydrates(text)}
              />
              <TextInput
                placeholder='Fat'
                value={fat}
                onChangeText={(text) => setFat(text)}
              />
              <TextInput
                placeholder='Protein'
                value={protein}
                onChangeText={(text) => setProtein(text)}
              />
              <Button title='Submit Meal' onPress={handleSubmitMeal} />
              <Divider />
              <Text>{message}</Text>
            </View>
          </View>
        </Modal>
      )}
      {exercisesScreen && (
        <Modal animationType='slide'>
          <View style={[styles.container, { flex: 1 }]}>
            <TouchableOpacity
              onPress={() => setExercisesScreen(false)}
              style={styles.closeIcon}
            >
              <MaterialCommunityIcons name='close' size={30} color='#000' />
            </TouchableOpacity>
            <View style={styles.listOfExercises}>
              <Button
                title='Add an exercise'
                onPress={() => setAddExercisesScreen(true)}
              />
              <Divider />
              <FlatList
                data={exercises}
                renderItem={({ item }) => (
                  <View style={styles.item}>
                    <Text>Name: {item.info.name}</Text>
                    <Text>Duration: {item.info.duration}</Text>
                    <Text>Calories Spent: {item.info.calories_spent}</Text>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => {
                        deleteExercise(item.exercise_id);
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
                keyExtractor={(item) => item.exercise_id}
              />
            </View>
          </View>
        </Modal>
      )}
      {addExercisesScreen && (
        <Modal animationType='slide'>
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => setAddExercisesScreen(false)}
              style={styles.closeIcon}
            >
              <MaterialCommunityIcons name='close' size={30} color='#000' />
            </TouchableOpacity>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder='Exercise Name'
                value={exerciseName}
                onChangeText={(text) => setExerciseName(text)}
              />
              <TextInput
                placeholder='Duration'
                value={duration}
                onChangeText={(text) => setDuration(text)}
              />
              <TextInput
                placeholder='Calories Spent'
                value={caloriesSpent}
                onChangeText={(text) => setCaloriesSpent(text)}
                style={"margin-bottom: 20px"}
              />
              <Button title='Submit Exercise' onPress={handleSubmitExercise} />
              <Divider />
              <Text>{message}</Text>
            </View>
          </View>
        </Modal>
      )}
      {updateMealScreen && (
        <Modal animationType='slide'>
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => setUpdateMealScreen(false)}
              style={styles.closeIcon}
            >
              <MaterialCommunityIcons name='close' size={30} color='#000' />
            </TouchableOpacity>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder='Meal Name'
                value={updateMealData.info.name}
                onChangeText={(text) =>
                  setUpdateMealData({
                    ...updateMealData,
                    info: { ...updateMealData.info, name: text },
                  })
                }
              />
              <TextInput
                placeholder='Type of Meal'
                value={updateMealData.type_of_meal}
                onChangeText={(text) =>
                  setUpdateMealData({ ...updateMealData, type_of_meal: text })
                }
              />
              <TextInput
                placeholder='Calories'
                value={String(updateMealData.info.calories)}
                onChangeText={(text) =>
                  setUpdateMealData({
                    ...updateMealData,
                    info: { ...updateMealData.info, calories: text },
                  })
                }
              />
              <TextInput
                placeholder='Carbohydrates'
                value={String(updateMealData.info.carbohydrates)}
                onChangeText={(text) =>
                  setUpdateMealData({
                    ...updateMealData,
                    info: { ...updateMealData.info, carbohydrates: text },
                  })
                }
              />
              <TextInput
                placeholder='Fat'
                value={String(updateMealData.info.fat)}
                onChangeText={(text) =>
                  setUpdateMealData({
                    ...updateMealData,
                    info: { ...updateMealData.info, fat: text },
                  })
                }
              />
              <TextInput
                placeholder='Protein'
                value={String(updateMealData.info.protein)}
                onChangeText={(text) =>
                  setUpdateMealData({
                    ...updateMealData,
                    info: { ...updateMealData.info, protein: text },
                  })
                }
              />
              <Button title='Update Meal' onPress={handleUpdateMealSubmit} />
              <Divider />
              <Text>{message}</Text>
            </View>
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
    paddingBottom: 100,
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
  listOfExercises: {
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
    bottom: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  inputContainer: {
    marginTop: 50,
  },
  updateButton: {
    position: "absolute",
    right: 20,
    top: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
});
