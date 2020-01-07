<template>
  <b-card>
    <b-row>
      <b-col>
        <h1>{{person.names[0].value}} ({{person.names[1].value}})</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="2">
        <b-img
          fluid
          :src="'https://commons.wikimedia.org/wiki/Special:Redirect/file?wptype=file&wpvalue='+person.images[0]"
        ></b-img>
      </b-col>
      <b-col cols="4">
        <span v-for="alias in person.aliases" :key="alias.value">
          {{alias.value}}
          <br />
        </span>
      </b-col>
      <b-col cols="6">
        {{new Date(person.birth_dates[0].value.time.substring(1,person.birth_dates[0].value.time.length-1))}}
        <br />
        {{person.birth_dates[0].value.time.substring(1,person.birth_dates[0].value.time.length-1)}}
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
export default {
  name: "PersonView",
  props: {
    person: ""
  }
};
</script>

<style scoped>
</style>