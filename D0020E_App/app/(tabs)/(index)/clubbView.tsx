import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

const clubName = ["Gammelstads Basketbollklubb"]
const team = [
  {
    id: 0,
    text: "Lag1"
  },
  {
    id: 1,
    text: "Lag2"
  },
  {
    id: 2,
    text: "Lag3"
  },
  {
    id: 3,
    text: "Lag4"
  },
  {
    id: 4,
    text: "Lag5"
  },
]
const desc = ["Det här är en beskrivning"]

function renderTeams() {
  return team.map((item) => {
    return(
          <Link 
              key={item.id}
              href={`/team/${item.id}`}
              asChild
          >
            <TouchableOpacity style={styles.teamBox}>
              <Text>{item.text}</Text>
            </TouchableOpacity>
          </Link>
      
    )});
}
export default function Tab() {
  return (
    <View style={styles.container}>
      <View style={styles.mainBox}>
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>{clubName}</Text>
        </View>
        <View style={styles.teamBox}>{renderTeams()}</View>
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
  }
});
