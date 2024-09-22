import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { gql, useMutation } from "@apollo/client";

const CREATE_POST = gql`
  mutation CreatePost($content: String!, $tags: [String], $imgUrl: String) {
    createPost(content: $content, tags: $tags, imgUrl: $imgUrl)
  }
`;

export default function CreatePostScreen({ navigation }) {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [createPost, { loading, error }] = useMutation(CREATE_POST, {
    onCompleted: () => {
      navigation.navigate("Home", { refresh: true }); // Passing refresh flag instead
    },
  });

  const handleCreatePost = async () => {
    if (!content) {
      alert("Content is required.");
      return;
    }

    try {
      await createPost({
        variables: {
          content,
          tags: tags.split(",").map((tag) => tag.trim()),
          imgUrl,
        },
      });
      alert("Post created successfully");
      navigation.navigate("Home", { refresh: true }); // Navigate with refresh flag
    } catch (e) {
      console.error(e);
      alert("An error occurred while creating the post.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Post</Text>
      <TextInput
        placeholder="Write something..."
        value={content}
        onChangeText={setContent}
        style={styles.input}
        multiline
        numberOfLines={4}
      />

      <TextInput
        placeholder="Tags (comma separated)"
        value={tags}
        onChangeText={setTags}
        style={styles.input}
      />
      <TextInput
        placeholder="Image URL"
        value={imgUrl}
        onChangeText={setImgUrl}
        style={styles.input}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <Button title="Post" onPress={handleCreatePost} color="#4CAF50" />
      )}
      {error && (
        <Text style={styles.errorText}>
          {error.message || "An error occurred while creating the post."}
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
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});
