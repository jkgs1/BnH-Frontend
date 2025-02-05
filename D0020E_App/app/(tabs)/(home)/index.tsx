import { View, Text, StyleSheet } from 'react-native';

export function Tab() {
  return (
    <View style={styles.container}>
      <Text>Tab [Home|Settings]</Text>
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
  box: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: "20%",
    width: "90%",
    borderColor: "black",
    borderWidth: 2,
    marginTop: 2,
    backgroundColor: "#1E90FF",
    marginBottom: 60,
  },
  box1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: "20%",
    width: "90%",
    marginTop: 2,
  },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "black",
  }
});

export default function welcomeScreen() {
  const klubbNamn = ["Gammelstads Basketbollklubb"]
  return(
  <View
  style={styles.container}
  >
    <View style={styles.box1}>
      <Text style={styles.titleText}>Välkommen, {klubbNamn}</Text>
    </View>
    <View style={styles.box}>
      <Text style={styles.titleText}>Se dina lag</Text>
    </View>
    <View style={styles.box}>
      <Text style={styles.titleText}>Se matchstatestik</Text>
    </View>

  </View>
  )
}