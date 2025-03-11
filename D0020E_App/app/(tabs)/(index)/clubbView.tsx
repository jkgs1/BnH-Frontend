import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView} from 'react-native';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import {getTeamsfromApi, Team} from "@/app/getTeamsapi";

const getUser = async () : Promise<string|null> => {
  const klubbNamn = await AsyncStorage.getItem("userName");
  return klubbNamn;
}

const Tab: React.FC = () => {

  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userName = await getUser();
      setUser(userName);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getTeamsfromApi();
      if (result) {
        setTeams(result)
      }
    }
    fetchData();
  },[]);

  // Render teams dynamically
  const renderTeams = () => {
    console.log(teams)
    return teams.map((team) => (
        <Link key={team.id} href={`/team/${team.id}`} asChild>
          <TouchableOpacity style={styles.teamBox}>
            <Text style={styles.teamName}>{team.name}</Text>
            <Text style={styles.teamDescription}>{team.description}</Text>
          </TouchableOpacity>
        </Link>
    ));
  };

  return (
      <View style={styles.container}>
        <View style={styles.mainBox}>
          <View style={styles.titleBox}>
            <Text style={styles.titleText}>Inloggad som {user}</Text>

          </View>
          <View style={styles.teamList}>
            {renderTeams()}
          </View>

        </View>
      </View>
  );
}
export default function welcomeScreen() {
  return(
      <Tab />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  mainBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',


    width: "70%",
    height: "70%",
    padding: 2,
    flexDirection: "column"
  },
  titleBox: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 4,
    width: "100%",
    height: "20%",

  },
  teamList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingBottom: 2,
    width: '100%',
    height: 'auto',

    flexDirection: 'column',
    gap:2
  },
  teamBox:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "white",
    paddingBottom: 2,
    width: "100%",
    height: "auto",
    borderWidth: 2,
    borderColor: "black",
    flexDirection: "column",
  },
  titleText: {
    fontSize: 32,
    fontWeight: "normal",
    color: "black"
  },
  teamName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
  },
  teamDescription: {
    fontSize: 26,
    fontWeight: "normal",
    color: "black"
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },

});
