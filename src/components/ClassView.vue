<template>
  <div id="class-view">
    <div class="pane-id">Class View</div>
    <div id="cognected-graph">
      <Categories v-if="showCategories" />
      <ClassGraph v-if="!showCategories" ></ClassGraph>
      <div
        id="class-settings-menu"
        v-on:click="settingsOpened = !settingsOpened"
        v-bind:class="{
          'collapsed-settings': !settingsOpened,
          'opened-settings': settingsOpened,
        }"
      >
        <img src="../assets/settings-icon.png" />
        <div
          class="settings-menu"
          v-bind:class="{
            'collapsed-settings-menu': !settingsOpened,
            'opened-settings-menu': settingsOpened,
          }"
        >
          <Tooltip text="Assignments" @click.native="Assignments_Click">
            <img src="../assets/assignments-icon.png" />
          </Tooltip>
          <Tooltip text="Categories">
            <img src="../assets/categories-icon.png" v-on:click="toggleCategories" />
          </Tooltip>

          <Tooltip text="Students" @click.native="Students_Click">
            <img src="../assets/students-icon.png" />
          </Tooltip>

          <Tooltip text="Configure" @click.native="viewUserSettings=!viewUserSettings">
            <img src="../assets/graph-settings-icon.png" />
          </Tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClassGraph from "../components/ClassGraph.vue";
import Tooltip from "../components/Tooltip.vue";
import UserSettings from "../components/UserSettings.vue"

export default {
  name: "ClassView",
  components: {
    ClassGraph,
    Tooltip,
    UserSettings,
  },
  data() {
    return {
      settingsOpened: false,
      viewUserSettings: true,
      userData: ['', ''],
    };
  },
  methods:{
    Assignments_Click() {
      console.log("Assignments click");
    },
    Categories_Click() {
      console.log("Categories click");
    },
    Students_Click() {
      console.log("Students click");
    },
    Configure_Click() {
      console.log("Configure click");
    },
    SettingsReturn(value){
      this.viewUserSettings = false;

      if(value != 'Canceled'){
        console.log('Return from settings event');
        this.userData = value;
        console.log(this.userData);
      }
    }
  }
};

</script>

<style scoped>
.pane-id {
  font-family: "K2D", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 15px;
  color: #e5e5e5;
  transform-origin: 0 0;
  transform: rotate(90deg);
  position: absolute;
  left: 15px;
  white-space: nowrap;
  overflow: hidden;
}

#cognected-graph {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 97vh !important;
}

.collapsed-settings {
  position: absolute;
  z-index: 1;
  bottom: 60px;
  background: #e5e5e5;
  border-radius: 30px;
  display: flex;
  align-items: center;
  padding: 10px 15px 10px 15px;
  min-width: 0px;
  transition: all 1s;
}

.opened-settings {
  position: absolute;
  z-index: 1;
  bottom: 60px;
  background: #e5e5e5;
  border-radius: 30px;
  display: flex;
  align-items: center;
  padding: 10px 15px 10px 15px;
  min-width: 50px;
  transition: all 1s;
}

.collapsed-settings-menu {
  display: flex;
  max-width: 0px;
  transition: all 1s;
  overflow: hidden;
}

.opened-settings-menu {
  display: flex;
  max-width: 200px;
  transition: all 1s;
  overflow: hidden;
}

#class-settings-menu > img {
  width: 20px;
  height: auto;
}

.tooltip-box {
  padding-left: 10px;
}
</style>
