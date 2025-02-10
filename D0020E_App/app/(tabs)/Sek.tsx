import React, {useState} from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, TouchableOpacityProps, ScrollView } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';

// Define TypeScript interfaces for props
interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  style?: object;
}



const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, style }) => {
  
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const PlayerButtons: React.FC<{ start: number; end: number; toggleShow: () => void }> = ({ start, end, toggleShow }) => {
  const players = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  return (
    <>
      {players.map((player, index) => {
        if (index % 2 === 0) {
          return (
            <View
              key={player}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                //width: '70%',
                flex:1,
                marginVertical: '2%',
                marginHorizontal:'2%',
              }}
            >
              <CustomButton
                title={`P${player}`}
                onPress={() => {
                  if (player >= 1 && player <= 4) toggleShow(); 
                }}
                style={styles.playerButton}
              />
              {players[index + 1] && (
                <CustomButton
                  title={`P${players[index + 1]}`}
                  onPress={() => {
                    if (players[index + 1] >= 1 && players[index + 1] <= 4) toggleShow(); 
                  }}
                  style={styles.playerButton}
                />
              )}
            </View>
          );
        }
        return null;
      })}
    </>
  );
};

const PointButtons: React.FC<{ start: number; end: number;toggleShow: () => void }> = ({ start, end, toggleShow }) => {
  const points = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '70%',marginHorizontal:'8%',}}>
      {points.map((point) => (
        <CustomButton
          key={point}
          title={`${point} Point`}
          onPress={() => toggleShow()}
          style={styles.playerButton}
        />
      ))}
    </View>
  );
};

const Tab: React.FC = () => {
  const[show, setShow]=useState(false);
  const toggleShow = () => setShow(!show);
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[styles.container, { flexDirection: 'column' }]}>
        <View style={{ flex: 3, backgroundColor: 'lightgrey' }}>
          <Text style={{ textAlign: "left", textAlignVertical: 'bottom' }}>Hello world</Text>
        </View>
        <View style={styles.buttonBox}>

          {/* Left Section for home players */}
          <View style={[styles.teamPlayers, { backgroundColor: 'grey', alignItems: 'center' }]}>
            
            {/*Button the change players */}
            <CustomButton
              title="Byte"
              onPress={() => Alert.alert('Button Pressed', 'You clicked byte')}
              style={{ backgroundColor: 'purple', paddingVertical: 5, top: 0, position: 'absolute', }}
            />

            
            {/* First Four Buttons for players on the court */}
            <PlayerButtons start={1} end={4} toggleShow={toggleShow}/>

            {/* Middle Single Button, player on court */}
            <View style={{ flex:1, marginVertical: '2%',marginHorizontal:'2%', alignItems: 'center' }}>
              <CustomButton
                title="P5"
                onPress={toggleShow}
                style={styles.playerButton}
              />
              
            </View>
            
            {/* Next Six Buttons for players on the bench */}
            <PlayerButtons start={6} end={11} toggleShow={()=>{}}/>

            {/* Bottom Button, last player on bench */}
            <View style={{ flex:1, marginVertical: '2%', marginHorizontal:'2%', alignItems: 'center' }}>
              <CustomButton
                title="P12"
                onPress={() => Alert.alert('Button Pressed', 'You clicked Player 12!')}
                style={styles.playerButton}
              />
            </View>
          </View>

          {/* Middle Section still in progress */}
          <View style={[styles.teamPlayers, { backgroundColor: 'black' }]}>
            {show && <ActionView />}
          </View>

          {/* Right Section is for the away team */}
          <View style={[styles.teamPlayers, { backgroundColor: 'grey' }]}>
            <CustomButton
              title="Byte"
              onPress={() => Alert.alert('Button Pressed', 'You clicked the Byte button!')}
              style={{ backgroundColor: 'purple', paddingVertical: 5 }}
            />
          </View>
        </View>
        
      </View>
    </ScrollView>
  );
};


const ActionView: React.FC  =()=>{
  const[show, setShow]=useState(false);
  const toggleShow = () => setShow(!show);

  return(
    <View style={styles.actionWindowView}>
      
      {/*Knapp för poäng 1-3 */}
      <View >
        <PointButtons start={1} end={3} toggleShow={toggleShow}/>
      </View>

      {/*Knapp för fouls */}
      <View style={{justifyContent: 'space-between', width: '70%', alignSelf: 'center',}}>
        <CustomButton
            title={'FOUL'}
            onPress={() => setShow(false)}
            style={styles.playerButton}
          />
      </View>
      
    </View>
  )
}


//https://stackoverflow.com/questions/68494075/how-can-i-make-a-button-change-what-components-are-showing-in-react-native
//Link for action buttens. open up a new view


const styles = StyleSheet.create({
  container: {
    flex: 1,    
    borderWidth: 2,
    borderColor: "yellow"
  },
  teamPlayers: {
    paddingVertical: '5%',
    paddingHorizontal: '5%',
    flex: 1,
  },
  button: {
    borderRadius: 3,
    backgroundColor: 'blue',
    alignSelf: 'center',
    paddingHorizontal: "20%",
    paddingVertical: "10%",
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  playerButton: {
    backgroundColor: 'blue',
    width: '15%', // Square button
    aspectRatio: 1, // Ensures square shape
    marginVertical: '1%',
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonBox: {
    flex: 2,
    backgroundColor: "gray",
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "red",
  },
  actionWindowView:{
    flexDirection: 'column',
    width: '120%',
    height: '45%',
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 10,
    position: 'absolute',
    top: 0, // Centers vertically
    alignSelf: 'center', // Centers horizontally
    transform: [{ translateY: -80 }], // Adjusts for exact centering
  }
});

export default Tab;