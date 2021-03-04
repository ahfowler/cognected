<template>
  <div id="class-view">
    <div class="pane-id">Class View</div>
    <div id="cognected-graph">
      <UserSettings v-if="this.viewUserSettings" @clicked="SettingsReturn" :propCanvasURL="this.userData[0]" :propToken="this.userData[1]"></UserSettings>
      <NodeInfo v-if="this.nodeClicked != -1 && !this.viewUserSettings" :key="this.nodeClicked" :propkeywordData="this.nodeClickData[1]"></NodeInfo>
      <ClassGraph v-if="!this.viewUserSettings" @clicked="NodeClickedEvent" :canvasURL="this.userData[0]" :token="this.userData[1]" :courseID="this.userData[2]"></ClassGraph>
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
          <Tooltip text="Assignments - COMING SOON" @click.native="Assignments_Click">
            <img src="../assets/assignments-icon.png" />
          </Tooltip>

          <Tooltip text="Categories - COMING SOON" @click.native="Categories_Click">
            <img src="../assets/categories-icon.png" />
          </Tooltip>

          <Tooltip text="Students - COMING SOON" @click.native="Students_Click">
            <img src="../assets/students-icon.png" />
          </Tooltip>

          <Tooltip text="Configure" @click.native="viewUserSettings=!viewUserSettings">
            <img src="../assets/graph-settings-icon.png" />
          </Tooltip>

          <Tooltip text="User Guide" @click.native="UserGuide_Click">
            <img src="../assets/info-icon.png" />
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
import NodeInfo from "../components/NodeInfo.vue";

export default {
  name: "ClassView",
  components: {
    ClassGraph,
    Tooltip,
    UserSettings,
    NodeInfo,
  },
  data() {
    return {
      settingsOpened: false,
      viewUserSettings: true,
      userData: ['', '', ''],
      nodeClicked: -1,
      nodeClickData: [-1, undefined, undefined],
      keyword: Object,
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
    UserGuide_Click() {
      Object.assign(document.createElement('a'), {
        target: '_blank',
        href: 'https://drive.google.com/file/d/1A1CjziR9ubyikiGY9IDMDBHchp1gpLa6/view?usp=sharing',
      }).click();
    },
    SettingsReturn(value){
      this.viewUserSettings = false;

      if(value != 'Canceled'){
        this.userData = value;
      }
    },
    NodeClickedEvent(nodeData){
      this.nodeClickData = nodeData
      
      if(this.nodeClickData[0] != -1){
        this.keyword = this.nodeClickData[1];
      }
      else{
        this.keyword = undefined;
      }

      this.nodeClicked = this.nodeClickData[0];
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
  height: 80vh !important;
}

.input-group{
    display:flex; 
    flex-direction: row; 
    justify-content: center; 
    align-items: center
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
