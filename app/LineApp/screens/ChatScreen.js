import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const randomImageUrl = (index) =>
  `https://picsum.photos/100/100?random=${index}`;

const chatData = Array.from({ length: 10 }, (_, index) => ({
  id: index.toString(),
  username: `User ${index + 1}`,
  lastMessage: `This is the last message from User ${index + 1}`,
  imageUrl: randomImageUrl(index),
}));

const ChatScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.profileImage} />
      <View style={styles.chatContent}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
  },
  list: {
    padding: 16,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
    borderRadius: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#388E3C",
  },
  lastMessage: {
    fontSize: 14,
    color: "#424242",
  },
});

export default ChatScreen;
