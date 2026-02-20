<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const formData = ref({
  email: "",
  password: "",
});

const authStore = useAuthStore();
const router = useRouter();
async function onSubmit() {
  try {
    await authStore.login(formData.value.email, formData.value.password);
    router.push("/home");
  } catch (error) {
    return error;
  }
}
</script>

<template>
  <div id="login-base">
    <div class="lg-group">
      <h1>Netlink</h1>
      <p>Explore, Learn and Connect.</p>
    </div>
    <div class="lg-group lg-form-container">
      <h2>Log into Netlink</h2>
      <div class="form-base">
        <form @submit.prevent="onSubmit()" method="post" id="loginForm">
          <div class="formGroup">
            <label for="net-email">Email:</label>
            <input
              type="email"
              id="net-email"
              v-model="formData.email"
            />
          </div>

          <div class="formGroup">
            <label for="net-password">Password:</label>
            <input
              type="password"
              id="net-password"
              v-model="formData.password"
            />
          </div>

          <button type="submit" class="submit-btn">Log in</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
#login-base {
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 100vh;
}
.lg-form-container {
  display: flex;
  flex-direction: column;
}
.lg-form-container h2 {
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
