import React, { useState, useEffect } from 'react';
import { query, where, getDocs, getFirestore, collection, orderBy, limit, onSnapshot } from "firebase/firestore";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import app from '../core/firebase/firebase';

const ChatListScreen = () => {
  const { chats, messages, currentUser } = useUser(); 
  const navigation = useNavigation(); 
  const db = getFirestore(app);
  const [userChats, setUserChats] = useState([]);

  useEffect(() => {
    let messageUnsubscribes = []; 
  
    const chatsRef = collection(db, "chats");
    const unsubscribeChats = onSnapshot(query(chatsRef, where("participants", "array-contains", currentUser.email)), (querySnapshot) => {
      const chatsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      const fetchMessages = async () => {
        const fetchChatLastMessage = (chat, index) => {
          const messagesRef = collection(db, "messages");
          const unsubscribeMessage = onSnapshot(query(messagesRef, where("chatId", "==", chat.id), orderBy("timestamp", "desc"), limit(1)), (messageSnapshot) => {
            const messagesData = messageSnapshot.docs.map(doc => doc.data());
            if (messagesData.length > 0) {
              chatsData[index].lastMessage = messagesData[0];
            }
            setUserChats([...chatsData]);
          });
          return unsubscribeMessage;
        };
        messageUnsubscribes.forEach(unsubscribe => unsubscribe());
  
        messageUnsubscribes = chatsData.map(fetchChatLastMessage);
      };
  
      fetchMessages();
    });

    return () => {
      unsubscribeChats();
      messageUnsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  const renderChatItem = ({ item }) => {
    const lastMessage = item.lastMessage; 

    return (
      <TouchableOpacity style={styles.chatItem} onPress={() => navigation.navigate('Chat', { chat: item })}>
        <Text style={styles.chatName}>{item.name}</Text>
        {
          lastMessage?.messageType == 'text' ? <Text style={styles.lastMessage}>{lastMessage?.message}</Text> : <Text style={styles.lastMessage}>{lastMessage && 'imagen'}</Text>
        }
        <Text style={styles.lastMessageTime}>{lastMessage?.timestamp}</Text>
        </TouchableOpacity>
    );
  };

  const handleAddChat = () => {
    navigation.navigate('AddChat');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <View style={styles.titleContainer}>
          <Text style={styles.headerText}>Chats</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddChat}>
          <Image source={require('../../assets/agregar.png')} style={styles.addIcon} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={userChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id.toString()}
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
    marginBottom: 16, 
  },
  chatName: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  lastMessageTime: {
    fontSize: 12,
    color: '#888',
    position: 'absolute',
    right: 16,
    top: 16,
  },
});

export default ChatListScreen;


