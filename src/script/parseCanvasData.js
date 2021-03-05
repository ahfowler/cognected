import $ from "jquery";

/* Class Definitions */
//declaration for the assignment class
class Assignment {
  constructor(id, name, desc, pts_Possible, url) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.totalPts = pts_Possible;
    this.grades = {};
    this.average = -1;
    this.url = url;

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

    if (count == 0) {
      this.average = -1;
    } else {
      this.average = parseFloat((total / count).toFixed(1));
    }
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
var corsAnywhere = "https://salty-atoll-62320.herokuapp.com/"; //NEEDED TO CREATE A 'PROPER' CORS API CALL
var dataLoading = false;

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
//expects an array of assignment ID's
function CalcAssignmentListAvg(assignments) {
  var total = 0;
  var notGradedCount = 0;

  assignments.forEach((item) => {
    if (Assignments[item].average != -1) {
      total += Assignments[item].average;
    } else {
      notGradedCount += 1;
    }
  });

  var assignmentCount = assignments.length - notGradedCount;
  var KeywordAvg = -1;
  if (assignmentCount != 0) {
    KeywordAvg = parseFloat((total / assignmentCount).toFixed(1));
  }

  return KeywordAvg;
}

/* API Call Functions */
//eslint-disable-next-line
function AjaxCallAssignments(courseID, accesskey, canvasURL) {
  try {
    dataLoading = true;
    //Canvas API call for the ASSIGNMENT for the given course
    $.ajax({
      url:
        corsAnywhere +
        canvasURL +
        "/api/v1/courses/" +
        courseID +
        "/assignments?per_page=100",
      datatype: "jsonp",
      headers: {
        Authorization: "Bearer " + accesskey,
        "x-requested-with": "xhr",
      },
      success: async function(res, status, xhr) {
        await sleep(75);
        var remainingPages = xhr.getResponseHeader("link");
        courseAssignmentData = res;

        if (remainingPages != null) {
          await ReturnAllRemaining(remainingPages, accesskey, "Assignments");
        }

        ParseJsonToAssignment();

        AjaxCallGrade(courseID, accesskey, canvasURL);
      },
      error: function(xhr) {
        console.log(xhr.responseText);
      },
    });
  } catch (e) {
    console.log(e);
  }
}

function AjaxCallGrade(courseID, accesskey, canvasURL) {
  try {
    //Canvas API call for the grade history for the given course
    $.ajax({
      url:
        corsAnywhere +
        canvasURL +
        "/api/v1/courses/" +
        courseID +
        "/gradebook_history/feed?per_page=100",
      datatype: "json",
      headers: {
        Authorization: "Bearer " + accesskey,
        "x-requested-with": "xhr",
      },
      success: async function(res, status, xhr) {
        await sleep(75);
        var remainingPages = xhr.getResponseHeader("link");
        courseGradeData = res;

        if (remainingPages != null) {
          await ReturnAllRemaining(remainingPages, accesskey, "Grades").then();
        }

        ParseGradeJson();
      },
      error: function(xhr) {
        console.log(xhr.responseText);
      },
    });
  } catch (e) {
    console.log(e);
  }
}

//helper for ParseLinkHead Function
//from https://bill.burkecentral.com/2009/10/15/parsing-link-headers-with-javascript-and-java/
function unquote(value) {
  if (value.charAt(0) == '"' && value.charAt(value.length - 1) == '"')
    return value.substring(1, value.length - 1);
  return value;
}

//function to parse the link header
//from https://bill.burkecentral.com/2009/10/15/parsing-link-headers-with-javascript-and-java/
function ParseLinkHead(value) {
  //eslint-disable-next-line
  var linkexp = /<[^>]*>\s*(\s*;\s*[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*")))*(,|$)/g;
  //eslint-disable-next-line
  var paramexp = /[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*"))/g;

  var matches = value.match(linkexp);
  var rels = new Object();
  var titles = new Object();
  for (var i = 0; i < matches.length; i++) {
    var split = matches[i].split(">");
    var href = split[0].substring(1);
    var ps = split[1];
    var link = new Object();
    link.href = href;
    var s = ps.match(paramexp);
    for (var j = 0; j < s.length; j++) {
      var p = s[j];
      var paramsplit = p.split("=");
      var name = paramsplit[0];
      link[name] = unquote(paramsplit[1]);
    }

    if (link.rel != undefined) {
      rels[link.rel] = link;
    }
    if (link.title != undefined) {
      titles[link.title] = link;
    }
  }
  var linkheader = new Object();
  linkheader.rels = rels;
  linkheader.titles = titles;
  return linkheader;
}

//function allows for application to 'halt' for x ms
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//Function to retrieve all remaining json data if there are more than 100 results from the previous call
async function ReturnAllRemaining(linkHeader, accesskey, callType) {
  var linkParser = ParseLinkHead(linkHeader);
  var remainingPages;

  //while there is no last page or the current page does not equal the last page
  while (
    linkParser.rels.last === undefined ||
    linkParser.rels.current.href != linkParser.rels.last.href
  ) {
    await $.ajax({
      url: corsAnywhere + linkParser.rels.next.href,
      datatype: "jsonp",
      headers: {
        Authorization: "Bearer " + accesskey,
        "x-requested-with": "xhr",
      },
      success: async function(res, status, xhr) {
        await sleep(50);
        remainingPages = xhr.getResponseHeader("link");

        //make sure that there was a link header in the last call
        if (remainingPages != null && remainingPages != undefined) {
          if (callType == "Students") {
            //courseStudentData = courseStudentData.concat(res);
          } else if (callType == "Grades") {
            courseGradeData = courseGradeData.concat(res);
          } else if (callType == "Assignments") {
            courseAssignmentData = courseAssignmentData.concat(res);
          }

          //set the current linkparser to the new link header
          linkParser = ParseLinkHead(remainingPages);
        }
      },
      error: function(xhr) {
        console.log(xhr.responseText);
      },
    });

    await sleep(100);
  }
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
        item.points_possible,
        item.html_url
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

    for (var i = 0; i < Keywords.length; i++) {
      Keywords[i].CalcKeywordAverage();
    }

    console.log("ASSIGNMENT OBJECTS");
    console.log(Assignments);

    // console.log("KEYWORD OBJECTS");
    // console.log(Keywords);

    dataLoading = false;
  }
}

function GetDataLoading() {
  return dataLoading;
}

export {
  Assignments,
  Keywords,
  Students,
  KeywordIndex,
  CalcAssignmentListAvg,
  edgeExists,
  GetDataLoading,
  AjaxCallAssignments,
  Keyword,
};
