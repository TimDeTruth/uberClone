import { Link, router } from "expo-router";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import {
  FlatList,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RideCard from "@/components/RideCard";
import React, { useState, useEffect } from "react";
import { icons } from "@/constants";
import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import { useLocationStore } from "@/store";
import * as Location from "expo-location";
import { useFetch } from "@/lib/fetch";
import { Ride } from "@/types/type";

// const recentRides = [
//   {
//     ride_id: "1",
//     user_email: "test@test.com",
//     origin_address: "Kathmandu, Nepal",
//     destination_address: "Pokhara, Nepal",
//     origin_latitude: "27.717245",
//     origin_longitude: "85.323961",
//     destination_latitude: "28.209583",
//     destination_longitude: "83.985567",
//     ride_time: 391,
//     fare_price: "19500.00",
//     payment_status: "paid",
//     driver_id: 2,
//     user_id: "1",
//     created_at: "2024-08-12 05:19:20.620007",
//     driver: {
//       driver_id: "2",
//       first_name: "David",
//       last_name: "Brown",
//       profile_image_url:
//         "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
//       car_image_url:
//         "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
//       car_seats: 5,
//       rating: "4.60",
//     },
//   },
//   {
//     ride_id: "2",
//     user_email: "test@test.com",
//     origin_address: "Jalkot, MH",
//     destination_address: "Pune, Maharashtra, India",
//     origin_latitude: "18.609116",
//     origin_longitude: "77.165873",
//     destination_latitude: "18.520430",
//     destination_longitude: "73.856744",
//     ride_time: 491,
//     fare_price: "24500.00",
//     payment_status: "paid",
//     driver_id: 1,
//     user_id: "1",
//     created_at: "2024-08-12 06:12:17.683046",
//     driver: {
//       driver_id: "1",
//       first_name: "James",
//       last_name: "Wilson",
//       profile_image_url:
//         "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
//       car_image_url:
//         "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
//       car_seats: 4,
//       rating: "4.80",
//     },
//   },
//   {
//     ride_id: "3",
//     user_email: "test@test.com",
//     origin_address: "Zagreb, Croatia",
//     destination_address: "Rijeka, Croatia",
//     origin_latitude: "45.815011",
//     origin_longitude: "15.981919",
//     destination_latitude: "45.327063",
//     destination_longitude: "14.442176",
//     ride_time: 124,
//     fare_price: "6200.00",
//     payment_status: "paid",
//     driver_id: 1,
//     user_id: "1",
//     created_at: "2024-08-12 08:49:01.809053",
//     driver: {
//       driver_id: "1",
//       first_name: "James",
//       last_name: "Wilson",
//       profile_image_url:
//         "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
//       car_image_url:
//         "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
//       car_seats: 4,
//       rating: "4.80",
//     },
//   },
//   {
//     ride_id: "4",
//     user_email: "test@test.com",
//     origin_address: "Okayama, Japan",
//     destination_address: "Osaka, Japan",
//     origin_latitude: "34.655531",
//     origin_longitude: "133.919795",
//     destination_latitude: "34.693725",
//     destination_longitude: "135.502254",
//     ride_time: 159,
//     fare_price: "7900.00",
//     payment_status: "paid",
//     driver_id: 3,
//     user_id: "1",
//     created_at: "2024-08-12 18:43:54.297838",
//     driver: {
//       driver_id: "3",
//       first_name: "Michael",
//       last_name: "Johnson",
//       profile_image_url:
//         "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
//       car_image_url:
//         "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
//       car_seats: 4,
//       rating: "4.70",
//     },
//   },
// ];

export default function Page() {
  const { user } = useUser();

  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const [hasPermission, setHasPermission] = useState(false);
  const { signOut } = useAuth();
  // const loading = false;

  const { data: recentRides, loading } = useFetch<Ride[]>(
    `/(api)/ride/${user?.id}`
  );

  const handleSignOut = async () => {
    signOut();

    router.replace("/(auth)/sign-in");
  };
  const handleDestinationSearch = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);

    router.push("/(root)/find-ride");
  };

  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setHasPermission(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        setUserLocation({
          latitude: 37.7749,
          longitude: -122.4194,
          address: address[0] ? `${address[0].name}, ${address[0].region}` : "",
        });
      } catch (error) {
        console.error("Error getting location:", error);
        setHasPermission(false);
      }
    };

    getLocation();
  }, []);

  return (
    <SafeAreaView className="bg-general-500">
      <FlatList
        data={recentRides?.slice(0, 5)}
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
              <View className="flex flex-row items-center justify-between my-5">
                <Text className="text-sm font-JakartaExtraBold">
                  Welcome,{" "}
                  {user?.firstName || user?.emailAddresses[0].emailAddress}👋
                </Text>

                <TouchableOpacity
                  className="justify-center items-center w-10 h-10 rounded-full bg-white"
                  onPress={handleSignOut}
                >
                  <Image source={icons.out} className="w-5 h-5" alt="logout" />
                </TouchableOpacity>
              </View>
              <GoogleTextInput
                icon={icons.search}
                containerStyle="bg-white shadow-md shadow-neutral-200 "
                handlePress={() => {}}
              />

              <>
                <Text className="text-xl font-JakartaBold mt-5 mb-3">
                  Your Current Location
                </Text>
                <View className="flex flex-row items-center bg-transparent h-[300px]">
                  <Map />
                </View>
              </>

              <Text className="text-xl font-JakartaBold mt-5 mb-3">
                Recent Rides
              </Text>
            </>
          );
        }}
      />
    </SafeAreaView>
  );
}

/*       <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
      </SignedIn>
      <SignedOut>
        <Link href="/sign-in">
          <Text>Sign In</Text>
        </Link>
        <Link href="/sign-up">
          <Text>Sign Up</Text>
        </Link>
      </SignedOut> */
