// firebase-config.js

// ✅ TODAS las importaciones con la MISMA versión
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB2lW0KYtnmyqrLLA-L6mhrvMIVDFr1ICM",
  authDomain: "web-infantil.firebaseapp.com",
  projectId: "web-infantil",
  storageBucket: "web-infantil.firebasestorage.app",
  messagingSenderId: "906393909749",
  appId: "1:906393909749:web:2804f838c60f7f08fe08bc",
  measurementId: "G-WFYBJR35D2"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa servicios con manejo de errores
let analytics;
let auth;
let db;

try {
  analytics = getAnalytics(app);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error("Error al inicializar Firebase:", error);
}

// Exporta los servicios
export { auth, db, analytics };