import { View, Text } from "react-native";
import React from "react";
import RideLayout from "@/components/RideLayout";

export default function BookRide() {
  return (
    <RideLayout title="Book a ride" snapPoints={["65%", "85%"]}>
      <Text>BookRide</Text>
    </RideLayout>
  );
}
