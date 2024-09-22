import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { gql, useQuery } from "@apollo/client";
import { useIsFocused } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

// Define the GraphQL query with a parameter for user ID
const GET_USER_PROFILE = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      _id
      createdAt
      email
      username
      updatedAt
      followers {
        _id
      }
      following {
        name
      }
      userPosts {
        _id
        content
        imgUrl
      }
    }
  }
`;

export default function ProfileScreen({ route }) {
  const { id } = route.params;

  // Correctly passing the variable as `id`
  const { data, loading, error, refetch } = useQuery(GET_USER_PROFILE, {
    variables: { id },
  });

  const isFocused = useIsFocused();

  // Refetch when the screen is focused
  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]);

  if (loading) {
    return <ActivityIndicator size="large" color="#4CAF50" />;
  }
  if (error) {
    return <Text>Error fetching user profile: {error.message}</Text>;
  }

  const { getUserById } = data;

  const renderHeader = () => (
    <View style={styles.headerBackground}>
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: `https://picsum.photos/1920/1080?random=${Math.floor(
              Math.random() * 1000
            )}`,
          }}
          style={styles.profileImage}
        />
        <Text style={styles.title}>
          {getUserById.username || "No Name Available"}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statsCard}>
          <Ionicons name="people" size={24} color="#4CAF50" />
          <Text style={styles.statsNumber}>
            {getUserById.followers?.length || 0}
          </Text>
          <Text style={styles.statsLabel}>Followers</Text>
        </View>

        <View style={styles.statsCard}>
          <Ionicons name="person-add" size={24} color="#4CAF50" />
          <Text style={styles.statsNumber}>
            {getUserById.following?.length || 0}
          </Text>
          <Text style={styles.statsLabel}>Following</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Posts</Text>
    </View>
  );

  return (
    <FlatList
      data={getUserById.userPosts || []}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={renderHeader}
      renderItem={({ item }) => (
        <View style={styles.postCard}>
          {item.imgUrl && (
            <Image source={{ uri: item.imgUrl }} style={styles.postImage} />
          )}
          <Text style={styles.postContent}>{item.content}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9F7EF",
  },
  headerBackground: {
    backgroundColor: "#81C784",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  statsCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  statsNumber: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 8,
    color: "#388E3C",
  },
  statsLabel: {
    fontSize: 14,
    color: "#777",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 10,
    color: "#388E3C",
  },
  postCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  postContent: {
    fontSize: 16,
    color: "#333",
  },
});
