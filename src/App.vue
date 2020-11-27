<template>
  <div id="app">
    <transition name="fade">
      <LoadingScreen v-if="this.isLoading"></LoadingScreen>
      <div id="content" v-if="!this.isLoading">
        <!-- Top Right Logo -->
        <div id="top-right-logo">
          <div id="cognected-title">Cognect<span>Ed</span></div>
          <div id="cognected-subtitle">
            The Systems Curriculum Gradebook
          </div>
        </div>
        <multipane layout="vertical">
          <div :style="{ width: '50%', 'min-width': '1%' }" id="student-view">
            <StudentView></StudentView>
          </div>
          <multipane-resizer>
            <div id="slider-bar"></div>
            <div id="slider-icon">
              <div
                :style="{
                  'margin-right': this.margin + 'px',
                  transform: 'rotate(-' + this.turn + 'deg)',
                }"
              >
                <div class="slider-arrow"></div>
              </div>
              <div class="slider-center"></div>
              <div
                :style="{
                  'margin-left': this.margin + 'px',
                  transform: 'rotate(' + this.turn + 'deg)',
                }"
              >
                <div class="slider-arrow"></div>
              </div>
            </div>
          </multipane-resizer>
          <div :style="{ flexGrow: 1, 'min-width': '1%' }" id="class-view">
            <ClassView></ClassView>
          </div>
        </multipane>
      </div>
    </transition>
  </div>
</template>

<script>
import LoadingScreen from "./components/LoadingScreen.vue";
import StudentView from "./components/StudentView.vue";
import ClassView from "./components/ClassView.vue";

export default {
  name: "App",
  components: {
    LoadingScreen,
    StudentView,
    ClassView,
  },
  data() {
    return {
      turn: 90,
      margin: 10,
      isLoading: true,
    };
  },
  methods: {
    updateIsLoading() {
      setTimeout(() => (this.isLoading = false), 3000);
    },
  },
  created() {
    this.updateIsLoading();
  },
};
</script>

<style>
#top-right-logo {
  text-align: center;
  position: absolute;
  top: 15px;
  right: 20px;
  z-index: 2;
}

#cognected-title {
  font-family: "K2D", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 34px;
  line-height: 44px;
  color: #174793;
}

#cognected-title > span {
  color: #fcc100;
}

#cognected-subtitle {
  font-family: "K2D", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 10px;
  line-height: 13px;
  text-align: center;
  color: #000000;
}

#content {
  display: flex;
  height: 98vh;
}

#student-view {
  height: 100%;
}

#class-view {
  height: 100%;
}

.multipane.layout-v .multipane-resizer {
  margin: 0;
  left: 0;
  width: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#slider-bar {
  border: 1px solid #e5e5e5;
  width: 0px;
  height: 100%;
  z-index: 0;
}

#slider-icon {
  display: flex;
  flex-direction: row;
  align-items: center;
  pointer-events: none;
  position: absolute;
  top: 50%;
}

.slider-center {
  background: #174793;
  border-radius: 10px;
  width: 10px;
  height: 30px;
}

.slider-arrow {
  background-color: #fcc100;
}
.slider-arrow:before,
.slider-arrow:after {
  content: "";
  position: absolute;
  background-color: inherit;
}
.slider-arrow,
.slider-arrow:before,
.slider-arrow:after {
  width: 5px;
  height: 5px;
  border-top-right-radius: 30%;
}

.slider-arrow {
  transform: rotate(-60deg) skewX(-30deg) scale(1, 0.866);
}
.slider-arrow:before {
  transform: rotate(-135deg) skewX(-45deg) scale(1.414, 0.707)
    translate(0, -50%);
}
.slider-arrow:after {
  transform: rotate(135deg) skewY(-45deg) scale(0.707, 1.414) translate(50%);
}

.multipane {
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition-delay: 3s;
  transition: opacity 1s;
  transition-timing-function: ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
