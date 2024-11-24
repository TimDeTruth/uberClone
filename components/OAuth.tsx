import { StyleSheet, Text, View, Image, Alert } from "react-native";
import React, { useCallback } from "react";
import CustomButton from "./CustomButton";
import { icons } from "@/constants";
import { useOAuth } from "@clerk/clerk-expo";
import { googleOauth } from "@/lib/auth";
import { router } from "expo-router";

const OAuth = () => {
  const handleGoogleSignIn = async () => {
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

    const handleGoogleSignIn = useCallback(async () => {
      try {
        const result = await googleOauth(startOAuthFlow);

        // if session exists, redirect to home or if user is created successfully
        if (result?.code === "session_exists" || result?.code === "success") {
          Alert.alert("Success", "Session already exists, redirecting to home");
          router.push("/(root)/(tabs)/home");
        }

        Alert.alert(result?.success ? "Success" : "Error", result?.message);
      } catch (error) {
        console.error("OAuth error", error);
      }
    }, []);
  };

  return (
    <View>
      <View className="flex flex-row items-center justify-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-general-100" />
        <Text className="text-lg">Or</Text>
        <View className="flex-1 h-[1px] bg-general-100" />
      </View>

      <CustomButton
        title="Log in with Google"
        className="mt-5 w-full shadow-none"
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode="contain"
            className="w-5 h-5 mx-2"
          />
        )}
        bgVariant="outline"
        textVariant="primary"
        onPress={() => {
          handleGoogleSignIn();
        }}
      />
    </View>
  );
};

export default OAuth;

const styles = StyleSheet.create({});
