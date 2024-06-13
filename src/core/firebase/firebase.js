import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAf16oOjKMbji6kFNkJvmNqI3CI1HOc0vM",
  authDomain: "mensajes-8d9d4.firebaseapp.com",
  projectId: "mensajes-8d9d4",
  storageBucket: "mensajes-8d9d4.appspot.com",
  messagingSenderId: "237703736730",
  appId: "1:237703736730:web:e573d22ad14f86b4649e23",
  measurementId: "G-ST97YJQGBL"
}

const app = initializeApp(firebaseConfig);

export default app;