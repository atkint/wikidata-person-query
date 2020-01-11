<template>
  <b-container>
    <b-form @submit="onSubmit" @reset="onReset">
      <b-card>
        <b-row>
          <b-col cols="10">
            <b-input v-model="wikipedia_link"></b-input>
          </b-col>
          <b-col cols="2">
            <b-button block @click="queryWikipedia(wikipedia_link)">Query</b-button>
          </b-col>
        </b-row>
      </b-card>
      <a
        v-if="wikibase_item"
        :href="'https://www.wikidata.org/wiki/Special:EntityPage/'+wikibase_item"
        target="_blank"
      >Wikidata</a>
      <b-row>
        <b-col cols="10">
          <b-textarea style="height:512px" v-if="api_result" :value="api_result"></b-textarea>
        </b-col>
        <b-col>
          <b-textarea style="height:512px" v-if="person_info" :value="person_info"></b-textarea>
        </b-col>
      </b-row>
      <PersonView v-if="person_object" :person="person_object" :props_lookup="props_lookup"/>
      <b-card>
        <b-row>
          <b-col cols="8">
            <b-button block type="submit" variant="primary">Submit</b-button>
          </b-col>
          <b-col>
            <b-button block type="reset" variant="danger">Reset</b-button>
          </b-col>
        </b-row>
      </b-card>
    </b-form>
  </b-container>
</template>

<script>
import axios from "axios";
import PersonView from "./partials/PersonView";
import deriver from "../utilities/wiki_deriver";
import parser from "../utilities/wikidata_parser";
import querier from "../utilities/wiki_querier";

export default {
  name: "AddPerson",
  components: { PersonView },
  data() {
    return {
      wikipedia_link: "https://en.wikipedia.org/wiki/Yuan_Shikai",
      wikibase_item: "",
      api_result: "",
      wikidata_response: null,
      person_info: "",
      person_object: null,
      props_lookup: {},
    };
  },
  mounted() {},
  methods: {
    onSubmit() {},
    onReset() {},
    queryWikipedia(wikipedia_url) {
      let wikipedia_query = querier.getWikidataPropertyQuery(wikipedia_url);
      this.api_result = "";
      this.person_object = null;

      // Query wikipedia to get the wikidata ID
      axios.get(wikipedia_query).then(response => {
        let wikidata_query = querier.getWikidataQuery(response);
        this.api_result = JSON.stringify(response, null, 2);
        
        // Query wikidata to get the wikidata entity
        axios.get(wikidata_query).then(response => {
          this.wikidata_response = response;
          this.api_result = JSON.stringify(response, null, 2);

          // Build the person object with wikidata IDs on the properties
          this.person_object = parser.createPersonFromWikidata(response);

          let prop_query = querier.getPropertyQuery(this.person_object, this.props_lookup);
          axios.get(prop_query).then(response => {
            console.log(response)
            this.props_lookup = parser.createPropertyLookup(response, this.props_lookup);
          });
        });
      });
    },
    queryWikidata(query) {
      axios.get(query).then(response => {
        this.wikidata_response = response;
        this.api_result = JSON.stringify(response, null, 2);
        this.parseWikidataReponse(response);
      });
    }
  }
};
</script>

<style scoped>
</style>
