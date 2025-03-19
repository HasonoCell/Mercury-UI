<script setup lang="ts">
import Input from "../Input/Input.vue";
import Form from "./Form.vue";
import FormItem from "./FormItem.vue";
import Button from "../Button/Button.vue";
import { reactive } from "vue";

const model = reactive({
  email: "",
  password: "",
});

const rules = {
  email: [{ type: "email" as const, required: true, trigger: "blur" }],
  password: [{ type: "string" as const, required: true, trigger: "blur" }],
};
</script>

<template>
  <div>
    <Form :model="model" :rules="rules">
      <FormItem label="email" prop="email">
        <Input v-model="model.email" />
      </FormItem>

      <FormItem label="password" prop="password">
        <template #label="{ label }">
          <Button>{{ label }}</Button>
        </template>
        <Input v-model="model.password" />
      </FormItem>
      <div>
        <Button type="primary">Submit</Button>
        <Button>Reset</Button>
      </div>
    </Form>
  </div>
</template>
