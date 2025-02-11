import { View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';

const matchID = "123456"

const TeamInputFunc = () => {
    const [homeTeam, onChangeHome] = React.useState('Hemmalag');
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

export default function Tab() {
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
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
        backgroundColor:"green",
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
    },
    button: {
        height: 60,
        width: "90%",
        borderWidth: 1,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "normal",
        color: "black",
    }
});
