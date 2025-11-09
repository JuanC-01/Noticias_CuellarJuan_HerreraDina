import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where} from "firebase/firestore";
import { db } from "./firebase"; 
const sectionsCollection = collection(db, "secciones");

/**
 * @returns {Array} 
 */
export const getSections = async () => {
  try {
    const querySnapshot = await getDocs(sectionsCollection);
    
    const sectionsList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return sectionsList; 
  } catch (error) {
    console.error("Error al obtener secciones:", error);
    return [];
  }
};

/**
 * @param {string} nombre 
 * @param {string} slug 
 */
export const createSection = (nombre, slug, color) => {
  if (!nombre || !slug) {
    return Promise.reject(new Error("Nombre y slug son requeridos"));
  }
  return addDoc(sectionsCollection, {
    nombre: nombre,
    slug: slug,
    color: color
  });
};


/**
 * Updates a section
 * @param {string} sectionId - 
 * @param {Object} updatedData 
 */
export const updateSection = (sectionId, updatedData) => {
  if (!sectionId || !updatedData) {
    return Promise.reject(new Error("Section ID and data are required"));
  }
  const sectionDoc = doc(db, "secciones", sectionId);
  return updateDoc(sectionDoc, updatedData); 
};

/**
 * Deletes a section 
 * @param {string} sectionId 
 */
export const deleteSection = (sectionId) => {
  if (!sectionId) {
    return Promise.reject(new Error("Section ID is required"));
  }
  const sectionDoc = doc(db, "secciones", sectionId);
  return deleteDoc(sectionDoc);
};

export const getSectionBySlug = async (slug) => {
  const sectionsCollection = collection(db, "secciones");
  const q = query(sectionsCollection, where("slug", "==", slug));
  
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    console.warn(`No se encontró sección con slug: ${slug}`);
    return null;
  }
  const sectionDoc = querySnapshot.docs[0];
  return { id: sectionDoc.id, ...sectionDoc.data() };
};