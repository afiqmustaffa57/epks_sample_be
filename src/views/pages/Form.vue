<template>
<div class="grid p-fluid">
    <div class="col-12">
        <form @submit="submitForm" class="card">
            <h5>Form with vuelidate</h5>
            <div class="p-fluid formgrid grid">
                <div class="field col-12 md:col-6">
                    <label for="firstname2">Firstname</label>
                    <InputText v-model="state.firstName" id="firstName2" type="text" :class="{'p-invalid' :  v$.firstName.$dirty && v$.firstName.$invalid }" />
                    <div class="text-danger" v-if="v$.firstName.$dirty && v$.firstName.required.$invalid">Name is required.</div>
                </div>
                <div class="field col-12 md:col-6">
                    <label for="lastname2">Lastname</label>
                    <InputText v-model="state.lastName" id="lastName2" type="text" :class="{'p-invalid' :  v$.lastName.$dirty && v$.lastName.$invalid }" />
                    <div v-if="v$.lastName.$dirty && v$.lastName.required.$invalid">Name is required.</div>
                </div>
                <div class="field col-12">
                    <label for="address">Address</label>
                    <Textarea v-model="state.address" id="address" rows="4" :class="{'p-invalid' :  v$.address.$dirty && v$.address.$invalid }" />
                    {{ address }}
                    <div v-if="v$.address.$dirty && v$.address.required.$invalid">Name is required.</div>
                </div>
                <div class="field col-12 md:col-6">
                    <label for="city">IC Number</label>
                    <InputText v-model="state.icnumber" id="icnumber" type="text" :class="{'p-invalid' :  v$.icnumber.$dirty && v$.icnumber.$invalid }" />
                    <div v-if="v$.icnumber.$dirty && v$.icnumber.required.$invalid">Name is required.</div>
                    <div v-if="v$.icnumber.$dirty && v$.icnumber.isIc.$invalid">IC Number is not valid.</div>
                </div>
                <Button @click="submitForm" label="Submit"></Button>
            </div>
        </form>
    </div>
</div>
</template>

    
<script setup>
import {
    ref,
    computed,
    reactive
} from 'vue';
import {
    useVuelidate
} from '@vuelidate/core';
import {
    required,
    numeric,
    helpers
} from '@vuelidate/validators';

const state = ref({
    firstName: '',
    lastName: '',
    address: '',
    icnumber: '',
})
let $autoDirty = true
const rules = {
    firstName: {
        required,
        $autoDirty
    }, // Matches state.firstName
    lastName: {
        required,
        $autoDirty
    }, // Matches state.lastName
    address: {
        required,
        $autoDirty
    },
    icnumber: {
        isIc: helpers.regex(/^\d{12}$/),
        required
    }
}

const v$ = useVuelidate(rules, state)

const submitForm = () => {
    v$.value.$touch()
    if (v$.value.$invalid) {
        // alert('Please fix the errors before submitting.');
        console.log('Please fix the errors before submitting.')
    } else {
        // alert('Form submitted successfully!');
        console.log('Form submitted successfully!')
        // Handle successful form submission logic here
    }
}
</script>
