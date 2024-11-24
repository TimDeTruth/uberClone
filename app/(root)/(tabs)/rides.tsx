import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  View,
} from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { useFetch } from "@/lib/fetch";
import { Ride } from "@/types/type";
import RideCard from "@/components/RideCard";

const Rides = () => {
  const { user } = useUser();

  const { data: recentRides, loading } = useFetch<Ride[]>(
    `/(api)/ride/${user?.id}`
  );

  return (
    <SafeAreaView className="bg-general-500">
      <FlatList
        data={recentRides}
        renderItem={({ item }) => <RideCard ride={item} />}
        className="px-4"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={() => {
          return (
            <View className="flex flex-col  items-center justify-center">
              {!loading ? (
                <>
                  <Image
                    source={require("@/assets/images/no-result.png")}
                    className="w-40 h-40"
                    alt="no rides found"
                    resizeMode="contain"
                  />
                  <Text className="text-sm">No recent rides found</Text>
                </>
              ) : (
                <ActivityIndicator size="large" color="#000" />
              )}
            </View>
          );
        }}
        ListHeaderComponent={() => {
          return (
            <>
              <Text className="text-2l font-JakartaBold my-5">All Rides</Text>
            </>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default Rides;

const styles = StyleSheet.create({});
