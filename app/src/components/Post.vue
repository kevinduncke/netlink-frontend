<script setup lang="ts">
// COMPONENTS
import Navigation from "./Navigation.vue";

// STYLES
import "../styles/utilities.css";
import "../styles/body.css";
</script>
<template>
    <div class="dash-wrapper">
        <Navigation />
        <div class="dash-sidepanel scrollable-hidden">
            <div class="post-comments">
                <h2>Comments</h2>
                <div></div>
            </div>
            <div class="post-liked">
                <h2>Likes</h2>
            </div>         
            <div class="post-shared">
                <h2>Shares</h2>
            </div>               
        </div>
        <div class="dash-content scrollable-hidden">
            <div class="post-info">
                <h2>Information</h2>
            </div>            
            <!-- INFO ABOUT THIS POST + ACTIONS (REPORT, EDIT) -->
            <div class="post-base">
                <h2>Post</h2>
            </div>            
            <!-- POST -->
            <div class="post-comment-base">
                <h2>New Comment</h2>
            </div>
            <!-- NEW COMMENT ON THIS POST -->
        </div>
    </div>
</template>
<style scoped>
</style>