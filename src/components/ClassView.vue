<template>
  <div id="class-view">
    <div class="pane-id">
      Class View
      <span style="color:black">{{ this.userData[3] }}</span>
    </div>
    <NodeInfo
      style="z-index:2;"
      v-if="this.nodeClicked != -1 && !this.viewUserSettings"
      :key="this.nodeClicked"
      :propkeywordData="this.nodeClickData[1]"
      @clicked="NodeInfoAddCategoryClick"
    ></NodeInfo>
    <div id="cognected-graph">
      <UserSettings
        v-if="this.viewUserSettings"
        @clicked="SettingsReturn"
        :propCanvasURL="this.userData[0]"
        :propToken="this.userData[1]"
        style="margin-bottom:8%;margin-top:5%"
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
        <img
          src="../assets/settings-icon.png"
          v-show="!settingsOpened"
          style="cursor: pointer;"
        />
        <img
          src="../assets/settings-icon-active.png"
          v-show="settingsOpened"
          style="cursor: pointer;"
        />
        <div
          class="settings-menu"
          v-bind:class="{
            'collapsed-settings-menu': !settingsOpened,
            'opened-settings-menu': settingsOpened,
          }"
        >
          <Tooltip text="Assignments" @click.native="Assignments_Click">
            <img
              src="../assets/assignments-applied-icon.png"
              v-show="selectedAssignments.length > 0"
              style="cursor: pointer;"
            />
            <img
              src="../assets/assignments-icon.png"
              v-show="selectedAssignments.length == 0"
              style="cursor: pointer;"
            />
          </Tooltip>

          <Tooltip text="Categories" @click.native="Categories_Click">
            <img
              src="../assets/categories-icon-active.png"
              v-show="selectedCategories.length > 0"
              style="cursor: pointer;"
            />
            <img
              src="../assets/categories-icon.png"
              v-show="selectedCategories.length == 0"
              style="cursor: pointer;"
            />
          </Tooltip>

          <Tooltip text="Students - COMING SOON" @click.native="Students_Click">
            <img
              src="../assets/students-icon-active.png"
              v-show="selectedStudents.length > 0"
              style="cursor: pointer;"
            />
            <img
              src="../assets/students-icon.png"
              v-show="selectedStudents.length == 0"
              style="cursor: pointer;"
            />
          </Tooltip>

          <Tooltip
            text="Configure"
            @click.native="viewUserSettings = !viewUserSettings"
          >
            <img
              src="../assets/graph-settings-icon.png"
              style="cursor: pointer;"
            />
          </Tooltip>

          <Tooltip text="User Guide" @click.native="UserGuide_Click">
            <img src="../assets/info-icon.png" style="cursor: pointer;" />
          </Tooltip>
        </div>
      </div>
    </div>
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
                id="assignment-search-box"
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
      <div
        class="wrapper"
        v-show="categoriesClicked"
        style="max-height:70%;margin-top:10%;margin-bottom:10%;overflow-y:auto;width:30%"
      >
        <div class="dropdown-background-box">
          <h2>Select a Category:</h2>
          <div class="dropdown-box">
            <p>
              Search for a category or select a category from the drop down
              list.
            </p>
            <div class="dropdown">
              <input
                id="category-search-box"
                v-model="categoriesSearch"
                placeholder="Type a category name..."
              />
              <div class="dropdown-area">
                <div
                  class="dropdown-message"
                  v-show="categoryFilteredList.length == 0"
                >
                  No categories found.
                </div>
                <div
                  id="assignment-dropdown-list"
                  v-for="category in categoryFilteredList"
                  :key="category.id"
                  v-show="categoryFilteredList.length > 0"
                >
                  <input
                    name="categoryList"
                    type="checkbox"
                    :id="category.id + '-checkbox'"
                    v-model="currentCategory[category.id]"
                  />
                  <label :for="category.id">{{ category.name }}</label>
                </div>
              </div>
            </div>
            <div class="selected-items" v-show="selectedCategories.length > 0">
              <div
                class="selected-item"
                v-for="category in selectedCategories"
                :key="category.id"
              >
                <a class="selected-item-name">
                  {{ findCategoryName(category) }}
                  <div
                    style="margin-left:5px;"
                    class="close"
                    @click="removeSelectedCategory(category)"
                  />
                </a>
              </div>
            </div>
            <div class="input-group">
              <a class="myCancelButton" @click="categoriesClicked = false"
                >Cancel</a
              >
              <a class="myApplyButton" @click="applyCategories()">Apply</a>
            </div>
            <a
              class="clear-button"
              v-show="selectedCategories.length > 0"
              @click="clearSelectedCategories()"
              >Clear</a
            >
            <CategoryController
              v-if="showCategories"
              :propAddCategory="nodeInfoReturnCategory"
            />
            <a
              class="myApplyButton"
              @click="
                showCategories = !showCategories;
                if (showCategories) {
                  manageCategoriesStatus = 'Hide';
                } else {
                  manageCategoriesStatus = 'Show';
                }
              "
              >{{ manageCategoriesStatus }} Manage Categories</a
            >
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div
        class="wrapper"
        v-show="studentsClicked"
        style="max-height:70%;margin-top:10%;margin-bottom:10%;overflow-y:auto;"
      >
        <div class="dropdown-background-box">
          <h2>Select Students:</h2>
          <div class="dropdown-box">
            <p>
              Search for a student or select one or more students from the drop
              down list.
            </p>
            <div class="dropdown">
              <input
                id="student-search-box"
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
                  :key="student.id + '-' + student.name"
                  v-show="studentFilteredList.length > 0"
                >
                  <input
                    name="studentList"
                    type="checkbox"
                    :id="student.id + '-checkbox'"
                    v-model="currentStudent[student.id]"
                  />
                  <label :for="student.id">{{ student.name }}</label>
                </div>
              </div>
            </div>
            <div class="selected-items" v-show="selectedStudents.length > 0">
              <div
                class="selected-item"
                v-for="student in selectedStudents"
                :key="student.id + '-' + student.name"
              >
                <a class="selected-item-name">
                  {{ findStudentName(student) }}
                  <div
                    style="margin-left:5px;"
                    class="close"
                    @click="removeSelectedStudent(student)"
                  />
                </a>
              </div>
            </div>
            <div>
              <a class="myCancelButton" @click="studentsClicked = false"
                >Cancel</a
              >
              <a class="myApplyButton" @click="studentsClicked = false"
                >Apply</a
              >
            </div>
            <a
              class="clear-button"
              v-show="selectedStudents.length > 0"
              @click="clearSelectedStudents()"
              >Clear</a
            >
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div
        class="overlay"
        v-show="assignmentClicked || categoriesClicked || studentsClicked"
      ></div>
    </transition>
  </div>
</template>

<script>
import ClassGraph from "../components/ClassGraph.vue";
import Tooltip from "../components/Tooltip.vue";
import UserSettings from "../components/UserSettings.vue";
import {
  Assignments,
  Categories,
  StudentObjects,
} from "../script/parseCanvasData.js";
import NodeInfo from "../components/NodeInfo.vue";
import CategoryController from "../components/CategoryController.vue";

export default {
  name: "ClassView",
  components: {
    ClassGraph,
    Tooltip,
    UserSettings,
    NodeInfo,
    CategoryController,
  },
  data() {
    return {
      importedAssignmentsDictionary: Assignments,
      settingsOpened: false,
      viewUserSettings: true,
      userData: ["", "", "", ""],
      assignmentClicked: false,
      assignmentSearch: "",
      assignments: [],
      currentAssignment: {},
      nodeClicked: -1,
      nodeClickData: [-1, undefined, undefined],
      keyword: Object,
      categoriesClicked: false,
      categoriesSearch: "",
      categories: Categories,
      currentCategory: {},
      studentsClicked: false,
      studentSearch: "",
      students: [],
      currentStudent: {},
      showCategories: false,
      manageCategoriesStatus: "Show",
      nodeInfoReturnCategory: "",
    };
  },
  methods: {
    Assignments_Click() {
      this.assignmentClicked = !this.assignmentClicked;
      this.assignments = Object.values(Assignments);
    },
    Categories_Click() {
      this.categoriesClicked = !this.categoriesClicked;
      this.categories = Categories;
    },
    Students_Click() {
      this.studentsClicked = !this.studentsClicked;
      this.students = StudentObjects;
    },
    UserGuide_Click() {
      Object.assign(document.createElement("a"), {
        target: "_blank",
        href:
          "https://drive.google.com/file/d/1A1CjziR9ubyikiGY9IDMDBHchp1gpLa6/view?usp=sharing",
      }).click();
    },
    SettingsReturn(data) {
      this.viewUserSettings = false;

      if (data != "Canceled") {
        this.userData = data;
        this.$root.$emit("updateStudentGraph", data);
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
    NodeInfoAddCategoryClick(value) {
      this.categoriesClicked = true;
      this.showCategories = true;

      this.nodeInfoReturnCategory = value;
    },
    removeSelectedAssignment(assignmentId) {
      this.currentAssignment[assignmentId] = false;
      document.getElementById(assignmentId).checked = false;
    },
    removeSelectedCategory(categoryId) {
      this.currentCategory[categoryId] = false;
      document.getElementById(categoryId + "-checkbox").checked = false;
    },
    removeSelectedStudent(studentId) {
      this.currentStudent[studentId] = false;
      document.getElementById(studentId + "-checkbox").checked = false;
    },
    clearSearchBox() {
      document.getElementById("assignment-search-box").value = "";
    },
    clearSelectedAssignments() {
      for (let k in this.currentAssignment) {
        this.currentAssignment[k] = false;
        document.getElementById(k).checked = false;
      }
    },
    clearSelectedCategories() {
      for (let k in this.currentCategory) {
        this.currentCategory[k] = false;
        document.getElementById(k + "-checkbox").checked = false;
      }
    },
    clearSelectedStudents() {
      for (let k in this.currentStudent) {
        this.currentStudent[k] = false;
        document.getElementById(k + "-checkbox").checked = false;
      }
    },
    findCategoryName(categoryId) {
      for (let i = 0; i < this.categories.length; i++) {
        if (this.categories[i].id == categoryId) {
          return this.categories[i].name;
        }
      }
    },
    findStudentName(studentId) {
      for (let i = 0; i < this.students.length; i++) {
        if (this.students[i].id == studentId) {
          return this.students[i].name;
        }
      }
    },
    applyAssignments() {
      this.assignmentClicked = false;
      this.$root.$emit("applyAssignments", this.selectedAssignments);
    },
    applyCategories() {
      this.categoriesClicked = false;
      this.$root.$emit("applyCategories", this.selectedCategories);
    },
    cancelSelection() {
      this.assignmentClicked = false;
      this.categoriesClicked = false;
      this.studentsClicked = false;
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
    categoryFilteredList() {
      return this.categories.filter((category) => {
        return category.name
          .toLowerCase()
          .includes(this.categoriesSearch.toLowerCase());
      });
    },
    selectedCategories() {
      let activeCategories = [];
      for (let k in this.currentCategory) {
        if (this.currentCategory[k]) {
          activeCategories.push(k);
        }
      }
      return activeCategories;
    },
    studentFilteredList() {
      return this.students.filter((student) => {
        return student.name
          .toLowerCase()
          .includes(this.studentSearch.toLowerCase());
      });
    },
    selectedStudents() {
      let activeStudents = [];
      for (let k in this.currentStudent) {
        if (this.currentStudent[k]) {
          activeStudents.push(k);
        }
      }
      return activeStudents;
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

.wrapper {
  text-align: center;
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
  margin-left: 10px;
  margin-bottom: 15px;
  width: fit-content;
  cursor: pointer;
  text-shadow: 0px 1px 0px #2f6627;
}

.myApplyButton:hover {
  background-color: #246bd6;
}
.myApplyButton:active {
  position: relative;
  top: 1px;
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
  margin-right: 10px;
  margin-bottom: 15px;
  text-decoration: none;
  text-shadow: 0px 1px 0px #2f6627;
}

.myCancelButton:hover {
  background-color: #ee6250;
}
.myCancelButton:active {
  position: relative;
  top: 1px;
}
</style>
