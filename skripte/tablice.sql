CREATE TABLE "user" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name varchar(25) NOT NULL UNIQUE,
  gender varchar(1) NOT NULL,
  height numeric(4,1) NOT NULL,
  weight numeric(4,1) NOT NULL,
  date_of_birth date NOT NULL,
  physical_activity_level numeric NOT NULL,
  goal_weight numeric(4,1) NOT NULL
);

CREATE TABLE weight_indicators (
   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
   user_id UUID REFERENCES "user"(id) ON DELETE CASCADE,
   info JSON NOT NULL 
);

CREATE TABLE plan (
   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
   user_id UUID REFERENCES "user"(id) ON DELETE CASCADE,
   protein_goal INTEGER NOT NULL,
   calories_goal INTEGER NOT NULL,
   water_goal decimal NOT NULL
);

CREATE TABLE diary (
   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
   plan_id UUID REFERENCES plan(id) ON DELETE CASCADE,
   day DATE DEFAULT CURRENT_DATE NOT NULL,
   protein_consumed INTEGER DEFAULT 0 NOT NULL,
   calories_consumed INTEGER DEFAULT 0 NOT NULL,
   water_consumed INTEGER DEFAULT 0 NOT NULL,
   notes varchar(2000)
);

CREATE TABLE exercise (
   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
   info JSON NOT NULL 
);

CREATE TABLE meal (
   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
   info JSON NOT NULL 
);

CREATE TABLE diary_exercise (
	diary_id UUID REFERENCES diary(id) ON DELETE CASCADE,
	exercise_id UUID REFERENCES exercise(id) ON DELETE CASCADE,
	time timestamp DEFAULT LOCALTIMESTAMP NOT NULL,
	CONSTRAINT diary_exercise_pkey PRIMARY KEY (diary_id, exercise_id)
);

CREATE TABLE diary_meal (
	diary_id UUID REFERENCES diary(id) ON DELETE CASCADE,
	meal_id UUID REFERENCES meal(id) ON DELETE CASCADE,
	type_of_meal varchar(30) NOT NULL,
	CONSTRAINT diary_meal_pkey PRIMARY KEY (diary_id, meal_id)
);


INSERT INTO "user" (id,"name",gender,height,weight,date_of_birth,physical_activity_level,goal_weight) VALUES
	 ('a0454374-e0b6-4f13-914d-3814e326d79b','Ivan','M',177.5,77.0,'2000-01-31',1.2,72.0),
	 ('93df80f8-c850-4fd4-bb91-6f922d96b115','Marija','F',165.0,55.0,'1985-06-15',1.375,57.0),
	 ('42375a5c-3ef4-47a5-91fa-c50aff774d9f','Mirko','M',190.0,95.0,'1988-03-20',1.55,88.0),
	 ('95141f83-c5f9-4053-9989-4070548a8020','Smiljana','F',175.0,70.0,'1993-09-05',1.2,65.0),
	 ('b66af9fe-e383-4291-95b7-1acb82f0ae5e','Krešo','M',180.0,80.0,'1987-11-11',1.2,75.0);
	
INSERT INTO weight_indicators (id,user_id,info) VALUES
	 ('56e10447-ee29-40e9-aa5e-6f81a2adb820','a0454374-e0b6-4f13-914d-3814e326d79b','{"bmi" : 24.4, "bmr" : 1852, "body_fat_percentage" : 18.4}'),
	 ('226ff8f7-fbed-48f2-86f9-a8900523e5bf','93df80f8-c850-4fd4-bb91-6f922d96b115','{"bmi" : 20.2, "bmr" : 1301, "body_fat_percentage" : 27.6}'),
	 ('6ab0aa91-1bc2-4b1e-841b-86f49b17d807','42375a5c-3ef4-47a5-91fa-c50aff774d9f','{"bmi" : 26.3, "bmr" : 2080, "body_fat_percentage" : 23.4}'),
	 ('9a898b8c-052f-4242-8814-473b4868195b','95141f83-c5f9-4053-9989-4070548a8020','{"bmi" : 22.9, "bmr" : 1501, "body_fat_percentage" : 29.0}'),
	 ('e3713fc5-5a44-47d6-9a2b-afca21b0bb15','b66af9fe-e383-4291-95b7-1acb82f0ae5e','{"bmi" : 24.7, "bmr" : 1817, "body_fat_percentage" : 21.7}');
	
INSERT INTO plan (id,user_id,protein_goal,calories_goal,water_goal) VALUES
	 ('902b1eda-7f1e-474a-b2df-ef49e773ff2e','a0454374-e0b6-4f13-914d-3814e326d79b',113,2022,3.7),
	 ('0d5f8bca-36ce-4996-a56f-c55a3eb15a62','93df80f8-c850-4fd4-bb91-6f922d96b115',72,1989,2.7),
	 ('5cb52775-7ceb-48f7-b203-a3786fd7c8fb','42375a5c-3ef4-47a5-91fa-c50aff774d9f',131,3024,3.7),
	 ('17920a41-1944-4efb-8ee5-2f42542ba258','95141f83-c5f9-4053-9989-4070548a8020',89,1601,2.7),
	 ('6984134d-e4c4-4025-a500-c017be3cb6de','b66af9fe-e383-4291-95b7-1acb82f0ae5e',113,1980,3.7);

INSERT INTO diary (id,plan_id,"day",protein_consumed,calories_consumed,water_consumed,notes) VALUES
	 ('29b4704e-bd83-4747-836e-e2c0d1b17c4a','902b1eda-7f1e-474a-b2df-ef49e773ff2e','2023-01-07',0,0,0,''),
	 ('1c64cfb8-b4d3-47bf-af4b-5b41cb578623','0d5f8bca-36ce-4996-a56f-c55a3eb15a62','2023-01-07',0,0,0,''),
	 ('eae93d7c-0112-40a2-b195-bf51c49f40d1','5cb52775-7ceb-48f7-b203-a3786fd7c8fb','2023-01-07',0,0,0,''),
	 ('9991237d-d8b3-4205-bdb7-8e93067399b0','17920a41-1944-4efb-8ee5-2f42542ba258','2023-01-07',0,0,0,''),
	 ('a834def9-2286-461a-9f64-47ec7b827cc7','6984134d-e4c4-4025-a500-c017be3cb6de','2023-01-07',0,0,0,'');

INSERT INTO meal (id,info) VALUES
	 ('076ce5fb-0265-43f7-bbaf-dcccb52f0929','{"name": "Eggs and toast", "calories": 300, "protein": 15, "fat": 10, "carbohydrates": 35}'),
	 ('2bdc1cc9-f368-4b1a-a264-af435c57b8b9','{"name": "Salad with grilled chicken", "calories": 400, "protein": 25, "fat": 15, "carbohydrates": 25}'),
	 ('1c073465-36fe-4482-9def-bd7c6d52ae76','{"name": "Sushi", "calories": 500, "protein": 20, "fat": 10, "carbohydrates": 50}'),
	 ('607cd6ea-d0de-4fbe-a9b8-75004e877c74','{"name": "Burger and fries", "calories": 700, "protein": 30, "fat": 20, "carbohydrates": 60}'),
	 ('c404c5c1-b3a6-4070-bb82-cec11e036d1a','{"name": "Pizza", "calories": 600, "protein": 25, "fat": 15, "carbohydrates": 55}');

INSERT INTO exercise (id,info) VALUES
	 ('ee7ff749-e88a-4dfd-bdf0-0c8df6e2fa66','{"name": "Run", "duration": 30, "calories_spent": 300}'),
	 ('143639df-5e2d-4d50-9958-319e1b1457f7','{"name": "Yoga", "duration": 60, "calories_spent": 200}'),
	 ('5d05a6ae-f1a3-45f0-9e6f-c06a97aa242a','{"name": "Weight lifting", "duration": 45, "calories_spent": 400}'),
	 ('fd464f5e-81e8-4180-8c58-2171bd8290ec','{"name": "Swimming", "duration": 30, "calories_spent": 350}'),
	 ('f3ced8eb-dc4e-4449-b949-44be38ee26b1','{"name": "Cycling", "duration": 45, "calories_spent": 450}');

INSERT INTO diary_exercise (diary_id, exercise_id, time) VALUES
	('29b4704e-bd83-4747-836e-e2c0d1b17c4a', 'ee7ff749-e88a-4dfd-bdf0-0c8df6e2fa66', '2023-01-07 12:00:00'),
	('1c64cfb8-b4d3-47bf-af4b-5b41cb578623', '143639df-5e2d-4d50-9958-319e1b1457f7', '2023-01-07 15:00:00'),
	('eae93d7c-0112-40a2-b195-bf51c49f40d1', '5d05a6ae-f1a3-45f0-9e6f-c06a97aa242a', '2023-01-07 17:00:00'),
	('9991237d-d8b3-4205-bdb7-8e93067399b0', 'fd464f5e-81e8-4180-8c58-2171bd8290ec', '2023-01-07 19:00:00'),
	('a834def9-2286-461a-9f64-47ec7b827cc7', 'f3ced8eb-dc4e-4449-b949-44be38ee26b1', '2023-01-07 21:00:00');

INSERT INTO diary_meal (diary_id, meal_id, type_of_meal) VALUES
	('29b4704e-bd83-4747-836e-e2c0d1b17c4a', '076ce5fb-0265-43f7-bbaf-dcccb52f0929', 'breakfast'),
	('1c64cfb8-b4d3-47bf-af4b-5b41cb578623', '2bdc1cc9-f368-4b1a-a264-af435c57b8b9', 'lunch'),
	('eae93d7c-0112-40a2-b195-bf51c49f40d1', '1c073465-36fe-4482-9def-bd7c6d52ae76', 'dinner'),
	('9991237d-d8b3-4205-bdb7-8e93067399b0', '607cd6ea-d0de-4fbe-a9b8-75004e877c74', 'snack'),
	('a834def9-2286-461a-9f64-47ec7b827cc7', 'c404c5c1-b3a6-4070-bb82-cec11e036d1a', 'dinner');




