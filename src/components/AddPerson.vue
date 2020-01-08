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
      <PersonView v-if="person_object" :person="person_object" />
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
      person_object: null
    };
  },
  mounted() {},
  methods: {
    onSubmit() {},
    onReset() {},
    queryWikipedia(query) {
      this.person_object = null;
      this.wikibase_item = "";
      this.api_result = "";
      var wiki_name = query.replace("https://en.wikipedia.org/wiki/", "");
      this.query_string =
        "https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&ppprop=wikibase_item&redirects=1&titles=" +
        wiki_name +
        "&format=json&origin=*";
      console.log(this.query_string);

      axios.get(this.query_string).then(response => {
        this.api_result = JSON.stringify(response, null, 2);
        let first_page =
          response.data.query.pages[Object.keys(response.data.query.pages)[0]];
        this.wikibase_item = first_page.pageprops.wikibase_item;
        this.queryWikidata(
          "https://www.wikidata.org/w/api.php?action=wbgetentities&ids=" +
            this.wikibase_item +
            "&languages=en|zh&format=json&origin=*"
        );
      });
    },
    queryWikidata(query) {
      console.log(query);
      axios.get(query).then(response => {
        this.wikidata_response = response;
        this.api_result = JSON.stringify(response, null, 2);
        this.parseWikidataReponse(response);
      });
    },
    parseWikidataReponse(response) {
      this.person_object = {};
      let person =
        response.data.entities[Object.keys(response.data.entities)[0]];

      let aliases = [];
      let names = [];

      // Add the labels (Wikipedia page common name)
      Object.keys(person.labels).forEach(lang => {
        names.push(person.labels[lang]);
      });
      this.person_object.names = names;

      // Add the aliases
      Object.keys(person.aliases).forEach(lang => {
        person.aliases[lang].forEach(a => {
          aliases.push(a);
        });
      });
      this.person_object.aliases = aliases;

      this.person_object.images = this.getPropertyValue(person, "P18");
      this.person_object.birth_dates = this.getPropertyObject(person, "P569");
      this.person_object.death_dates = this.getPropertyObject(person, "P570");
      this.person_object.burial_places = this.getPropertyId(person, "P119");
      this.person_object.death_places = this.getPropertyId(person, "P20");
      this.person_object.birth_places = this.getPropertyId(person, "P19");
      this.person_object.manner_of_death = this.getPropertyId(person, "P1196");
      this.person_object.cause_of_death = this.getPropertyId(person, "P509");
      this.person_object.wikidata_id = person["id"];
      this.person_object.wikilinks = person.sitelinks;

      // Add the wikimedia commons gallery property P373 (for more images)
      this.person_object.wiki_commons = this.getPropertyValue(
        person,
        "P373",
        true
      );
      // Add the date that this was retrieved so updates can be done later
      this.person_object.scrape_date = new Date();
    },

    // For wikidata entities. Eg. Other places/people where the id is what's needed
    getPropertyId(data, property, single_value = false) {
      let results = [];
      if (data.claims[property] != null) {
        if (single_value) {
          // Single value result
          return data.claims[property][0].mainsnak.datavalue.value.id;
        } else {
          // Array of the objects
          data.claims[property].forEach(p => {
            results.push(p.mainsnak.datavalue.value.id);
          });
          return results;
        }
      }
      return null;
    },

    // For the whole datavalue object. Eg. for dates/times
    getPropertyObject(data, property, single_value = false) {
      let results = [];
      console.log(data.claims[property]);
      if (data.claims[property] != null) {
        if (single_value) {
          // Single value result
          return data.claims[property][0].mainsnak.datavalue;
        } else {
          data.claims[property].forEach(p => {
            // Array of the objects
            results.push(p.mainsnak.datavalue);
          });
          return results;
        }
      }
      return null;
    },

    // For properties that have a string or integer value
    getPropertyValue(data, property, single_value = false) {
      let results = [];
      if (data.claims[property] != null) {
        if (single_value) {
          // Single value result
          return data.claims[property][0].mainsnak.datavalue.value;
        } else {
          data.claims[property].forEach(p => {
            // Basic array of the values
            results.push(p.mainsnak.datavalue.value);
          });
          return results;
        }
      }
      return null;
    }
  }
};
</script>

<style scoped>

</style>