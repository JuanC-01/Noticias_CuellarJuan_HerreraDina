// src/services/usersService.js
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase"; 

/**
 * @param {string} uid - El ID de usuario de Firebase Auth.
 * @returns {Object|null} - Los datos del usuario o null si no existe.
 */
export const getUserData = async (uid) => {
  if (!uid) return null;
  try {
    const userDocRef = doc(db, "usuarios", uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data(); 
    } else {
      console.warn("No existe el documento de usuario en Firestore");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    return null;
  }
};

/**
 * @param {string} uid - El ID de usuario de Firebase Auth.
 * @param {string} email - Email del usuario.
 * @param {string} nombre - Nombre del usuario.
 */
export const createUserData = async (uid, email, nombre) => {
  try {
    const userDocRef = doc(db, "usuarios", uid);
    await setDoc(userDocRef, {
      email: email,
      nombre: nombre,
      rol: "reportero" 
    });
  } catch (error) {
    console.error("Error al crear datos del usuario:", error);
  }
};