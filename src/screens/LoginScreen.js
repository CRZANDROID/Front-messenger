import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../contexts/UserContext'; 
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../core/firebase/firebase';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { users, login } = useUser(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = () => {
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        console.log(userCredential.user);
        login(userCredential.user);
        navigation.navigate('ChatsList');
      })
      .catch((error) => {
        setError(true);
      });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setError(false);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Login</Text>
      <View style={styles.form}>
        <TextInput
          placeholder="Account"
          placeholderTextColor={'#888'}
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor={'#888'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          style={styles.input}
        />
        {error && <Text style={styles.error}>Usuario o contraseña incorrectos</Text>}
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerLink}>
          <Text style={styles.registerLinkText}>Don't have an account? <Text style={{ color: '#47d392' }}>Register here</Text></Text>
        </TouchableOpacity>
      </View>
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
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  form: {
    width: '80%',
  },
  input: {
    color: 'black',
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#000',
  },
  button: {
    width: '100%',
    backgroundColor: '#FDA156',
    padding: 10,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  registerLink: {
    marginTop: 10,
  },
  registerLinkText: {
    color: '#888',
    fontSize: 14,
  },
});

export default LoginScreen;
