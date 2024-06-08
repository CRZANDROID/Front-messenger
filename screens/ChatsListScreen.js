import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';

const ChatListScreen = () => {
  const { chats } = useUser(); 
  const navigation = useNavigation(); 

  const renderChatItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.chatItem} onPress={() => navigation.navigate('Chat', { chat: item })}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.lastMessage}>Último mensaje...</Text>
      </TouchableOpacity>
    );
  };

  const handleAddChat = () => {
    navigation.navigate('AddChat');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <View style={styles.titleContainer}>
          <Text style={styles.headerText}>Chats</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddChat}>
          <Image source={require('../assets/agregar.png')} style={styles.addIcon} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.username}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#47D392',
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'space-between',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  titleContainer: {
    flex: 1,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22,
    marginLeft: 16,
  },
  addButton: {
    padding: 8,
    borderRadius: 20,
  },
  addIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  chatItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    marginBottom: 16, // Margen inferior más grande
  },
  chatName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
});

export default ChatListScreen;
