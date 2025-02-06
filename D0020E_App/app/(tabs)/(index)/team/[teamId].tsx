// app/team/[teamId].js
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function TeamDetails() {
  const { teamId } = useLocalSearchParams(); // Access the dynamic `teamId`
  return (
    <View>
      <Text>Team Details for ID: {teamId}</Text>
    </View>
  );
}