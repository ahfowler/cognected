<template>
  <div id="loading-wrapper">
    <div>
      <img id="loading-logo" src="../assets/logo.png" />
      <div id="loading-text">
        <div id="loading-cognected-title">Cognect<span>Ed</span></div>
        <div id="loading-cognected-subtitle">
          The Systems Curriculum Gradebook
        </div>
        <div id="loading-message">
          Hang tight! <br />
          We’re cognecting your students....
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoadingScreen",
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=K2D:wght@100;300;400;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap");

#loading-wrapper {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 97vh;
  background-color: #ffffff;
}

#loading-logo {
  width: 192px;
  height: 160px;
}

#loading-text {
  text-align: center;
}

#loading-cognected-title {
  font-family: "K2D", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 70px;
  line-height: 91px;
  color: #174793;
}

#loading-cognected-title > span {
  color: #fcc100;
}

#loading-cognected-subtitle {
  font-family: "K2D", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 18px;
  line-height: 23px;
  text-align: center;
  color: #000000;
}

#loading-message {
  font-family: "Roboto", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 13px;
  line-height: 25px;
  text-align: center;
  color: #000000;
  margin-top: 52px;
}
</style>
