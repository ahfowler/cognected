<template>
    <div>
        <p style="font:">CognectEd User Settings</p>
        <div class="input-group">
            <label id="label">Canvas URL</label>
            <input placeholder="Institution Canvas URL...  (i.e https://asu.instructure.com/ )" style="width:500px" id="CanvasUrl" v-model="canvasURL" @keyup="PopulateCourses" @paste="PopulateCourses"> 
        </div>

        <div class="input-group">
            <label id="label">Token</label>
            <input placeholder="User Token..." id="Token" v-model="token" @keyup="PopulateCourses" @paste="PopulateCourses"/>
        </div>

        <div class="dropdown">
          <div class="dropdown-area">
            <div
              id="dropdown-list"
              v-for="course in courses"
              :key="course.name"
            >
              <input
                name="courseList"
                type="radio"
                :id="course.name"
                :value="course.name"
              />
              <label :for="course.name">{{ course.name }}</label>
            </div>
          </div>
        </div>

        <a class="myButton" @click="CancelClick" style="float:left;margin-left:50px">Cancel</a>

        <a class="myButton" @click="ApplyClick" style="float:right;margin-right:50px">Apply</a>
    </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: "UserSettings",
  props: {
    canvasURL: String,
    token: String,
    course: String,
  },
  data() {
      return{
          message: '',
          courses: [
            
        ],
      };
  },
  methods: {
    CancelClick(){
      console.log('Cancel Click');
      this.$emit('clicked', 'Canceled');
    },
    ApplyClick(){
      console.log('Apply Click');
      this.$emit('clicked', [this.canvasURL, this.token, ]);
    },
    PopulateCourses(){
      if(this.canvasURL.includes("instructure.com") && this.token.length > 60){
        var corsAnywhere = "https://salty-atoll-62320.herokuapp.com/"; //NEEDED TO CREATE A 'PROPER' CORS API CALL
        var enrollmentTypes = ["TeacherEnrollment","TaEnrollment","ObserverEnrollment", "DesignerEnrollment"];

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
                console.log(jsondata)
                this.courses.concat(jsondata)
              }
            },
            error: function (xhr) {
              console.log(xhr.responseText);
            },
          });
        });

        console.log("Getting Classes")
      }
    },
  }
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

</style>