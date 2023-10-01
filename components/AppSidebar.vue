<template>
    <div class="sidebarWrapper">
        <div v-for="note in notes" :key="note.id" class="rowElement" :class="{ selected: note.id === selected.id}" @click="() => select(note)">
            <div class="title wrap" :class="{ empty: !note.title}">{{ note.title || 'Empty' }}</div>
            <div class="wrap">{{ getTime(note.created) }} {{ note.description }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
    interface Props {
        notes: iNote[],
        selected: iNote,
        select: (note: iNote) => void,
    }
    const { notes, selected } = defineProps<Props>();
    function getTime(t: number) {
        const date = new Date();
        date.setTime(t);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
</script>
<style>
.wrap {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.sidebarWrapper {
    padding: 8px;
    overflow-y: auto;
}

.rowElement {
    display: flex;
    flex-direction: column;
    padding: 8px;
    font-size: 12px;
    margin: 1rem;
    cursor: pointer;
}

.rowElement.selected {
    background-color: #FBE59B;
    border-radius: 4px;
}

.rowElement .title {
    font-weight: 600;
}
.rowElement .title.empty {
    font-style: italic;
}

</style>