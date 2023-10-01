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
        <div class="controlPanel" v-if="mode === 'view'">
            <div><div class="buttonWrapper" v-if="selected" ><img src="~/assets/swg/edit_button.svg" alt="" @click="mode = 'edit'" /></div></div>
            <input type="text" @input="setSearchText" placeholder="Search" />
        </div>
        <MainArea v-if="notes.length" :mode="mode" :selected="selected" :updateNote="updateCurrentNote" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { debounce } from 'lodash-es';
    export type ModeType = "view" | "edit" | "create";
    const { getNotes, saveNote, removeNote, updateNote } = await useIndexedDB();
    const mode = ref<ModeType>("view");
    const searchStr = ref<string>("");
    const data = await getNotes(searchStr.value);
    const notes = ref(data);
    const selected = ref(data.length ? data[0] : undefined);

    const setSearchText = debounce(async (e: Event) => {
        const target = e.target as HTMLTextAreaElement
    
        searchStr.value = target.value.length >= 3 ? target.value : "";
        const filterNotes = await getNotes(searchStr.value);
        notes.value = filterNotes;
        selected.value = filterNotes.length ? filterNotes[0]: undefined;
    
    }, 200)

    async function addNote() {
        searchStr.value = "";
        const res = await saveNote({
            title: "",
            description: "",
            fullText: "",
            created: (new Date()).getTime()
        });
        const data = await getNotes(searchStr.value);
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
        const data = await getNotes(searchStr.value);
        notes.value = data;

    }
    async function removeRecord() {
        const userConfirmed = confirm("Do you really want to delete this note?");

        if (userConfirmed) {
            await removeNote(selected.value.id);
            const data = await getNotes(searchStr.value);
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
     overflow: hidden;
 }
 .sidebarContainer {
     width: 300px;
     height: 100%;
     border-right: 1px solid #cccccc;
     display: flex;
     flex-direction: column;
 }
 .mainContainer {
     width: 100%;
     height: 100%;
 }
 .buttonsPanel {
     width: 100%;
     display: flex;
     padding: 8px;
 }
 .buttonWrapper {
     width: 20px;
     height: 20px;
     margin-left: 16px;
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
     margin: 8px;
 }
 
 </style>
 