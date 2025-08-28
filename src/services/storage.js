import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../lib/firebase";

// генеруємо шлях у Storage
export function photoPath(uid, clientId, procId, filename) {
  const safe = filename.replace(/[^\w.\-]+/g, "_");
  return `users/${uid}/clients/${clientId}/procedures/${procId}/${Date.now()}_${safe}`;
}

// завантажуємо кілька файлів -> повертаємо [{path, url}]
export async function uploadProcedurePhotos(uid, clientId, procId, files) {
  const results = [];
  for (const file of files) {
    const path = photoPath(uid, clientId, procId, file.name);
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    results.push({ path, url });
  }
  return results;
}

// видалити один файл у Storage
export async function deletePhoto(path) {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}
