import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, TextInput, Alert} from 'react-native';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import {getTeamsfromApi, Team} from "@/app/getTeamsapi";

const getUser = async () : Promise<string|null> => {
  const klubbNamn = await AsyncStorage.getItem("userName");
  return klubbNamn;
}
const addTeamToDB = async (teamName:string, teamDescription:string, ): Promise<boolean> => {
  const tokenString = await AsyncStorage.getItem('userToken');
  if (!tokenString) {
    console.error('No token found');
    alert('No token found');
    return false;
  }
  {/* Add a new player */}
  try {
    const response = await Axios({
      url: `/api/clubber/teams/`,
      method: 'post',
      baseURL: 'https://api.bnh.dust.ludd.ltu.se/',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${tokenString}`,
      },
      data: {
        name: teamName,
        description: teamDescription,
      }
    });
    return true;
  } catch (error) {
    console.log("Could not add team to DB");
    return false;
  }
};

const Tab: React.FC = () => {

  const [teams, setTeams] = useState<Team[]>([]);
  const [user, setUser] = useState<string | null>(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");

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

  const handleAddTeam = async () => {
    const addOK = await addTeamToDB(newTeamName, newTeamDescription)
    if(addOK){
      Alert.alert('Success', 'Team added successfully!');
      const reload = await getTeamsfromApi();
      setNewTeamName("")
      setNewTeamDescription("")
    }
  }

  // Render teams dynamically
  const renderTeams = () => {
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
          <ScrollView style={{width:"100%"}}>
            <View style={styles.teamList}>
              {renderTeams()}
            </View>
          </ScrollView>
          <View style={styles.teamSettings}>
            <TextInput
                style={styles.input}
                placeholder="Teamname:"
                value={newTeamName}
                onChangeText={setNewTeamName}
                spellCheck={false}
            />
            <TextInput
                style={styles.input}
                placeholder="Team Description:"
                value={newTeamDescription}
                onChangeText={setNewTeamDescription}
                spellCheck={false}
            />
            <TouchableOpacity style={styles.button} onPress={handleAddTeam}>
              <Text style={styles.buttonText}>Add Team</Text>
            </TouchableOpacity>
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
    alignItems: 'center'
  },
  teamSettings: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4
  },
  button: {
    height: 40,
    backgroundColor: "#007BFF",
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "black",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
    width: "100%",
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
    flexDirection: 'column',
    gap:2,
    height:"auto"
  },
  teamBox:{
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "white",
    paddingBottom: 2,
    width: "100%",
    height: 150,
    borderWidth: 2,
    borderColor: "black",
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
