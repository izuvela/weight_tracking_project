CREATE OR REPLACE FUNCTION insert_weight_indicators_and_plan()
RETURNS TRIGGER AS $$
DECLARE
  bmi decimal;
  bmr integer;
  body_fat_percentage decimal;
  protein_goal decimal;
  calories_goal integer;
  water_goal decimal;
  age integer;
BEGIN
  bmi = ROUND(NEW.weight / (NEW.height/100)^2, 1);
  age = EXTRACT(YEAR FROM NOW()) - EXTRACT(YEAR FROM NEW.date_of_birth);
  bmr = (CASE NEW.gender
         WHEN 'M' THEN ROUND(66 + (13.7 * NEW.weight) + (5 * NEW.height) - (6.8 * age))
         ELSE ROUND(655 + (9.6 * NEW.weight) + (1.8 * NEW.height) - (4.7 * age))
         END);
  body_fat_percentage = ROUND((CASE NEW.gender
                               WHEN 'M' THEN (1.20 * bmi) + (0.23 * age) - 16.2
                               ELSE (1.20 * bmi) + (0.23 * age) - 5.4
                               END), 1);
  protein_goal = ((1 - body_fat_percentage / 100) * NEW.weight) * 1.8;
  calories_goal = bmr * NEW.physical_activity_level;
  if NEW.goal_weight > NEW.weight then
    calories_goal = calories_goal + 200;
  else
    calories_goal = calories_goal - 200;
  end if;
  water_goal = (CASE NEW.gender WHEN 'M' THEN 3.7 ELSE 2.7 END);

  INSERT INTO weight_indicators (id, user_id, info)
  VALUES (gen_random_uuid(), NEW.id, json_build_object(
    'bmi', bmi,
    'bmr', bmr,
    'body_fat_percentage', body_fat_percentage
  ));

  INSERT INTO plan (user_id, protein_goal, calories_goal, water_goal)
  VALUES (NEW.id, protein_goal, calories_goal, water_goal);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_weight_indicators_and_plan_trigger
AFTER INSERT ON "user"
FOR EACH ROW
EXECUTE PROCEDURE insert_weight_indicators_and_plan();

CREATE OR REPLACE FUNCTION update_weight_indicators_and_plan()
RETURNS TRIGGER AS $$
DECLARE
  bmi decimal;
  bmr integer;
  body_fat_percentage decimal;
  protein_goal_value decimal;
  calories_goal_value integer;
  water_goal_value decimal;
  age integer;
BEGIN
  age = EXTRACT(YEAR FROM NOW()) - EXTRACT(YEAR FROM NEW.date_of_birth);
  bmi = ROUND(NEW.weight / (NEW.height/100)^2, 1);
  bmr = (CASE NEW.gender
         WHEN 'M' THEN ROUND(66 + (13.7 * NEW.weight) + (5 * NEW.height) - (6.8 * age))
         ELSE ROUND(655 + (9.6 * NEW.weight) + (1.8 * NEW.height) - (4.7 * age))
         END);
  body_fat_percentage = ROUND((CASE NEW.gender
                               WHEN 'M' THEN (1.20 * bmi) + (0.23 * age) - 16.2
                               ELSE (1.20 * bmi) + (0.23 * age) - 5.4
                               END), 1);
  protein_goal_value = ((1 - body_fat_percentage / 100) * NEW.weight) * 1.8;
  calories_goal_value = bmr * NEW.physical_activity_level;
  if NEW.goal_weight > NEW.weight then
    calories_goal_value = calories_goal_value + 500;
  else
    calories_goal_value = calories_goal_value - 500;
  end if;
  water_goal_value = (CASE NEW.gender WHEN 'M' THEN 3.7 ELSE 2.7 END);

  UPDATE weight_indicators
  SET info = json_build_object(
    'bmi', bmi,
    'bmr', bmr,
    'body_fat_percentage', body_fat_percentage
  )
  WHERE user_id = NEW.id;

  UPDATE plan
  SET protein_goal = protein_goal_value,
      calories_goal = calories_goal_value,
      water_goal = water_goal_value
  WHERE user_id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER update_weight_indicators_and_plan_trigger
AFTER UPDATE ON "user"
FOR EACH ROW
EXECUTE PROCEDURE update_weight_indicators_and_plan();

CREATE OR REPLACE FUNCTION insert_diary_defaults()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO diary (plan_id, day, protein_consumed, calories_consumed, water_consumed, notes)
  VALUES (NEW.id, CURRENT_DATE, 0, 0, 0, '');
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_diary_defaults
AFTER INSERT ON plan
FOR EACH ROW
EXECUTE PROCEDURE insert_diary_defaults();


CREATE OR REPLACE FUNCTION validate_meal_info()
RETURNS TRIGGER AS $$
DECLARE
  info_json JSONB;
BEGIN
  info_json := NEW.info::JSONB;
  
  IF info_json ? 'name' IS NOT TRUE OR info_json->>'name' IS NULL THEN
    RAISE EXCEPTION 'Invalid meal data: name is missing or null';
  END IF;
  IF info_json ? 'calories' IS NOT TRUE OR info_json->>'calories' IS NULL THEN
    RAISE EXCEPTION 'Invalid meal data: calories is missing or null';
  END IF;
  IF info_json ? 'protein' IS NOT TRUE OR info_json->>'protein' IS NULL THEN
    RAISE EXCEPTION 'Invalid meal data: protein is missing or null';
  END IF;
  IF info_json ? 'fat' IS NOT TRUE OR info_json->>'fat' IS NULL THEN
    RAISE EXCEPTION 'Invalid meal data: fat is missing or null';
  END IF;
  IF info_json ? 'carbohydrates' IS NOT TRUE OR info_json->>'carbohydrates' IS NULL THEN
    RAISE EXCEPTION 'Invalid meal data: carbohydrates is missing or null';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_meal_info_trigger
BEFORE INSERT OR UPDATE ON meal
FOR EACH ROW
EXECUTE PROCEDURE validate_meal_info();


