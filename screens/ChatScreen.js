import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, FlatList, PermissionsAndroid, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useUser } from '../contexts/UserContext';

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { chat } = route.params;
  const { messages, addMessageToChat } = useUser(); // Obtener mensajes y función para añadir mensajes del contexto
  const [message, setMessage] = useState('');
  const scrollViewRef = useRef();

  const chatMessages = messages[chat.id] || []; // Obtener los mensajes del chat actual

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        text: message,
        id: Date.now().toString(),
        timestamp: new Date(),
        sent: true,
      };
      addMessageToChat(chat.id, newMessage); // Añadir mensaje al contexto
      setMessage('');
    }
  };

  const handleOpenMedia = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Permiso de acceso a almacenamiento',
          message: 'Esta aplicación necesita acceso a su almacenamiento para seleccionar imágenes.',
          buttonNeutral: 'Preguntar más tarde',
          buttonNegative: 'Cancelar',
          buttonPositive: 'Aceptar',
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permiso de almacenamiento denegado');
        return;
      }
    }

    launchImageLibrary({}, (response) => {
      if (response.didCancel) {
        console.log('Usuario canceló la selección de imagen');
      } else if (response.error) {
        console.log('Error: ', response.error);
      } else {
        console.log('Imagen seleccionada: ', response.assets[0]);
        // Puedes agregar la imagen seleccionada al estado de mensajes aquí si es necesario
      }
    });
  };

  const renderMessageItem = ({ item }) => {
    const messageStyle = item.sent ? styles.sentMessage : styles.receivedMessage;
    return (
      <View style={[styles.messageItem, messageStyle]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTime}>{item.timestamp.toLocaleTimeString()}</Text>
      </View>
    );
  };

  const renderDateLabel = (date) => {
    return (
      <View style={styles.dateLabelContainer}>
        <Text style={styles.dateLabel}>{date.toLocaleDateString()}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image source={require('../assets/atras.png')} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerText}>{chat.name}</Text>
        </View>
        <ScrollView
          style={styles.messageList}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        >
          {chatMessages.length > 0 && renderDateLabel(chatMessages[0].timestamp)}
          {chatMessages.map((item) => (
            <React.Fragment key={item.id}>
              {renderMessageItem({ item })}
            </React.Fragment>
          ))}
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.mediaButton} onPress={handleOpenMedia}>
            <Image source={require('../assets/multimedia.png')} style={styles.mediaIcon} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Escribe un mensaje..."
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Image source={require('../assets/enviar.png')} style={styles.sendIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    marginLeft: 16,
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  messageItem: {
    padding: 8,
    borderRadius: 10,
    marginBottom: 16,
    maxWidth: '80%',
    borderWidth: 1,
    borderColor: 'black',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#CCC',
  },
  mediaButton: {
    marginRight: 8,
  },
  mediaIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  sendButton: {
    marginLeft: 8,
  },
  sendIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  dateLabelContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dateLabel: {
    backgroundColor: '#EEE',
    padding: 4,
    borderRadius: 8,
    color: '#888',
  },
});

export default ChatScreen;
