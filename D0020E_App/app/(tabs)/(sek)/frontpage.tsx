import {View, Text, StyleSheet, TouchableOpacity, Modal, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import Axios from 'axios';
import {useRouter, Router} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getTeamsfromApi, Team, TeamPlayer} from "@/app/getTeamsapi";

interface Match {
    id: number;
    full_title: number;
    players: TeamPlayer[];
    startTime: string;
    endTime: string;
    homeTeamId: number;
    awayTeamId: number;
}

interface MatchPlayer {
    id: number;
    number: number | null;
    match: number;
    player: number | null;
    team: number | null;
}

const TeamGetter: React.FC = () => {
    const [teams, setTeams] = useState<Team[]>([]);

    {/* Hook call to save team information from @link:getTeamsapi.tsx with setTeams */
    }
    useEffect(() => {
        const fetchData = async () => {
            const result = await getTeamsfromApi();
            if (result) {
                setTeams(result)
            }
        }
        fetchData();
    }, []);

    const router = useRouter();

    {/* used to set teams ID, needed for posting to database */
    }
    const [homeTeamId, setHomeTeamId] = useState<number | null>(null);
    const [awayTeamId, setAwayTeamId] = useState<number | null>(null);

    {/* used for hiding and showing modal component when returning page */
    }
    const [modalVisibleHome, setModalVisibleHome] = useState(false);
    const [modalVisibleAway, setModalVisibleAway] = useState(false);

    {/* sets the types for values when picking teams */
    }
    const handleTeamSelection = (
        teamId: number,
        setTeamId: React.Dispatch<React.SetStateAction<number | null>>,
        setModalVisible: React.Dispatch<React.SetStateAction<boolean>>) => {
        setTeamId(teamId);
        setModalVisible(false);
        console.log("Team selected: ", teamId);
    };

    return (
        <View style={styles.container}>

            {/* Select Team 1 Button */}
            <TouchableOpacity
                style={styles.teamButton}
                onPress={() => setModalVisibleHome(true)}
            >
                <Text style={styles.teamButtonText}>
                    {homeTeamId ? `Team 1: ${teams.find(teams =>
                        teams.id == homeTeamId)?.name}` : 'Välj Hemmalag'}
                </Text>
            </TouchableOpacity>

            {/* Select Team 2 Button */}
            <TouchableOpacity
                style={styles.teamButton}
                onPress={() => setModalVisibleAway(true)}
            >
                <Text style={styles.teamButtonText}>
                    {awayTeamId ? `Team 2: ${teams.find(team =>
                        team.id === awayTeamId)?.name}` : 'Välj Bortalag'}
                </Text>
            </TouchableOpacity>

            {/* Modal is used to open a menu component and FlatList displays a list of teams */}
            <Modal
                visible={modalVisibleHome}
                animationType="slide"
                onRequestClose={() => setModalVisibleHome(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={teams}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    style={styles.teamItem}
                                    onPress={() => handleTeamSelection(item.id, setHomeTeamId, setModalVisibleHome)}
                                >
                                    <Text style={styles.teamItemText}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>

            <Modal
                visible={modalVisibleAway}
                animationType="slide"
                onRequestClose={() => setModalVisibleAway(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={teams}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    style={styles.teamItem}
                                    onPress={() => handleTeamSelection(item.id, setAwayTeamId, setModalVisibleAway)}
                                >
                                    <Text style={styles.teamItemText}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>

            {/* Start a new game, generate a matchID */}
            <TouchableOpacity
                style={styles.startMatchBox}
                onPress={() => {
                    if (homeTeamId && awayTeamId) {
                        apiCall(router, homeTeamId, awayTeamId)
                    }
                }}
            >
                <Text style={styles.titleText}>Generera ny match</Text>
            </TouchableOpacity>
        </View>
    );
}

{/* checks that user has a valid token and then posts game to database */
}
const apiCall = async (router: Router, homeTeamId: number, awayTeamId: number) => {
    const tokenString = await AsyncStorage.getItem("userToken");
    if (!tokenString) {
        console.log("No token found")
        alert("No token found")
        router.push("/loginPage")
        return;
    }
    console.log("Token found: ", tokenString);

    try {
        const match: Match = await Axios({
            url: "/api/matchup/match/",
            method: "post",
            baseURL: "https://api.bnh.dust.ludd.ltu.se/",
            data: {
                homeTeamId: homeTeamId,
                awayTeamId: awayTeamId,
            },
            headers: {
                "content-type": "application/json",
                Authorization: `Token ${tokenString}`
            }
        }).then((res) => res.data);

        const homeTeamPlayers: Promise<TeamPlayer[]> = Axios({
            url: `/api/clubber/teams/${homeTeamId}/players/`,
            method: "get",
            baseURL: "https://api.bnh.dust.ludd.ltu.se/",
            headers: {
                "content-type": "application/json",
                Authorization: `Token ${tokenString}`
            }
        }).then(t => t.data.results);
        const awayTeamPlayers: Promise<TeamPlayer[]> = Axios({
            url: `/api/clubber/teams/${awayTeamId}/players/`,
            method: "get",
            baseURL: "https://api.bnh.dust.ludd.ltu.se/",
            headers: {
                "content-type": "application/json",
                Authorization: `Token ${tokenString}`
            }
        }).then(t => t.data.results);
        const matchPlayers: Promise<MatchPlayer[]> = Promise.all([...await awayTeamPlayers, ...await homeTeamPlayers]
            .map(async p => Axios({
                url: `/api/matchup/match/${awayTeamId}/players/`,
                method: "post",
                baseURL: "https://api.bnh.dust.ludd.ltu.se/",
                data: {
                    number: p.number,
                    match: match.id,
                    player: p.player,
                    team: p.team
                },
                headers: {
                    "content-type": "application/json",
                    Authorization: `Token ${tokenString}`
                }
            }).then(t => t.data)));


        router.push(`./match/${match.id}`)
        await AsyncStorage.setItem("matchid", match.id.toString());
        console.log("Match: ", match.id);
        await matchPlayers;
    } catch (error: any) {
        console.log(error)
    }
    console.log("Headers: ", {
        "content-type": "application/json",
        Authorization: `Bearer ${tokenString}`,
    });
}

export default function frontpage() {
    return (
        <TeamGetter/>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    startMatchBox: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "green",
        width: "80%",
        height: "auto",
        borderRadius: 10,
        padding: 10,
    },
    titleText: {
        color: "white",
        fontSize: 38,
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
    },
    teamItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "lightgray",
    },
    teamItemText: {
        fontSize: 18,
    },
    teamButton: {
        width: "80%",
        padding: 15,
        backgroundColor: "#1E90FF",
        borderRadius: 10,
        marginBottom: 10,
        alignItems: "center",
    },
    teamButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});
