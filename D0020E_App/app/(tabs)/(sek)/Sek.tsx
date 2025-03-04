import React, { useEffect,useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, TouchableOpacityProps, ScrollView } from 'react-native';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = "https://api.bnh.dust.ludd.ltu.se/api/matchup";

//  "https://api.bnh.dust.ludd.ltu.se/api/matchup/match/event";

const api = axios.create({
    baseURL: baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

//takes matchId, playerId and update the score of the game
const updatePlayerScore = async (matchId: number, playerId: number, points: number) => {
  try {
    const response = await api.patch(`/match/${matchId}/event/players/${playerId}/score`, { points });
    return response.data;
  } catch (error) {
    console.error('Error updating player score:', error);
    throw error;
  }
};

//takes matchId, both playerIds and update the fouls of the game
  const updatePlayerFouls = async (matchId: number,playerId: number, player:number,fouls: number) => {
    try {
      const response = await api.patch(`/${matchId}/event/players/${playerId}/fouls`, { fouls });
      return response.data;
    } catch (error) {
      console.error('Error updating player fouls:', error);
      throw error;
    }
  };
  {/*
  export const updatePlayerOnCourt = async (matchId: number,playerId: number, playerId:number) => {
    try {
      const response = await api.patch(`/${matchId}/event/players/${playerId}/fouls`, { fouls });
      return response.data;
    } catch (error) {
      console.error('Error updating players on court:', error);
      throw error;
    }
  };  
    */}
  
  const fetchMatchId = async () => {
    try {
      const matchIDstring = await AsyncStorage.getItem("matchid");
      const matchId= Number(matchIDstring);
      return matchId;
    } catch (error) {
      console.error('Error fetching match data:', error);
      throw error;
    }
  };

  const fetchPlayers = async (matchId: number) => {
    try {
      const response = await api.get(`/match/${matchId}/event/players/`);
      return response.data; // Returns an array of players
    } catch (error) {
      console.error('Error fetching players:', error);
      throw error;
    }
  };


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

// pointcounter, unused
const incrementCountRef = useRef<(number: number) => number>();
const pointCounter = () => {
  const [pointCount, setCount] = useState<number>(0);
  incrementCountRef.current = (number: number) => {
    setCount((prevCount) => prevCount + number);
    return pointCount + number;
  };

  return (
    <View style={styles.container}>
      <Text>{pointCount}</Text>
    </View>
  );
};

const PlayerButtons: React.FC<{ start: number; end: number; openActionView: (playerId: number) => void }> =
    ({ start, end, openActionView }) => {
      const players = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  return (
    <>
      {players.map((player, index) => {
        if (index % 2 === 0) {
          return (
            <View
              key={player}
              style={styles.playerBoxButton}
            >
              <CustomButton
                title={`P${player}`}
                onPress={() => {
                  if (player >= 1 && player <= 4) openActionView(player);
                }}
                style={styles.playerButton}
              />
              {players[index + 1] && (
                <CustomButton
                  title={`P${players[index + 1]}`}
                  onPress={() => {
                    if (players[index + 1] >= 1 && players[index + 1] <= 4) openActionView(player);
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


const PointButtons: React.FC<{ start: number; end: number; closeActionView: () => void; playerId: number; matchId: number }> =
    ({start, end, closeActionView, playerId, matchId,}) => {

const points = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  const handleScore = async (points: number) => {
    try {
      await updatePlayerScore(matchId, playerId, points); // Use matchId and playerId
      Alert.alert('Success', `${points} points added to Player ${playerId}!`);
      closeActionView();
    } catch (error) {
      Alert.alert('Error', 'Failed to update player score.');
    }
  };

  return (
      <View>
        {points.map((point) => (
            <CustomButton
                key={point}
                title={`${point} Poäng`}
                onPress={() => handleScore(point)}
                style={styles.pointButton}
            />
        ))}
      </View>
  );
};

const CircleHeader = () => {
  const [timeoutsLeft, setTimeoutsLeft] = useState<number>(3);
  const [foulsLeft, setFoulsLeft] = useState<number>(1);
  const [timeoutsRight, setTimeoutsRight] = useState<number>(3);
  const [foulsRight, setFoulsRight] = useState<number>(1);

  const currentPeriod = 2;

  const renderInfoCircles = (count: number, total: number) => {
    return Array.from({ length: total }).map((_, index) => (
      <View
        key={index}
        style={[
          styles.infoCircle,
          index < count ? styles.filledInfoCircle : styles.emptyInfoCircle,
        ]}
      />
    ));
  };
  return (
    <View style={styles.headerInfoCirclesContainer}>

      {/* Left */}
      <View style={{ alignItems: "flex-start", }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 14, fontWeight: "bold", paddingBottom: 4, }}>Timeout:</Text>
          <View style={{ flexDirection: "row", marginBottom: 8, }}>
            {renderInfoCircles(timeoutsLeft, 3)}
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 14, fontWeight: "bold", paddingBottom: 4, }}>Foul</Text>
          <View style={{ flexDirection: "row", marginBottom: 8, }}>
            {renderInfoCircles(foulsLeft, 5)}
          </View>
        </View>
      </View>

      {/* Middle */}
      <View style={{ alignItems: "center", }}>
        <Text style={{ fontSize: 28, fontWeight: "bold" }}>Period: {currentPeriod}</Text>
      </View>

      {/* Right */}
      <View style={{ alignItems: "flex-end", }}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flexDirection: "row" }}>
            {renderInfoCircles(timeoutsRight, 3)}
          </View>
          <Text style={{ fontSize: 14, fontWeight: "bold", paddingBottom: 4, }}>Timeout</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flexDirection: "row" }}>
            {renderInfoCircles(foulsRight, 5)}
          </View>
          <Text style={{ fontSize: 14, fontWeight: "bold", paddingBottom: 4, }}>Foul</Text>
        </View>
      </View>

    </View>
  )
}

const Tab: React.FC = () => {
  const [showActionView, setShowActionView] = useState(false);
  const openActionView = () => setShowActionView(true);
  const closeActionView = () => setShowActionView(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [players, setPlayers] = useState<Array<{ id: number; name: string }>>([]);
  const [matchId, setMatchId] = useState<number | null>(null);


  //Used to load matchId and playerId when component loads in.
  useEffect(() => {
    const loadMatchAndPlayers = async () => {
      try {
        // Fetch matchId from AsyncStorage
        const matchIDstring = await AsyncStorage.getItem("matchid");
        const matchId = Number(matchIDstring);
        setMatchId(matchId);

        if (matchId) {
          // Fetch players for the match
          const playersData = await fetchPlayers(matchId);
          setPlayers(playersData);
        }
      } catch (error) {
        console.error('Failed to load match or players:', error);
      }
    };

    loadMatchAndPlayers(); // Call the async function
  }, []);



  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[styles.container, { flexDirection: 'column' }]}>
        {/* Header/ Match status box */}
        <View style={styles.matchStatsBox}>
          <View style={styles.pointBox}>
            <Text style={{ color: "white", fontSize: 64, }}>12-12</Text>
          </View>
        </View>
        <CircleHeader />

        <View style={styles.buttonBox}>

          {/* Left Section for home players */}
          <View style={[styles.teamPlayers, { alignItems: 'center' }]}>

            {/*Button the change players */}
            <CustomButton
              title="Byte"
              onPress={() => Alert.alert('Button Pressed', 'You clicked byte')}
              style={styles.byteButton}
            />


            {/* First Four Buttons for players on the court */}
            <PlayerButtons start={1} end={4} openActionView={(playerId) => {
              setSelectedPlayerId(playerId);
              openActionView();
            }} />

            {/* Middle Single Button, player on court */}
            <View style={styles.playerBoxButton}>
              <CustomButton
                  title="P5"
                  onPress={() => {
                    setSelectedPlayerId(5);  // Set player ID to 5
                    openActionView();
                  }}
                  style={styles.playerButton}
              />
            </View>

            {/* Next Six Buttons for players on the bench */}
            <PlayerButtons start={6} end={11} openActionView={openActionView} />

            {/* Bottom Button, last player on bench */}
            <View style={styles.playerBoxButton}>
              <CustomButton
                title="P12"
                onPress={() => Alert.alert('Button Pressed', 'You clicked Player 12!')}
                style={styles.playerButton}
              />
            </View>
          </View>

          {/* Middle Section still in progress */}
          <View style={[styles.teamPlayers, { backgroundColor: "white" }]}>

          </View>

          {/* Right Section is for the away team */}
          <View style={[styles.teamPlayers]}>

            <CustomButton
              title="Byte"
              onPress={() => Alert.alert('Button Pressed', 'You clicked the Byte button!')}
              style={styles.byteButton}
            />
            {/* First Four Buttons for players on the court */}
            <PlayerButtons start={1} end={4} openActionView={openActionView} />

            {/* Middle Single Button, player on court */}
            {/*</View><View style={{ flex: 1, marginVertical: '2%', marginHorizontal: '2%', alignItems: 'center' }}>*/}
            <View style={styles.playerBoxButton}>
              <CustomButton
                title="P5"
                onPress={() => openActionView()}
                style={styles.playerButton}
              />
            </View>

            {/* Next Six Buttons for players on the bench */}
            <PlayerButtons start={6} end={11} openActionView={openActionView} />

            {/* Bottom Button, last player on bench */}
            <View style={styles.playerBoxButton}>
              <CustomButton
                title="P12"
                onPress={() => Alert.alert('Button Pressed', 'You clicked Player 12!')}
                style={styles.playerButton}
              />
            </View>
          </View>
        </View>
          {showActionView && matchId && selectedPlayerId &&
              <ActionView
                  closeActionView={closeActionView}
                  playerId={selectedPlayerId}
                  matchId={matchId}
              />
          }
      </View>
    </ScrollView>
  );
};


const ActionView: React.FC<{ closeActionView: () => void; playerId: number; matchId: number }> =
    ({closeActionView, playerId, matchId,}) => {

  {/*
  const handleFoul = async () => {
    try {
      await updatePlayerFouls(matchId, playerId, 1); // Use matchId and playerId
      Alert.alert('Success', `Foul added to Player ${playerId}!`);
      closeActionView();
    } catch (error) {
      Alert.alert('Error', 'Failed to update player fouls.');
    }
  };
      */}

  return (
      <View style={styles.actionWindowView}>
        <TouchableOpacity onPress={closeActionView} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>

        {/* Point Buttons */}
        <View>
          <PointButtons start={1} end={3} closeActionView={closeActionView} playerId={playerId} matchId={matchId} />
        </View>

        {/* Foul Button */}
        <View style={styles.foulButton}>
          <CustomButton
              title={'FOUL'}
             // onPress={handleFoul}
              style={styles.pointButton}
          />
        </View>
      </View>
  );
};


//https://stackoverflow.com/questions/68494075/how-can-i-make-a-button-change-what-components-are-showing-in-react-native
//Link for action buttens. open up a new view


const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "auto",
  },
  byteButton: {
    backgroundColor: 'purple',
    width: "90%",
    height: "5%",
    paddingVertical: 0,
    top: 10,
    position: 'absolute',
    borderRadius: 8,
  },
  pointBox: {
    borderColor: "black",
    borderWidth: 2,
    backgroundColor: "green",
    width: "auto",
    height: "auto",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  matchStatsBox: {
    backgroundColor: 'lightgray',
    alignItems: "center",
    justifyContent: "center",
    height: "auto",
    paddingTop: 10,
  },
  teamPlayers: {
    paddingVertical: '5%',
    paddingHorizontal: '5%',
    flex: 1,
    borderBlockColor: 'black',
    borderWidth: 1
  },
  infoCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  filledInfoCircle: {
    backgroundColor: "red",
  },
  emptyInfoCircle: {
    backgroundColor: "lightgrey",
    borderWidth: 1,
    borderColor: "gray",
  },
  headerInfoCirclesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'lightgray',
    paddingBottom: 12,
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
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: "center",
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  playerBoxButton: {
    flexDirection: 'row',
    justifyContent: "center",
    alignContent: "center",
    width: '100%',
    flex: 1,
    marginHorizontal: '1%',
    marginVertical: "1%",
    gap: 10,
  },
  playerButton: {
    backgroundColor: 'blue',
    width: '61%', // Square button
    //aspectRatio: 1, // Ensures square shape
    //marginVertical: '0%',
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 8,
  },
  pointButton: {
    backgroundColor: 'blue',
    width: '80%', // Square button
    aspectRatio: 1, // Ensures square shape
    marginVertical: '27%',
    //marginHorizontal:'-5%',
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  foulButton: {
    alignSelf: 'center',
    width: '33%',
  },
  buttonBox: {
    flex: 2,
    backgroundColor: "white",
    flexDirection: "row",
  },
  actionWindowView: {
    flexDirection: 'row',
    width: '40%',
    height: '45%',
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 10,
    position: 'absolute',
    top: 0, // Centers vertically
    alignSelf: 'center', // Centers horizontally
    transform: [{ translateY: '40%' }], // Adjusts for exact centering
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  }
});

export default Tab;