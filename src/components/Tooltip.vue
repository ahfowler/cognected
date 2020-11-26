<template>
  <div class="tooltip-box">
    <slot />
    <div class="tooltip">
      <span class="text">{{ text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.tooltip-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tooltip-box:hover .tooltip {
  opacity: 1;
}

.tooltip {
  color: #000;
  font-family: "Roboto", sans-serif;
  text-align: center;
  font-size: 12px;
  padding: 5px;
  bottom: 100%;

  opacity: 0;
  transition: opacity 1s;

  position: absolute;
  z-index: 1;

  background: #fff;
  border-radius: 5px;
  border: #000 solid 1px;
}

.text::after {
  content: " ";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #000 transparent transparent transparent;
}

.tooltip-box > img {
  width: 20px;
  height: auto;
}
</style>
