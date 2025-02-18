import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import React, { useState } from 'react';
import Axios from 'axios';
import { useRouter, Router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiCall = async (router: Router, homeTeamId: number, awayTeamId: number) => {
    const tokenString = await AsyncStorage.getItem("userToken");
    if(!tokenString) {
        console.log("No token found")
        alert("No token found")
        router.push("/loginPage")
        return;
    }
    console.log("Token found: ", tokenString);

    try {
        const response = await Axios({
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
        });
        if (response.status === 200) {
            router.push("/matchsettings");
        }
    } catch (error: any) {
        console.log(error)
    }
    console.log("Headers: ", {
        "content-type": "application/json",
        Authorization: `Bearer ${tokenString}`,
    });
}

const teams = [
    { id: 1, name: 'Team 1' },
    { id: 2, name: 'Team 2' },
    { id: 3, name: 'Team 3' },
    { id: 4, name: 'Team 4' },
];

export default function frontpage() {
    const router = useRouter();

    const [homeTeamId, setHomeTeamId] = useState<number | null>(null);
    const [awayTeamId, setAwayTeamId] = useState<number | null>(null);

    const [modalVisibleHome, setModalVisibleHome] = useState(false);
    const [modalVisibleAway, setModalVisibleAway] = useState(false);

    const handleTeamSelection = (
        teamId: number,
        setTeamId: React.Dispatch<React.SetStateAction<number | null>>,
        setModalVisible: React.Dispatch<React.SetStateAction<boolean>>) => {
        setTeamId(teamId);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>

            {/* Select Team 1 Button */}
            <TouchableOpacity
                style={styles.teamButton}
                onPress={() => setModalVisibleHome(true)}
            >
                <Text style={styles.teamButtonText}>
                    {homeTeamId ? `Team 1: ${teams.find(team =>
                        team.id == homeTeamId)?.name}` : 'Select Team 1'}
                </Text>
            </TouchableOpacity>
            
            {/* Select Team 2 Button */}
            <TouchableOpacity
                style={styles.teamButton}
                onPress={() => setModalVisibleAway(true)}
            >
                <Text style={styles.teamButtonText}>
                    {awayTeamId ? `Team 2: ${teams.find(team => 
                        team.id === awayTeamId)?.name}` : 'Select Team 2'}
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
                            renderItem={({ item }) => (
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
                            renderItem={({ item }) => (
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
                    if (homeTeamId && awayTeamId){
                    apiCall(router, homeTeamId, awayTeamId)
                }}}
            >
                <Text style={styles.titleText}>Press here to generate new match</Text>
            </TouchableOpacity>
        </View>
    );
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
        padding:10,
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
        backgroundColor: "black",
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
