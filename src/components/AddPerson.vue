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
        <b-col>
          <b-textarea style="height:512px" v-if="api_result" :value="api_result"></b-textarea>
        </b-col>
        <b-col>
          <b-textarea style="height:512px" v-if="person_info" :value="person_info"></b-textarea>
        </b-col>
      </b-row>

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
export default {
  name: "AddPerson",
  components: {},
  data() {
    return {
      wikipedia_link: "https://en.wikipedia.org/wiki/Yuan_Shikai",
      wikibase_item: "",
      api_result: "",
      wikidata_response: null,
      person_info: ""
    };
  },
  mounted() {},
  methods: {
    onSubmit() {},
    onReset() {},
    queryWikipedia(query) {
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
      let person =
        response.data.entities[Object.keys(response.data.entities)[0]];
      this.person_info = "Name:\t";
      this.person_info += person.labels.zh.value || "";
      this.person_info += " (" + person.labels.en.value + ")" || "";
      this.person_info += "\nAliases:\t";
      let aliases = [];
      Object.keys(person.aliases).forEach(lang => {
        person.aliases[lang].forEach(a => {
          aliases.push(a.value);
        });
      });
      /*
      person.aliases.en.forEach(a => {
        aliases.push(a.value);
      });*/
      this.person_info += aliases.join("\n\t\t");
    }
  }
};
</script>

<style scoped></style>
