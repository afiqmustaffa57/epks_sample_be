<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <!-- modal -->
                <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="New Item" :modal="true"
                    class="p-fluid">
                    <div class="field">
                        <label for="name">Name</label>
                        <InputText id="name" v-model.trim="exam.name" required="true" autofocus
                            :class="{ 'p-invalid': v$.name.$dirty && v$.name.$invalid }" />
                        <div class="text-danger" v-if="v$.name.$dirty && v$.name.required.$invalid">Name is required.</div>
                    </div>
                    <div class="field">
                        <label for="name">Description</label>
                        <Textarea id="name" v-model.trim="exam.description" required="true" autofocus />
                        <div class="text-danger" v-if="v$.description.$dirty && v$.description.required.$invalid">Name is
                            required.</div>
                    </div>
                    <div class="field">
                        <label for="venue">venue </label>
                        <InputText id="venue    " v-model.trim="exam.venue" required="true" autofocus />
                        <div class="text-danger" v-if="v$.venue.$dirty && v$.venue.required.$invalid">Name is required.
                        </div>
                    </div>
                    <div class="field">
                        <label for="duration">duration </label>
                        <InputText id="duration" v-model.trim="exam.duration" required="true" autofocus />
                        <div class="text-danger" v-if="v$.duration.$dirty && v$.duration.required.$invalid">Name is
                            required.</div>
                    </div>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                                @click="editProduct(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                                @click="confirmDeleteExam(slotProps.data)" />
                        </template>
                    </Column>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveExam" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteExamDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>Are you sure you want to delete this item?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteExamDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteExam" />
                    </template>
                </Dialog>

                <!-- modal end -->
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                        </div>
                    </template>
                </Toolbar>
                <h5>Datatable with Pagination, filter and CRUD</h5>
                <DataTable :value="exams" lazy paginator :rows="10" :totalRecords="totalRow" @page="onPage($event)"
                    @sort="onSort($event)" :rowsPerPageOptions="[5, 10, 20, 50]" class="p-datatable-gridlines"
                    filterDisplay="menu">
                    <template #header>
                        <div class="flex justify-content-between">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                            <span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText @input="getexams" v-model="filter" placeholder="Keyword Search" />
                            </span>
                        </div>
                    </template>
                    <Column field="name" header="Name" style="width: 25%"></Column>
                    <Column field="description" header="Description" style="width: 25%"></Column>
                    <Column field="venue" header="Venue" style="width: 25%"></Column>
                    <Column field="duration" header="Duration" style="width: 25%"></Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                                @click="editProduct(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                                @click="confirmDeleteExam(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    ref,
    onMounted
} from 'vue';
import axios from '@/axios';
import {
    useVuelidate
} from '@vuelidate/core';
import {
    required,
    numeric,
    helpers
} from '@vuelidate/validators';
import { useToast } from 'primevue/usetoast';

const toast = useToast()

const exams = ref(null);
const totalRow = ref(0)
const currentPage = ref(1)
const limit = ref(10)
const filter = ref('')
const productDialog = ref(false)
const deleteExamDialog = ref(false);
const currentId = ref('')
const exam = ref({
    name: '',
    description: '',
    venue: '',
    duration: 0
})
let $autoDirty = true
const rules = {
    name: {
        required,
        $autoDirty
    }, // Matches state.firstName
    description: {
        required,
        $autoDirty
    }, // Matches state.lastName
    venue: {
        required,
        $autoDirty
    },
    duration: {
        required
    }
}

const v$ = useVuelidate(rules, exam)


const openNew = () => {
    // product.value = {};
    // submitted.value = false;
    productDialog.value = true;
};

const confirmDeleteExam = (item) => {
    currentId.value = item.id
    deleteExamDialog.value = true;
};

const deleteExam = async () => {
   try {
    await axios.delete(`/exam/${currentId.value}`)
    await getexams()
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    deleteExamDialog.value = false
   } catch (error) {
    
   }
    
};


const clearFilter = () => {
    filter.value = ""
    getexams()
}
const onPage = (e) => {
    console.log(e)
    currentPage.value = e.page + 1
    limit.value = e.rows
    getexams()
}
const getexams = async () => {
    let resp = await axios.get(`/exams?page=${currentPage.value}&limit=${limit.value}&filter=${filter.value}`)
    // console.log('resp', resp.)
    exams.value = resp.data.items
    totalRow.value = resp.data.meta.totalRecords
}
const saveExam = async () => {
    v$.value.$touch()
    if (!v$.value.$invalid) {
        // alert('Please fix the errors before submitting.');
        let body = {
            name: exam.value.name,
            description: exam.value.description,
            venue: exam.value.venue,
            time: new Date(),
            duration: +exam.value.duration
        }
        await axios.post(`/exams`, body)
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Exam Created', life: 3000 });
        currentPage.value = 1
        await getexams()
        productDialog.value = false;
    }
}
const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};
onMounted(() => {
    getexams()
})
</script>

<style lang="scss" scoped></style>
