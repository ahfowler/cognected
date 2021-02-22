<template>
    <div >
        <div class="loading" v-if="dataLoading">Loading&#8230;</div>
        <p style="font:">CognectEd User Settings</p>
        <div class="input-group">
            <label id="label">Canvas URL</label>
            <input placeholder="Institution Canvas URL...  (i.e https://asu.instructure.com/ )" style="min-width:500px;" id="CanvasUrl" v-model="canvasURL" @keyup="PopulateCourses" @paste="PopulateCourses"/> 
        </div>

        <div class="input-group">
            <label id="label">Token</label>
            <input placeholder="User Token..." id="Token" v-model="token" @keyup="PopulateCourses" @paste="PopulateCourses"/>
        </div>

        <div class="dropdown">
          <div class="dropdown-area">
            <div
              id="dropdown-list"
              v-for="(course, i) in courses"
              :key="i+'-'+course.name"
            >
              <input
                name="courseList"
                type="radio"
                :id="course.name"
                :value="course.name"
                v-model="currentCourse"
              />
              <label :for="course.name">{{ course.name }}</label>
            </div>
          </div>
        </div>

        <a class="myButton" @click="CancelClick" style="float:left;margin-left:50px">Cancel</a>

        <a class="myButton" href="https://drive.google.com/file/d/1A1CjziR9ubyikiGY9IDMDBHchp1gpLa6/view?usp=sharing" target="_blank">User Guide</a>

        <a class="myButton" @click="ApplyClick" style="float:right;margin-right:50px">Apply</a>
    </div>
</template>

<script>
import $ from 'jquery';

import {
  GetDataLoading,
  AjaxCallAssignments,
} from "../script/parseCanvasData.js";

export default {
  name: "UserSettings",
  props: {
    propCanvasURL: String,
    propToken: String,
  },
  data() {
      return{
          message: '',
          courses: [],
          currentCourse: '',
          canvasURL: this.propCanvasURL,
          token: this.propToken,
          dataLoading: false,
          checkDataLoading: undefined,
      };
  },
  methods: {
    CancelClick(){
      this.$emit('clicked', 'Canceled');
    },
    ApplyClick(){
      if(this.currentCourse != undefined && this.currentCourse != null && this.currentCourse != ''){
        AjaxCallAssignments(this.GetCourseId(this.currentCourse), this.token, this.canvasURL);
        
        this.checkDataLoading = window.setInterval(this.CheckData, 100)
      }
    },
    CheckData(){
      if(!GetDataLoading()){
        this.dataLoading = false;
        clearInterval(this.checkDataLoading)
        this.$emit('clicked', [this.canvasURL, this.token, this.GetCourseId(this.currentCourse)]);
      }
      else{
        this.dataLoading = true;
      }
    },
    GetCourseId(name){
      return this.courses.find((course) => course.name == name).id;
    },
    PopulateCourses(){
      if(this.canvasURL.includes("instructure.com") && this.token.length > 60){
        this.dataLoading = true;
        let context = this
        context.courses = []
        var corsAnywhere = "https://salty-atoll-62320.herokuapp.com/"; //NEEDED TO CREATE A 'PROPER' CORS API CALL
        var enrollmentTypes = ["TeacherEnrollment","TaEnrollment","ObserverEnrollment", "DesignerEnrollment"]; //, "StudentEnrollment"]; add if needed in testing
        //get course data for each enrollment type
        enrollmentTypes.forEach((item) => {
          $.ajax({
            url:corsAnywhere + this.canvasURL +"/api/v1/courses?enrollment_role=" + item,
            datatype: "json",
            method: "GET",
            headers: {
              "x-requested-with": "xhr",
              Authorization: "Bearer " + this.token,
            },
            success: function (jsondata) {
              if (jsondata.length != 0) {
                jsondata.forEach(element => {
                  if(element.name != undefined && element.name != null && element.name != ""){
                    context.courses.push({name: element.name, id: element.id.toString()});
                  }
                });
                
                context.currentCourse = context.courses[0].name;
                context.dataLoading = false;
              }
            },
            error: function (xhr) {
              context.dataLoading = false;
              console.log(xhr.responseText);
            },
          });
        });
      }
    },

  },
  mounted() {
      this.PopulateCourses()
  },
}
</script>

<style scoped>

p {
  font-family: "K2D", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 26px;
  text-align: center;
  color: #000000;
  margin-bottom: 25px;
}

label {
  font-family: "K2D", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 15px;
  color: black;
  left: 20px;
}

input {
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
  margin: 20px;
}

.input-group{
    display:flex; 
    flex-direction: row; 
    justify-content: center; 
    align-items: center
}

::placeholder {
  color: #e5e5e5;
}

.myButton {
	background-color:#174793;
	border-radius:28px;
	border:1px solid #ffffff;
	display:inline-block;
	cursor:pointer;
	color:#ffffff;
	font-family:"Roboto", sans-serif;
	font-size:12px;
	padding:10px 31px;
	text-decoration:none;
	text-shadow:0px 1px 0px #2f6627;
}
.myButton:hover {
	background-color:#246bd6;
}
.myButton:active {
	position:relative;
	top:1px;
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
}

#dropdown-list input {
  width: 8%;
  margin: 10px 15px 10px 10px;
}

/* Absolute Center Spinner */
.loading {
  position: fixed;
  z-index: 999;
  height: 2em;
  width: 2em;
  overflow: visible;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

/* Transparent Overlay */
.loading:before {
  content: '';
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.1);
}

.loading:not(:required) {
  font: 0/0 a;
  color: transparent;
  text-shadow: none;
  background-color: transparent;
  border: 0;
}

.loading:not(:required):after {
  content: '';
  display: block;
  font-size: 10px;
  width: 1em;
  height: 1em;
  margin-top: -0.5em;
  -webkit-animation: spinner 1500ms infinite linear;
  -moz-animation: spinner 1500ms infinite linear;
  -ms-animation: spinner 1500ms infinite linear;
  -o-animation: spinner 1500ms infinite linear;
  animation: spinner 1500ms infinite linear;
  border-radius: 0.5em;
  -webkit-box-shadow: rgba(0, 0, 0, 0.75) 1.5em 0 0 0, rgba(0, 0, 0, 0.75) 1.1em 1.1em 0 0, rgba(0, 0, 0, 0.75) 0 1.5em 0 0, rgba(0, 0, 0, 0.75) -1.1em 1.1em 0 0, rgba(0, 0, 0, 0.5) -1.5em 0 0 0, rgba(0, 0, 0, 0.5) -1.1em -1.1em 0 0, rgba(0, 0, 0, 0.75) 0 -1.5em 0 0, rgba(0, 0, 0, 0.75) 1.1em -1.1em 0 0;
  box-shadow: rgba(35, 104, 214, 1) 1.5em 0 0 0, rgba(35, 104, 214, 1) 1.1em 1.1em 0 0, rgba(35, 104, 214, 1) 0 1.5em 0 0, rgba(35, 104, 214, 1) -1.1em 1.1em 0 0, rgba(35, 104, 214, 1) -1.5em 0 0 0, rgba(35, 104, 214, 1) -1.1em -1.1em 0 0, rgba(35, 104, 214, 1) 0 -1.5em 0 0, rgba(35, 104, 214, 1) 1.1em -1.1em 0 0;
}

/* rgba(252, 193, 0, 1)  Orange*/
/* rgba(23, 71, 147, 1)  Blue*/
/* rgba(0, 0, 0, 1)  Black*/
/* rgba(35, 104, 214, 1)  LightBlue*/

/* Animation */

@-webkit-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-moz-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-o-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

</style>