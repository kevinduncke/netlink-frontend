<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const formData = ref({
  email: "",
  password: "",
});

const router = useRouter();

const authStore = useAuthStore();

async function onSubmit() {
  try {
    await authStore.register(formData.value.email, formData.value.password);
    router.push("/login");
  } catch (error) {
    return error;
  }
}
</script>

<template>
  <div id="register-base">
    <div class="rg-group">
      <h1>Netlink</h1>
      <p>Explore, Learn and Connect.</p>
    </div>
    <div class="rg-group rg-form-container">
      <h2>Register to Netlink</h2>
      <div class="form-base">
        <form @submit.prevent="onSubmit()" method="post">
          <div class="formGroup">
            <label for="email">Email:</label>
            <input
              type="email"
              name="email"
              id="net-email"
              v-model="formData.email"
            />
          </div>

          <div class="formGroup">
            <label for="password">Password:</label>
            <input
              type="password"
              name="password"
              id="net-password"
              v-model="formData.password"
            />
          </div>

          <button type="submit" class="submit-btn">Register</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
#register-base {
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 100vh;
}
.rg-form-container {
  display: flex;
  flex-direction: column;
}
.rg-form-container h2 {
  font-size: 1rem;
  text-align: left;
  font-weight: 700;
  letter-spacing: 0.02rem;
  margin-bottom: 2rem;
}
.formGroup {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  row-gap: 0.5rem;
  margin-bottom: 2rem;
}
.formGroup input {
  padding: 0.5rem;
}
</style>
