<template>
  <div id="class-view">
    <div class="pane-id">Class View</div>
    <NodeInfo
      style="z-index:2;position:absolute;"
      v-if="this.nodeClicked != -1 && !this.viewUserSettings"
      :key="this.nodeClicked"
      :propkeywordData="this.nodeClickData[1]"
    ></NodeInfo>
    <div id="cognected-graph">
      <UserSettings
        v-if="this.viewUserSettings"
        @clicked="SettingsReturn"
        :propCanvasURL="this.userData[0]"
        :propToken="this.userData[1]"
      ></UserSettings>
      <ClassGraph
        v-if="!this.viewUserSettings"
        @clicked="NodeClickedEvent"
        :canvasURL="this.userData[0]"
        :token="this.userData[1]"
        :courseID="this.userData[2]"
      ></ClassGraph>
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
          <Tooltip
            text="Assignments - COMING SOON"
            @click.native="Assignments_Click"
          >
            <img src="../assets/assignments-icon.png" />
          </Tooltip>

          <Tooltip
            text="Categories - COMING SOON"
            @click.native="Categories_Click"
          >
            <img src="../assets/categories-icon.png" />
          </Tooltip>

          <Tooltip text="Students - COMING SOON" @click.native="Students_Click">
            <img src="../assets/students-icon.png" />
          </Tooltip>

          <Tooltip
            text="Configure"
            @click.native="viewUserSettings = !viewUserSettings"
          >
            <img src="../assets/graph-settings-icon.png" />
          </Tooltip>

          <Tooltip text="User Guide" @click.native="UserGuide_Click">
            <img src="../assets/info-icon.png" />
          </Tooltip>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div id="class-assignment-wrapper" v-show="assignmentClicked">
        <div class="dropdown-background-box">
          <h2>Select an Assignment:</h2>
          <div class="dropdown-box">
            <p>
              Search for an assignment or select an assignment from the drop
              down list.
            </p>
            <div class="dropdown">
              <input
                v-model="assignmentSearch"
                placeholder="Type an assignment's name..."
              />
              <div class="dropdown-area">
                <div
                  class="dropdown-message"
                  v-show="assignmentFilteredList.length == 0"
                >
                  No assignments found.
                </div>
                <div
                  id="assignment-dropdown-list"
                  v-for="assignment in assignmentFilteredList"
                  :key="assignment.id"
                  v-show="assignmentFilteredList.length > 0"
                >
                  <input
                    name="assignmentList"
                    type="checkbox"
                    :id="assignment.id"
                    v-model="currentAssignment[assignment.id]"
                  />
                  <label :for="assignment.id">{{ assignment.name }}</label>
                </div>
              </div>
            </div>
            <div class="selected-items" v-show="selectedAssignments.length > 0">
              <div
                id="selected-assignments"
                v-for="assignment in selectedAssignments"
                :key="assignment.id"
              >
                <a class="selected-assignment">
                  {{ importedAssignmentsDictionary[assignment].name }}
                  <div
                    style="margin-left:5px;"
                    class="close-assignment"
                    @click="removeSelectedAssignment(assignment)"
                  />
                </a>
              </div>
            </div>
            <a class="apply-button" @click="assignmentClicked = false">Apply</a>
            <a
              class="clear-button"
              v-show="selectedAssignments.length > 0"
              @click="clearSelectedAssignments()"
              >Clear</a
            >
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="overlay" v-show="assignmentClicked"></div>
    </transition>
  </div>
</template>

<script>
import ClassGraph from "../components/ClassGraph.vue";
import Tooltip from "../components/Tooltip.vue";
import UserSettings from "../components/UserSettings.vue";
import { Assignments } from "../script/parseCanvasData.js";
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
      importedAssignmentsDictionary: Assignments,
      settingsOpened: false,
      viewUserSettings: true,
      userData: ["", "", ""],
      assignmentClicked: false,
      assignmentSearch: "",
      assignments: [],
      currentAssignment: {},
      nodeClicked: -1,
      nodeClickData: [-1, undefined, undefined],
      keyword: Object,
    };
  },
  methods: {
    Assignments_Click() {
      this.assignmentClicked = !this.assignmentClicked;
      this.assignments = Object.values(Assignments);
      console.log("Assignments click");
    },
    Categories_Click() {
      console.log("Categories click");
    },
    Students_Click() {
      console.log("Students click");
    },
    UserGuide_Click() {
      Object.assign(document.createElement("a"), {
        target: "_blank",
        href:
          "https://drive.google.com/file/d/1A1CjziR9ubyikiGY9IDMDBHchp1gpLa6/view?usp=sharing",
      }).click();
    },
    SettingsReturn(value) {
      this.viewUserSettings = false;

      if (value != "Canceled") {
        this.userData = value;
      }
    },
    NodeClickedEvent(nodeData) {
      this.nodeClickData = nodeData;

      if (this.nodeClickData[0] != -1) {
        this.keyword = this.nodeClickData[1];
      } else {
        this.keyword = undefined;
      }

      this.nodeClicked = this.nodeClickData[0];
    },
    removeSelectedAssignment(assignmentId) {
      this.currentAssignment[assignmentId] = false;
      document.getElementById(assignmentId).checked = false;
    },
    clearSelectedAssignments() {
      for (let k in this.currentAssignment) {
        this.currentAssignment[k] = false;
        document.getElementById(k).checked = false;
      }
    },
  },
  computed: {
    assignmentFilteredList() {
      return this.assignments.filter((assignment) => {
        return assignment.name
          .toLowerCase()
          .includes(this.assignmentSearch.toLowerCase());
      });
    },
    selectedAssignments() {
      let activeAssignments = [];
      for (let k in this.currentAssignment) {
        if (this.currentAssignment[k]) {
          activeAssignments.push(k);
        }
      }
      return activeAssignments;
    },
  },
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
  width: 100%;
  height: 98vh;
}

.input-group {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
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

#class-view {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}

#class-assignment-wrapper {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 97vh;
  width: 100%;
  max-width: 650px;
  overflow: hidden;
  position: absolute;
  z-index: 2;
}

.dropdown-background-box {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: absolute;
}

.dropdown-background-box > h2 {
  font-family: "K2D", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 26px;
  text-align: center;
  color: #000000;
  margin-bottom: 25px;
}

.dropdown-background-box > .dropdown-box {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  width: 80%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dropdown-background-box > .dropdown-box > p {
  font-family: "Roboto", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 19px;
  text-align: center;
  color: #000000;
}

.dropdown {
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dropdown input {
  border: 1px solid #e5e5e5;
  border-radius: 1px;
  height: 30px;
  width: 95%;
  padding: 5px 10px 5px 10px;
  font-family: "Roboto", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 15px;
  line-height: 15px;
}

::placeholder {
  color: #e5e5e5;
}

.dropdown-area {
  border: 1px solid #e5e5e5;
  border-radius: 1px;
  max-height: 200px;
  min-height: 200px;
  overflow-y: scroll;
  width: 100%;
  position: relative;
  top: -1px;
}

#assignment-dropdown-list {
  font-family: "Roboto", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 15px;
  line-height: 15px;
  display: flex;
  align-items: center;
  text-align: left;
  padding-right: 10px;
}

.dropdown-message {
  font-family: "Roboto", sans-serif;
  color: #e5e5e5;
  font-style: normal;
  font-weight: 300;
  font-size: 15px;
  line-height: 15px;
  margin-top: 10px;
}

#assignment-dropdown-list input {
  max-width: 8%;
  min-width: 8%;
  margin: 10px 15px 10px 10px;
}

.apply-button {
  background: #174793;
  border-radius: 20px;
  font-family: "Roboto", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  color: #ffffff;
  padding: 10px 30px;
  margin-bottom: 15px;
  width: fit-content;
}

.selected-items {
  margin-bottom: 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 95%;
}

.selected-assignment {
  background: #e5e5e5;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-style: normal;
  font-weight: 300;
  padding: 5px 8px;
  border-radius: 8px;
  width: fit-content;
  display: flex;
  align-items: center;
  margin: 5px 5px;
}

.close-assignment {
  width: 8px;
  height: 8px;
  background: url("../assets/close.png") no-repeat;
  background-size: cover;
}

.close-assignment:hover {
  background: url("../assets/close-red.png") no-repeat;
  background-size: cover;
}

.overlay {
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.356);
}

.fade-enter-active,
.fade-leave-active {
  transition-delay: 3s;
  transition: opacity 0.8s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.clear-button {
  font-family: "Roboto", sans-serif;
  color: #000000;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 15px;
  margin-bottom: 10px;
}

.clear-button:hover {
  color: #000000a4;
}
</style>
