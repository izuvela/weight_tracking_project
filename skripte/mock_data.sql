INSERT INTO "user" (name, gender, height, weight, date_of_birth, physical_activity_level, goal_weight)
VALUES
  ('Ivan', 'M', 177.5, 77, '2000-01-31', 1.2, 72),
  ('Marija', 'F', 165, 55, '1985-06-15', 1.375, 57),
  ('Mirko', 'M', 190, 95, '1988-03-20', 1.55, 88),
  ('Smiljana', 'F', 175, 70, '1993-09-05', 1.2, 65),
  ('Krešo', 'M', 180, 80, '1987-11-11', 1.2, 75);
 
 INSERT INTO exercise (info) VALUES
('{"name": "Run", "duration": 30, "calories_spent": 300}'),
('{"name": "Yoga", "duration": 60, "calories_spent": 200}'),
('{"name": "Weight lifting", "duration": 45, "calories_spent": 400}'),
('{"name": "Swimming", "duration": 30, "calories_spent": 350}'),
('{"name": "Cycling", "duration": 45, "calories_spent": 450}');

INSERT INTO meal (info) VALUES
('{"name": "Eggs and toast", "calories": 300, "protein": 15, "fat": 10, "carbohydrates": 35}'),
('{"name": "Salad with grilled chicken", "calories": 400, "protein": 25, "fat": 15, "carbohydrates": 25}'),
('{"name": "Sushi", "calories": 500, "protein": 20, "fat": 10, "carbohydrates": 50}'),
('{"name": "Burger and fries", "calories": 700, "protein": 30, "fat": 20, "carbohydrates": 60}'),
('{"name": "Pizza", "calories": 600, "protein": 25, "fat": 15, "carbohydrates": 55}');