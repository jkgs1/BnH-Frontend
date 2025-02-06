import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, TouchableOpacityProps } from 'react-native';

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

const PlayerButtons: React.FC<{ start: number; end: number }> = ({ start, end }) => {
  const players = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  return (
    <>
      {players.map((player, index) => {
        // Render two buttons per row
        if (index % 2 === 0) {
          return (
            <View
              key={player}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '70%',
                marginVertical: '2%',
              }}
            >
              <CustomButton
                title={`P${player}`}
                onPress={() => Alert.alert('Button Pressed', `You clicked Player ${player}!`)}
                style={styles.playerButton}
              />
              {players[index + 1] && (
                <CustomButton
                  title={`P${players[index + 1]}`}
                  onPress={() => Alert.alert('Button Pressed', `You clicked Player ${players[index + 1]}!`)}
                  style={styles.playerButton}
                />
              )}
            </View>
          );
        }
        return null; // Skip rendering for the second button in the pair
      })}
    </>
  );
};

const Tab: React.FC = () => {
  return (
    <View style={[styles.container, { flexDirection: 'column' }]}>
      <View style={{ flex: 1, backgroundColor: 'lightgrey' }}>
        <Text style={{ textAlign: "left", textAlignVertical: 'bottom' }}>Hello world</Text>
      </View>

      <View style={{ flex: 2, backgroundColor: 'grey', flexDirection: 'row' }}>
        {/* Left Section for home players */}
        <View style={[styles.teamPlayers, { backgroundColor: 'grey', alignItems: 'center' }]}>
          <CustomButton
            title="Byte"
            onPress={() => Alert.alert('Button Pressed', 'You clicked the Byte button!')}
            style={{ backgroundColor: 'purple', paddingVertical: 5, top: 0 ,position: 'absolute',}}
          />

          {/* First Four Buttons for players on the court */}
          <PlayerButtons start={1} end={4} />

          {/* Middle Single Button, player on court */}
          <View style={{ width: '70%', marginVertical: '2%', alignItems: 'center' }}>
            <CustomButton
              title="P5"
              onPress={() => Alert.alert('Button Pressed', 'You clicked Player 5!')}
              style={styles.playerButton}
            />
          </View>

          {/* Next Six Buttons for players on the bench */}
          <PlayerButtons start={6} end={11} />

          {/* Bottom Button, last player on bench */}
          <View style={{ width: '70%', marginVertical: '2%', alignItems: 'center' }}>
            <CustomButton
              title="P12"
              onPress={() => Alert.alert('Button Pressed', 'You clicked Player 12!')}
              style={styles.playerButton}
            />
          </View>
        </View>

        {/* Middle Section still in progress */}
        <View style={[styles.teamPlayers, { backgroundColor: 'black' }]}></View>

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
  );
};


//https://stackoverflow.com/questions/68494075/how-can-i-make-a-button-change-what-components-are-showing-in-react-native
//Link for action buttens. open up a new view


const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
});

export default Tab;