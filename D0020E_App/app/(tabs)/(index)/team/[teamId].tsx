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
    players: [];
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
        const response = await Axios({
            url: `/api/clubber/players/`,
            method: 'get',
            baseURL: 'https://api.bnh.dust.ludd.ltu.se/',
            headers: {
                'content-type': 'application/json',
                Authorization: `Token ${tokenString}`, // Add token to the Authorization header
            },
        });
        const players = response.data.results.filter((player: Player) =>
            playerIds.includes(player.id)
        );
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
            method: 'put',
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
                url: `/api/clubber/teams/${teamId}/team_player`,
                method: 'post',
                baseURL: 'https://api.bnh.dust.ludd.ltu.se/',
                headers: {
                    'content-type': 'application/json',
                    Authorization: `Token ${tokenString}`,
                },
                data: {
                    players: response.data.id,
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
    const [newPlayerFirstName, setNewPlayerFirstName] = useState("");
    const [newPlayerSurName, setNewPlayerSurName] = useState("");
    const newPlayerDesc = "";


    useEffect(() => {
        const fetchTeamAndPlayers = async () => {
            const teamData = await getTeamFromApi(Number(teamId));
            if (teamData) {
                setTeam(teamData);

                // Fetch player details for the player IDs in the team
                const playerDetails = await getPlayersFromApi(teamData.players);
                setPlayers(playerDetails);
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
                const playerDetails = await getPlayersFromApi(teamData.players);
                setPlayers(playerDetails);
            }
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

    return (
        <ScrollView style={styles.container}>
            <View style={styles.teamInfo}>
                <Text style={styles.teamName}>Team Name: {team.name}</Text>
                <Text style={styles.teamDescription}>Description: {team.description}</Text>
                <Text style={styles.teamClub}>Club: {team.club || 'N/A'}</Text>
            </View>

            <View>
                <Text style={styles.playersHeader}>Players:</Text>
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
                    <Text style={{width: 50, textAlign: 'center'}}>Team options</Text>
                </View>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
            </View>

            {/* Where the actual settings start */}
            <View style={styles.teamSettings}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter new team name"
                    value={newTeamName}
                    onChangeText={setNewTeamName}
                />
                <TouchableOpacity style={styles.button} onPress={handleUpdateTeamName}>
                    <Text style={styles.buttonText}>Update Team Name</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.teamSettings}>
                <TextInput
                    style={styles.input}
                    placeholder="Firstname"
                    value={newPlayerFirstName}
                    onChangeText={setNewPlayerFirstName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Surname"
                    value={newPlayerSurName}
                    onChangeText={setNewPlayerSurName}
                />
                <TouchableOpacity style={styles.button} onPress={handleAddPlayer}>
                    <Text style={styles.buttonText}>Add player</Text>
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
      marginTop: 40,
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 4
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