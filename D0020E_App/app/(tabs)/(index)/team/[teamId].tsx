// app/team/[teamId].js
import {router, useLocalSearchParams, useRouter} from 'expo-router';
import {View, Text, ScrollView, StyleSheet, Alert, TextInput, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Axios from "axios";

interface Team {
    id: number;
    name: string;
    logo: string | null;
    description: string;
    club: string | null;
    players: TeamPlayer[];
}

interface TeamPlayer {
    id: number;
    number: number,
    team: number,
    player: number,
    shirt: number|null,
}

interface Player {
    id: number;
    givenName: string;
    surname: string;
    bio: string;
    portrait: string | null;
    anon: boolean;
    user: null | any;
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
        let players: Player[] = await Promise.all(playerIds.map(async i => Axios({
            url: `/api/clubber/players/${i}/`,
            method: 'get',
            baseURL: 'https://api.bnh.dust.ludd.ltu.se/',
            headers: {
                'content-type': 'application/json',
                Authorization: `Token ${tokenString}`, // Add token to the Authorization header
            },
        }).then((value) => value.data)));
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

const changeTeamName = async (teamId: number, newName: string): Promise<Team | null> => {
    const tokenString = await AsyncStorage.getItem('userToken');
    if (!tokenString) {
        console.error('No token found');
        alert('No token found');
        return null;
    }
    try {
        const response = await Axios({
            url: `/api/clubber/teams/${teamId}/`,
            method: 'patch',
            baseURL: 'https://api.bnh.dust.ludd.ltu.se/',
            headers: {
                'content-type': 'application/json',
                Authorization: `Token ${tokenString}`,
            },
            data: {
                name: newName,
            }
        });
        return response.data as Team;
    } catch (error) {
        console.error("Error in changeTeamName", error);
        return null;
    }
};

const changeTeamDesc = async (teamId: number, newDesc: string): Promise<Team | null> => {
    const tokenString = await AsyncStorage.getItem('userToken');
    if (!tokenString) {
        console.error('No token found');
        alert('No token found');
        return null;
    }
    try {
        const response = await Axios({
            url: `/api/clubber/teams/${teamId}/`,
            method: 'patch',
            baseURL: 'https://api.bnh.dust.ludd.ltu.se/',
            headers: {
                'content-type': 'application/json',
                Authorization: `Token ${tokenString}`,
            },
            data: {
                description: newDesc,
            }
        });
        return response.data as Team;
    } catch (error) {
        console.error("Error in changeTeamDesc");
        return null;
    }
};

const addPlayerToTeam = async (teamId: number, team: Team | null , playerData: { givenName: string; surname: string; bio: string }): Promise<boolean> => {
    const tokenString = await AsyncStorage.getItem('userToken');
    if (!tokenString) {
        console.error('No token found');
        alert('No token found');
        return false;
    }
    {/* Add a new player */}
    try {
        const response = await Axios({
            url: `/api/clubber/players/`,
            method: 'post',
            baseURL: 'https://api.bnh.dust.ludd.ltu.se/',
            headers: {
                'content-type': 'application/json',
                Authorization: `Token ${tokenString}`,
            },
            data: playerData,
        });
        console.log("playerData", playerData);

        {/* Add the new player ID to the team */}
        if (team!=null){
            const teamResponse = await Axios({
                url: `/api/clubber/teams/${teamId}/players/`,
                method: 'post',
                baseURL: 'https://api.bnh.dust.ludd.ltu.se/',
                headers: {
                    'content-type': 'application/json',
                    Authorization: `Token ${tokenString}`,
                },
                data: {
                    player: response.data.id,
                    team: teamId,
                },
            });
            console.log("teamResponse", teamResponse);
        }else{
            console.log("Team is null")
        }
        return true;
    } catch (error) {
        console.error("Error in addPlayerToTeam");
        return false;
    }
};

export default function TeamDetails() {
    const { teamId } = useLocalSearchParams<{ teamId: string }>();
    const [team, setTeam] = useState<Team | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [newTeamName, setNewTeamName] = useState("");
    const [newTeamDescription, setNewTeamDescription] = useState("");
    const [newPlayerFirstName, setNewPlayerFirstName] = useState("");
    const [newPlayerSurName, setNewPlayerSurName] = useState("");
    const newPlayerDesc = "";


    useEffect(() => {
        const fetchTeamAndPlayers = async () => {
            const teamData = await getTeamFromApi(Number(teamId));
            if (teamData) {
                setTeam(teamData);

                // Fetch player details for the player IDs in the team
                console.log(teamData);
                console.log(teamData.players.map((p) => p.player));
                const playerDetails = await getPlayersFromApi(teamData.players.map((p) => p.player));
                if(playerDetails!=undefined){
                    setPlayers(playerDetails);
                }
            }
        };

        fetchTeamAndPlayers();
    }, [teamId]);

    const handleAddPlayer = async () => {
        if (!newPlayerFirstName.trim() || !newPlayerSurName.trim()) {
            Alert.alert('Error', 'Please enter a valid given name and surname.');
            return;
        }

        const playerData = {
            givenName: newPlayerFirstName,
            surname: newPlayerSurName,
            bio: newPlayerDesc,
        };

        const success = await addPlayerToTeam(Number(teamId), team, playerData);
        if (success) {
            Alert.alert('Success', 'Player added successfully!');
            // Refresh the team data
            const teamData = await getTeamFromApi(Number(teamId));
            if (teamData) {
                setTeam(teamData);
                const playerDetails = await getPlayersFromApi(teamData.players.map((p) => p.player));
                if(playerDetails!=undefined) {
                    setPlayers(playerDetails);
                }            }
            // Clear the form
            setNewPlayerFirstName('');
            setNewPlayerSurName('');
        } else {
            Alert.alert('Error', 'Failed to add player.');
        }
    };

    if (!team) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }
    const handleUpdateTeamName = async () => {
        if (!newTeamName.trim()) {
            Alert.alert("Du måste ange ett giltligt namn");
            return;
        }

        const success = await changeTeamName(Number(teamId), newTeamName);
        if (success) {
            Alert.alert("Nytt lagnamn sparat!");
            // Refresh the team data
            const teamData = await getTeamFromApi(Number(teamId));
            if (teamData) {
                setTeam(teamData);
            }
        } else {
            Alert.alert("Det blev något fel");
        }
    };
    const handleUpdateTeamDescription = async () => {
        if (!newTeamDescription.trim()) {
            Alert.alert("Du måste ange en giltlig beskrivning");
            return;
        }
        const success = await changeTeamDesc(Number(teamId), newTeamDescription);
        if (success) {
            Alert.alert("Ny lagbeskrivning sparat!");
            // Refresh the team data
            const teamData = await getTeamFromApi(Number(teamId));
            if (teamData) {
                setTeam(teamData);
            }
        } else {
            Alert.alert("Det blev något fel");
        }
    };
    const handleDeleteTeamAlert = async () => {
            return Alert.alert(
                "Är du säker?",
                `Är du helt säker på att du vill ta bort ${team.name}?`,
                [
                    // The "Yes" button
                    {
                        text: "Yes",
                        onPress: () => {
                            handleDeleteTeam();
                        },
                    },
                    // The "No" button
                    // Does nothing but dismiss the dialog when tapped
                    {
                        text: "No",
                    },
                ]
            );

    }
    const handleDeleteTeam = async () => {
        const tokenString = await AsyncStorage.getItem('userToken');
        if (!tokenString) {
            console.error('No token found');
            alert('No token found');
            return null;
        }
        try{
            const response = await Axios({
                url: `/api/clubber/teams/${teamId}/`,
                method: 'delete',
                baseURL: 'https://api.bnh.dust.ludd.ltu.se/',
                headers: {
                    'content-type': 'application/json',
                    Authorization: `Token ${tokenString}`,
                },
                data: {
                    id: teamId,
                }
            });
        }catch(error){
            console.log("Failed to delete team");
        }
        return null;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.teamInfo}>
                <Text style={styles.teamName}>Lagnamn: {team.name}</Text>
                <Text style={styles.teamDescription}>Beskrivning: {team.description}</Text>
                <Text style={styles.teamClub}>Klubb: {team.club || 'N/A'}</Text>
            </View>

            <View>
                <Text style={styles.playersHeader}>Spelare:</Text>
                {players.map((player) => (
                    <View style={styles.playerCard} key={player.id}>
                        <Text style={styles.playerName}>{player.givenName} {player.surname}</Text>
                    </View>
                ))}
            </View>
            {/* Settings, starting with a seperator line */}
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                <View>
                    <Text style={{width: 200, textAlign: 'center'}}>Laginställningar</Text>
                </View>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
            </View>

            {/* Where the actual settings start */}
            <View style={styles.teamSettings}>
                <TextInput
                    style={styles.input}
                    placeholder="Ange nytt lagnamn"
                    value={newTeamName}
                    onChangeText={setNewTeamName}
                    spellCheck={false}
                />
                <TouchableOpacity style={styles.button} onPress={handleUpdateTeamName}>
                    <Text style={styles.buttonText}>Uppdatera lagnamn</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.teamSettings}>
                <TextInput
                    style={styles.input}
                    placeholder="Ange beskrivning"
                    value={newTeamDescription}
                    onChangeText={setNewTeamDescription}
                    spellCheck={false}
                />
                <TouchableOpacity style={styles.button} onPress={handleUpdateTeamDescription}>
                    <Text style={styles.buttonText}>Uppdatera lagbeskrivning</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.teamSettings}>
                <TextInput
                    style={styles.input}
                    placeholder="Förnamn"
                    value={newPlayerFirstName}
                    onChangeText={setNewPlayerFirstName}
                    spellCheck={false}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Efternamn"
                    value={newPlayerSurName}
                    onChangeText={setNewPlayerSurName}
                    spellCheck={false}
                />
                <TouchableOpacity style={styles.button} onPress={handleAddPlayer}>
                    <Text style={styles.buttonText}>Lägg till ny spelare</Text>
                </TouchableOpacity>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                <View>
                    <Text style={{width: 200, textAlign: 'center'}}>Advancerade inställningar</Text>
                </View>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
            </View>

            <View style={styles.teamSettingsForDelete}>
                <TouchableOpacity style={styles.buttonDelete} onPress={handleDeleteTeamAlert}>
                    <Text style={styles.buttonText}>Radera Lag.</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f5f5",
    },
    teamSettings: {
      marginTop: 20,
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 4
    },
    teamSettingsForDelete:{
      marginTop: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
    },
    buttonDelete: {
        backgroundColor: "red",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        width: "30%",
    },
    button: {
        backgroundColor: "#007BFF",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        width: "30%",
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
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 16,
        backgroundColor: "#fff",
        width: "100%",
    },
    teamInfo: {
        marginBottom: 20,
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    teamName: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
    },
    teamDescription: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    teamClub: {
        fontSize: 16,
        color: "#666",
    },
    playersHeader: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
        color: '#333',
    },
    playerCard: {
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    playerName: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
});