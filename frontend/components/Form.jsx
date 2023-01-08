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

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, "Name must contain at least 3 letters")
    .required("Name is required"),
  gender: yup.string().required("Gender is required"),
  dateOfBirth: yup
    .string()
    .required("Date of birth is required")
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      "Date of birth must be in the format YYYY-MM-DD"
    ),
  weight: yup.number().required("Weight is required"),
  height: yup.number().required("Height is required"),
  physicalActivityLevel: yup
    .string()
    .required("Physical activity level is required"),
  goalWeight: yup.number().required("Goal weight is required"),
});

const Form = ({ setSubmittedForm }) => {
  return (
    <ScrollView>
      <View style={styles.container}>
        <Formik
          initialValues={{
            name: "",
            gender: "M",
            dateOfBirth: "",
            weight: "",
            height: "",
            physicalActivityLevel: "1.2",
            goalWeight: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            const storeData = async (value) => {
              try {
                await AsyncStorage.setItem("@user_name", value);
                console.log("Data saved:", value);
              } catch (e) {
                console.log(e);
              }
            };
            storeData(values.name).then(() => {
              // TODO: submit form to backend, receive response and set state
              setSubmittedForm(true);
              console.log(values);
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
                onChangeText={handleChange("dateOfBirth")}
                onBlur={handleBlur("dateOfBirth")}
                value={values.dateOfBirth}
                placeholder="Date of birth (YYYY-MM-DD)"
                style={styles.input}
              />
              {errors.dateOfBirth && touched.dateOfBirth && (
                <Text style={styles.error}>{errors.dateOfBirth}</Text>
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
                placeholder="Height (m)"
                keyboardType="numeric"
                style={styles.input}
              />
              {errors.height && touched.height && <Text style={styles.error}>{errors.height}</Text>}
              <View style={styles.picker}>
                <Picker
                  selectedValue={values.physicalActivityLevel}
                  onValueChange={(itemValue) =>
                    handleChange("physicalActivityLevel")(itemValue)
                  }
                >
                  <Picker.Item label="Sedentary" value={"1.2"} />
                  <Picker.Item label="Lightly Active" value={"1.375"} />
                  <Picker.Item label="Very Active" value={"1.725"} />
                  <Picker.Item label="Extra Active" value={"1.9"} />
                </Picker>
              </View>
              {errors.physicalActivityLevel &&
                touched.physicalActivityLevel && (
                  <Text style={styles.error}>{errors.physicalActivityLevel}</Text>
                )}
              <TextInput
                onChangeText={handleChange("goalWeight")}
                onBlur={handleBlur("goalWeight")}
                value={values.goalWeight}
                placeholder="Goal Weight (kg)"
                keyboardType="numeric"
                style={styles.input}
              />
              {errors.goalWeight && touched.goalWeight && (
                <Text style={styles.error}>{errors.goalWeight}</Text>
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
