import { View, Text, StyleSheet } from 'react-native';

export default function Tab() {
    const clubName = ["Gammelstads Basketbollklubb"]
    const team = ["Lag1","Lag2","Lag3","Lag4","Lag5"]
    const desc = ["Det här är en beskrivning"]
  return (
    <View style={styles.container}>
        <View style={styles.mainBox}>
            <View style={styles.titleBox}>
                <Text style={styles.titleText}>{clubName}</Text>
            </View>
            <View style={styles.titleBox}>
                <Text style={styles.teamName}>{team}</Text>
                <Text style={styles.teamDescription}>{desc}</Text>
            </View>

        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "gray"
  },
  mainBox:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: "black",
    borderWidth: 2,
    backgroundColor: "lightgray",
    width: "70%",
    height: "auto",
    padding: 2,
    flexDirection: "column"
  },
  titleBox:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "yellow",
    paddingBottom: 4,
  },
  titleText:{
    fontSize: 32,
    fontWeight: "normal",
    color: "black"
  },
  teamName:{
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
  },
  teamDescription: {
    fontSize: 26,
    fontWeight: "normal",
    color: "black"
  }
});
