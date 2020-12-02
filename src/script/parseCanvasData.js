/* Class Definitions */
class Assignment {
  constructor(id, name, desc, pts_Possible) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.totalPts = pts_Possible;
    this.grades = {};
    this.average = -1;

    //check if this assignment is extraCredit
    if (this.totalPts == 0) {
      this.extraCredit = true;
    } else {
      this.extraCredit = false;
    }

    //if the description is not blank or null
    if (this.desc != null && this.desc != "") {
      var div = document.createElement("div");
      div.innerHTML = desc;

      this.keywords = ParseKeywords(div.textContent || div.innerText || "");

      //if there were keywords in the description
      if (this.keywords != false) {
        HandleKeywords(this.keywords, this.id);
      }
    }
  }

  //appends the given grade to the grade list if the ID matches
  AppendGrade(gradeObject) {
    //if this assignment was extra credit just make the grade to be 100
    if (this.totalPts == 0) {
      this.grades[gradeObject.user_name] = 100.0;
    } else {
      var roundedGrade = parseFloat(
        ((gradeObject.current_grade / this.totalPts) * 100).toFixed(1)
      );

      //if this assignment contained extraCredit make the flag true
      if (roundedGrade > 100) {
        this.extraCredit = true;
      }

      this.grades[gradeObject.user_name] = roundedGrade;
    }
  }

  //function to calculate the total assignment average
  CalcAssignmentAverage() {
    var total = 0;
    var count = Object.keys(this.grades).length;
    for (let key in this.grades) {
      total += this.grades[key];
    }

    this.average = parseFloat((total / count).toFixed(1));
  }
}

class Keyword {
  constructor(name) {
    this.name = name;
    this.keyword_Avg = 0;
    this.associatedKeys = {};
    this.assignments = [];

    //used for later features
    this.category = null;
  }

  //function to calculate the total assignment average
  CalcKeywordAverage() {
    this.keyword_Avg = CalcAssignmentListAvg(this.assignments);
  }

  //appends the given assignment to the assignments list
  AppendAssignment(assignmentID) {
    this.assignments.push(assignmentID);
  }

  //appends the given keywords to the associatedKeys list
  AppendToAssociatedKey(keywords, assignmentID) {
    keywords.forEach((item) => {
      if (item != this.name) {
        if (this.associatedKeys[item] == undefined) {
          this.associatedKeys[item] = [];
        }

        this.associatedKeys[item].push(assignmentID);
      }
    });
  }
}

// class Category {
//   constructor(name, color, id) {
//     this.name = name;
//     this.color = color;
//     this.id = id;
//   }
// }

// class Student {
//   constructor(name, id) {
//     this.name = name;
//     this.id = id;
//   }
// }

/* Global Variables */
var courseAssignmentData;
var courseGradeData;
var Assignments = {};
var Keywords = [];
var Students = [];

/* Helper Functions */

//Used to parse out keywords from an assignment description
function ParseKeywords(description) {
  var regexp = /(\s|^)#\w\w+\b/gm;
  let result = description.match(regexp);
  if (result) {
    result = result.map((keyword) => {
      keyword = keyword.trim();
      keyword = keyword.replace(/[_-]/g, " ");
      return keyword.substring(1);
    });

    return result;
  } else {
    return false;
  }
}

//returns the index of the keyword
function KeywordIndex(keyword) {
  for (let i = 0; i < Keywords.length; i++) {
    if (Keywords[i].name == keyword) {
      return i;
    }
  }

  return -1;
}

//checks if the keyword exists and appends additional associated keywords if they are not on the list
function HandleKeywords(keywords, id) {
  keywords.forEach((item) => {
    var keyIdx = KeywordIndex(item);
    if (keyIdx == -1) {
      Keywords.push(new Keyword(item));
      keyIdx = Keywords.length - 1;
    }

    Keywords[keyIdx].AppendAssignment(id);
    Keywords[keyIdx].AppendToAssociatedKey(keywords, id);
  });
}

function edgeExists(edge, edges) {
  let answer = false;
  edges.forEach((currentEdge) => {
    if (
      (edge.to == currentEdge.to && edge.from == currentEdge.from) ||
      (edge.to == currentEdge.from && edge.from == currentEdge.to)
    ) {
      answer = true;
    }
  });
  return answer;
}

//Calculates the average of assignments given a list
// expects an array of assignment ID's
function CalcAssignmentListAvg(assignments) {
  var total = 0;

  assignments.forEach((item) => {
    total += Assignments[item].average;
  });

  return parseFloat((total / assignments.length).toFixed(1));
}

/* API Call Functions */
function AjaxCallAssignments(courseID, accesskey) {
  courseID = accesskey; // Turn off undefined error.
  courseAssignmentData = require("../assets/assignments.json");
  ParseJsonToAssignment();
}

function AjaxCallGrade(courseID, accesskey) {
  courseID = accesskey; // Turn off undefined error.
  courseGradeData = require("../assets/submissionVersions.json");
  ParseGradeJson();
}

/* JSON Parser Functions */
//parse the assignment data for the course
function ParseJsonToAssignment() {
  if (courseAssignmentData != undefined) {
    courseAssignmentData.forEach((item) => {
      Assignments[item.id] = new Assignment(
        item.id,
        item.name,
        item.description,
        item.points_possible
      );
    });
  }
}

//Parse the grade data for the course
function ParseGradeJson() {
  if (courseGradeData != undefined) {
    courseGradeData.forEach((item) => {
      Assignments[item.assignment_id].AppendGrade(item);
      if (!Students.includes(item.user_name)) {
        Students.push(item.user_name);
      }
    });

    for (let id in Assignments) {
      Assignments[id].CalcAssignmentAverage();
    }

    for (let i = 0; i < Keywords.length; i++) {
      Keywords[i].CalcKeywordAverage();
    }
  }
}

/* Main */
AjaxCallAssignments();
AjaxCallGrade();

export {
  Assignments,
  Keywords,
  Students,
  KeywordIndex,
  CalcAssignmentListAvg,
  edgeExists,
};
