import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { gql, useQuery, useMutation } from "@apollo/client";

// Define the GraphQL query for searching users
const SEARCH_USERS = gql`
  query SearchUsers($keyword: String!) {
    searchUsers(keyword: $keyword) {
      _id
      name
    }
  }
`;

// Define the mutation for following a user
const FOLLOW_USER = gql`
  mutation FollowUser($followingId: ID!) {
    followUser(followingId: $followingId)
  }
`;

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [followUser] = useMutation(FOLLOW_USER, {
    onCompleted: () => {
      Alert.alert("Success", "Followed successfully");
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  const { data, loading, error } = useQuery(SEARCH_USERS, {
    variables: { keyword: searchQuery },
    skip: searchQuery.length < 3,
  });

  const handleFollowPress = (userId) => {
    followUser({ variables: { followingId: userId } });
  };

  const handleUserPress = (userId) => {
    const id = userId;
    console.log("Navigating to UserProfile with userId:", id); // Add this to check if the press works
    navigation.navigate("UserProfile", { id });
  };

  if (loading) return <ActivityIndicator size="large" color="#4CAF50" />;
  if (error) return <Text>Error fetching users: {error.message}</Text>;

  const users = data ? data.searchUsers : [];

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search user..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.input}
      />
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.userContainer}>
            <TouchableOpacity onPress={() => handleUserPress(item._id)}>
              <Text style={styles.user}>{item.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleFollowPress(item._id)}
              style={styles.followButton}
            >
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#E8F5E9",
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    marginBottom: 12,
    borderRadius: 5,
  },
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    borderRadius: 5,
  },
  user: {
    fontSize: 16,
  },
  followButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
  },
  followButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
