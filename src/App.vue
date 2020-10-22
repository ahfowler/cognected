<template>
  <div>
    <network ref="network" :nodes="nodes" :edges="edges" :options="options">
    </network>
  </div>
</template>

<script>
import {
  studentsNodeList,
  keywordsNodeList,
  edges,
} from "./code/parseCanvasData.js";

export default {
  name: "App",
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
  mounted: function() {},
};
</script>

<style>
canvas {
  height: 95vh !important;
  background-color: #f8f8f8;
  padding: 10px;
}
</style>
