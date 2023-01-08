import { Formik } from "formik";
import * as yup from "yup";
import {
  TextInput,
  View,
  Button,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUser } from "../api/users";

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, "Name must contain at least 3 letters")
    .required("Name is required"),
  gender: yup.string().required("Gender is required"),
  date_of_birth: yup
    .string()
    .required("Date of birth is required")
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      "Date of birth must be in the format YYYY-MM-DD"
    ),
  weight: yup.number().required("Weight is required"),
  height: yup.number().required("Height is required"),
  physical_activity_level: yup
    .string()
    .required("Physical activity level is required"),
  goal_weight: yup.number().required("Goal weight is required"),
});

const Form = ({ setSubmittedForm, setUser }) => {
  return (
    <ScrollView>
      <View style={styles.container}>
        <Formik
          initialValues={{
            name: "",
            gender: "M",
            date_of_birth: "",
            weight: "",
            height: "",
            physical_activity_level: "1.2",
            goal_weight: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            const storeData = async (value) => {
              try {
                const userData = await createUser(value);
                await AsyncStorage.setItem("@user_id", userData.id);
                setUser(userData);
                console.log("Data saved:", value);
              } catch (e) {
                console.log(e);
              }
            };
            storeData(values).then(() => {
              setSubmittedForm(true);
            });
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.form}>
              <TextInput
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
                placeholder="Name"
                style={styles.input}
              />
              {errors.name && touched.name && <Text style={styles.error}>{errors.name}</Text>}
              <View style={styles.picker}>
                <Picker
                  selectedValue={values.gender}
                  onValueChange={(itemValue) =>
                    handleChange("gender")(itemValue)
                  }
                >
                  <Picker.Item label="Male" value="M" />
                  <Picker.Item label="Female" value="F" />
                </Picker>
              </View>
              {errors.gender && touched.gender && <Text style={styles.error}>{errors.gender}</Text>}
              <TextInput
                onChangeText={handleChange("date_of_birth")}
                onBlur={handleBlur("date_of_birth")}
                value={values.date_of_birth}
                placeholder="Date of birth (YYYY-MM-DD)"
                style={styles.input}
              />
              {errors.date_of_birth && touched.date_of_birth && (
                <Text style={styles.error}>{errors.date_of_birth}</Text>
              )}
              <TextInput
                onChangeText={handleChange("weight")}
                onBlur={handleBlur("weight")}
                value={values.weight}
                placeholder="Weight (kg)"
                keyboardType="numeric"
                style={styles.input}
              />
              {errors.weight && touched.weight && <Text style={styles.error}>{errors.weight}</Text>}
              <TextInput
                onChangeText={handleChange("height")}
                onBlur={handleBlur("height")}
                value={values.height}
                placeholder="Height (cm)"
                keyboardType="numeric"
                style={styles.input}
              />
              {errors.height && touched.height && <Text style={styles.error}>{errors.height}</Text>}
              <View style={styles.picker}>
                <Picker
                  selectedValue={values.physical_activity_level}
                  onValueChange={(itemValue) =>
                    handleChange("physical_activity_level")(itemValue)
                  }
                >
                  <Picker.Item label="Sedentary" value={"1.2"} />
                  <Picker.Item label="Lightly Active" value={"1.375"} />
                  <Picker.Item label="Very Active" value={"1.725"} />
                  <Picker.Item label="Extra Active" value={"1.9"} />
                </Picker>
              </View>
              {errors.physical_activity_level &&
                touched.physical_activity_level && (
                  <Text style={styles.error}>{errors.physical_activity_level}</Text>
                )}
              <TextInput
                onChangeText={handleChange("goal_weight")}
                onBlur={handleBlur("goal_weight")}
                value={values.goal_weight}
                placeholder="Goal Weight (kg)"
                keyboardType="numeric"
                style={styles.input}
              />
              {errors.goal_weight && touched.goal_weight && (
                <Text style={styles.error}>{errors.goal_weight}</Text>
              )}
              <Button onPress={handleSubmit} title="Submit" />
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  form: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    width: "80%",
    maxWidth: 300,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 10,
  },
  error: {
    color: "red",
  },
});

export default Form;
