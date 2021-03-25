<template>
  <div>
    <network
      ref="network"
      :nodes="nodes"
      :edges="edges"
      :options="options"
      :events="['click', 'dragging']"
      @click="myClickCallback"
      @dragging="myClickCallback"
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
      selectedAssignments: [],
      selectedCategories: [],
      importedAssignments: Assignments,
      nodes: [],
      edges: [],
      nodeClicked: -1,
      options: {
        nodes: {
          shape: "circle",
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
          color: {
            inherit: "both",
          },
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
      let selectedKeywordNode = this.importedKeywords[
        this.$refs.network.getSelection().nodes[0]
      ];
      if (selectedKeywordNode != undefined) {
        this.nodeClicked = KeywordIndex(selectedKeywordNode.name);
        this.createKeywordNodes();
        this.$refs.network.redraw();
        this.$emit("clicked", [
          this.nodeClicked,
          this.importedKeywords[this.nodeClicked],
          this.importedAssignments,
        ]);
      } else {
        if (this.nodeClicked != -1) {
          this.nodeClicked = -1;
          this.createKeywordNodes();
          this.$refs.network.redraw();
          this.$emit("clicked", [-1, undefined, undefined]);
        }
      }
    },
    createKeywordNodes() {
      this.nodes = [];
      let context = this;
      this.filteredKeywords.forEach((keyword) => {
        let nodeJson = {};
        nodeJson.color = {};
        //if there is a node clicked and we are redrawing
        if (context.nodeClicked != -1) {
          //if the current keyword is the clicked node OR the current keyword has an edge with the selected keyword
          if (
            keyword.name ==
              context.importedKeywords[context.nodeClicked].name ||
            this.HasEdge(keyword.name)
          ) {
            nodeJson.color.background = keyword.category.color; //will need to change the color to be keyword.category.color;
            nodeJson.color.border = keyword.category.color;
            nodeJson.color.highlight = {};
            nodeJson.color.highlight.background = keyword.category.color;
            nodeJson.color.highlight.border = keyword.category.color;
          } else {
            nodeJson.color.background = "rgba(227, 227, 227, 1)";
            nodeJson.color.border = "rgba(227, 227, 227, 1)";
            nodeJson.color.highlight = {};
            nodeJson.color.highlight.background = "rgba(227, 227, 227, 1)";
            nodeJson.color.highlight.border = "rgba(227, 227, 227, 1)";
          }
        } else {
          nodeJson.color.background = keyword.category.color;
          nodeJson.color.border = keyword.category.color;
          nodeJson.color.highlight = {};
          nodeJson.color.highlight.background = keyword.category.color;
          nodeJson.color.highlight.border = keyword.category.color;
        }

        nodeJson.id = KeywordIndex(keyword.name);

        nodeJson.label = keyword.name;
        nodeJson.font = {};
        nodeJson.font.color = "white";
        nodeJson.font.strokeWidth = 1;
        nodeJson.font.strokeColor = "black";

        nodeJson.value = 1;
        nodeJson.scaling = {};
        // nodeJson.scaling.label = {};
        // nodeJson.scaling.label.min = 20;
        // nodeJson.scaling.label.max = 20;
        nodeJson.scaling.min = Math.pow(keyword.keyword_Avg / 2, 2.1) * 0.017;
        nodeJson.scaling.max = Math.pow(keyword.keyword_Avg / 2, 2.1) * 0.017;

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

        if (!edgeExists(edgeJson, this.edges)) {
          this.edges.push(edgeJson);
        }
      });
    },
    HasEdge(keyword) {
      var foundEdge = false;

      this.edges.forEach((edge) => {
        if (
          (edge.from == this.nodeClicked && edge.to == KeywordIndex(keyword)) ||
          (edge.to == this.nodeClicked && edge.from == KeywordIndex(keyword))
        ) {
          foundEdge = true;
        }
      });

      return foundEdge;
    },
  },
  mounted() {
    this.createKeywordNodes();
    this.$refs.network.fit();

    //this.createEdges();
    this.$root.$on("applyAssignments", (selectedAssignments) => {
      this.selectedAssignments = selectedAssignments;
      this.createKeywordNodes();
    });

    this.$root.$on("applyCategories", (selectedCategories) => {
      this.selectedCategories = selectedCategories;
      this.createKeywordNodes();
    });
  },
  computed: {
    filterStructure() {
      let filterJSON = {};
      filterJSON.assignments = this.selectedAssignments;
      filterJSON.categories = this.selectedCategories;
      return filterJSON;
    },
    filteredKeywords() {
      let filters = ["assignments", "categories"];
      let selectedAssignments = this.selectedAssignments;
      let selectedCategories = this.selectedCategories;

      if (
        this.filterStructure.assignments.length > 0 ||
        this.filterStructure.categories.length > 0
      ) {
        return this.importedKeywords.filter(function(keyword) {
          for (let j = 0; j < filters.length; j++) {
            let keywordFound = (function(
              filterName,
              keyword,
              selectedAssignments,
              selectedCategories
            ) {
              if (filterName == "assignments") {
                if (selectedAssignments.length > 0) {
                  for (let i = 0; i < selectedAssignments.length; i++) {
                    if (
                      keyword.assignments.includes(
                        parseInt(selectedAssignments[i])
                      )
                    ) {
                      return false;
                    }
                  }
                  return true;
                } else {
                  return false;
                }
              } else if (filterName == "categories") {
                if (selectedCategories.length > 0) {
                  for (let i = 0; i < selectedCategories.length; i++) {
                    if (keyword.category.id == selectedCategories[i]) {
                      return false;
                    }
                  }
                  return true;
                } else {
                  return false;
                }
              }
            })(filters[j], keyword, selectedAssignments, selectedCategories);

            // For each filter parameter...
            if (filters[j] == "assignments" && keywordFound) {
              return false; // Doesn't match filter.
            } else if (filters[j] == "categories" && keywordFound) {
              return false;
            }
          }
          return true;
        });
      } else {
        return this.importedKeywords;
      }
    },
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
