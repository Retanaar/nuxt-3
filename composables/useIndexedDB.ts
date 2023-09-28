
interface ReturnType {
    getNotes: () => Promise<iNote[]>
    saveNote: (note: iNote) => Promise<iNote>;
    removeNote: (id: number) => Promise<void>;
}

async function useIndexedDB(): Promise<ReturnType>{
    const dbConnection = await openDatabase();
    function openDatabase(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
        const request = window.indexedDB.open('markdowns', 1);
    
        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains('notes')) {
            db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
            }
        };
    
        request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            resolve(db);
        };
    
        request.onerror = () => {
            reject(request.error);
        };
        });
    }
    function getNotes(): Promise<iNote[]> {
        return new Promise<iNote[]>((resolve, reject) => {
            const tx = dbConnection.transaction('notes', 'readonly');
            const store = tx.objectStore('notes');
            const notes: iNote[] = [];
            store.openCursor().onsuccess = (event) => {
                const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
                if (cursor) {
                    notes.push({
                        id: cursor.primaryKey as number,
                        title: cursor.value.title,
                        description: cursor.value.description,
                        fullText: cursor.value.fullText,
                        created: cursor.value.created
                    });
                    cursor.continue();
                } else {
                    resolve(notes);
                }
            };

        });
    }
    function saveNote(note: iNote): Promise<iNote> {
        return new Promise<iNote>((resolve, reject) => {
            //const dbConnection = await openDatabase();
            const tx = dbConnection.transaction('notes', "readwrite");
            const objectStore = tx.objectStore('notes');
            const addRequest = objectStore.add(note);
            addRequest.onsuccess = function (event) {
                console.log('added');
                resolve((event.target as IDBRequest<IDBCursorWithValue>).result);
            };
        })
    }

    function removeNote(id: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const tx = dbConnection.transaction('notes', "readwrite");
            const objectStore = tx.objectStore('notes');
            const rmRequest = objectStore.delete(id);
            rmRequest.onsuccess = () => {
                resolve();
            };
        });
    }
 
    return {
        getNotes,
        saveNote,
        removeNote,
    }
}

export default useIndexedDB;