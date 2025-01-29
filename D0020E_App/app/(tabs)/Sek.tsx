import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import React from 'react';


function TeamChBtn({ title, onPress, style }) {
  return (
    <TouchableOpacity style={[styles.teamChangeButton, style]} onPress={onPress}>
      <Text style={styles.teamButtonTxt}>{title}</Text>
    </TouchableOpacity>
  );
}
function PlayerBtn({ title, onPress, style }) {
  return (
    <TouchableOpacity style={[styles.playerButton, style]} onPress={onPress}>
      <Text style={styles.teamButtonTxt}>{title}</Text>
    </TouchableOpacity>
  );
}

export default function Tab() {
  return (
    <View style={[styles.container, { flexDirection: 'column' }]}>
      <View style={{ flex: 1, backgroundColor: 'lightgrey' }}>
        <Text style={{ textAlign: "left", textAlignVertical: 'bottom'}}>
          Hello world</Text>
      </View>
      
      <View style={{ flex: 2, backgroundColor: 'grey', flexDirection: 'row' }}>
       
       
       
       
        {/* Left Section for home players */}
        <View style={[styles.teamPlayers, { backgroundColor: 'grey', alignItems: 'center' }]}>
          {/*Button to change players */}
          <TeamChBtn 
            title="Byte" 
            onPress={() => Alert.alert('Button Pressed', 'You clicked the Byte button!')} 
            style={{ backgroundColor: 'purple', paddingVertical: 5 }}
          />

          {/* First Four Buttons for players on the court*/}
          {Array.from({ length: 2 }).map((_, rowIndex) => (
            <View
              key={rowIndex}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '80%',
                marginVertical: '2%',
              }}
            >
              <PlayerBtn
                title={`P${rowIndex * 2 + 1}`}
                onPress={() => Alert.alert('Button Pressed', `You clicked Player ${rowIndex * 2 + 1}!`)}
                style={styles.playerButton}
              />
              <PlayerBtn
                title={`P${rowIndex * 2 + 2}`}
                onPress={() => Alert.alert('Button Pressed', `You clicked Player ${rowIndex * 2 + 2}!`)}
                style={styles.playerButton}
              />
            </View>
          ))}

          {/* Middle Single Button, player on court*/}
          <View style={{ width: '80%', marginVertical: '2%', alignItems: 'center' }}>
            <PlayerBtn
              title="P5"
              onPress={() => Alert.alert('Button Pressed', 'You clicked Player 5!')}
              style={styles.playerButton}
            />
          </View>

          {/* Next Six Buttons players on the bench */}
          {Array.from({ length: 3 }).map((_, rowIndex) => (
            <View
              key={rowIndex}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '80%',
                marginVertical: '2%',
              }}
            >
              <PlayerBtn
                title={`P${rowIndex * 2 + 6}`}
                onPress={() => Alert.alert('Button Pressed', `You clicked Player ${rowIndex * 2 + 6}!`)}
                style={styles.playerButton}
              />
              <PlayerBtn
                title={`P${rowIndex * 2 + 7}`}
                onPress={() => Alert.alert('Button Pressed', `You clicked Player ${rowIndex * 2 + 7}!`)}
                style={styles.playerButton}
              />
            </View>
          ))}

          {/* Bottom Button , last player on bench*/}
          <View style={{ width: '80%', marginVertical: '2%', alignItems: 'center' }}>
            <PlayerBtn
              title="P12"
              onPress={() => Alert.alert('Button Pressed', 'You clicked Player 12!')}
              style={styles.playerButton}
            />
          </View>
        </View>



        
        {/* middle Section still in progress */}
        <View style={[styles.teamPlayers, { backgroundColor: 'black' }]}></View>
        
        {/* Right Section is for the away team */}
        <View style={[styles.teamPlayers, { backgroundColor: 'grey' }]}>
          <TeamChBtn 
            title="Byte" 
            onPress={() => Alert.alert('Button Pressed', 'You clicked the Byte button!')} 
            style={{ backgroundColor: 'purple', paddingVertical: 5 }}
          />
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  teamPlayers: {
    paddingVertical: '5%',
    paddingHorizontal: '5%',
    flex: 1,
  },
  teamChangeButton: {
    top:0,
    position: 'absolute',
    borderRadius: 3,
    backgroundColor: 'blue',
    alignSelf: 'center',
    paddingHorizontal: "20%", 
    paddingVertical: "10%", 
  },
  teamButtonTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerButton:{
    backgroundColor: 'blue',
    width: '15%', // Square button
    aspectRatio: 1, // Ensures square shape
    marginVertical: '1%',
  }
});
