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
