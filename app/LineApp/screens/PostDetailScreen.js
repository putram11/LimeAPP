import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";

const GET_POST_BY_ID = gql`
  query GetPostById($id: ID!) {
    getPostById(id: $id) {
      _id
      content
      tags
      imgUrl
      comments {
        username
        content
      }
      likes {
        username
      }
      username
    }
  }
`;

const ADD_COMMENT = gql`
  mutation AddComment($postId: ID!, $content: String!) {
    addComment(postId: $postId, content: $content)
  }
`;

const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId)
  }
`;

export default function PostDetailScreen({ route }) {
  const { postId } = route.params;
  const [newComment, setNewComment] = useState("");
  const [message, setMessage] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_POST_BY_ID, {
    variables: { id: postId },
    fetchPolicy: "network-only",
  });

  const [addComment, { loading: addingComment }] = useMutation(ADD_COMMENT, {
    onCompleted: (data) => {
      setNewComment("");
      setMessage(data.addComment);
      refetch();
      Alert.alert("Success", data.addComment);
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  const [likePost] = useMutation(LIKE_POST, {
    onCompleted: () => {
      setIsLiked(true);
      refetch();
      Alert.alert("Success", "Post liked!");
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  useEffect(() => {
    refetch();
  }, [postId]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment({
        variables: {
          postId,
          content: newComment,
        },
      });
    }
  };

  const handleLikePost = () => {
    likePost({
      variables: {
        postId,
      },
    });
  };

  if (loading) return <ActivityIndicator size="large" color="#4CAF50" />;
  if (error) return <Text>Error loading post: {error.message}</Text>;

  const { getPostById } = data;

  return (
    <ScrollView style={styles.container}>
      {/* Post Details */}
      <Text style={styles.title}>Post by {getPostById.username}</Text>
      <Text style={styles.content}>{getPostById.content}</Text>

      {/* Tags */}
      {getPostById.tags && getPostById.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {getPostById.tags.map((tag, index) => (
            <Text key={index} style={styles.tag}>
              #{tag}
            </Text>
          ))}
        </View>
      )}

      {/* Image */}
      {getPostById.imgUrl && (
        <Image source={{ uri: getPostById.imgUrl }} style={styles.postImage} />
      )}

      {/* Like button */}
      <TouchableOpacity onPress={handleLikePost} style={styles.likeButton}>
        <Ionicons
          name={isLiked ? "heart" : "heart-outline"}
          size={28}
          color={isLiked ? "#00C853" : "#757575"}
        />
      </TouchableOpacity>
      <Text style={styles.likeCount}>
        {getPostById.likes ? getPostById.likes.length : 0} Likes
      </Text>

      {/* Comments Section */}
      <Text style={styles.sectionTitle}>Comments</Text>
      <View style={styles.commentsSection}>
        {getPostById.comments && getPostById.comments.length > 0 ? (
          getPostById.comments.map((comment, index) => (
            <View key={index} style={styles.commentContainer}>
              <Text style={styles.username}>{comment.username}</Text>
              <Text style={styles.commentContent}>{comment.content}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noComments}>No comments yet.</Text>
        )}
      </View>

      {/* Add Comment */}
      <TextInput
        placeholder="Add a comment..."
        value={newComment}
        onChangeText={setNewComment}
        style={styles.input}
      />
      <Button
        title={addingComment ? "Posting..." : "Comment"}
        onPress={handleAddComment}
        color="#00C853"
        disabled={addingComment}
      />

      {/* Show success message */}
      {message ? <Text style={styles.successMessage}>{message}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 22,
    marginBottom: 16,
    color: "#212121",
    textAlign: "center",
    fontWeight: "600",
  },
  content: {
    fontSize: 16,
    color: "#424242",
    marginBottom: 12,
    textAlign: "center",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 12,
  },
  tag: {
    fontSize: 14,
    color: "#00796B",
    marginRight: 8,
    marginBottom: 8,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  likeButton: {
    alignSelf: "center",
    marginTop: 16,
  },
  likeCount: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
    color: "#212121",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 8,
    marginTop: 16,
  },
  commentsSection: {
    marginBottom: 16,
  },
  commentContainer: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    marginBottom: 8,
    borderRadius: 5,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  username: {
    fontWeight: "600",
    color: "#00796B",
  },
  commentContent: {
    fontSize: 14,
    color: "#424242",
  },
  noComments: {
    textAlign: "center",
    color: "#757575",
    fontSize: 14,
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    marginBottom: 12,
    borderRadius: 5,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  successMessage: {
    marginTop: 16,
    color: "#00C853",
    fontWeight: "600",
    textAlign: "center",
  },
});
