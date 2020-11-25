// 1. Get submissionVersion and assignments
let submissionVersions = require("../assets/submissionVersions.json");
let assignments = require("../assets/assignments.json");

// 2. Create supporting functions:
// parseKeywords(): Reads in an assignment description and returns an array of keywords found.
function parseKeywords(description) {
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

function createAssignments(assignments) {
  let assignmentsList = [];
  for (let i = 0; i < assignments.length; i++) {
    let assignment = {};
    assignment.name = assignments[i].name;
    assignment.id = assignments[i].id;
    assignment.keywords = parseKeywords(assignments[i].description);
    assignmentsList.push(assignment);
  }
  return assignmentsList;
}

function createKeywords(assignmentsList) {
  let keywordsList = [];
  let keywords = [];
  for (let i = 0; i < assignmentsList.length; i++) {
    assignmentsList[i].keywords.forEach((k) => {
      if (!keywords.includes(k)) {
        // A keyword object doesn't exist.
        let keyword = {};
        keyword.name = k;
        keyword.relatedAssignments = [];
        keyword.relatedAssignments.push(assignmentsList[i].id);
        keywordsList.push(keyword);
        keywords.push(k);
      } else {
        for (let j = 0; j < keywordsList.length; j++) {
          if (keywordsList[j].name == k) {
            keywordsList[j].relatedAssignments.push(assignmentsList[i].id);
          }
        }
      }
    });
  }
  return keywordsList;
}

function createStudents(submissionVersions, assignmentsList) {
  let studentsList = [];
  let studentNames = [];

  for (let i = 0; i < submissionVersions.length; i++) {
    let currentStudent = {};
    if (!studentNames.includes(submissionVersions[i].user_name)) {
      currentStudent.name = submissionVersions[i].user_name;
      currentStudent.id = submissionVersions[i].user_id;
      currentStudent.grades = populateScores(
        submissionVersions,
        assignmentsList,
        currentStudent.name
      );
      studentNames.push(submissionVersions[i].user_name);
      studentsList.push(currentStudent);
    }
  }

  return studentsList;
}

function populateScores(submissionVersions, assignmentsList, studentName) {
  let gradesList = [];

  for (let i = 0; i < submissionVersions.length; i++) {
    // Go through every submissionVersion...
    if (submissionVersions[i].user_name == studentName) {
      // If this submissionVersion is the student's...
      let currentAssignment = {};
      currentAssignment.assignmentName = submissionVersions[i].assignment_name;
      currentAssignment.assignmentId = submissionVersions[i].assignment_id;
      currentAssignment.keywords = []; // Populate the keywords.

      for (let j = 0; j < assignmentsList.length; j++) {
        // Go through all of the assignments...
        if (assignmentsList[j].id == currentAssignment.assignmentId) {
          // If you find the assignment that this sumbissionVersion is for...
          for (let l = 0; l < assignmentsList[j].keywords.length; l++) {
            // Go though all the keywords for that assignment...
            let currentKeyword = {};
            currentKeyword.keywordName = assignmentsList[j].keywords[l];
            currentKeyword.grade = submissionVersions[i].current_grade;
            currentAssignment.keywords.push(currentKeyword);
          }
        }
      }
      gradesList.push(currentAssignment);
    }
  }

  return gradesList;
}

function createAssignmentNodes(assignmentsList) {
  let assignmentNodes = [];
  assignmentsList.forEach((assignment) => {
    let assignmentNode = {};
    assignmentNode.id = assignment.id;
    assignmentNode.group = "assignments";
    assignmentNode.label = assignment.name;
    assignmentNodes.push(assignmentNode);
  });
  return assignmentNodes;
}

function createKeywordNodes(keywordsList) {
  let keywordNodes = [];
  keywordsList.forEach((keyword) => {
    let keywordNode = {};
    keywordNode.id = keyword.name;
    keywordNode.group = "keywords";
    keywordNode.label = keyword.name;
    keywordNodes.push(keywordNode);
  });
  return keywordNodes;
}

function createStudentNodes(studentList) {
  let studentNodes = [];
  studentList.forEach((student) => {
    let studentNode = {};
    studentNode.id = student.id;
    studentNode.group = "students";
    studentNode.label = student.name;
    studentNodes.push(studentNode);
  });
  return studentNodes;
}

function computeColor(grade) {
  if (grade >= 100 || grade >= 90) {
    grade = "#398E38";
  } else if (grade >= 80) {
    grade = "#87C137";
  } else if (grade >= 70) {
    grade = "#FCC100";
  } else if (grade >= 50) {
    grade = "#EE7D15";
  } else {
    grade = "#E21D1D";
  }
  return grade;
}

function createStudentConnections(studentsList) {
  let connections = [];

  studentsList.forEach((student) => {
    console.log(student.name);
    student.grades.forEach((grade) => {
      grade.keywords.forEach((keyword) => {
        let currentConnection = {};
        currentConnection.from = student.id;
        currentConnection.to = keyword.keywordName;
        currentConnection.width = keyword.grade / 20;
        currentConnection.title =
          student.name +
          "'s " +
          grade.assignmentName +
          " score: (" +
          keyword.keywordName +
          ") " +
          keyword.grade +
          "%";
        currentConnection.color = computeColor(keyword.grade);
        connections.push(currentConnection);
      });
    });
  });
  return connections;
}

let assignmentsList = createAssignments(assignments);
// console.log(assignmentsList);

let keywordsList = createKeywords(assignmentsList);
// console.log(keywordsList);

let studentsList = createStudents(submissionVersions, assignmentsList);
for (let i = 0; i < studentsList.length; i++) {
  console.log(studentsList[i]);
  for (let j = 0; j < studentsList[i].grades.length; j++) {
    console.log(studentsList[i].grades[j]);
  }
}

export let assignmentNodeList = createAssignmentNodes(assignmentsList);
// console.log(assignmentNodeList);

export let keywordsNodeList = createKeywordNodes(keywordsList);
// console.log(keywordsNodeList);

export let studentsNodeList = createStudentNodes(studentsList);
// console.log(studentsNodeList);

export let edges = createStudentConnections(studentsList);
// console.log(edges);

export default {
  assignmentNodeList,
  studentsNodeList,
  keywordsNodeList,
  edges,
};
