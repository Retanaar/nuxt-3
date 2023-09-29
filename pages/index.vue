<template>
    <div class="mainWrapper">
        <div class="sidebarContainer">
        <div class="buttonsPanel">
                <div class="buttonWrapper" @click="addNote">
                    <img src="~/assets/swg/plus_icon.svg" alt="" />
                </div>
                <div class="buttonWrapper" @click="removeRecord">
                    <img src="~/assets/swg/trash_icon.svg" alt="" />
                </div>
            </div>
        <div v-if="!notes.length" class="emptyRecords">
            No Records
        </div>
        <AppSidebar v-else :notes="notes" :selected="selected" :select="select"/>
        </div>
        <div class="mainContainer">
        <div class="controlPanel" v-if="selected && mode === 'view'">
            <div class="buttonWrapper"><img src="~/assets/swg/edit_button.svg" alt="" @click="mode = 'edit'" /></div>
            <input type="text" />
        </div>
        <MainArea v-if="notes.length" :mode="mode" :selected="selected" :updateNote="updateCurrentNote" />
        </div>
    </div>
</template>

<script setup lang="ts">
    export type ModeType = "view" | "edit" | "create";
    const { getNotes, saveNote, removeNote, updateNote } = await useIndexedDB();
    const mode = ref<ModeType>("view");
    const searchStr = ref<string>("");
    const data = await getNotes(searchStr);
    const notes = ref(data);
    const selected = ref(data.length ? data[0] : undefined);

    async function addNote() {
        const res = await saveNote({
            title: "",
            description: "",
            fullText: "",
            created: (new Date()).getTime()
        });
        const data = await getNotes();
        notes.value = data;
        selected.value = data[data.length - 1];
        mode.value = "edit";
    }
    function select(note: iNote) {
        selected.value = note;
        mode.value = "view";
    }
    async function updateCurrentNote(note: string) {
        const trimNote = note.trim().split("\n");
        const description = trimNote.slice(1).join("\n").trim().slice(0, 30);
        const buf: Partial<iNote> = {
            title: trimNote[0],
            description,
            fullText: note,
        };

        await updateNote(buf, selected.value.id);
        const data = await getNotes();
        notes.value = data;

    }
    async function removeRecord() {
        const userConfirmed = confirm("Do you really want to delete this note?");

        if (userConfirmed) {
            await removeNote(selected.value.id);
            const data = await getNotes();
            notes.value = data;
            selected.value = data.length ? data[0]: undefined;
        }
    }
 </script>
 
 <style >
 .mainWrapper {
     display: flex;
     width: 100%;
     height: 100vh;
 }
 .sidebarContainer {
     width: 300px;
     height: 100%;
     border-right: 1px solid #cccccc;
 }
 .mainContainer {
     width: 100%;
     height: 100%;
 }
 .buttonsPanel {
     width: 100%;
     display: flex;
     padding: 1rem;
 }
 .buttonWrapper {
     width: 20px;
     height: 20px;
     margin-left: 2rem;
     border: 1px solid #ffffff;
     padding:3px;
     cursor: ponter;
 
 }
 .buttonWrapper:hover {
     border: 1px solid #cccccc;
 }
 .buttonWrapper img {
     width: 20px;
     height: 20px;
 
 }
 .emptyRecords {
     font-size: 16px;
     text-align: center;
     background-color: yellow;
     margin: 0 8px;
 }
 .controlPanel {
     display: flex;
     justify-content: space-between;
     align-items: center;
     margin: 1rem;
 }
 
 </style>
 