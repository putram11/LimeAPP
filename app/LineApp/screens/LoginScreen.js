import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { gql, useMutation } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";

const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Mutation hook for login
  const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER);

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Username and Password are required.");
      return;
    }

    try {
      const { data } = await loginUser({
        variables: { username, password },
      });

      // Debugging: log token to the console
      const userToken = data?.loginUser?.token;

      if (userToken) {
        await SecureStore.setItemAsync("authToken", userToken);

        // Debugging: alert the token (optional)
        alert(`Login successful! `);

        navigation.replace("Main");
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (e) {
      console.error("Login Error:", e);
      alert(`An error occurred during login: ${e.message || e}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none" // Avoid automatic capitalization of username
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <Button title="Login" onPress={handleLogin} color="#4CAF50" />
      )}

      {error && (
        <Text style={styles.errorText}>
          {error.message || "An error occurred during login."}
        </Text>
      )}

      <Text
        style={styles.registerText}
        onPress={() => navigation.navigate("Register")}
      >
        Don't have an account? Register here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#E8F5E9",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: "#388E3C",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    marginBottom: 12,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  registerText: {
    marginTop: 10,
    color: "#388E3C",
    textAlign: "center",
  },
});
