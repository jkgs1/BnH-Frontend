import * as yup from "yup";
import {GestureResponderEvent, Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import React from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {router} from "expo-router";
import {Formik} from "formik";

const loginSchema = yup.object().shape({
    email: yup
        .string()
        .email('Vänligen ange en giltlig e-post')
        .required('Ange en giltlig E-post'),
    username: yup
        .string()
        .required('Ange ett användarnamn'),
    passwd: yup
        .string()
        .min(4, ({ min }) => 'Passwd must be at least 4 chars')
        .required('Ange ett lösenord'),
    confirmPassword: yup
        .string()
        .required("Vänligen bekräfta lösenord")

})
function LogoPic() {
    let fileuri = require("../assets/images/BuzzLogo.png");
    return (
        <Image style={styles.logo} source={fileuri} />
    );
}

interface LoginValues {
    email: string;
    username: string;
    passwd: string;
    confirmPassword: string;
}
export default function Signup() {
    const handlSubmit = async (values: LoginValues) => {
        console.log("Signup:", values)
        try {
            {/* TODO: Add actuall api */}
            const response = await axios.post("https://api.bnh.dust.ludd.ltu.se/api/auth/",
                {
                    email: values.email,
                    username: values.username,
                    password: values.passwd,
                    confirmPassword: values.confirmPassword
                },
                {
                    headers: {
                        "content-type": "application/json",
                    }
                }

            );


            const tokenToString = response.data.token;
            console.log("Signup ok:", tokenToString)
            await AsyncStorage.setItem("userToken", tokenToString);
            console.log("Token saved")
            router.push("/");


        } catch(error){
            if (error instanceof Error) {
                console.error("Denied: Generic", error.message);
            } else if (axios.isAxiosError(error)) {
                console.error("Denied: Axios", error.message)
            }
            throw error;
        }
    }

    return(
        <View style={styles.container}>
            <LogoPic></LogoPic>
            <Text style={styles.title}>Skapa ett konto</Text>
            <Formik
                validationSchema={loginSchema}
                initialValues={{ email: '', passwd: '', username:'', confirmPassword: '', }}
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
                                       placeholder="Användarnamn"
                                       keyboardType="default"
                                       onChangeText={handleChange('username')}
                                       onBlur={handleBlur('username')}
                                       value={values.username}
                            ></TextInput>
                        </View>
                        {errors.username && touched.username && (
                            <Text style={styles.errorText}>{errors.username}</Text>
                        )}
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

                        <View style={styles.inputContainer}>
                            <TextInput style={styles.input}
                                       placeholder="Bekräfta lösenord"
                                       keyboardType="default"
                                       secureTextEntry
                                       onChangeText={handleChange('confirmPassword')}
                                       onBlur={handleBlur('confirmPassword')}
                                       value={values.confirmPassword}
                            ></TextInput>
                        </View>
                        {errors.confirmPassword && touched.confirmPassword && (
                            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                        )}

                        <TouchableOpacity
                            style={styles.button}
                            onPress={()=> router.push("/loginPage")}
                            disabled={!isValid}
                        >
                            <Text style={styles.buttonText}>Jag har redan ett konto</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSubmit as (e?: GestureResponderEvent) => void}
                            disabled={!isValid}
                        >
                            <Text style={styles.buttonText}>Skapa konto</Text>
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
    buttonTextSignUp:{
        color:"#1E90FF",
        fontSize:18,
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