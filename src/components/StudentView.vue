<template>
  <div id="student-view">
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
                style="cursor: pointer;"
                @click="
                  applyClicked = false;
                  reselectStudent = true;
                "
              />
              <img
                src="../assets/students-icon.png"
                style="cursor: pointer;"
                v-show="currentStudent.name == ''"
              />
            </Tooltip>
            <Tooltip text="Assignments">
              <img
                src="../assets/assignments-applied-icon.png"
                v-show="selectedAssignments.length > 0"
                style="cursor: pointer;"
                @click="Assignments_Click"
              />
              <img
                src="../assets/assignments-icon.png"
                v-show="selectedAssignments.length == 0"
                style="cursor: pointer;"
                @click="Assignments_Click"
              />
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
      <div class="wrapper" v-show="!applyClicked">
        <div class="dropdown-background-box">
          <h2>Select a Student:</h2>
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
                  id="assignment-dropdown-list"
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
            <a class="myCancelButton" @click="this.applyClicked = true"
              >Cancel</a
            >
            <a class="myApplyButton" @click="this.applyStudent">Apply</a>
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div
        class="wrapper"
        v-show="assignmentClicked"
        style="max-height:70%;margin-top:10%;margin-bottom:10%;overflow-y:auto;"
      >
        <div class="dropdown-background-box">
          <h2>Select an Assignment:</h2>
          <div class="dropdown-box">
            <p>
              Search for an assignment or select an assignment from the drop
              down list.
            </p>
            <div class="dropdown">
              <input
                id="student-assignment-search-box"
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
                class="selected-item"
                v-for="assignment in selectedAssignments"
                :key="assignment.id"
              >
                <a class="selected-item-name">
                  {{ importedAssignmentsDictionary[assignment].name }}
                  <div
                    style="margin-left:5px;"
                    class="close"
                    @click="removeSelectedAssignment(assignment)"
                  />
                </a>
              </div>
            </div>
            <div class="input-group">
              <a class="myCancelButton" @click="assignmentClicked = false"
                >Cancel</a
              >
              <a class="myApplyButton" @click="applyAssignments()">Apply</a>
            </div>
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
      <div class="overlay" v-show="!applyClicked && reselectStudent"></div>
    </transition>
  </div>
</template>

<script>
import {
  StudentObjects,
  ParseGradeJsonRespectToStudent,
  Assignments,
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
      assignmentClicked: false,
      assignmentSearch: "",
      assignments: [],
      currentAssignment: {},
      importedAssignmentsDictionary: Assignments,
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
  methods: {
    applyStudent() {
      this.applyClicked = true;
      this.reselectStudent = false;
      ParseGradeJsonRespectToStudent(this.currentStudent.id);
      this.$root.$emit("studentApplied");
    },
    Assignments_Click() {
      this.assignmentClicked = !this.assignmentClicked;
      this.assignments = Object.values(Assignments);
    },
    clearSelectedAssignments() {
      for (let k in this.currentAssignment) {
        this.currentAssignment[k] = false;
        document.getElementById(k).checked = false;
      }
    },
    removeSelectedAssignment(assignmentId) {
      this.currentAssignment[assignmentId] = false;
      document.getElementById(assignmentId).checked = false;
    },
    applyAssignments() {
      this.assignmentClicked = false;
      this.$root.$emit(
        "applyAssignments_StudentView",
        this.selectedAssignments
      );
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
  left: 15px;
  white-space: nowrap;
  overflow: hidden;
}

#student-cognected-graph {
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

#student-settings-menu > img {
  width: 20px;
  height: auto;
}

.tooltip-box {
  padding-left: 10px;
}

#student-view {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}

.wrapper {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
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
  min-width: 70%;
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
  min-width: 95%;
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

.myApplyButton {
  background-color: #174793;
  border-radius: 28px;
  border: 1px solid #ffffff;
  display: inline-block;
  cursor: pointer;
  color: #ffffff;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  padding: 10px 31px;
  text-decoration: none;
  width: fit-content;
  cursor: pointer;
  text-shadow: 0px 1px 0px #2f6627;
}

.myApplyButton:hover {
  background-color: #246bd6;
}

.selected-items {
  margin-bottom: 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 95%;
}

.selected-item-name {
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

.close {
  width: 8px;
  height: 8px;
  background: url("../assets/close.png") no-repeat;
  background-size: cover;
}

.close:hover {
  background: url("../assets/close-red.png") no-repeat;
  background-size: cover;
  cursor: pointer;
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
  cursor: pointer;
}

.myCancelButton {
  background-color: #f3442c;
  border-radius: 28px;
  border: 1px solid #ffffff;
  display: inline-block;
  cursor: pointer;
  color: #ffffff;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  padding: 10px 31px;
  text-decoration: none;
  text-shadow: 0px 1px 0px #2f6627;
}

.myCancelButton:hover {
  background-color: #ee6250;
}
</style>
