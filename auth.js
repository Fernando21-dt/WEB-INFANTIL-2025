import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.getElementById("loginBtn");
  const nombreUsuario = localStorage.getItem('nombreUsuario');
  if (loginBtn && nombreUsuario) {
    loginBtn.textContent = `Hola, ${nombreUsuario}`;
  }
});
// Registro de usuario
document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("registerUsername").value;
  const email = document.getElementById("registerEmail").value;
  const birthdate = document.getElementById("registerBirthdate").value;
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Validaciones
  if (password !== confirmPassword) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  if (!username.trim()) {
    alert("El nombre de usuario es obligatorio.");
    return;
  }

  if (!birthdate) {
    alert("La fecha de nacimiento es obligatoria.");
    return;
  }

  try {
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Actualizar el perfil del usuario con el nombre de usuario
    await updateProfile(user, {
      displayName: username
    });

    // Guardar datos adicionales en Firestore
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: email,
      birthdate: birthdate,
      createdAt: new Date().toISOString(),
      uid: user.uid,
      profileComplete: true
    });

    alert("¡Cuenta creada correctamente! Bienvenido " + username);
    closeRegisterModal();
    
    // Limpiar el formulario
    document.getElementById("registerForm").reset();
    
  } catch (error) {
    console.error("Error al crear la cuenta:", error);
    
    // Mensajes de error más específicos
    let errorMessage = "Error desconocido";
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = "Este correo electrónico ya está registrado";
        break;
      case 'auth/weak-password':
        errorMessage = "La contraseña debe tener al menos 6 caracteres";
        break;
      case 'auth/invalid-email':
        errorMessage = "Correo electrónico no válido";
        break;
      default:
        errorMessage = error.message;
    }
    
    alert("Error: " + errorMessage);
  }
});

// Login de usuario
document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Obtener datos del usuario desde Firestore
    const userData = await getUserData(user.uid);
    const displayName = userData ? userData.username : user.displayName || user.email;
    localStorage.setItem('nombreUsuario', displayName);
    
    alert("¡Bienvenido de vuelta, " + displayName + "!");
    closeLoginModal();
    
    // Limpiar el formulario
    document.getElementById("loginForm").reset();
    
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    
    // Mensajes de error más específicos
    let errorMessage = "Error desconocido";
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = "No existe una cuenta con este correo electrónico";
        break;
      case 'auth/wrong-password':
        errorMessage = "Contraseña incorrecta";
        break;
      case 'auth/invalid-email':
        errorMessage = "Correo electrónico no válido";
        break;
      case 'auth/too-many-requests':
        errorMessage = "Demasiados intentos fallidos. Intenta más tarde";
        break;
      default:
        errorMessage = error.message;
    }
    
    alert("Error: " + errorMessage);
  }
});

// Función para obtener datos del usuario desde Firestore
async function getUserData(uid) {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No se encontraron datos del usuario");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    return null;
  }
}

// Mostrar y cerrar modales
window.showRegisterForm = function () {
  document.getElementById("registerModal").style.display = "block";
  document.getElementById("loginModal").style.display = "none";
};

window.closeRegisterModal = function () {
  document.getElementById("registerModal").style.display = "none";
};

window.closeLoginModal = function () {
  document.getElementById("loginModal").style.display = "none";
};

// Función para mostrar el modal de login
window.showLoginModal = function () {
  document.getElementById("loginModal").style.display = "block";
};

// Cambia el texto del botón y muestra menú de cuenta si está logueado
// Cambia el texto del botón y muestra menú de cuenta si está logueado
async function actualizarBotonLogin(user) {
  const loginBtn = document.getElementById("loginBtn");
  const accountMenu = document.getElementById("accountMenu");
  
  if (loginBtn) {
    if (user) {
      // Obtener datos adicionales del usuario
      const userData = await getUserData(user.uid);
      const displayName = userData ? userData.username : user.email;
      
      loginBtn.textContent = `Hola, ${displayName}`;
      
      // Modificar el onclick para redirigir al perfil
      loginBtn.onclick = function(e) {
        e.stopPropagation();
        // Redirigir a la página de perfil
        window.location.href = 'perfil.html'; // Cambia por el nombre correcto de tu archivo HTML de perfil
      };
      
      // Opcional: También puedes mantener el menú desplegable si lo prefieres
      // loginBtn.onclick = function(e) {
      //   e.stopPropagation();
      //   if (accountMenu) accountMenu.style.display = accountMenu.style.display === "block" ? "none" : "block";
      // };
      
    } else {
      loginBtn.textContent = "Iniciar Sesión";
      loginBtn.onclick = function() {
        showLoginModal(); // Función para mostrar el modal de login
      };
      if (accountMenu) accountMenu.style.display = "none";
    }
  }
}

// Espera a que el DOM esté listo antes de escuchar el estado de autenticación
document.addEventListener("DOMContentLoaded", function () {
  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function() {
      signOut(auth).then(() => {
        document.getElementById("accountMenu").style.display = "none";
        alert("Sesión cerrada correctamente");
      });
    });
  }

  onAuthStateChanged(auth, async (user) => {
    await actualizarBotonLogin(user);
    if (user) {
      console.log("Usuario activo:", user.email);
      // Obtener y mostrar datos adicionales del usuario
      const userData = await getUserData(user.uid);
      if (userData) {
        console.log("Datos del usuario:", {
          username: userData.username,
          email: userData.email,
          birthdate: userData.birthdate,
          createdAt: userData.createdAt
        });
      }
    } else {
      console.log("Ningún usuario ha iniciado sesión.");
    }
  });

  // Oculta el menú si haces click fuera de él
  document.addEventListener("click", function(e) {
    const accountMenu = document.getElementById("accountMenu");
    const loginBtn = document.getElementById("loginBtn");
    if (accountMenu && loginBtn && accountMenu.style.display === "block") {
      if (!accountMenu.contains(e.target) && e.target !== loginBtn) {
        accountMenu.style.display = "none";
      }
    }
  });
});