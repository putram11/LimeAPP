import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { gql, useMutation } from "@apollo/client";

// Define the Register mutation
const REGISTER_USER = gql`
  mutation RegisterUser(
    $name: String!
    $username: String!
    $email: String!
    $password: String!
  ) {
    registerUser(
      name: $name
      username: $username
      email: $email
      password: $password
    ) {
      _id
      name
      username
      email
    }
  }
`;

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Use mutation hook
  const [registerUser, { data, loading, error }] = useMutation(REGISTER_USER);

  const handleRegister = async () => {
    try {
      // Execute the mutation and pass the form data as variables
      const { data } = await registerUser({
        variables: { name, username, email, password },
      });

      if (data) {
        alert("Registration successful");
        navigation.navigate("Login"); // Navigate to Login screen after successful registration
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred during registration.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button
        title={loading ? "Registering..." : "Register"}
        onPress={handleRegister}
        color="#4CAF50"
        disabled={loading}
      />

      {error && (
        <Text style={{ color: "red", marginTop: 10, textAlign: "center" }}>
          {error.message}
        </Text>
      )}
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
});
