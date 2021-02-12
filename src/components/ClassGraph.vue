<template>
  <div>
    <network
      ref="network"
      :nodes="nodes"
      :edges="edges"
      :options="options"
      :events="['click']"
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
  name: "ClassGraph",
  data() {
    return {
      courseID: 18732,
      accessKey: "7236~8dQSbbxT2iQeatKfNOJYzWR441OHkkv5CcUOr4sksrHNmdk1SRQoJG5wrut4e0s7",
      importedKeywords: Keywords,
      importedAssignments: Assignments,
      nodes: [],
      edges: [],
      options: {
        nodes: {
          shape: "circle",
          // scaling: {
          //   // label: {
          //   //     enabled: true,
          //   //     min: 10,
          //   //     max: 10
          //   // },
          //   // customScalingFunction: function(min, max, total, value) {
          //   //   return value * 0.005;
          //   // },
          //   // min: 10,
          //   // max: 10,
          // },
          value: 1, 
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
        physics: {
          barnesHut: {
            avoidOverlap: 1,
            springConstant: 0.001,
            centralGravity: 1,
            gravitationalConstant: -5000,
          },
        },
        interaction: {
          hover: false,
        },
      },
    };
  },
  methods: {
    myClickCallback() {
      let selectedKeywordNode = this.importedKeywords[this.$refs.network.getSelection().nodes[0]]
      if(selectedKeywordNode != undefined){
        console.log("Selected Node: " + selectedKeywordNode.name);

        this.importedKeywords[KeywordIndex(selectedKeywordNode.name)].name = "UPDATED: " + selectedKeywordNode.name;
        this.createKeywordNodes();
        this.$refs.network.body.emitter.emit('_dataChanged');
        this.$refs.network.redraw();
      }

    },
    createKeywordNodes() {
      this.nodes = [];
      this.importedKeywords.forEach((keyword) => {
        let nodeJson = {};
        nodeJson.id = KeywordIndex(keyword.name);

        nodeJson.label = keyword.name;
        nodeJson.font = {};
        nodeJson.font.color = "white";
        nodeJson.font.strokeWidth = 2;
        nodeJson.font.strokeColor = "black";

        nodeJson.scaling = {};
        nodeJson.scaling.min = keyword.keyword_Avg / 2;
        nodeJson.scaling.max = keyword.keyword_Avg / 2;

        nodeJson.title = "<b>" + keyword.name + "</b><br/><b>Class Grade Average: </b>" + keyword.keyword_Avg + "%";
        //nodeJson.value = keyword.keyword_Avg;
        
        this.nodes.push(nodeJson);
      });
    },
    createEdges() {
      console.log("ASSIGNMENTS: ");
      console.log(this.importedAssignments)
      console.log("KEYWORDS: ");
      console.log(this.importedKeywords)
      
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
          edgeJson.length = (110 / 100) * 100 - edgeAverage; // Highest grade receieved from any assignment.
          edgeJson.length += 130;
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
#cognected-graph > div,
#cognected-graph > div > div {
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
