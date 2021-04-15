<template>
  <div class="container">
    <p class="title">{{ this.keyword.name }}</p>
    <p class="mini-header">Category - {{ this.keyword.category.name }}</p>
    <br />
    <input
      type="text"
      class="category-input"
      v-model="category"
      list="categories"
      placeholder="Type a category to add..."
      @change="CategoryFound"
      @keyup="CategoryFound"
    />
    <datalist id="categories">
      <option v-for="cat in this.categoryList" :key="cat.name">{{
        cat.name
      }}</option>
    </datalist>

    <a
      style="margin-left:25px;text-decoration:none;"
      v-if="displayAddCategory"
      href="#"
      @click="AddNewCategoryClick"
      >Create a new category called "{{ category }}"?
    </a>
    <hr />

    <p class="mini-header">Keyword Average</p>
    <br />
    <p style="margin-left:25px;margin-top:5px;margin-bottom:5px">
      Average Grade: {{ this.keyword.keyword_Avg.toString() }}%
    </p>
    <hr />

    <p class="mini-header">Mentioned Assignments</p>
    <br /><br />
    <div
      v-if="assignmentsList != undefined"
      style="overflow:auto;max-height:100px;width:100%;margin-bottom:10px;"
    >
      <div v-for="id in this.keyword.assignments" :key="id">
        <a :href="assignmentsList[id].url" target="_blank"
          >• {{ assignmentsList[id].name }}</a
        >
      </div>
    </div>
    <hr />

    <p class="mini-header">Connected Keywords</p>
    <br />
    <div
      v-if="keyword != undefined"
      style="overflow:auto;max-height:100px;width:100%;margin-bottom:10px;"
    >
      <div v-for="asKey in Object.keys(keyword.associatedKeys)" :key="asKey">
        <a style="color:#000000">• {{ asKey }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Assignments,
  Categories,
  EditKeywordCategory,
} from "../script/parseCanvasData.js";

export default {
  name: "NodeInfo",
  props: {
    propkeywordData: Object,
  },
  data() {
    return {
      keyword: this.propkeywordData,
      assignmentsList: Assignments,
      category: "",
      categoryList: Categories,
      displayAddCategory: false,
    };
  },
  methods: {
    CategoryFound() {
      this.displayAddCategory =
        this.category.length != 0 &&
        !this.categoryList.some((cat) => cat.name == this.category);

      if (this.categoryList.some((cat) => cat.name == this.category)) {
        EditKeywordCategory(this.keyword.name, this.category);
      }
    },
    AddNewCategoryClick() {
      this.$emit("clicked", this.category);
    },
  },
  mounted() {
    this.categoryList = Categories;
  },
};
</script>

<style scoped>
.container {
  background-color: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 1px;
  max-width: 35%;
  max-height: 80%;
  position: absolute;
  overflow-y: auto;
  top: 5%;
  left: 30px;
}

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
  float: left;
  margin-left: 25px;
  margin-bottom: 5px;
}

.inline-group {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.closeButton {
  background-color: #000000;
  border-radius: 42px;
  cursor: pointer;
  color: #ffffff;
  font-family: Arial;
  font-size: 8px;
  padding: 5px 7px;
  text-decoration: none;
  text-shadow: 0px 1px 0px #ffffff;
  float: right;
  margin-top: 10px;
  margin-right: 5px;
}
.closeButton:hover {
  background-color: #ff4242;
}
.closeButton:active {
  position: relative;
  top: 1px;
}
</style>
