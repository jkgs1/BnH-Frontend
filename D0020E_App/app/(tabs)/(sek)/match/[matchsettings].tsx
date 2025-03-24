import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    TouchableOpacityProps,
    Modal,
    FlatList, GestureResponderEvent, ScrollView
} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import React, {useEffect, useState} from 'react';
import {Router, router, useLocalSearchParams} from 'expo-router';
import Axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getTeamsfromApi, getTeamFromId, Team} from "@/app/getTeamsapi";

interface Matchprops {
    id: number;
    homeTeamId: number;
    awayTeamId: number;
}

interface Player {
    bio: string;
    givenName: string;
    id: number;
    surname: string;
}

interface PickPlayersProps {
    players: Player[];
    teamName: string;
}

const apiCall = async () => {
    const tokenString = await AsyncStorage.getItem("userToken");
    const matchIDstring = await AsyncStorage.getItem("matchid");

    const matchID = Number(matchIDstring);

    {/* Checks that the token is valid and that the gameId was correctly fetched from AsyncStorage */
    }
    if (!matchID) {
        console.log("No match found")
        alert("No match found")
        return;
    }
    if (!tokenString) {
        console.log("No tokenString")
    }

    {/* gets match information based on matchID */
    }
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

const getTeams = async (homeTeamId: number, awayTeamId: number) => {
    try {
        {/* Fetch all teams and then find the 2 wanted teams */
        }
        const allTeams = await getTeamsfromApi();
        if (!allTeams) {
            console.error("No teams found");
            return;
        }
        const homeTeam = allTeams.find(team => team.id === homeTeamId);
        const awayTeam = allTeams.find(team => team.id === awayTeamId);

        // Return the filtered teams
        return [homeTeam, awayTeam].filter(team => team !== undefined) as Team[];
    } catch (error) {
        console.log("Error in getTeamFromId", error);
        console.log(error);
    }
}

const getPlayersFromApi = async (playerIds: number[]) => {
    const tokenString = await AsyncStorage.getItem('userToken');
    if (!tokenString) {
        console.error('No token found');
        alert('No token found');
        router.push('/loginPage');
        return;
    }
    try {
        const players: Player[] = await Promise.all(playerIds.map(i => Axios({
            url: `/api/clubber/players/${i}/`,
            method: 'get',
            baseURL: 'https://api.bnh.dust.ludd.ltu.se/',
            headers: {
                'content-type': 'application/json',
                Authorization: `Token ${tokenString}`, // Add token to the Authorization header
            },
        }).then((p => p.data))));
        return players;
    } catch (error) {
        console.log("Error in getPlayersFromApi", error);
        console.log(error);
    }
}
const getTeamFromApi = async (teamId: number): Promise<Team | null> => {
    const tokenString = await AsyncStorage.getItem('userToken');
    if (!tokenString) {
        console.error('No token found');
        alert('No token found');
        return null;
    }
    try {
        const response = await Axios({
            url: `/api/clubber/teams/${teamId}/`,
            method: 'get',
            baseURL: 'https://api.bnh.dust.ludd.ltu.se/',
            headers: {
                'content-type': 'application/json',
                Authorization: `Token ${tokenString}`,
            },
        });
        return response.data as Team;
    } catch (error) {
        console.error("Error in getTeamFromApi", error);
        return null;
    }
};

const ThisIsAFunction: React.FC = () => {

    const [homeTeamId, setHomeTeamId] = useState<number | undefined>();
    const [awayTeamId, setAwayTeamId] = useState<number | undefined>();
    const [matchID, setMatchID] = useState<number | undefined>();
    const [homeplayers, sethomePlayers] = useState<Player[]>([]);
    const [awayplayers, setawayPlayers] = useState<Player[]>([]);
    const [teamInfo, setteamInfo] = useState<Team[]>([]);

    {/* gets teams id from apiCall() function above */
    }
    useEffect(() => {
        const fetchData = async () => {
            const result = await apiCall();
            if (result) {
                setHomeTeamId(result.homeTeamId)
                setAwayTeamId(result.awayTeamId)
                setMatchID(result.id)
            }
        }
        fetchData();
    }, []);

    {/* gets team information with getTeams */
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (homeTeamId !== undefined && awayTeamId !== undefined) {
                    const result = await getTeams(homeTeamId, awayTeamId);
                    if (result !== undefined) {
                        setteamInfo(result)
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [homeTeamId, awayTeamId]);

    {/* Get players */
    }

    useEffect(() => {
        const fetchTeamAndPlayers = async () => {
            const teamhomeData = await getTeamFromApi(Number(homeTeamId));
            const teamawayData = await getTeamFromApi(Number(awayTeamId));
            if (teamhomeData && teamawayData) {
                // Fetch player details for the player IDs in the team
                const playerhomeDetails = await getPlayersFromApi(teamhomeData.players.map(p => p.player));
                const playerawayDetails = await getPlayersFromApi(teamawayData.players.map(p => p.player));
                sethomePlayers(playerhomeDetails as Player[]);
                setawayPlayers(playerawayDetails as Player[]);
            }
        };

        fetchTeamAndPlayers();
    }, [homeTeamId, awayTeamId]);

    const getTeamNameById = (teamInfo: Team[], teamId: number | undefined): string => {
        const team = teamInfo.find((team) => team.id === teamId);
        return team ? team.name : "Team not found";
    };

    {/* This is used so that a user can change the team names */
    }
    const TeamInputFunc = () => {
        const [homeTeam, onChangeHome] = React.useState(getTeamNameById(teamInfo, homeTeamId));
        const [awayTeam, onChangeAway] = React.useState(getTeamNameById(teamInfo, awayTeamId));

        return (
            <SafeAreaProvider>
                <SafeAreaView>

                    <View style={styles.teamOptions}>
                        <TextInput
                            style={styles.teamInput}
                            onChangeText={onChangeHome}
                            value={homeTeam}
                            keyboardType="default"
                            spellCheck={false}
                            autoCorrect={false}
                        />
                        <TextInput
                            style={styles.teamInput}
                            onChangeText={onChangeAway}
                            value={awayTeam}
                            keyboardType="default"
                            spellCheck={false}
                            autoCorrect={false}
                        />
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    };

    const PickPlayers: React.FC<PickPlayersProps> = ({players, teamName}) => {
        {/* used for hiding and showing modal component when returning page */
        }
        const [modalVisibleHome, setModalVisibleHome] = useState(false);

        {/* sets the types for values when picking players */
        }
        const handlePlayerSelection = (
            playerId: number,
            setModalVisible: React.Dispatch<React.SetStateAction<boolean>>) => {
            setModalVisible(false);
            console.log("Player selected: ", playerId);
        };

        return (
            <View style={{width: "100%"}}>
                <View style={{width: "100%"}}>
                    <TouchableOpacity style={styles.button} onPress={() => setModalVisibleHome(true)}>
                        <View style={styles.teamOptions}>
                            <Text style={styles.buttonText}>Visa Spelare</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <Modal
                    visible={modalVisibleHome}
                    animationType="slide"
                    onRequestClose={() => setModalVisibleHome(false)}
                    presentationStyle="fullScreen"
                >
                    <View style={{height: "100%"}}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <FlatList
                                    data={players}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={({item}) => (
                                        <TouchableOpacity
                                            style={styles.playerItem}
                                            onPress={() => handlePlayerSelection(+item.id, setModalVisibleHome)}
                                        >
                                            <Text style={styles.playerItemText}>{item.givenName}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </View>
                    </View>

                </Modal>
            </View>

        )
    };


    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.toptopHeader, {backgroundColor: "lightgray"}]}>
                <Text style={styles.topHeaderTitle}>Matchid {matchID} Träningsmatch</Text>
            </View>
            <View style={[styles.topmiddleHeader, {backgroundColor: "lightgray"}]}></View>
            <View style={[styles.topbottomHeader, {backgroundColor: "lightgray"}]}>
                <Text style={styles.topHeaderTeamText}>Hemmalag</Text>
                <Text style={styles.topHeaderTeamText}>Bortalag</Text>
            </View>

            {/* Manually change the names of the teams */}
            <View style={styles.teamOptions}>
                <TeamInputFunc/>
            </View>

            <View style={{alignItems: "flex-start", flexDirection: "row"}}>
                <View style={styles.teamOptionsHome}>
                    <PickPlayers players={homeplayers} teamName={"Hemmalag"}/>
                    <CustomButton title="Välj ledarstab"/>
                    <CustomButton title="Lagfärg"/>
                </View>
                <View style={styles.teamOptionsAway}>
                    <PickPlayers players={awayplayers} teamName={"Bortalag"}/>
                    <CustomButton title="Välj ledarstab"/>
                    <CustomButton title="Lagfärg"/>
                </View>
            </View>

            {/* Match Options */}
            <View style={{alignContent: "flex-start", flexDirection: "row"}}>
                <View style={styles.matchOptions}>
                    <MatchOptionButton title='Matchfunktionärer'/>

                </View>
            </View>

            <View style={styles.bottomContainer}>
                <MatchStartButton title="Starta match"/>
            </View>
        </View>
    );
}

interface CustomButtonProps extends TouchableOpacityProps {
    title: string;
    style?: object;
}

const CustomButton: React.FC<CustomButtonProps> = ({title, onPress, style}) => {

    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <View style={styles.teamOptions}>
                <Text style={styles.buttonText}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
};
const MatchOptionButton: React.FC<CustomButtonProps> = ({title, onPress, style}) => {
    return (
        <TouchableOpacity style={styles.matchButtons} onPress={onPress}>
            <View style={styles.teamOptions}>
                <Text style={styles.buttonText}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
};

const MatchStartButton: React.FC<CustomButtonProps> = ({title, onPress, style}) => {
    return (
        <TouchableOpacity style={styles.greenButton} onPress={() =>
            router.push("/Sek")
        }>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

export default function Tab() {
    return (
        <ThisIsAFunction/>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        height: "100%",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        marginBottom: 40,
        marginTop: 40,
    },
    playerItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "lightgray",
    },
    playerItemText: {
        fontSize: 18,
    },
    bottomContainer: {
        backgroundColor: "",
        height: "30%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        bottom: 0,
        position: "absolute"
    },
    // Header
    topheader: {
        width: "100%",
        height: "auto",
        flex: 1,
    },
    toptopHeader: {
        width: "100%",
        height: "auto",
        justifyContent: "center",
        alignItems: 'flex-start',
        paddingTop: 5,
        paddingLeft: 20,
    },
    topmiddleHeader: {
        width: "100%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    topbottomHeader: {
        width: "100%",
        height: "auto",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexDirection: "row",
        padding: 20,
    },
    topHeaderTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "black",
    },
    topHeaderTeamText: {
        fontSize: 20,
        fontWeight: "normal",
        color: "black",
    },
    // Team Options
    teamOptions: {
        width: "100%",
        height: "auto",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexDirection: "row",
    },
    teamOptionsHome: {
        width: "50%",
        height: "auto",
        alignItems: "flex-start",
        flexDirection: "column",

        top: 20,
        left: 10,
        gap: 10,
    },
    teamOptionsAway: {
        width: "50%",
        height: "auto",
        alignItems: "flex-end",
        flexDirection: "column",

        top: 20,
        right: 10,
        gap: 10,
    },
    teamInput: {
        width: "45%",
        height: "auto",
        margin: 10,
        borderWidth: 1,
        padding: 10,

    },
    // Match Options
    matchOptions: {
        width: "100%",
        height: "auto",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "",
        top: 50,
        gap: 10,
    },
    // Buttons
    matchButtons: {
        height: 60,
        width: "90%",
        borderWidth: 1,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
    },
    button: {
        height: 60,
        width: "90%",
        borderWidth: 1,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "normal",
        color: "black",
    },
    greenButton: {
        borderColor: "black",
        borderWidth: 2,
        backgroundColor: "green",
        width: "50%",
        height: "50%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },
});
