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
    router.push("/dashboard");
  } catch (error) {
    return error;
  }
}
</script>

<template>
  <div class="ntl-wrapper">
    <div class="ntl-group">
      <img src="../assets/logos/logo-02.png" alt="Netlink Logo" height="200" />
      <p>
        Stay <span style="color: #006145;">connected</span>, share, build <br>
        and learn <span style="color: #006145;">together.</span>
      </p>
    </div>
    <div class="ntl-group ntl-form-container">
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
              <router-link to="/forgot">
                <button class="opt-btn">Forgot Password?</button>
              </router-link>
            </div>
            <div>
              <router-link to="/register">
                <button class="opt-btn">Create Account</button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
