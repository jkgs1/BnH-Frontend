import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from 'expo-router';
import * as yup from 'yup';
import { Formik } from 'formik';

/* npm install yup, npm install formik 
   yup is used for schema validation, formik is used for 
*/


export default function Tab() {
  return (
    <View style={styles.container}>
      <Text>Tab [Home|Settings]</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
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
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#1E90FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Enter email')
    .required('Email is required'),
  passwd: yup
    .string()
    .min(4, ({ min }) => 'Passwd must be at least ${min} chars')
    .required('Passwd req'),
})

export function loginpage(){
  /* const { token, user, saveToken, saveUser } = useAuth();
  const nav = useNav(); */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Formik
        validationSchema={loginSchema}
        initialValues={{ email: 'Enter email here', passwd: 'Enter passwd here'}}
        onSubmit={async (values) => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          alert(JSON.stringify(values, null, 2));
        }}
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
                onChangeText={handleChange('lösen')}
                onBlur={handleBlur('lösen')}
                value={values.passwd}
                ></TextInput>
              </View>
              {errors.passwd && touched.passwd && (
                <Text style={styles.errorText}>{errors.passwd}</Text>
              )}
              <TouchableOpacity
              style={styles.button}
              onPress={(handleSubmit)=>{''}}
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
