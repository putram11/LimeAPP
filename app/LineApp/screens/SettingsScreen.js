import React from "react";
import { View, Button, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";

export default function SettingsScreen({ navigation }) {
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("authToken"); // Remove token from SecureStore
    navigation.replace("Login"); // Navigate to login screen
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} color="#F44336" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
  },
});
