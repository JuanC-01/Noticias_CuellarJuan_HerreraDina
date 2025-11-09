import { doc, addDoc, getDoc, serverTimestamp, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

const newsCollection = collection(db, "noticias");
/**
 * @param {string} uid 
 * @returns {Array} 
 */
export const getNewsByReporter = async (uid) => {
    if (!uid) return [];
    const q = query(newsCollection, where("autorId", "==", uid));
    const querySnapshot = await getDocs(q);
    const newsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    return newsList;
};

/**
 * @returns {Array} 
 */
export const getAllNews = async () => {
    const querySnapshot = await getDocs(newsCollection);
    const newsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    return newsList;
};

/**
 * @param {string} newsId 
 * @param {string} newStatus 
 */
export const updateNewsStatus = (newsId, newStatus) => {
    const newsDoc = doc(db, "noticias", newsId);
    return updateDoc(newsDoc, {
        estado: newStatus
    });
};

/**
 * @returns {Array} 
 */
export const getPublishedNews = async () => {
    const newsCollection = collection(db, "noticias");
    const q = query(newsCollection, where("estado", "==", "publicado"));
    try {
        const querySnapshot = await getDocs(q);
        const newsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return newsList;
    } catch (error) {
        console.error("Error al obtener noticias publicadas:", error);
        return [];
    }
};

/**
 * @param {File} file 
 * @returns {Promise<string>} 
 */
export const uploadNewsImage = async (file) => {
    if (!file) return null;
    const storageRef = ref(storage, `noticias/${Date.now()}-${file.name}`);

    await uploadBytes(storageRef, file);

    const url = await getDownloadURL(storageRef);
    return url;
};

/**
 * @param {Object} newsData 
 */
export const createNews = (newsData) => {
    return addDoc(newsCollection, newsData);
};

/**
 * @param {string} newsId
 * @returns {Object|null} 
 */
export const getNewsById = async (newsId) => {
    const newsDoc = doc(db, "noticias", newsId);
    const docSnap = await getDoc(newsDoc);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.warn("No se encontró la noticia");
        return null;
    }
};

/**
 * @param {string} newsId 
 * @param {Object} newsData 
 */
export const updateNews = (newsId, newsData) => {
    const newsDoc = doc(db, "noticias", newsId);
    return updateDoc(newsDoc, newsData);
};

export const getNewsBySectionSlug = async (slug) => {
  const newsCollection = collection(db, "noticias");
  const q = query(
    newsCollection, 
    where("categoria", "==", slug),
    where("estado", "==", "publicado")
  );

  const querySnapshot = await getDocs(q);
  const newsList = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  return newsList;
};