<template>
    <div>
        <p style="font:">CognectEd User Settings</p>
        <div class="input-group">
            <label id="label">Canvas URL</label>
            <input placeholder="Institution Canvas URL...  (i.e https://asu.instructure.com/ )" style="width:500px" id="CanvasUrl" v-model="canvasURL"> 
        </div>

        <div class="input-group">
            <label id="label">Token</label>
            <input placeholder="User Token..." id="Token" v-model="token"/>
        </div>

        <a class="myButton" @click="CancelClick" style="float:left;margin-left:50px">Cancel</a>

        <a class="myButton" @click="ApplyClick" style="float:right;margin-right:50px">Apply</a>
    </div>
</template>

<script>
export default {
    name: "UserSettings",
    props: {
      canvasURL: String,
      token: String,
    },
    data() {
        return{
            message: '',
        }
    },
    methods: {
      CancelClick(){
        console.log('Cancel Click');
        this.$emit('clicked', 'Canceled');
      },
      ApplyClick(){
        console.log('Apply Click');
        this.$emit('clicked', [this.canvasURL, this.token]);
      }
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
</style>