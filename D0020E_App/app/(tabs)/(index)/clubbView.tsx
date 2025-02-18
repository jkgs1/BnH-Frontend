import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';

interface Team {
  id: number;
  name: string;
  logo: string | null;
  description: string;
  club: string | null;
  players: [];
}

export default function Tab() {
  const [teams, setTeams] = useState<Team[]>([]); // State to store fetched teams
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const router = useRouter();

  // Fetch teams from the API
  const getTeamsfromApi = async () => {
    const tokenString = await AsyncStorage.getItem('userToken');
    if (!tokenString) {
      console.error('No token found');
      alert('No token found');
      router.push('/loginPage');
      return;
    }
    try {
      setLoading(true);
      const response = await Axios({
        url: '/api/clubber/clubs/5/teams/',
        method: 'get',
        baseURL: 'https://api.bnh.dust.ludd.ltu.se/',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${tokenString}`, // Add token to the Authorization header
        },
      });

      // Assuming response.data contains the team data
      if (response.data && Array.isArray(response.data)) {
        setTeams(response.data);
      } else {
        console.error('Invalid response data:', response.data);
        setError('Invalid data received from the server.');
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError('Failed to fetch teams. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch teams when the component mounts
  useEffect(() => {
    getTeamsfromApi();
  }, []);

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
            <Text style={styles.titleText}>Club Name</Text>
          </View>
          <View style={styles.teamList}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                renderTeams()
            )}
          </View>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "gray"
  },
  mainBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: "black",
    borderWidth: 2,

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
    height: "30%",
    backgroundColor: "white"
  },
  teamList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    paddingBottom: 2,
    width: '100%',
    height: 'auto',
    borderWidth: 2,
    borderColor: 'black',
    flexDirection: 'column',
  },
  teamBox:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "red",
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
