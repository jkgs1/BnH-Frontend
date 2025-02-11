import React, {useState, useRef} from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, TouchableOpacityProps, ScrollView } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';

// Define TypeScript interfaces for props
interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  style?: object;
}



const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, style }) => {
  
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};
// pointcounter, unused
const incrementCountRef = useRef<(number: number) => number>();
const pointCounter = () => {
  const [pointCount, setCount] = useState<number>(0);
  incrementCountRef.current = (number: number) => {
    setCount((prevCount) => prevCount + number);
    return pointCount + number; 
  };

  return (
    <View style={styles.container}>
      <Text>{pointCount}</Text>
    </View>
  );
};

const PlayerButtons: React.FC<{ start: number; end: number; toggleShow: () => void }> = ({ start, end, toggleShow }) => {
  const players = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  return (
    <>
      {players.map((player, index) => {
        if (index % 2 === 0) {
          return (
            <View
              key={player}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                //width: '70%',
                flex:1,
                marginVertical: '2%',
                marginHorizontal:'2%',
              }}
            >
              <CustomButton
                title={`P${player}`}
                onPress={() => {
                  if (player >= 1 && player <= 4) toggleShow(); 
                }}
                style={styles.playerButton}
              />
              {players[index + 1] && (
                <CustomButton
                  title={`P${players[index + 1]}`}
                  onPress={() => {
                    if (players[index + 1] >= 1 && players[index + 1] <= 4) toggleShow(); 
                  }}
                  style={styles.playerButton}
                />
              )}
            </View>
          );
        }
        return null;
      })}
    </>
  );
};


const PointButtons: React.FC<{ start: number; end: number;toggleShow: () => void }> = ({ start, end, toggleShow }) => {
  const points = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '70%',marginHorizontal:'8%',}}>
      {points.map((point) => (
        <CustomButton
          key={point}
          title={`${point} Point`}
          onPress={() => toggleShow()}
          style={styles.playerButton}
        />
      ))}
    </View>
  );
};

const CircleHeader=()=> {
  const [timeoutsLeft, setTimeoutsLeft] = useState<number>(3);
  const [foulsLeft, setFoulsLeft] = useState<number>(1);
  const [timeoutsRight, setTimeoutsRight] = useState<number>(3);
  const [foulsRight, setFoulsRight] = useState<number>(1);

  const renderInfoCircles = (count: number, total: number) => {
    return Array.from({ length: total }).map((_, index) => (
      <View
        key={index}
        style={[
          styles.infoCircle,
          index < count ? styles.filledInfoCircle : styles.emptyInfoCircle,
        ]}
      />
    ));
  };
  return (
    <View style={styles.headerInfoCirclesContainer}>
      <View style={{alignItems:"center"}}>
        <Text style={{fontSize:14,fontWeight:"bold"}}>Timeout:</Text>
        <View style={{flexDirection:"row",marginBottom:8,}}>
          {renderInfoCircles(timeoutsLeft, 3)}
        </View>
        <Text style={{fontSize:14,fontWeight:"bold"}}>Foul</Text>
        <View style={{flexDirection:"row",marginBottom:8,}}>
          {renderInfoCircles(foulsLeft, 5)}
        </View>
      </View>

      <View style={{alignItems:"center",}}>
        <Text style={{fontSize:14,fontWeight:"bold"}}>Timeout</Text>
        <View style={{flexDirection:"row"}}>
          {renderInfoCircles(timeoutsRight, 3)}
        </View>
        <Text style={{fontSize:14,fontWeight:"bold"}}>Foul</Text>
        <View style={{flexDirection:"row"}}>
          {renderInfoCircles(foulsRight, 5)}
        </View>
      </View>

    </View>
  )
}
const Tab: React.FC = () => {
  const[show, setShow]=useState(false);
  const toggleShow = () => setShow(!show);
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[styles.container, { flexDirection: 'column' }]}>
<<<<<<< HEAD
        
        <View style={{ flex: 1, backgroundColor: 'lightgrey' }}>
          <Text style={{ textAlign: "left", textAlignVertical: 'bottom' }}>Hello world</Text>
=======
        {/* Header/ Match status box */}
        <View style={styles.matchStatsBox}>
          <View style={styles.pointBox}>
            <Text style={{color:"white", fontSize:64,}}>12-12</Text>
          </View>
>>>>>>> 3823c74d1e0729ec3559379db9fea8b281d67ca2
        </View>
        <CircleHeader />

        <View style={styles.buttonBox}>

          {/* Left Section for home players */}
          <View style={[styles.teamPlayers, { backgroundColor: 'grey', alignItems: 'center' }]}>
            
            {/*Button the change players */}
            <CustomButton
              title="Byte"
              onPress={() => Alert.alert('Button Pressed', 'You clicked byte')}
              style={{ backgroundColor: 'purple', paddingVertical: 5, top: 0, position: 'absolute', }}
            />

            
            {/* First Four Buttons for players on the court */}
            <PlayerButtons start={1} end={4} toggleShow={toggleShow}/>

            {/* Middle Single Button, player on court */}
            <View style={{ flex:1, marginVertical: '2%',marginHorizontal:'2%', alignItems: 'center' }}>
              <CustomButton
                title="P5"
                onPress={toggleShow}
                style={styles.playerButton}
              />
              
            </View>
            
            {/* Next Six Buttons for players on the bench */}
            <PlayerButtons start={6} end={11} toggleShow={()=>{}}/>

            {/* Bottom Button, last player on bench */}
            <View style={{ flex:1, marginVertical: '2%', marginHorizontal:'2%', alignItems: 'center' }}>
              <CustomButton
                title="P12"
                onPress={() => Alert.alert('Button Pressed', 'You clicked Player 12!')}
                style={styles.playerButton}
              />
            </View>
          </View>

          {/* Middle Section still in progress */}
          <View style={[styles.teamPlayers, { backgroundColor: 'black' }]}>
            {show && <ActionView />}
          </View>

          {/* Right Section is for the away team */}
          <View style={[styles.teamPlayers, { backgroundColor: 'grey' }]}>
            <CustomButton
              title="Byte"
              onPress={() => Alert.alert('Button Pressed', 'You clicked the Byte button!')}
              style={{ backgroundColor: 'purple', paddingVertical: 5 }}
            />
          </View>
        </View>
        
      </View>
    </ScrollView>
  );
};


const ActionView: React.FC  =()=>{
  const[show, setShow]=useState(false);
  const toggleShow = () => setShow(!show);

  return(
    <View style={styles.actionWindowView}>
      
      {/*Knapp för poäng 1-3 */}
      <View >
        <PointButtons start={1} end={3} toggleShow={toggleShow}/>
      </View>

      {/*Knapp för fouls */}
      <View style={{justifyContent: 'space-between', width: '70%', alignSelf: 'center',}}>
        <CustomButton
            title={'FOUL'}
            onPress={() => setShow(false)}
            style={styles.playerButton}
          />
      </View>
      
    </View>
  )
}


//https://stackoverflow.com/questions/68494075/how-can-i-make-a-button-change-what-components-are-showing-in-react-native
//Link for action buttens. open up a new view


const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "auto",
  },
  pointBox:{
    borderColor: "black",
    borderWidth: 2,
    backgroundColor: "green",
    width: "auto",
    height: "auto",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  matchStatsBox:{ 
    backgroundColor: 'pink',
    alignItems: "center",
    justifyContent: "center",
    height: 300,
  },
  teamPlayers: {
    paddingVertical: '5%',
    paddingHorizontal: '5%',
    flex: 1,
  },
  infoCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  filledInfoCircle: {
    backgroundColor: "red",
  },
  emptyInfoCircle: {
    backgroundColor: "lightgrey",
    borderWidth: 1,
    borderColor: "gray",
  },
  headerInfoCirclesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'pink',
  },
  button: {
    borderRadius: 3,
    backgroundColor: 'blue',
    alignSelf: 'center',
    paddingHorizontal: "20%",
    paddingVertical: "10%",
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  playerButton: {
    backgroundColor: 'blue',
    width: '15%', // Square button
    aspectRatio: 1, // Ensures square shape
    marginVertical: '1%',
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonBox: {
    flex: 2,
    backgroundColor: "gray",
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "red",
  },
  actionWindowView:{
    flexDirection: 'column',
    width: '120%',
    height: '45%',
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 10,
    position: 'absolute',
    top: 0, // Centers vertically
    alignSelf: 'center', // Centers horizontally
    transform: [{ translateY: -80 }], // Adjusts for exact centering
  }
});

export default Tab;