"use client";
 
import { useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useUser } from "@/hooks/useUser";
import { auth, db } from "@/lib/firebase";
import { useSettingsStore } from "@/stores/useSettingsStore";
import {
  applyCloudData,
  getLocalData,
  subscribeToAllStores,
  toSortedJson,
  type DorbitData,
} from "@/lib/cloudData";
 
// Shows nothing. While you're signed in, it keeps your stores and your cloud document the same.
export default function CloudSync() {
  const user = useUser();
  const uid = user?.uid;
 
  useEffect(() => {
    if (!uid) return; // not signed in: everything stays on this device only
 
    const ref = doc(db, "users", uid); // your document: users/<your id>
    let lastSynced = ""; // the data we last sent or received, as text
    let applyingCloudData = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
 
    // 1. Cloud -> this device. Runs once right away, then every time the document changes
    //    (for example when you add a to-do on your phone).
    const stopListening = onSnapshot(ref, (snapshot) => {
      if (!snapshot.exists()) {
        // First sign-in ever: use the Google first name if no name is set yet,
        // then upload what this device has
        const settings = useSettingsStore.getState();
        const firstName = auth.currentUser?.displayName?.split(" ")[0];
        if (!settings.name && firstName) settings.setName(firstName);
        const data = getLocalData();
        lastSynced = toSortedJson(data);
        setDoc(ref, data);
        return;
      }
      const data = snapshot.data() as DorbitData;
      const text = toSortedJson(data);
      if (text === lastSynced) return; // nothing new (usually our own upload coming back)
      lastSynced = text;
      applyingCloudData = true;
      applyCloudData(data);
      applyingCloudData = false;
    });
 
    // 2. This device -> cloud. When any store changes, wait 1 second of quiet, then upload once.
    const stopWatchingStores = subscribeToAllStores(() => {
      if (applyingCloudData) return; // the change came from the cloud, don't send it back
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const data = getLocalData();
        const text = toSortedJson(data);
        if (text === lastSynced) return;
        lastSynced = text;
        setDoc(ref, data);
      }, 1000);
    });
 
    // Signed out (or page closed): stop everything
    return () => {
      stopListening();
      stopWatchingStores();
      clearTimeout(timeoutId);
    };
  }, [uid]);
 
  return null;
}
 