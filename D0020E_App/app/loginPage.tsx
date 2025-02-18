import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, Pressable, Button, GestureResponderEvent } from 'react-native';
import { router, useNavigation } from 'expo-router';
import * as yup from 'yup';
import { Formik, FormikHelpers, FormikValues } from 'formik';
import { navigate } from 'expo-router/build/global-state/routing';
import Axios from 'axios'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const loginSchema = yup.object().shape({
  email: yup
    .string()
//    .email('Vänligen ange en giltlig e-post')
    .required('Ange E-post'),
  passwd: yup
    .string()
    .min(4, ({ min }) => 'Passwd must be at least ${min} chars')
    .required('Ange lösenord'),
})
function LogoPic() {
  let fileuri = require("../assets/images/BuzzLogo.png");
  return (
    <Image style={styles.logo} source={fileuri} />
  );
}

interface LoginValues {
  email: string;
  passwd: string;
}

export default function loginpage() {
  // const { token, user, saveToken, saveUser } = useAuth();
  const nav = useNavigation();
  const handlSubmit = async (values: LoginValues) => {
    console.log("Login:", values)
    try {
      const response = await axios.post("https://api.bnh.dust.ludd.ltu.se/api/auth/",
        { 
          username: values.email,
          password: values.passwd,
        },
        {
          headers: {
            "content-type": "application/json",
          }
        }
        
      );

      const tokenToString = JSON.stringify(response.data.token);
      console.log("Login ok:", tokenToString)
      await AsyncStorage.setItem("userToken", tokenToString);
      console.log("Token saved")
      

    } catch(error){
      if (error instanceof Error) {
        console.error("Denied: Generic", error.message);
      } else if (axios.isAxiosError(error)) {
        console.error("Denied: Axios", error.message)
      }
      throw error;
    }
  } 

  return (
    <View style={styles.container}>
      <LogoPic></LogoPic>
      <Text style={styles.title}>Logga in</Text>
      <Formik
        validationSchema={loginSchema}
        initialValues={{ email: '', passwd: '' }}
        onSubmit={values => handlSubmit(values)}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isValid,
        }) => (
          <>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input}
                placeholder="E-post"
                keyboardType="email-address"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              ></TextInput>
            </View>
            {errors.email && touched.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
            <View style={styles.inputContainer}>
              <TextInput style={styles.input}
                placeholder="Lösenord"
                keyboardType="default"
                secureTextEntry
                onChangeText={handleChange('passwd')}
                onBlur={handleBlur('passwd')}
                value={values.passwd}
              ></TextInput>
            </View>
            {errors.passwd && touched.passwd && (
              <Text style={styles.errorText}>{errors.passwd}</Text>
            )}

            <TouchableOpacity
              style={styles.button}
              // onPress={()=> nav.navigate()}
              disabled={!isValid}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit as (e?: GestureResponderEvent) => void}
              disabled={!isValid}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </>

        )
        }
      </Formik>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#bcbcbc',
    width: '100%',

  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    height: 50,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: '100%',
  },
  errorText: {
    color: 'red',
    alignSelf: 'auto',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  button: {
    width: '50%',
    height: 50,
    backgroundColor: '#1E90FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    height: 300,
    width: 400,
    resizeMode: "contain",
    marginBottom: 0,
  }
});
