<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

// VALIDATION
const emailPattern = /^[a-zA-Z0-9._%+-]+@netlink\.local$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const errors = ref({
  email: "",
  password: "",
  general: "",
});

function validateLogin() {
  errors.value = { email: "", password: "", general: "" };

  // NETLINK EMAIL
  if (!emailPattern.test(formData.value.email)) {
    errors.value.email = "Email is required.";
  } else if (!emailPattern.test(formData.value.email.trim())) {
    errors.value.email = "Invalid email format, '@netlink.local' required.";
  }

  // NETLINK PASSWORD
  if (!passwordPattern.test(formData.value.password)) {
    errors.value.password = "Password is required.";
  }

  return !errors.value.email && !errors.value.password;
}

const formData = ref({ email: "", password: "" });
async function onSubmit() {
  if (!validateLogin()) return;
  try {
    await authStore.login(
      formData.value.email.trim().toLowerCase(),
      formData.value.password.trim(),
    );
    formData.value.email = "";
    formData.value.password = "";
    router.push("/dashboard");
  } catch (error) {
    errors.value.general = "Invalid login credentials. Please try again.";
    console.error(errors.value.general, error);
  }
}

// CHECK IF USER IS ALREADY LOGGED IN
onMounted(() => {
  if (authStore.isAuthenticated()) {
    router.push("/dashboard");
  } else {
    return;
  }
});
</script>

<template>
  <div class="ntl-wrapper">
    <div class="ntl-group">
      <img src="../assets/logos/logo-02.png" alt="Netlink Logo" height="200" />
      <p>
        Stay <span style="color: #006145">connected</span>, share, build <br />
        and learn <span style="color: #006145">together.</span>
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
              <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
            </div>

            <div class="formGroup">
              <input
                type="password"
                id="net-password"
                placeholder="Password"
                v-model="formData.password"
              />
              <p v-if="errors.password" class="form-error">
                {{ errors.password }}
              </p>
            </div>
            <div v-if="errors.general" class="formValidation">
              <p class="form-error">
                {{ errors.general }}
              </p>
            </div>
            <button
              type="submit"
              class="submit-btn"
              :class="{
                disabled: !formData.email.length || !formData.password.length,
                'animated-btn':
                  formData.email.length && formData.password.length,
              }"
              :disabled="!formData.email.length || !formData.password.length"
            >
              Log in
            </button>
          </form>
          <div class="options-btns">
            <div>
              <router-link :to="{ name: 'forgot-password' }">
                <button class="opt-btn">Forgot Password?</button>
              </router-link>
            </div>
            <div>
              <router-link :to="{ name: 'register' }">
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
/* Remove autocomplete background color */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0px 1000px #f4f4f4 inset !important; /* Set to your background */
  box-shadow: 0 0 0px 1000px #f4f4f4 inset !important;
  -webkit-text-fill-color: #000 !important; /* Set to your text color */
  transition: background-color 5000s ease-in-out 0s;
}
.formValidation {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border-radius: 10px;
  margin-bottom: 1rem;
}
.form-error {
  font-family: "Montserrat Regular", sans-serif;
  font-size: 0.9rem;
  padding: 0;
}
.disabled {
  border: 2px solid #027f5c !important;
  color: #01956b;
  cursor: auto;
}
.animated-btn:hover {
  border: 2px solid #ffffff;
  background-color: #ffffff;
  color: #006145;
}
.opt-btn:hover {
  border: 1px solid #ffffff;
  background-color: #ffffff;
  color: #006145;  
}
</style>
