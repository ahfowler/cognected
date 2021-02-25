<template>
  <div>
    <network
      ref="studentNetwork"
      :nodes="nodes"
      :edges="edges"
      :options="options"
      :events="['click', 'doubleClick']"
      @click="myClickCallback"
    ></network>
  </div>
</template>

<script>
// Import keyword nodes and edges from Javascript file.
import {
  Assignments,
  Keywords,
  KeywordIndex,
  CalcAssignmentListAvg,
  edgeExists,
} from "../script/parseCanvasData.js";

export default {
  name: "StudentGraph",
  data() {
    return {
      importedKeywords: Keywords,
      importedAssignments: Assignments,
      nodes: [],
      edges: [],
      options: {
        nodes: {
          shape: "dot",
          font: {
            color: "#FFFFFF",
            face: "K2D",
            size: 9,
          },
          scaling: {
            customScalingFunction: function(min, max, total, value) {
              return value * 0.004;
            },
            min: 10,
            max: 100,
          },
          color: {
            background: "#174793",
            border: "#174793",
            highlight: {
              background: "#174793",
              border: "#174793",
            },
          },
        },
        edges: {
          smooth: false,
          width: 3,
        },
        groups: {
          one: { color: { background: "#fcc100" } },
        },
        physics: {
          barnesHut: {
            avoidOverlap: 1,
            springConstant: 0.1,
            centralGravity: 0.5,
          },
          maxVelocity: 10,
          minVelocity: 1,
        },
        interaction: {
          hover: false,
          selectable: false,
          selectConnectedEdges: false,
          // dragNodes: false,
        },
      },
    };
  },
  methods: {
    formatLabel(label) {
      let newLabel = "";
      let words = label.split(" ");
      if (words.length > 1) {
        words.forEach((word) => {
          newLabel += word + "\n";
        });
        return newLabel;
      } else {
        return label;
      }
    },
    myClickCallback() {
      console.log("hello");
    },
    createKeywordNodes() {
      this.nodes = [];
      this.importedKeywords.forEach((keyword) => {
        let nodeJson = {};
        nodeJson.id = KeywordIndex(keyword.name);
        // nodeJson.label = this.formatLabel(keyword.name);
        nodeJson.title = "<b>" + keyword.name +"</b><br/><b>Class Grade Average: </b>" + keyword.keyword_Avg +"%";
        nodeJson.value = keyword.keyword_Avg;
        if (keyword.category != null) {
          nodeJson.group = keyword.category.name;
        }
        this.nodes.push(nodeJson);
      });
    },
    createEdges() {
      console.log(this.importedAssignments);
      console.log(this.importedKeywords);
      this.edges = [];
      this.importedKeywords.forEach((keyword) => {
        let edgeJson = {};
        edgeJson.from = KeywordIndex(keyword.name);
        for (let keywordName in keyword.associatedKeys) {
          edgeJson.to = KeywordIndex(keywordName);
          // Calculate the edge average.
          let edgeAverage = CalcAssignmentListAvg(
            keyword.associatedKeys[keywordName]
          );
          edgeJson.length = Math.round(102 - edgeAverage + 1) + 100;
          edgeJson.title = "<b>Class Grade Average: </b>" + edgeAverage + "%";
        }

        if (!edgeExists(edgeJson, this.edges)) {
          this.edges.push(edgeJson);
        }
      });
    },
  },
  mounted() {
    this.createKeywordNodes();
    this.createEdges();
  },
};
</script>

<style scoped>
#student-cognected-graph > div,
#student-cognected-graph > div > div {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.keywordTooltip {
  background-color: rgba(23, 71, 147, 0.8) !important;
}
</style>
