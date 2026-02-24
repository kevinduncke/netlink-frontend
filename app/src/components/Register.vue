<script setup lang="ts"></script>

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
          <form @submit.prevent="" method="post" id="loginForm">
            <div class="formGroup">
              <input type="email" id="net-email" placeholder="Email" />
            </div>

            <div class="formGroup">
              <input type="password" id="net-password" placeholder="Password" />
            </div>

            <div class="formGroup">
              <input
                type="password"
                id="net-password-confirm"
                placeholder="Confirm Password"
              />
            </div>
            <button type="submit" class="submit-btn">Sign Up</button>
          </form>
          <router-link to="/login">
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
