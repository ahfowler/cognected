<template>
  <div>
    <network ref="network" :nodes="nodes" :edges="edges" :options="options">
    </network>
  </div>
</template>

<script>
// Import keyword nodes and edges from Javascript file.
import {
  studentsNodeList,
  keywordsNodeList,
  edges,
} from "../script/example.js";

export default {
  name: "ClassGraph",
  data() {
    return {
      nodes: studentsNodeList.concat(keywordsNodeList),
      edges: edges,
      options: {
        nodes: {
          shape: "circle",
          borderWidth: 0,
          font: {
            color: "white",
          },
        },
        edges: {
          color: {
            inherit: "both",
            opacity: 1,
          },
          smooth: true,
          selectionWidth: 0,
        },
        groups: {
          students: {
            color: {
              background: "#E21D1D",
              border: "#E21D1D",
              highlight: {
                background: "#E21D1D",
                border: "#E21D1D",
              },
            },
          },
          assignments: {
            color: {
              background: "#FCC100",
              border: "#FCC100",
              highlight: {
                background: "#FCC100",
                border: "#FCC100",
              },
            },
          },
          keywords: {
            color: {
              background: "#174793",
              border: "#174793",
              highlight: {
                background: "#174793",
                border: "#174793",
              },
            },
          },
        },
        physics: {
          barnesHut: {
            springConstant: 0.001,
            avoidOverlap: 1,
          },
          maxVelocity: 10,
        },
      },
    };
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
</style>
