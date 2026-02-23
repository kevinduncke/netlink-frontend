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
      <p>
        Stay <span style="color: #006145;">connected</span>, share, build <br>
        and learn <span style="color: #006145;">together.</span>
      </p>
    </div>
    <div class="lg-group lg-form-container">
      <div class="form-wrapper">
        <h2>Log into Netlink</h2>
        <div class="form-base">
          <form @submit.prevent="onSubmit()" method="post" id="loginForm">
            <div class="formGroup">
              <input
                type="email"
                id="net-email"
                placeholder="Email or Username"
                v-model="formData.email"
              />
            </div>

            <div class="formGroup">
              <input
                type="password"
                id="net-password"
                placeholder="Password"
                v-model="formData.password"
              />
            </div>
            <button type="submit" class="submit-btn">Log in</button>
          </form>
          <div class="options-btns">
            <div>
              <button class="opt-btn" type="button">Forgot Password?</button>
            </div>
            <div>
              <button class="opt-btn" type="button">Create Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#login-base {
  font-family: "Inter", sans-serif;
  display: grid;
  grid-template-columns: 50% 50%;
}
.lg-group {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  color: #000000;
}
.lg-group p {
  text-align: center;
  font-family: "Montserrat Medium", sans-serif;
  font-size: 16px;
}
.lg-form-container {
  display: flex;
  flex-direction: column;
  align-items: normal;
  background-color: #006145;
  color: #ffffff;
}
.lg-form-container h2 {
  font-size: 1rem;
  text-align: left;
  font-family: "Montserrat SemiBold", sans-serif;
  font-size: 18px;
  letter-spacing: 0.02rem;
  margin-bottom: 2rem;
}
.form-wrapper {
  margin: 0 5rem;
}
.formGroup {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  row-gap: 0.5rem;
  margin-bottom: 1rem;
}
.formGroup input {
  padding: 1.2rem 1rem;
  width: 100%;
  box-sizing: border-box;
  font-family: "Montserrat Medium", sans-serif;
  font-size: 14px;
  color: #3f3f3f;
  border: none;
  border-radius: 5px;
  outline: none;
}
.submit-btn {
  width: 100%;
  padding: 1.1rem;
  border: 2px solid #ffffff;
  border-radius: 5px;
  background-color: transparent;
  color: #ffffff;
  font-family: "Montserrat SemiBold", sans-serif;
  font-size: 15px;
}
.options-btns {
  display: grid;
  grid-template-columns: auto auto;
  margin-top: 0.5rem;
  gap: 0.5rem;
}
.opt-btn {
  width: 100%;
  padding: 1.2rem 0;
  background-color: transparent;
  color: #ffffff;
  border: 1px solid #ffffff;
  font-family: "Montserrat Regular", sans-serif;
  border-radius: 5px;
}
</style>
