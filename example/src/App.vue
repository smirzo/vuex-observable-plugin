<template>
  <div>
    <h1>{{number}}</h1>
    <p>
      Click
      <b>START</b> to start streaming numbers and
      <b>STOP</b> to stop streaming numbers.
    </p>
    <button @click="start">START</button>
    <button @click="stop">STOP</button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['number'])
  },
  methods: {
    ...mapActions({
      start: 'START_STREAMING_NUMBERS',
      stop: 'STOP_STREAMING_NUMBERS'
    })
  }
};
</script>
