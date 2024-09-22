import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { gql, useQuery } from "@apollo/client";

const GET_POSTS = gql`
  query GetPosts {
    getAllPosts {
      _id
      content
      imgUrl
      createdAt
      updatedAt
      tags
      username
    }
  }
`;

const randomImageUrl = `https://picsum.photos/1920/1080?random=${Math.floor(
  Math.random() * 1000
)}`;

export default function HomeScreen({ navigation, route }) {
  const { refresh } = route.params || {};
  const { loading, error, data, refetch } = useQuery(GET_POSTS);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (data && data.getAllPosts) {
      const sortedPosts = data.getAllPosts
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sortedPosts);
    }
  }, [data]);

  useEffect(() => {
    if (refresh) {
      refetch();
    }
  }, [refresh]);

  const handleCreatePost = async () => {
    navigation.navigate("CreatePost", {
      onPostCreated: () => {
        refetch();
      },
    });
  };

  const handlePostPress = (postId) => {
    navigation.navigate("PostDetail", { postId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePostPress(item._id)}
      style={styles.postContainer}
    >
      <View style={styles.headerContainer}>
        <Image source={{ uri: randomImageUrl }} style={styles.profileImage} />
        <View style={styles.usernameContainer}>
          <Text style={styles.username}>{item.username}</Text>
        </View>
      </View>
      {item.imgUrl && (
        <Image source={{ uri: item.imgUrl }} style={styles.postImage} />
      )}
      <Text style={styles.postContent}>{item.content}</Text>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator size="large" color="#00C853" />;
  if (error) return <Text>Error loading posts: {error.message}</Text>;

  return (
    <View style={styles.container}>
      {/* Create Post Button */}
      <TouchableOpacity
        style={styles.createPostButton}
        onPress={handleCreatePost}
      >
        <Text style={styles.createPostButtonText}>Create Post</Text>
      </TouchableOpacity>

      {/* FlatList of Posts */}
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.postsContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  postsContainer: {
    padding: 16,
  },
  postContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  usernameContainer: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212121",
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 8,
  },
  postContent: {
    fontSize: 16,
    color: "#424242",
  },
  createPostButton: {
    backgroundColor: "#00C853",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  createPostButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
