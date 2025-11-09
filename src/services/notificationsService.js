import { collection, addDoc, serverTimestamp, query, where, getDocs, writeBatch, doc} from "firebase/firestore";
import { db } from "./firebase";

/**
 * @param {Array<string>} notificationIds
 * @returns {Promise<void>}
 */
export const markNotificationsAsRead = async (notificationIds) => {
  if (!notificationIds || notificationIds.length === 0) {
    return; 
  }
  const batch = writeBatch(db);

  notificationIds.forEach((id) => {
    const notifDocRef = doc(db, "notificaciones", id);
    batch.update(notifDocRef, { read: true }); 
  });

  try {
    await batch.commit(); 
    console.log(`${notificationIds.length} notificaciones marcadas como leídas.`);
  } catch (error) {
    console.error("Error al marcar notificaciones como leídas:", error);
  }
};


export const createNotification = async ({ userId, actorId, actorName, actorRole, type, newsId, message }) => {
  if (!userId) throw new Error("userId requerido para notificación");
  try {
    await addDoc(collection(db, "notificaciones"), {
      userId,
      actorId,
      actorName,
      actorRole,
      type,
      newsId: newsId || null,
      message: message || "",
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Error creando notificación:", err);
    throw err;
  }
};

export const notifyAllEditors = async (data) => {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    const editors = snapshot.docs.filter(doc => doc.data().rol === 'editor');
    console.log(`🧩 notifyAllEditors(): encontrados ${editors.length} editores`);

    for (const docSnap of editors) {
      const editor = docSnap.data();
      await addDoc(collection(db, 'notifications'), {
        userId: docSnap.id,
        actorId: data.actorId,
        actorName: data.actorName,
        actorRole: data.actorRole,
        type: data.type,
        newsId: data.newsId,
        message: data.message,
        createdAt: serverTimestamp(),
        read: false,
      });
      console.log(`Notificación creada para editor: ${editor.nombre}`);
    }
  } catch (error) {
    console.error('Error en notifyAllEditors:', error);
  }
};
