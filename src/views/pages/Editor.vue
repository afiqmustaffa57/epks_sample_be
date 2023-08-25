<template>
    <div class="grid p-fluid">
        <div class="col-12">
            <div class="card">
                <h5>Wyswig vuequill form</h5>
                <div class="p-fluid formgrid grid">
                    <div class="field col-12 md:col-6">
                        <label for="city">Title</label>
                        <InputText v-model="title" id="title" type="text" />
                    </div>
                    <div class="field col-12 md:col-12">
                        <label for="city">Content</label>
                        <QuillEditor v-model:content="content" contentType="html" theme="snow" toolbar="full"
                            :modules="modules" />
                    </div>
                    <div class="field col-12">
                        <label for="answer">Answers</label>
                    </div>
                    <div class="grid col-12 mt-2" v-for="(item, index) in answers" :key="index">
                        <div class="field col-2">
                            <label for="name2">Name</label>
                            <InputText v-model="item.name" id="name2" type="text" />
                        </div>
                        <div class="field col-10">
                            <label for="Content">Content</label>
                            <InputText v-model="item.content" id="Content" type="text" />
                        </div>
                    </div>
                    <div class="field col-2 md:col-2">
                        <label for="correctAnswer">Correct Answer</label>
                        <InputText v-model="correctAnswer" id="correctAnswer" type="text" />
                    </div>
                    <Button @click="submitForm" label="Submit"></Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import BlotFormatter from 'quill-blot-formatter';
import axios from '@/axios';
import {
    ref,
    onMounted
} from 'vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const content = ref('');
const title = ref('');
const correctAnswer = ref('');
const answers = ref([{
    name: 'A',
    content: ''
}, {
    name: 'B',
    content: ''
}, {
    name: 'C',
    content: ''
}, {
    name: 'D',
    content: ''
}])
const modules = {
    name: 'blotFormatter',
    module: BlotFormatter,
}

const submitForm = async () => {
    console.log(content.value)
    try {
        let resp = await axios.post(`/question`, {
            title: title.value,
            content: content.value,
            answer: answers.value,
            correctAnswer: correctAnswer.value
        })
        toast.add({ severity: 'success', summary: 'Success', detail: '', life: 3000 });
    } catch (error) {
        
    }
}
</script>

<style lang="scss">
.ql-container {
    box-sizing: border-box;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 13px;
    height: inherit !important;
    margin: 0px;
    position: relative;
}
</style>
