import { Button, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { getPlan, getWeightIndicators } from "../api/users";
import Divider from "../components/Divider";

const HomeScreen = ({ user }) => {
  const [weightIndicators, setWeightIndicators] = useState(null);
  const [waterGoal, setWaterGoal] = useState(null);
  const [caloriesGoal, setCaloriesGoal] = useState(null);
  const [proteinGoal, setProteinGoal] = useState(null);

  const fetchData = async () => {
    try {
      getWeightIndicators(user.id).then((data) => {
        setWeightIndicators(data.info);
      });
      getPlan(user.id).then((data) => {
        setWaterGoal(data.water_goal);
        setCaloriesGoal(data.calories_goal);
        setProteinGoal(data.protein_goal);
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {weightIndicators && (
        <View style={styles.container}>
          <Text>BMI: {weightIndicators.bmi}</Text>
          <Text>BMR: {weightIndicators.bmr}</Text>
          <Text>
            Body Fat Percentage: {weightIndicators.body_fat_percentage}%
          </Text>
          <Divider />
          <Text>Calories goal: {caloriesGoal}</Text>
          <Text>Protein goal: {proteinGoal} g</Text>
          <Text>Water goal: {waterGoal} L</Text>
        </View>
      )}
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
