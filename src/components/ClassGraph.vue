<template>
  <div>
    <network
      ref="network"
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
  name: "ClassGraph",
  props: {
    courseID: String,
    token: String,
    canvasURL: String,
  },
  data() {
    return {
      importedKeywords: Keywords,
      importedAssignments: Assignments,
      nodes: [],
      edges: [],
      nodeClicked: -1,
      options: {
        nodes: {
          shape: "circle",
          // scaling: {
          //   label: {
          //       enabled: true,
          //       min: 10,
          //       max: 10
          //   },
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
        groups: {
          one: { color: { background: "#fcc100" } },
        },
        physics: {
          barnesHut: {
            avoidOverlap: 1,
            springConstant: 0.1,
            centralGravity: 1,
          },
          maxVelocity: 2,
          minVelocity: 1,
        },
        interaction: {
          hover: false,
          selectable: true,
          selectConnectedEdges: true,
          dragNodes: true,
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
      let selectedKeywordNode = this.importedKeywords[this.$refs.network.getSelection().nodes[0]];
      if (selectedKeywordNode != undefined) {
        this.nodeClicked = KeywordIndex(selectedKeywordNode.name);
        this.createKeywordNodes();
        this.$refs.network.redraw();
      }
      else{
        if(this.nodeClicked != -1){
          this.nodeClicked = -1;
          this.createKeywordNodes();
          this.$refs.network.redraw();
        }
      }
    },
    createKeywordNodes() {
      this.nodes = [];
      let context = this;
      this.importedKeywords.forEach((keyword) => {
        let nodeJson = {};
        nodeJson.color = {};
        //if there is a node clicked and we are redrawing
        if(context.nodeClicked != -1){
          //if the current keyword is the clicked node OR the current keyword has an edge with the selected keyword
          if(keyword.name == context.importedKeywords[context.nodeClicked].name || this.HasEdge(keyword.name)){
            nodeJson.color.background = 'rgba(23, 71, 147, 1)'; //will need to change the color to be keyword.category.color;
            nodeJson.color.border = 'rgba(23, 71, 147, 1)';
            nodeJson.color.highlight = {};
            nodeJson.color.highlight.background = 'rgba(23, 71, 147, 1)';
            nodeJson.color.highlight.border = 'rgba(23, 71, 147, 1)';
          }
          else
          {
            nodeJson.color.background = 'rgba(227, 227, 227, 1)';
            nodeJson.color.border = 'rgba(227, 227, 227, 1)';
            nodeJson.color.highlight = {};
            nodeJson.color.highlight.background = 'rgba(227, 227, 227, 1)';
            nodeJson.color.highlight.border = 'rgba(227, 227, 227, 1)';
          }
        }
        else{
            nodeJson.color.background = 'rgba(23, 71, 147, 1)';
            nodeJson.color.border = 'rgba(23, 71, 147, 1)';
            nodeJson.color.highlight = {};
            nodeJson.color.highlight.background = 'rgba(23, 71, 147, 1)';
            nodeJson.color.highlight.border = 'rgba(23, 71, 147, 1)';
        }
        
        nodeJson.id = KeywordIndex(keyword.name);

        nodeJson.label = keyword.name;
        nodeJson.font = {};
        nodeJson.font.color = "white";
        nodeJson.font.strokeWidth = 2;
        nodeJson.font.strokeColor = "black";
        
        nodeJson.value = 1
        nodeJson.scaling = {};
        // nodeJson.scaling.label = {};
        // nodeJson.scaling.label.min = 20;
        // nodeJson.scaling.label.max = 20;
        nodeJson.scaling.min = keyword.keyword_Avg / 2;
        nodeJson.scaling.max = keyword.keyword_Avg / 2;

        nodeJson.title =
          "<b>" +
          keyword.name +
          "</b><br/><b>Class Grade Average: </b>" +
          keyword.keyword_Avg +
          "%";
        nodeJson.value = keyword.keyword_Avg;

        this.nodes.push(nodeJson);
      });

      this.createEdges();
    },
    createEdges() {
      // console.log("ASSIGNMENTS: ");
      // console.log(this.importedAssignments);
      // console.log("KEYWORDS: ");
      // console.log(this.importedKeywords);

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
5
        if (!edgeExists(edgeJson, this.edges)) {
          this.edges.push(edgeJson);
        }
      });
    },
    HasEdge(keyword){
      var foundEdge = false;

      this.edges.forEach(edge => {
        if(edge.from == this.nodeClicked && edge.to == KeywordIndex(keyword) || edge.to == this.nodeClicked && edge.from == KeywordIndex(keyword) ){
          foundEdge = true;
        }
      });

      return foundEdge;
    },
  },
  mounted() {
    this.createKeywordNodes();
    //this.createEdges();
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
