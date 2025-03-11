import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Axios from "axios";
import {useEffect, useState} from "react";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "lightgray"
  },
  box: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: "20%",
    width: "90%",
    marginTop: 2,
    backgroundColor: "#1E90FF",
    marginBottom: 60,
    borderRadius: 20,
  },
  box1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: "20%",
    width: "90%",
    marginTop: 2,
  },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  title2Text:{
    fontSize: 32,
    fontWeight: "bold",
    color: "black"
  },
});
const getUser = async () : Promise<string|null> => {
  const klubbNamn = await AsyncStorage.getItem("userName");
  return klubbNamn;
}

export default function welcomeScreen() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userName = await getUser();
      setUser(userName);
    };

    fetchUser();
  }, []);

  return(
  <View
  style={styles.container}
  >
    <View style={styles.box1}>
      <Text style={styles.title2Text}>Välkommen, {user}</Text>
    </View>
    <Pressable
        style={styles.box}
        onPress={() => router.push("/(tabs)/(index)/clubbView")}
    >
      <Text style={styles.titleText}>Se dina lag</Text>
    </Pressable>
    <View style={styles.box}>
      <Text style={styles.titleText}>Se matchstatestik</Text>
    </View>

  </View>
  )
}
