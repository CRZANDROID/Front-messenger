import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../contexts/UserContext';
import { collection, getDocs, setDoc, doc, addDoc, query, where } from "firebase/firestore";
import { Picker } from '@react-native-picker/picker';
import app from '../core/firebase/firebase';
import { getFirestore } from 'firebase/firestore';

const AddChatScreen = () => {
  const [name, setName] = useState('');
  const { currentUser  } = useUser();
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [account, setAccount] = useState('');
  const db = getFirestore(app);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const chatRoomExists = async (participants) => {
    const q = query(collection(db, "chats"), where("participants", "==", participants));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };
  
  const createChatRoom = async () => {
    const participants = [currentUser.email, account].sort();
    if (await chatRoomExists(participants)) {
      Alert.alert('Error', 'Ya existe una sala de chat con estos participantes');
      return;
    }
    const chatRoomId = doc(collection(db, "chats")).id;
    const newChatRoom = {
      id: chatRoomId,
      participants: participants,
      name: name,
    };
    await setDoc(doc(db, "chats", chatRoomId), newChatRoom);
    Alert.alert(`Chat creado correctamente`);
  };

  const handleAddChat = () => {
    createChatRoom();
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => doc.data());
      setUsers(usersList);
      setAccount(usersList[0].email);
    };

    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Image source={require('../../assets/atras.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Chat</Text>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
      </View>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image source={require('../../assets/usuario.png')} style={styles.image} />
        </View>
        <TextInput placeholder="Nombre" style={styles.input} value={name} onChangeText={setName} placeholderTextColor="black"/>
        <View style={styles.input}>
          <Picker
            selectedValue={account}
            onValueChange={(itemValue) => setAccount(itemValue)}
            style={styles.input}
          >
            {users.map((user, index) => (
              user.email != currentUser.email && <Picker.Item key={index} label={user.email} value={user.email}/> 
            ))}
          </Picker>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddChat}>
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#000',
    overflow: 'hidden',
  },
  addButton: {
    backgroundColor: '#FDA156',
    padding: 12,
    borderRadius: 15,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddChatScreen;


