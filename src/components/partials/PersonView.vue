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
        <span v-if="person.cause_of_death.length > 0">{{props_lookup[person.cause_of_death[0]]}}</span> <span v-if="person.manner_of_death.length > 0">({{props_lookup[person.manner_of_death[0]]}})</span>
        <br />
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
export default {
  name: "PersonView",
  props: {
    person: "",
    props_lookup: {}
  }
};
</script>

<style scoped>
</style>