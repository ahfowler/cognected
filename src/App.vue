<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    HelloWorld,
  },
  methods: {
    getGradeData: function () {
      $.ajax({
        url:
          "https://asu.instructure.com/api/v1/courses/" +
          "18732" +
          "/assignments?per_page=100",
        datatype: "jsonp",
        crossDomain: true,
        beforeSend: function (xhr) {
          xhr.setRequestHeader(
            "Authorization",
            "Bearer " +
              "7236~8dQSbbxT2iQeatKfNOJYzWR441OHkkv5CcUOr4sksrHNmdk1SRQoJG5wrut4e0s7"
          );
        },
        success: function (jsondata) {
          console.log(jsondata);
        },
        error: function (xhr, status, error) {
          console.log(xhr.responseText);
        },
      });

      $.ajax({
        url:
          "https://asu.instructure.com/api/v1/courses/" +
          "18732" +
          "/gradebook_history/feed?per_page=100",
        datatype: "json",
        crossDomain: true,
        beforeSend: function (xhr) {
          xhr.setRequestHeader(
            "Authorization",
            "Bearer " +
              "7236~8dQSbbxT2iQeatKfNOJYzWR441OHkkv5CcUOr4sksrHNmdk1SRQoJG5wrut4e0s7"
          );
        },
        success: function (jsondata) {
          console.log(jsondata);
        },
        error: function (xhr, status, error) {
          console.log(xhr.responseText);
        },
      });
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
