import { View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import React, {useEffect, useState} from 'react';
import {Router, router, useLocalSearchParams} from 'expo-router';
import  Axios  from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getTeamsfromApi, getTeamFromId, Team} from "@/app/getTeamsapi";

interface Matchprops {
    id: number;
    homeTeamId: number;
    awayTeamId: number;
}

const apiCall = async () => {
    const tokenString = await AsyncStorage.getItem("userToken");
    const matchIDstring = await AsyncStorage.getItem("matchid");

    const matchID= Number(matchIDstring);
    console.log("Vi hämtar matchidet som:", matchID);

    if(!matchID) {
        console.log("No match found")
        alert("No match found")
        return;
    }
    if(!tokenString) {
        console.log("No tokenString")
    }
    console.log("Match found: ", matchID);

    {/* gets match information based on matchID */}
    // TODO: Den här returnar en array med alla matcher, varför??
    try {
        const response = await Axios({
            url: `/api/matchup/match/`,
            method: "get",
            baseURL: "https://api.bnh.dust.ludd.ltu.se/",
            params: {id: matchID},
            headers: {
                "content-type": "application/json",
                Authorization: `Token ${tokenString}`
            }
        });

        console.log("this is what apiCall returns:", response.data.results);
        return response.data.results as Matchprops[];
    } catch (error: any) {
        console.log("Error in apiCall")
        console.log(error)
    }
}

const ThisIsAFunction: React.FC = () => {

    const [homeTeamId, setHomeTeamId] = useState<number | undefined>();
    const [awayTeamId, setAwayTeamId] = useState<number | undefined>();
    const [teams, setTeams] = useState<Team[]>([]);
    const [matchID, setMatchID] = useState<number | undefined>();

    {/* gets teams id from apiCall() function above */}
    useEffect(() => {
        const fetchData = async () => {
            const result = await apiCall();
            if (result) {
                setHomeTeamId(result.homeTeamId)
                console.log(result.homeTeamId);
                setAwayTeamId(result.awayTeamId)
                console.log(result.awayTeamId);
                setMatchID(result.matchID)
            }
        }
        fetchData();
    },[]);

    {/* gets team information with /getTeamsapi : func getTeamFromId */}
    useEffect(() => {
        const fetchData = async () => {
            if (homeTeamId!==undefined && awayTeamId!==undefined){
                const result = await getTeamFromId(homeTeamId, awayTeamId);
                if (result) {
                    setTeams(result)
                    console.log("This is from the second hook call:", result)
                }
            }
        }
        fetchData();
    },[]);

    const getTeamNameById = (teams: Team[], teamId: number | undefined): string => {
        const team = teams.find((team) => team.id === teamId);
        return team ? team.name : "Team not found";
    };
    console.log("This is the teams:", teams);

    const TeamInputFunc = () => {
        const [homeTeam, onChangeHome] = React.useState(getTeamNameById(teams, homeTeamId));
        const [awayTeam, onChangeAway] = React.useState('Bortalag');

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

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.toptopHeader, { backgroundColor: "lightgray" }]}>
                <Text style={styles.topHeaderTitle}>Matchid {matchID} Träningsmatch</Text>
            </View>
            <View style={[styles.topmiddleHeader, { backgroundColor: "lightgray" }]}></View>
            <View style={[styles.topbottomHeader, { backgroundColor: "lightgray" }]}>
                <Text style={styles.topHeaderTeamText}>Hemmalag</Text>
                <Text style={styles.topHeaderTeamText}>Bortalag</Text>
            </View>

            {/* Team options */}
            <View style={styles.teamOptions}>
                <TeamInputFunc />
            </View>
            <View style={{ alignItems: "flex-start",flexDirection:"row" }}>
                <View style={styles.teamOptionsHome}>
                    <CustomButton title="Välj Spelare" />
                    <CustomButton title="Välj ledarstab" />
                    <CustomButton title="Lagfärg" />
                </View>
                <View style={styles.teamOptionsAway}>
                    <CustomButton title="Välj Spelare" />
                    <CustomButton title="Välj ledarstab" />
                    <CustomButton title="Lagfärg" />
                </View>
            </View>

            {/* Match Options */}
            <View style={{alignContent:"flex-start",flexDirection:"row"}}>
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
const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, style }) => {

    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <View style={styles.teamOptions}>
                <Text style={styles.buttonText}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
};
const MatchOptionButton: React.FC<CustomButtonProps> = ({ title, onPress, style }) => {

    return (
        <TouchableOpacity style={styles.matchButtons} onPress={onPress}>
            <View style={styles.teamOptions}>
                <Text style={styles.buttonText}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
};

const MatchStartButton: React.FC<CustomButtonProps> = ({title, onPress, style}) => {
    return(
        <TouchableOpacity style={styles.greenButton}onPress={()=>
         router.push("/Sek")
        }>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

export default function Tab() {
    return(
        <ThisIsAFunction/>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    bottomContainer:{
        backgroundColor:"",
        height:"30%",
        width:"100%",
        justifyContent:"center",
        alignItems:"center",
        bottom:0,
        position:"absolute"
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
        width:"45%",
        height: "auto",
        margin: 10,
        borderWidth: 1,
        padding: 10,
        
    },
    // Match Options
    matchOptions:{
        width: "100%",
        height: "auto",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor:"",
        top:50,
        gap:10,
    },
    // Buttons
    matchButtons:{
        height: 60,
        width: "90%",
        borderWidth: 1,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius:8,
    },
    button: {
        height: 60,
        width: "90%",
        borderWidth: 1,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius:8,
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
