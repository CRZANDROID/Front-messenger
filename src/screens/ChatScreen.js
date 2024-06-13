import React, { useState, useEffect, useRef} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, PermissionsAndroid, Platform, Alert, KeyboardAvoidingView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useUser } from '../contexts/UserContext';
import app from '../core/firebase/firebase';
import { getFirestore, addDoc, collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { FlatList } from 'react-native-gesture-handler';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { chat } = route.params;
  const { messages, addMessageToChat, currentUser} = useUser(); 
  const [messagesFB, setMessagesFB] = useState([]);
  const [message, setMessage] = useState('');
  const scrollViewRef = useRef();
  const db = getFirestore(app);
  const storage = getStorage(app);

  const chatMessages = messages[chat.id] || []; 

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        text: message,
        id: Date.now().toString(),
        timestamp: new Date(),
        sent: true,
      };
      addMessageToChat(chat.id, newMessage);
      console.log('Mensaje enviado:', currentUser.email, recivePersonGenerate())
      addMessageToFirestore(chat.id, message, currentUser.email, recivePersonGenerate(), 'text');
      setMessage('');
    }
  };

  useEffect(() => {
    const messagesCollection = collection(db, "messages");
  
    const q = query(
      messagesCollection,
      where("chatId", "==", chat.id),
      orderBy("timestamp", "asc")
    );
  
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedMessages = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        const data = doc.data();
        loadedMessages.push({
          id: doc.id,
          message: data.message,
          sender: data.sender,
          receiver: data.receiver,
          chatId: data.chatId,
          messageType: data.messageType,
          timestamp: data.timestamp,
        });
      });
      console.log('Mensajes cargados:', loadedMessages);
      setMessagesFB(loadedMessages);
      });
      
    console.log('Mensajes:', messages); 
    return unsubscribe;
  }, [chat.id]);

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      console.log('Solicitando permiso de almacenamiento');
      try {
        console.log('Solicitando permiso de almacenamiento try');
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
        console.log('Permiso de almacenamiento concedido:', granted === PermissionsAndroid.RESULTS.GRANTED);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.log(err);
        return false;
      }
    }
    return true; 
  };

  const addMessageToFirestore = async (chatId, message, sender, receiver, messageType) => {
    const newMessage = {
      message: message,
      sender: sender,
      receiver: receiver,
      chatId: chatId,
      messageType: messageType,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
  
    await addDoc(collection(db, "messages"), newMessage);
  };


  const recivePersonGenerate = () => {
    if (chat.participants[0] == currentUser.email) {
      return chat.participants[1];
    } else {
      return chat.participants[0];
    }
  }
  

  const handleOpenMedia = async () => {
    // TODO: SOLICITAR PERMISO DE ALMACENAMIENTO DA ERROR Y LA LIBRERIA FUNCIONA BIEN SIN EL PERMISO
    // const hasPermission = await requestStoragePermission();
    // if (!hasPermission) {
    //   Alert.alert('Permiso denegado', 'No se puede acceder a la galería sin permisos');
    //   return;
    // }

    launchImageLibrary({}, (response) => {
      if (response.didCancel) {
        console.log('Usuario canceló la selección de imagen');
      } else if (response.errorCode) {
        console.log('Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        console.log('Imagen seleccionada: ', asset);
  
        // Convertir la imagen en un blob
        fetch(asset.uri)
          .then(res => res.blob())
          .then(blob => {
            // Crear una referencia a 'images/mountains.jpg'
            var imageRef = ref(storage, 'images/' + Date.now());
  
            // Subir la imagen al storage de Firebase
            const uploadTask = uploadBytesResumable(imageRef, blob);
  
            // Escuchar los eventos de cambio de estado, como el progreso, la pausa y la reanudación
            // Obtener la URL de descarga cuando la subida se haya completado
            uploadTask.on('state_changed',
              (snapshot) => {
                // Progreso de la subida
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
              }, 
              (error) => {
                // Manejar errores
                console.error("Error uploading image: ", error);
              }, 
              () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  console.log('File available at', downloadURL);
                  // Aquí es donde enviarías el mensaje con downloadURL como contenido
                  const newMessage = {
                    text: 'Imagen',
                    id: Date.now().toString(),
                    timestamp: new Date(),
                    sent: true,
                    image: downloadURL, // Usar la URL de descarga como el contenido del mensaje
                  };
                  addMessageToFirestore(chat.id, newMessage.image, currentUser.email, recivePersonGenerate(), 'image');
                });
              }
            );
          })
          .catch((error) => {
            console.error("Error converting image to blob: ", error);
          });
      }
    });
  };

  const renderMessageItem = (item) => {
    console.log('Item:', item);
    const messageStyle = item.receiver != currentUser.email ? styles.sentMessage : styles.receivedMessage;
    return (
      <View style={[styles.messageItem, messageStyle]}>
        {item.messageType == 'image' ? (
          <Image source={{ uri: item.message }} style={styles.messageImage} />
        ) : (
          <Text style={styles.messageText}>{item.message}</Text>
        )}
        <Text style={styles.messageTime}>{item.timestamp}</Text>
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
            <Image source={require('../../assets/atras.png')} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerText}>{chat.name}</Text>
        </View>
          <FlatList
          style={styles.messageList}
          data={messagesFB}
          renderItem={({item})=>{
            console.log('Item:', item);
            return renderMessageItem(item);
          }}
          >
          </FlatList>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.mediaButton} onPress={handleOpenMedia}>
            <Image source={require('../../assets/multimedia.png')} style={styles.mediaIcon} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Escribe un mensaje..."
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Image source={require('../../assets/enviar.png')} style={styles.sendIcon} />
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
  messageImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
});

export default ChatScreen;
