<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const formData = ref({
  email: "",
  name: "",
  password: "",
  confirmPassword: "",
});

const authStore = useAuthStore();
const router = useRouter();

async function onSubmit(){
  try {
    await authStore.register(formData.value.email, formData.value.name, formData.value.password);
    router.push("/login");
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
        Sign up and join to out <span style="color: #006145">networking community</span>, 
        <br />
        and stand out in the <span style="color: #006145">industry together.</span>
      </p>
    </div>
    <div class="ntl-group ntl-form-container">
      <div class="form-wrapper">
        <h2>Get Started on Netlink</h2>
        <div class="form-base">
          <form @submit.prevent="onSubmit()" method="post" id="loginForm">
            <div class="formGroup">
              <input type="email" id="net-email" placeholder="Email" v-model="formData.email" />
            </div>

            <div class="formGroup">
              <input type="text" id="net-name" placeholder="Full Name" v-model="formData.name" />
            </div>            

            <div class="formGroup">
              <input type="password" id="net-password" placeholder="Password" v-model="formData.password" />
            </div>

            <div class="formGroup">
              <input
                type="password"
                id="net-password-confirm"
                placeholder="Confirm Password"
                v-model="formData.confirmPassword"
              />
            </div>
            <button type="submit" class="submit-btn">Sign Up</button>
          </form>
          <router-link :to="{ name: 'login' }">
            <button type="button" class="submit-btn" id="regAccount">
              Already have an account?
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#regAccount {
  margin-top: 1rem!important;
  font-family: "Montserrat Regular", sans-serif;
  border: 1px solid #ffffff;
}
</style>
