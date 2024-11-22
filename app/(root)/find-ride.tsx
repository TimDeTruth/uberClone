import { Text, View } from "react-native";
import { useLocationStore } from "@/store";

const FindRide = () => {
  const {
    userAddress,
    destinationAddress,
    setDestinationLocation,
    setUserLocation,
  } = useLocationStore();
  return (
    <View>
      <Text className="text-2xl">Your are here: {userAddress}</Text>
      <Text className="text-2xl">Your are going to: {destinationAddress}</Text>
    </View>
  );
};
export default FindRide;
