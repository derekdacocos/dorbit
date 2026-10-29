"use client";

import { useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useUser } from "@/hooks/useUser";
import { db } from "@/lib/firebase";
import {
  applyCloudData,
  getLocalData,
  subscribeToAllStores,
  toSortedJson,
  type DorbitData,
} from "@/lib/cloudData";

export default function CloudSync() {
  const user = useUser();
  const uid = user?.uid;

  useEffect(() => {
    if (!uid) return; 

    const ref = doc(db, "users", uid); 
    let lastSynced = ""; 
    let applyingCloudData = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const stopListening = onSnapshot(ref, (snapshot) => {
      if (!snapshot.exists()) {
        // First sign-in ever: upload what this device has
        const data = getLocalData();
        lastSynced = toSortedJson(data);
        setDoc(ref, data);
        return;
      }
      const data = snapshot.data() as DorbitData;
      const text = toSortedJson(data);
      if (text === lastSynced) return;
      lastSynced = text;
      applyingCloudData = true;
      applyCloudData(data);
      applyingCloudData = false;
    });

    const stopWatchingStores = subscribeToAllStores(() => {
      if (applyingCloudData) return;
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