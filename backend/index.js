const express = require("express");
const app = express();
const pool = require("./db");
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Get all users
app.get("/users", async (req, res) => {
  try {
    const allUsers = await pool.query('SELECT * FROM "user";');
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Get a user
app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query(
      "SELECT id, name, gender, height, weight, to_char(date_of_birth, 'YYYY-MM-DD') as date_of_birth, physical_activity_level, goal_weight  FROM \"user\" WHERE id = $1",
      [id]
    );
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Create a user
app.post("/users", async (req, res) => {
  try {
    const {
      name,
      gender,
      height,
      weight,
      date_of_birth,
      physical_activity_level,
      goal_weight,
    } = req.body;
    const newUser = await pool.query(
      "INSERT INTO \"user\" (name, gender, height, weight, date_of_birth, physical_activity_level, goal_weight) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, gender, height, weight, to_char(date_of_birth, 'YYYY-MM-DD') as date_of_birth, physical_activity_level, goal_weight ",
      [
        name,
        gender,
        height,
        weight,
        date_of_birth,
        physical_activity_level,
        goal_weight,
      ]
    );
    const user = newUser.rows[0];
    res.json(user);
  } catch (err) {
    console.error(err.message);
  }
});

// Delete a user
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM "user" WHERE id = $1', [id]);
    res.json({ message: "User was deleted successfully" });
  } catch (err) {
    console.error(err.message);
  }
});

// Get a users plan
app.get("/users/:id/plan", async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await pool.query("SELECT * FROM plan WHERE user_id = $1", [
      id,
    ]);
    res.json(plan.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Get a users diary for the current day, if there is none, create a new one
app.get("/users/:id/diary", async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await pool.query("SELECT * FROM plan WHERE user_id = $1", [
      id,
    ]);
    const planId = plan.rows[0].id;
    const currentDate = new Date().toISOString().slice(0, 10);
    let diary = await pool.query(
      "SELECT id, plan_id, to_char(day, 'YYYY-MM-DD') as day, protein_consumed, calories_consumed, water_consumed, notes FROM diary WHERE plan_id = $1 AND day = $2",
      [planId, currentDate]
    );
    if (diary.rowCount === 0) {
      // There is no diary for the current date, so create a new one
      const newDiary = await pool.query(
        "INSERT INTO diary (plan_id, day) VALUES ($1, $2) RETURNING id, plan_id, to_char(day, 'YYYY-MM-DD') as day, protein_consumed, calories_consumed, water_consumed, notes",
        [planId, currentDate]
      );
      diary = newDiary;
    }
    res.json(diary.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Update a users diary for the current day
app.put("/users/:id/diary", async (req, res) => {
  try {
    const { id } = req.params;
    const { protein_consumed, calories_consumed, water_consumed, notes } =
      req.body;
    const plan = await pool.query("SELECT * FROM plan WHERE user_id = $1", [
      id,
    ]);
    const planId = plan.rows[0].id;
    const currentDate = new Date().toISOString().slice(0, 10);
    await pool.query(
      "UPDATE diary SET protein_consumed = $1, calories_consumed = $2, water_consumed = $3, notes = $4 WHERE plan_id = $5 AND day = $6",
      [
        protein_consumed,
        calories_consumed,
        water_consumed,
        notes,
        planId,
        currentDate,
      ]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.json({ success: false });
  }
});

// Create a meal for a user (updating diary table)
app.post("/users/:id/meals", async (req, res) => {
  try {
    const { id } = req.params;
    const { info, type_of_meal } = req.body;
    // First, get the plan for the specified user
    const planResult = await pool.query(
      "SELECT id FROM plan WHERE user_id = $1",
      [id]
    );
    const plan = planResult.rows[0];

    // Next, create the meal
    const mealResult = await pool.query(
      "INSERT INTO meal (info) VALUES ($1) RETURNING id",
      [info]
    );
    const meal = mealResult.rows[0];

    // Get the current date
    const currentDate = new Date();

    // Connect the meal to the diary for the current date and the specified plan
    const diaryResult = await pool.query(
      "INSERT INTO diary_meal (diary_id, meal_id, type_of_meal) VALUES ((SELECT id FROM diary WHERE plan_id = $1 AND day = $2), $3, $4)",
      [plan.id, currentDate, meal.id, type_of_meal]
    );
    // Update the diary with the calories, protein, and water consumed from the meal
    await pool.query(
      "UPDATE diary SET calories_consumed = calories_consumed + $1, protein_consumed = protein_consumed + $2 WHERE plan_id = $3 AND day = $4",
      [info.calories, info.protein, plan.id, currentDate]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.json({ success: false });
  }
});

// Get a users meals for the current day
app.get("/users/:id/meals", async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await pool.query("SELECT * FROM plan WHERE user_id = $1", [
      id,
    ]);
    const planId = plan.rows[0].id;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    const meals = await pool.query(
      "SELECT meal_id, type_of_meal, info FROM diary_meal INNER JOIN meal ON diary_meal.meal_id = meal.id WHERE diary_id = (SELECT id FROM diary WHERE plan_id = $1 AND day = $2)",
      [planId, formattedDate]
    );
    res.json(meals.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Create exercise for a user for the current day
app.post("/users/:id/exercises", async (req, res) => {
  try {
    const { id } = req.params;
    const { info } = req.body;
    // First, get the plan for the specified user
    const planResult = await pool.query(
      "SELECT id FROM plan WHERE user_id = $1",
      [id]
    );
    const plan = planResult.rows[0];

    // Next, create the exercise
    const exerciseResult = await pool.query(
      "INSERT INTO exercise (info) VALUES ($1) RETURNING id",
      [info]
    );
    const exercise = exerciseResult.rows[0];

    // Get the current date
    const currentDate = new Date();

    // Connect the exercise to the diary for the current date and the specified plan
    const diaryResult = await pool.query(
      "INSERT INTO diary_exercise (diary_id, exercise_id, time) VALUES ((SELECT id FROM diary WHERE plan_id = $1 AND day = $2), $3, $4)",
      [plan.id, currentDate, exercise.id, currentDate]
    );

    // Update the diary with the calories spent in the exercise
    await pool.query(
      "UPDATE diary SET calories_consumed = calories_consumed - $1 WHERE plan_id = $2 AND day = $3",
      [info.calories_spent, plan.id, currentDate]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.json({ success: false });
  }
});

// Get a users exercises for the current day
app.get("/users/:id/exercises", async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await pool.query("SELECT * FROM plan WHERE user_id = $1", [
      id,
    ]);
    const planId = plan.rows[0].id;
    const currentDate = new Date().toISOString().slice(0, 10);
    const exercises = await pool.query(
      "SELECT exercise_id, to_char(time, 'YYYY-MM-DD HH24:MI:SS') as time, info FROM diary_exercise INNER JOIN exercise ON diary_exercise.exercise_id = exercise.id WHERE diary_id = (SELECT id FROM diary WHERE plan_id = $1 AND day = $2)",
      [planId, currentDate]
    );
    res.json(exercises.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Get weight indicators for a user
app.get("/users/:id/weight-indicators", async (req, res) => {
  try {
    const { id } = req.params;
    const weightIndicators = await pool.query(
      "SELECT info FROM weight_indicators WHERE user_id = $1",
      [id]
    );
    res.json(weightIndicators.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Update exercise with exercise id
app.put("/exercises/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { info } = req.body;
    await pool.query("UPDATE exercise SET info = $1 WHERE id = $2", [info, id]);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

// Delete exercise with exercise id
app.delete("/exercises/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM exercise WHERE id = $1", [id]);
    res.json({ message: "Exercise deleted successfully" });
  } catch (err) {
    console.error(err.message);
  }
});

// Update meal info and type_of_meal with meal id
app.put("/meals/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { info, type_of_meal } = req.body;
    // Update the meal
    const mealResult = await pool.query(
      "UPDATE meal SET info = $1 WHERE id = $2",
      [info, id]
    );
    // Update the type_of_meal in diary_meal
    const diaryResult = await pool.query(
      "UPDATE diary_meal SET type_of_meal = $1 WHERE meal_id = $2",
      [type_of_meal, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.json({ success: false });
  }
});

// Delete meal with meal id (updating the diary)
app.delete("/meals/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Get the meal's nutrition information
    const mealResult = await pool.query(
      "SELECT info, diary_id, type_of_meal FROM meal JOIN diary_meal ON meal.id = diary_meal.meal_id WHERE meal.id = $1",
      [id]
    );
    const meal = mealResult.rows[0];

    // Delete the meal from the database
    await pool.query("DELETE FROM meal WHERE id = $1", [id]);

    // Update the diary with the calories and protein consumed from the deleted meal
    await pool.query(
      "UPDATE diary SET calories_consumed = calories_consumed - $1, protein_consumed = protein_consumed - $2 WHERE id = $3",
      [meal.info.calories, meal.info.protein, meal.diary_id]
    );

    res.json({ message: "Meal deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.json({ message: "Failed to delete meal" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
