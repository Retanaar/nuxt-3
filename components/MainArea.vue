<template>
    <div class="mainAreaContainer">
        <div class="noteDate">{{ formatDate(selected.created) }}</div>
        <div v-if="mode==='edit'" @input="update">
            <textarea @input="update">{{ selected.fullText }}</textarea>
        </div>
        <div class="viewMode"  v-if="mode === 'view'">
            <div v-html="marked(selected.fullText)" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { ModeType } from '~/pages/index.vue';
import { marked } from 'marked';
import { debounce } from 'lodash-es';

    interface Props {
        mode: ModeType,
        selected: iNote,
        updateNote: (note: string) => void;
    }

    const { mode, selected, updateNote } = defineProps<Props>();
    const update = debounce((e: Event) => {
        const target = e.target as HTMLTextAreaElement
        if (target.value) {
            updateNote(target.value)
        }
    }, 200)
    function formatDate(created: number) {
        const date = new Date();
        date.setTime(created);
        return `${date.getDay().toString().padStart(2, '0')}/${date.getMonth().toString().padStart(2, '0')}/${date.getFullYear()} 
        ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
</script>

<style>
    .mainAreaContainer {
        width: 100%;
        height: 100%;
        margin: 16px;
    }
    .mainContainer textarea {
        width: 97%;
        height: 90vh;
    }
    .viewMode {
        display: flex;
        flex-direction: column;
    }
    .noteDate {
        font-size: 12px;
        text-align: center;
    }
</style>