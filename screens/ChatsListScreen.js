import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUser } from '../contexts/UserContext'; 

const ChatListScreen = () => {
    const { users } = useUser(); // Obtener la lista de usuarios del contexto de usuario

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Lista de Usuarios</Text>
        {users.map(user => (
          <View key={user.id} style={styles.user}>
            <Text>Nombre de Usuario: {user.username}</Text>
            <Text>Contraseña: {user.password}</Text>
          </View>
        ))}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    user: {
      marginBottom: 10,
      padding: 10,
      backgroundColor: '#fff',
      borderRadius: 5,
      width: '80%',
    },
  });
  
  export default ChatListScreen;
