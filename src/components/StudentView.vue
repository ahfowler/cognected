<template>
  <div id="student-view-content">
    <div class="pane-id">
      Student View
      <span v-show="applyClicked || reselectStudent">{{
        currentStudent.name
      }}</span>
    </div>
    <transition name="fade">
      <div
        id="student-cognected-graph"
        v-show="applyClicked || reselectStudent"
      >
        <StudentGraph
          :canvasURL="this.userData[0]"
          :token="this.userData[1]"
          :courseID="this.userData[2]"
          :selectedStudent="this.currentStudent"
        ></StudentGraph>
        <div
          id="student-settings-menu"
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
            <Tooltip text="Students">
              <img
                src="../assets/students-icon-active.png"
                v-show="currentStudent.name != ''"
                @click="
                  applyClicked = false;
                  reselectStudent = true;
                "
              />
              <img
                src="../assets/students-icon.png"
                v-show="currentStudent.name == ''"
              />
            </Tooltip>
            <Tooltip text="Assignments">
              <img src="../assets/assignments-icon.png" />
            </Tooltip>
            <Tooltip text="Categories">
              <img src="../assets/categories-icon.png" />
            </Tooltip>
            <Tooltip text="Configure">
              <img src="../assets/graph-settings-icon.png" />
            </Tooltip>
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div id="student-wrapper" v-show="!applyClicked">
        <h2>WORK IN PROGRESS - Select a Student:</h2>
        <div class="dropdown-box">
          <p>
            Search for a student or select a name from the drop down list.
          </p>
          <div class="dropdown">
            <input
              v-model="studentSearch"
              placeholder="Type a student's name..."
            />
            <div class="dropdown-area">
              <div
                class="dropdown-message"
                v-show="studentFilteredList.length == 0"
              >
                No students found.
              </div>
              <div
                id="dropdown-list"
                v-for="student in studentFilteredList"
                :key="student.id"
                v-show="studentFilteredList.length > 0"
              >
                <input
                  name="studentList"
                  type="radio"
                  :id="student.id"
                  :value="student"
                  v-model="currentStudent"
                />
                <label :for="student.id">{{ student.name }}</label>
              </div>
            </div>
          </div>
          <a class="apply-button" @click="this.applyStudent">Apply</a>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="overlay" v-show="!applyClicked && reselectStudent"></div>
    </transition>
  </div>
</template>

<script>
import {
  StudentObjects,
  ParseGradeJsonRespectToStudent,
} from "../script/parseCanvasDataForStudent.js";
import Tooltip from "../components/Tooltip.vue";
import StudentGraph from "../components/StudentGraph.vue";

export default {
  name: "StudentView",
  components: {
    Tooltip,
    StudentGraph,
  },
  data() {
    return {
      userData: ["", "", ""],
      applyClicked: false,
      reselectStudent: false,
      studentSearch: "",
      students: StudentObjects,
      currentStudent: { name: "", id: "" },
      settingsOpened: false,
    };
  },
  computed: {
    studentFilteredList() {
      return this.students.filter((student) => {
        return student.name
          .toLowerCase()
          .includes(this.studentSearch.toLowerCase());
      });
    },
  },
  methods: {
    applyStudent() {
      this.applyClicked = true;
      this.reselectStudent = false;
      ParseGradeJsonRespectToStudent(this.currentStudent.id);
      this.$root.$emit("studentApplied");
    },
  },
  mounted() {
    this.$root.$on("updateStudentGraph", (value) => {
      this.userData = value;
    });
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
  left: 20px;
  white-space: nowrap;
  overflow: hidden;
}

.pane-id > span {
  color: #000000;
  margin-left: 10px;
}

#student-view-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}

#student-wrapper {
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

#student-wrapper > h2 {
  font-family: "K2D", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 26px;
  text-align: center;
  color: #000000;
  margin-bottom: 25px;
}

#student-wrapper > .dropdown-box {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  width: 60%;
  padding: 10px;
  max-height: 50vh;
}

#student-wrapper > .dropdown-box > p {
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

#dropdown-list {
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

#dropdown-list input {
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
  margin-bottom: 25px;
  display: inline-block;
}

#student-cognected-graph {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 97vh !important;
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
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

#student-settings-menu > img {
  width: 20px;
  height: auto;
}

.tooltip-box {
  padding-left: 10px;
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
</style>
