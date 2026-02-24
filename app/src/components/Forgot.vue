<script setup lang="ts"></script>

<template>
  <div class="ntl-wrapper">
    <div class="ntl-group">
      <img src="../assets/logos/logo-02.png" alt="Netlink Logo" height="200" />
      <p>
        You got an <span style="color: #006145">email</span> check <br />
        your <span style="color: #006145">inbox</span> to reset your
        password.
      </p>
    </div>
    <div class="ntl-group ntl-form-container">
      <div class="form-wrapper">
        <h2>Reset your Netlink</h2>
        <div class="form-base">
          <form @submit.prevent="" method="post" id="loginForm">
            <div class="formGroup">
              <input
                type="email"
                id="net-email"
                placeholder="Email or Username"
              />
            </div>
            <button type="submit" class="submit-btn">Send</button>
          </form>
          <div>
            <router-link to="/login">
              <button type="submit" class="submit-btn" id="backLogin">Back to login</button>
            </router-link>
          </div>
        </div>
      </div>

      <div class="form-wrapper" id="resetPassword">
        <h2>Reset code and Password</h2>
        <div class="form-base">
          <form @submit.prevent="" method="post" id="loginForm">
            <div class="formGroup">
              <input type="number" id="net-code" placeholder="Code" />
            </div>
            <div class="formGroup">
              <input
                type="password"
                id="net-password"
                placeholder="New Password"
              />
            </div>
            <button type="submit" class="submit-btn">Confirm</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#resetPassword {
  display: none;
}
#backLogin {
  margin-top: 1rem;
  font-family: "Montserrat Regular", sans-serif;
  border: 1px solid #ffffff;
}
</style>
