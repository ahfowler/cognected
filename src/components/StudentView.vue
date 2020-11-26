<template>
  <div id="student-view">
    <div class="pane-id">Student View</div>
    <div id="student-wrapper">
      <h2>Select a Student:</h2>
      <div class="dropdown-box">
        <p>Search for a student or select a name from the drop down list.</p>
        <div class="dropdown">
          <input placeholder="Type a student's name..." />
          <div class="dropdown-area">
            <div
              id="dropdown-list"
              v-for="student in students"
              :key="student.name"
            >
              <input
                name="studentList"
                type="radio"
                :id="student.name"
                :value="student.name"
              />
              <label :for="student.name">{{ student.name }}</label>
            </div>
          </div>
        </div>
        <div class="apply-button">Apply</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StudentView",
  data() {
    return {
      students: [
        { name: "Azaria Fowler" },
        { name: "Sai Dasari" },
        { name: "Albert Einstein" },
        { name: "Aarya Mecwan" },
        { name: "Prashant Mokkatappi" },
      ],
    };
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

#student-wrapper {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 97vh;
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
  width: 100%;
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
</style>
