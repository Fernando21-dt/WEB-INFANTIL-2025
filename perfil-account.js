import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, updatePassword, deleteUser, signOut } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
// Cerrar sesión desde el botón de perfil
document.addEventListener('DOMContentLoaded', function() {
  var btnLogout = document.getElementById('logoutBtnPerfil');
  if (btnLogout) {
    btnLogout.addEventListener('click', function() {
      signOut(auth).then(() => {
        window.location.href = 'index.html';
      }).catch((error) => {
        alert('Error al cerrar sesión: ' + error.message);
      });
    });
  }
});
import { doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

let currentUser = null;
let userData = null;

// Función para calcular la edad
function calculateAge(birthdate) {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

// Función para formatear fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Función para obtener datos del usuario
async function getUserData(uid) {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            throw new Error("No se encontraron datos del usuario");
        }
    } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        throw error;
    }
}

// Función para mostrar los datos del perfil
function displayProfile(user, data) {
    // Información básica
    document.getElementById('perfilName').textContent = data.username || user.displayName || 'Usuario';
    document.getElementById('perfilEmail').textContent = user.email;

    // Avatar: solo actualiza la inicial y el fondo, no el innerHTML
    const avatar = document.getElementById('perfilAvatar');
    const initial = (data.username || user.email).charAt(0).toUpperCase();
    // Actualiza el span de la inicial si existe
    let span = document.getElementById('avatarInicial');
    if (!span) {
        span = document.createElement('span');
        span.id = 'avatarInicial';
        span.style.zIndex = '1';
        span.style.position = 'relative';
        avatar.prepend(span);
    }
    span.textContent = initial;
    span.style.display = '';
    // Limpia el fondo si hay uno anterior
    avatar.style.backgroundImage = '';

    // Información detallada
    document.getElementById('perfilInfoUsername').textContent = data.username || 'No especificado';
    document.getElementById('perfilInfoEmail').textContent = user.email;
    document.getElementById('perfilInfoBirthdate').textContent = data.birthdate ? formatDate(data.birthdate) : 'No especificado';
    document.getElementById('perfilInfoAge').textContent = data.birthdate ? `${calculateAge(data.birthdate)} años` : 'No especificado';
    document.getElementById('perfilInfoJoinDate').textContent = data.createdAt ? formatDate(data.createdAt) : 'No disponible';
    document.getElementById('perfilInfoLastLogin').textContent = user.metadata && user.metadata.lastSignInTime
        ? formatDate(user.metadata.lastSignInTime)
        : 'Ahora';
}

// Función para cargar el perfil
async function loadProfile() {
    try {
        document.getElementById('perfilLoadingSection').style.display = 'block';
        document.getElementById('perfilProfileContent').style.display = 'none';
        document.getElementById('perfilErrorSection').style.display = 'none';

        if (!currentUser) {
            throw new Error("No hay usuario autenticado");
        }

        userData = await getUserData(currentUser.uid);
        displayProfile(currentUser, userData);

        document.getElementById('perfilLoadingSection').style.display = 'none';
        document.getElementById('perfilProfileContent').style.display = 'block';

    } catch (error) {
        console.error("Error cargando perfil:", error);
        document.getElementById('perfilLoadingSection').style.display = 'none';
        document.getElementById('perfilErrorSection').style.display = 'block';
        document.getElementById('perfilErrorText').textContent = error.message;
    }
}

// Funciones globales
window.goBack = function() {
    if (document.referrer) {
        window.history.back();
    } else {
        window.location.href = 'index.html';
    }
};

window.retryLoad = function() {
    loadProfile();
};

window.editProfile = function() {
    alert('🚧 Función de editar perfil en desarrollo');
};

window.changePassword = function() {
    const newPassword = prompt('Ingresa tu nueva contraseña (mínimo 6 caracteres):');
    if (newPassword && newPassword.length >= 6) {
        updatePassword(currentUser, newPassword)
            .then(() => {
                alert('✅ Contraseña actualizada correctamente');
            })
            .catch((error) => {
                alert('❌ Error al cambiar contraseña: ' + error.message);
            });
    } else if (newPassword) {
        alert('❌ La contraseña debe tener al menos 6 caracteres');
    }
};

window.downloadData = function() {
    if (userData && currentUser) {
        const dataToDownload = {
            username: userData.username,
            email: currentUser.email,
            birthdate: userData.birthdate,
            createdAt: userData.createdAt,
            uid: currentUser.uid
        };
        const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], 
            { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `perfil_${userData.username || 'usuario'}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
};

window.confirmDeleteAccount = function() {
    const confirmation = confirm(
        '⚠️ ¿Estás seguro de que quieres eliminar tu cuenta?\n\n' +
        'Esta acción NO se puede deshacer y perderás todos tus datos.\n\n' +
        'Escribe "ELIMINAR" para confirmar:'
    );
    if (confirmation) {
        const finalConfirm = prompt('Escribe "ELIMINAR" para confirmar:');
        if (finalConfirm === 'ELIMINAR') {
            deleteAccount();
        }
    }
};

async function deleteAccount() {
    try {
        await deleteDoc(doc(db, "users", currentUser.uid));
        await deleteUser(currentUser);
        alert('✅ Cuenta eliminada correctamente');
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Error eliminando cuenta:", error);
        alert('❌ Error al eliminar cuenta: ' + error.message);
    }
}

// Escuchar cambios de autenticación
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        loadProfile();
    } else {
        alert('❌ Debes iniciar sesión para ver tu perfil');
        window.location.href = 'index.html';
    }
});
