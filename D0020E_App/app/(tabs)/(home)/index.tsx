import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';

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
    borderRadius: 20,
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
  const klubbNamn = ["Clubb Name"]
  return(
  <View
  style={styles.container}
  >
    <View style={styles.box1}>
      <Text style={styles.titleText}>Välkommen, {klubbNamn}</Text>
    </View>
    <Pressable
        style={styles.box}
        onPress={() => router.push("/(tabs)/(index)/clubbView")}
    >
      <Text style={styles.titleText}>Se dina lag</Text>
    </Pressable>
    <View style={styles.box}>
      <Text style={styles.titleText}>Se matchstatestik</Text>
    </View>

  </View>
  )
}