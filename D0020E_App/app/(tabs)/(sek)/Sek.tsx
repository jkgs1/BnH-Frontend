import React, { useEffect,useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, TouchableOpacityProps, ScrollView } from 'react-native';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {router} from "expo-router";
import Axios from "axios";
import {Team, TeamPlayer} from "@/app/getTeamsapi";
import {Match, MatchPlayer} from "@/app/(tabs)/(sek)/frontpage";

interface Matchprops {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
}

const apiCall = async () => {
  const tokenString = await AsyncStorage.getItem("userToken");
  const matchIDstring = await AsyncStorage.getItem("matchid");

  const matchID= Number(matchIDstring);

  {/* Checks that the token is valid and that the gameId was correctly fetched from AsyncStorage */}
  if(!matchID) {
    console.log("No match found")
    alert("No match found")
    return;
  }
  if(!tokenString) {
    console.log("No tokenString")
  }

  {/* gets match information based on matchID */}
  try {
    const response = await Axios({
      url: `/api/matchup/match/${matchID}/`,
      method: "get",
      baseURL: "https://api.bnh.dust.ludd.ltu.se/",
      headers: {
        "content-type": "application/json",
        Authorization: `Token ${tokenString}`
      }
    });
    return response.data as Matchprops;
  } catch (error: any) {
    console.log("Error in apiCall")
    console.log(error)
  }
}

const getMatchPlayers = async (matchId: number): Promise<[MatchPlayer[], MatchPlayer[]]> => {
  const tokenString = await AsyncStorage.getItem('userToken');
  if (!tokenString) {
    console.error('No token found');
    alert('No token found');
    router.push('/loginPage');
    return [[], []]; // Return empty arrays if no token
  }

  try {
    const match: Match = await Axios({
      url: `/api/matchup/match/${matchId}/`,
      method: 'get',
      baseURL: 'https://api.bnh.dust.ludd.ltu.se/',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${tokenString}`,
      },
    }).then(res => res.data);

    const awayPlayers: MatchPlayer[] = match.players.filter(p => p.team === match.awayTeamId);
    const homePlayers: MatchPlayer[] = match.players.filter(p => p.team === match.homeTeamId);

    return [awayPlayers, homePlayers];
  } catch (error) {
    console.error('Error in getMatchPlayers:', error);
    return [[], []]; // Return empty arrays if there's an error
  }
};

const getPlayersFromApi = async (TeamId: number) => {
  const tokenString = await AsyncStorage.getItem('userToken');
  console.log("This is teamId", TeamId);
  if (!tokenString) {
    console.error('No token found');
    alert('No token found');
    router.push('/loginPage');
    return;
  }
  try {
    const team: Team = await Axios({
      url: `/api/clubber/teams/${TeamId}/`,
      method: 'get',
      baseURL: 'https://api.bnh.dust.ludd.ltu.se/',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${tokenString}`, // Add token to the Authorization header
      },
    }).then(res => res.data);
    console.log("jkl"+team.players);

    return team.players as TeamPlayer[];
  } catch (error) {
    console.log("Error in getPlayersFromApi", error);
    console.log(error);
  }
}


//takes matchId, playerId and update the score of the game && Need to send payerId correctly
const updatePlayerScore = async (matchId: number, playerId: number, points: number) => {
  let eventPoints = points.toString() + "P";
  const tokenString = await AsyncStorage.getItem('userToken');

  try {
    const response = await axios.post(
        `https://api.bnh.dust.ludd.ltu.se/api/matchup/match/${matchId}/events/`,
        {
          match: matchId,
          player1: playerId, // Use playerId directly
          player2: playerId, // Use playerId directly
          time: 23,
          event_type: eventPoints, // Event type in the form "#P"
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${tokenString}`,
          },
        }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating player score:', error);
    throw error;
  }
};

//takes matchId, both playerIds and update the fouls of the game
const updatePlayerFouls = async (matchId: number, OPlayerId: number, VPlayerId:number, fouls: string) => {
  const tokenString = await AsyncStorage.getItem('userToken');

  // Take the string fouls which can be "Personal Foul" or "Other Foul" and saves it as "FP" or "OP"
  let eventFouls = fouls
      .split(' ')
      .map(word => word.charAt(0))
      .reverse()
      .join('');

  try {
      const response = await axios.post(`https://api.bnh.dust.ludd.ltu.se/api/matchup/match/${matchId}/events/`, {
            match: matchId,
            player1: OPlayerId, //Offender
            player2: VPlayerId, //Victim
            time:23,
            event_type: eventFouls //Has two types of fouls ("FP", "Personal foul") & ("FO", "Other foul")
          }, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${tokenString}`
            }
          }
      )
      return response.data;
    } catch (error) {
      console.error('Error posting fouls:', error);
      throw error;
    }
  };

  
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

// pointcounter,
const getMatchScore = async (matchId: number, teamId: number,  ) => {
  const tokenString = await AsyncStorage.getItem('userToken');
  const [homeTeamId, setHomeTeamId] = useState<number | undefined>();
  const [awayTeamId, setAwayTeamId] = useState<number | undefined>();

  useEffect(() => {
    console.log("first")
    const fetchData = async () => {
      const result = await apiCall();
      if (result) {
        setHomeTeamId(result.homeTeamId)
        setAwayTeamId(result.awayTeamId)
        console.log("firsT hhok call:" ,result)
      }
    }
    fetchData();
  },[]);

  const match: Match = await Axios({
    url: `/api/matchup/match/${matchId}/`,
    method: "get",
    baseURL: "https://api.bnh.dust.ludd.ltu.se/",
    headers: {
      "content-type": "application/json",
      Authorization: `Token ${tokenString}`
    }
  }).then(res => res.data);

  if (teamId == match.homeTeamId) {
    try {
      const response = await Axios({
        url: `/api/matchup/match/${matchId}/get_home_score`,
        method: "get",
        baseURL: "https://api.bnh.dust.ludd.ltu.se/",
        headers: {
          "content-type": "application/json",
          Authorization: `Token ${tokenString}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting homeTeam score:', error);
      throw error;
    }
  } else if (teamId == match.awayTeamId) {
    try {
      const response = await Axios({
        url: `/api/matchup/match/${matchId}/get_away_score`,
        method: "get",
        baseURL: "https://api.bnh.dust.ludd.ltu.se/",
        headers: {
          "content-type": "application/json",
          Authorization: `Token ${tokenString}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting awayTeam score:', error);
      throw error;
    }
  }
};

const PlayerButtons: React.FC<{
  start: number;
  end: number;
  openActionView: (player: MatchPlayer) => void; // Pass the player object
  onPlayerPress?: (player: MatchPlayer) => void; // Pass the player object
  playerColors?: { [key: number]: string };
  players: MatchPlayer[];
}> = ({ start, end, openActionView, onPlayerPress, playerColors, players }) => {
  // Ensure we only display up to 12 players
  const displayedPlayers = players.slice(0, 12);

  // Split players into 6 rows of 2
  const rows = [];
  for (let i = 0; i < displayedPlayers.length; i += 2) {
    rows.push(displayedPlayers.slice(i, i + 2));
  }

  return (
      <View style={styles.playerGrid}>
        {rows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.playerRow}>
              {row.map((player, index) => (
                  <CustomButton
                      key={player.player} // Use player ID as the key
                      title={`P${player.id}`} // Display player.id
                      onPress={() => {
                        openActionView(player); // Pass the player object
                        if (onPlayerPress) onPlayerPress(player); // Pass the player object
                      }}
                      style={[
                        styles.playerButton,
                        { backgroundColor: playerColors?.[player.player] || "blue" },
                      ]}
                  />
              ))}
            </View>
        ))}
      </View>
  );
};

const FoulButtons: React.FC<{ closeActionView: () => void; OPlayerId: number; VPlayerId: number, matchId: number;}> =
    ({ closeActionView, OPlayerId,VPlayerId, matchId,}) => {

      const foulType = ['Personal Foul', 'Other Foul'];

      const handleFoul = async (foul: string) => {

        try {
          await updatePlayerFouls(matchId, OPlayerId, VPlayerId, foul);

          closeActionView();
        } catch (error) {
          Alert.alert('Error', 'Failed to update player fouls.');
        }
      };

      return (
          <View style={styles.foulButton}>
            {foulType.map((foul) => (
                <CustomButton
                    key={foul}
                    title={`${foul}`}
                    onPress={() => handleFoul(foul)}
                    style={styles.pointButton}
                />
            ))}
          </View>
      );
    };

const PointButtons: React.FC<{
  start: number;
  end: number;
  closeActionView: () => void;
  playerId: number;
  matchId: number;
}> = ({ start, end, closeActionView, playerId, matchId }) => {
  const points = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  const handleScore = async (points: number) => {
    try {
      await updatePlayerScore(matchId, playerId, points); // Call updatePlayerScore without playerArray
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

const useSubstituteButtons = () => {
  const [playerColors, setPlayerColors] = useState<{ [key: number]: string }>({
    1: "blue",
    2: "blue",
    3: "blue",
    4: "blue",
    5: "blue",
    6: "blue",
    7: "blue",
    8: "blue",
    9: "blue",
    10: "blue",
    11: "blue",
    12: "blue",
  });

  const [selectedCourtPlayer, setSelectedCourtPlayer] = useState<number | null>(null);
  const [selectedBenchPlayer, setSelectedBenchPlayer] = useState<number | null>(null);
  const [isSubstitutionMode, setIsSubstitutionMode] = useState(false); // Track substitution mode

  // Function to handle the "Byte" button press
  const handleBytePress = () => {
    // Enable substitution mode
    setIsSubstitutionMode(true);
    // Reset selection when "Byte" is pressed
    setSelectedCourtPlayer(null);
    setSelectedBenchPlayer(null);
    Alert.alert("Byte", "Select a court player (green) and a bench player (blue) to swap.");
  };

  // Function to handle player button press during substitution
  const handlePlayerPress = (playerId: number) => {
    if (isSubstitutionMode) {
      if (selectedCourtPlayer === null) {
        // Select the court player (must be green)
        if (playerColors[playerId] === "green") {
          setSelectedCourtPlayer(playerId);
        } else {
          Alert.alert("Invalid Selection", "Please select a court player (green) first.");
        }
      } else if (selectedBenchPlayer === null) {
        // Select the bench player (must be blue)
        if (playerColors[playerId] === "blue") {
          setSelectedBenchPlayer(playerId);

          // Swap colors
          const newColors = { ...playerColors };
          newColors[selectedCourtPlayer] = "blue";
          newColors[playerId] = "green";
          setPlayerColors(newColors);

          // Reset selection and disable substitution mode
          setSelectedCourtPlayer(null);
          setSelectedBenchPlayer(null);
          setIsSubstitutionMode(false);
        } else {
          Alert.alert("Invalid Selection", "Please select a bench player (blue).");
        }
      }
    }
  };

  // Function to turn the first five buttons green
  const initializeCourtPlayers = () => {
    const newColors = { ...playerColors };
    for (let i = 1; i <= 5; i++) {
      newColors[i] = "green";
    }
    setPlayerColors(newColors);
  };

  return { playerColors, handleBytePress, handlePlayerPress, initializeCourtPlayers, isSubstitutionMode };
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
  const [homePlayers, setHomePlayers] = useState<MatchPlayer[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<MatchPlayer[]>([]);
  const [matchId, setMatchId] = useState<number | null>(null);
  const [homeTeamId, setHomeTeamId] = useState<number | undefined>();
  const [awayTeamId, setAwayTeamId] = useState<number | undefined>();
  const [homeScore, setHomeScore] = useState<number | null>(null);
  const [awayScore, setAwayScore] = useState<number | null>(null);

  // Declare playerArray to store player IDs for both teams
  const [playerArray, setPlayerArray] = useState<number[]>([]);

  const { playerColors, handleBytePress, handlePlayerPress, initializeCourtPlayers, isSubstitutionMode } = useSubstituteButtons();

  // Initialize the first five buttons as green when the component mounts
  useEffect(() => {
    initializeCourtPlayers();
  }, []);

  // Fetch match ID from AsyncStorage
  useEffect(() => {
    const loadMatchId = async () => {
      try {
        const matchIDstring = await AsyncStorage.getItem("matchid");
        const matchId = Number(matchIDstring);
        setMatchId(matchId);
      } catch (error) {
        console.error('Failed to load match ID:', error);
      }
    };
    loadMatchId();
  }, []);

  // Fetch match data and set home and away team IDs
  useEffect(() => {
    const fetchData = async () => {
      const result = await apiCall();
      if (result) {
        setHomeTeamId(result.homeTeamId);
        setAwayTeamId(result.awayTeamId);
      }
    };
    fetchData();
  }, []);

  // Fetch players for the home team
  useEffect(() => {
    const fetchHomePlayers = async () => {
      const matchIDstring = await AsyncStorage.getItem("matchid");
      const matchId = Number(matchIDstring);
      if (matchId !== undefined) {
        const res = await getMatchPlayers(matchId);
        if (res[1]) { // Check if homePlayers exist
          setHomePlayers(res[1]);
          setPlayerArray((prev) => [...prev, ...res[1].map((p) => p.player)]);
        }
      }
    };
    fetchHomePlayers();
  }, [homeTeamId, matchId]);

// Fetch players for the away team
  useEffect(() => {
    const fetchAwayPlayers = async () => {
      const matchIDstring = await AsyncStorage.getItem("matchid");
      const matchId = Number(matchIDstring);
      if (matchId !== undefined) {
        const res = await getMatchPlayers(matchId);
        if (res[0]) { // Check if awayPlayers exist
          setAwayPlayers(res[0]);
          setPlayerArray((prev) => [...prev, ...res[0].map((p) => p.player)]);
        }
      }
    };
    fetchAwayPlayers();
  }, [awayTeamId, matchId]);

  // Fetch scores for home and away teams
  useEffect(() => {
    const fetchScores = async () => {
      if (matchId && homeTeamId && awayTeamId) {
        const homeScore = await getMatchScore(matchId, homeTeamId);
        const awayScore = await getMatchScore(matchId, awayTeamId);
        setHomeScore(homeScore['home_score']);
        setAwayScore(awayScore['away_score']);
      }
    };
    fetchScores();
  }, [matchId, homeTeamId, awayTeamId]);

  return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={[styles.container, { flexDirection: 'column' }]}>
          {/* Header/ Match status box */}
          <View style={styles.matchStatsBox}>
            <View style={styles.pointBox}>
              <Text style={{ color: "white", fontSize: 64 }}>{homeScore}-{awayScore}</Text>
            </View>
          </View>
          <CircleHeader />

          <View style={styles.buttonBox}>
            {/* Left Section for home players */}
            <View style={[styles.teamPlayers, { alignItems: 'center' }]}>
              <CustomButton
                  title="Byte"
                  onPress={handleBytePress}
                  style={styles.byteButton}
              />

              <PlayerButtons
                  start={1}
                  end={12}
                  openActionView={(playerId) => {
                    if (!isSubstitutionMode) {
                      setSelectedPlayerId(playerId.id);
                      openActionView();
                    }
                  }}

                  playerColors={playerColors}
                  players={homePlayers}
              />
            </View>

            {/* Middle Section */}
            <View style={[styles.teamPlayers, { backgroundColor: "white" }]} />

            {/* Right Section for away players */}
            <View style={[styles.teamPlayers]}>
              <CustomButton
                  title="Byte"
                  onPress={handleBytePress}
                  style={styles.byteButton}
              />

              <PlayerButtons
                  start={1}
                  end={12}
                  openActionView={(playerId) => {
                    if (!isSubstitutionMode) {
                      setSelectedPlayerId(playerId.id);
                      openActionView();
                    }
                  }}

                  playerColors={playerColors}
                  players={awayPlayers}
              />
            </View>
          </View>

          {showActionView && matchId && selectedPlayerId && (
              <ActionView
                  closeActionView={closeActionView}
                  playerId={selectedPlayerId}
                  matchId={matchId}
              />
          )}
        </View>
      </ScrollView>
  );
};

const ActionView: React.FC<{
  closeActionView: () => void;
  playerId: number;
  matchId: number;
}> = ({ closeActionView, playerId, matchId }) => {
  return (
      <View style={styles.actionWindowView}>
        <TouchableOpacity onPress={closeActionView} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>

        {/* Point Buttons */}
        <View>
          <PointButtons
              start={1}
              end={3}
              closeActionView={closeActionView}
              playerId={playerId}
              matchId={matchId}
          />
        </View>

        {/* Foul Buttons */}
        <View style={styles.foulButton}>
          <FoulButtons
              closeActionView={closeActionView}
              OPlayerId={playerId}
              VPlayerId={8} // Example victim player ID
              matchId={matchId}
          />
        </View>
      </View>
  );
};


//https://stackoverflow.com/questions/68494075/how-can-i-make-a-button-change-what-components-are-showing-in-react-native
//Link for action buttens. open up a new view


const styles = StyleSheet.create({
  playerGrid: {
    flexDirection: 'column', // Arrange rows vertically
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  playerRow: {
    flexDirection: 'row', // Arrange buttons horizontally within each row
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10, // Add some space between rows
  },
  playerButton: {
    backgroundColor: 'blue',
    width: '45%', // Adjust width to fit 2 buttons in a row
    aspectRatio: 1, // Ensure buttons are square
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
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
    width: '66%',
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