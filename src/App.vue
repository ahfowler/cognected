<template>
  <div id="app">
    <LoadingScreen v-if="isLoading"></LoadingScreen>
    <div id="content" v-if="!isLoading"></div>
  </div>
</template>

<script>
// import ClassGraph from "./components/ClassGraph.vue";
import LoadingScreen from "./components/LoadingScreen.vue";

export default {
  name: "App",
  components: {
    // ClassGraph,
    LoadingScreen,
  },
  data() {
    return {
      isLoading: true,
    };
  },
};
</script>

<style>
canvas {
  height: 95vh !important;
  background-color: #f8f8f8;
  padding: 10px;
}
</style>
