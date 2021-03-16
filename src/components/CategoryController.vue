<template>
  <div>
    <p class="title" style="text-align:center">Category Management</p>
    <br />

    <h3>Add New Category</h3>
     <ColorPicker class="pagination" :disabled="false" startColor="#ff0000" v-model="categoryColor"></ColorPicker>
    <input
      type="text"
      class="category-input"
      v-model="categoryName"
      placeholder="Type the category name ... "
    />

    <a class="myApplyButton" @click="AddCat" style="text-align:center; max-width:100px">Add Category</a>

    <hr/>
    <h3>Delete Categories</h3>
    <div class="category-group" style="width:80%;margin-right:10%;margin-left:10%">
      <div class="dropdown">
        <div class="dropdown-area">
          <div
            id="dropdown-list"
            v-for="(cat, i) in categoryList"
            :key="i + '-' + cat.name"
          >
            <input
              name="category_ist"
              type="radio"
              :id="cat.name"
              :value="cat.name"
              v-model="categoryToRemove"
            />
            <label :for="cat.name">{{ cat.name }}</label>
          </div>
        </div>

        <a class="myDeleteButton" @click="DeleteCat" style="text-align:center; max-width:100px">Delete Category</a>
      </div>
  </div>
  </div>
</template>

<script>
import {    Categories,
            AddCategory,
            RemoveCategory } from "../script/parseCanvasData.js";

import ColorPicker from 'vue-color-picker-wheel';

export default {
  name: "CategoryControl",
  components:{
      ColorPicker,
  },
  data() {
    return {
      categoryName: "",
      categoryColor: "",
      categoryToRemove: "",
      categoryList: Categories,
    };
  },
  methods: {
    AddCat(){
        if(this.categoryName.length != 0){
            AddCategory(this.categoryName, this.categoryColor)
        }
    },
    DeleteCat(){
        RemoveCategory(this.categoryToRemove)
    },
  },
  mounted() {
  },
};
</script>

<style scoped>

.pagination{ display: table; margin: 0 auto; }

p {
  font-family: "K2D", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 18px;
  text-align: left;
  color: #000000;
  display: inline-block;
  width: 75%;
}

a {
  font-family: "K2D", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 18px;
  text-align: left;
  color: #0645ad;
  display: inline-block;
  width: 75%;
  margin-left: 35px;
  margin-right: 10px;
  margin-bottom: 10px;
  padding: 5px;
}

hr {
  background-color: #e3e3e3;
  border-color: #e3e3e3;
  color: #e3e3e3;
  margin-right: 25px;
  margin-left: 25px;
}

h3 {
  font-family: "K2D", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 26px;
  text-align: center;
  color: #000000;
  margin-top: 50px;
}

.category-input {
  font-family: "K2D", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 18px;
  text-align: left;
  width: 75%;
  color: #000000;
  margin-right: 25px;
  margin-left: 25px;
  margin-bottom: 5px;
}

.mini-header {
  float: left;
  display: inline;
  margin-left: 25px;
  margin-bottom: 5px;
  font-weight: bold;
}

.title {
  font-family: "K2D", sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 26px;
  color: #000000;
  margin-bottom: 5px;
}

.inline-group {
  display: flex;
  flex-direction: row;
  align-items: center;
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
  text-shadow: 0px 1px 0px #2f6627;
}

.myApplyButton:hover {
  background-color: #246bd6;
}
.myApplyButton:active {
  position: relative;
  top: 1px;
}

.myDeleteButton {
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

.myDeleteButton:hover {
  background-color: #ee6250;
}
.myDeleteButton:active {
  position: relative;
  top: 1px;
}

.buttons-area {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.category-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.dropdown {
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.dropdown input {
  border: 1px solid #e5e5e5;
  border-radius: 1px;
  height: 30px;
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
  max-width: 8%;
  min-width: 8%;
  margin: 10px 15px 10px 10px;
}


</style>
