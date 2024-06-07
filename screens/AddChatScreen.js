import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AddChatScreen = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Image source={require('../assets/atras.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Chat</Text>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image source={require('../assets/usuario.png')} style={styles.image} />
        </View>
        
        <TextInput placeholder="Nombre" style={styles.input} />
        <TextInput placeholder="Cuenta" style={styles.input} />
        
        <TouchableOpacity style={styles.addButton}>
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
  
  titleContainer: {
    flex: 2,
  },
  
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22,
    marginLeft: 16,
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
