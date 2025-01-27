import { Link } from 'expo-router';
import { View, Text, StyleSheet,Image } from 'react-native';

function LogoPic(){
    let fileuri=require("../../../assets/images/BuzzLogo.png");
    return(
        <Image style ={styles.image} source ={fileuri}/>
    );
}

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Home Page</Text>
      <LogoPic/>
      <Link href="/details">View details</Link>
      
    </View>
  );
}

const styles = StyleSheet.create({
    image:{
        height: "90%",
        width: "90%",
        alignSelf:'center',
        resizeMode: 'contain',
    },
  container: {
    flex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
