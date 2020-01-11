function getWikidataPropertyQuery(wikipedia_url) {
  let wiki_name = wikipedia_url.split('/wiki/')[1];
  let url_start = wikipedia_url.split('/wiki/')[0];

  let wikipedia_query =
    url_start + "/w/api.php?action=query&prop=pageprops&ppprop=wikibase_item&redirects=1&titles=" +
    wiki_name +
    "&format=json&origin=*";

  return wikipedia_query;
}

function getWikidataQuery(wikipedia_response) {
  let first_page =
    wikipedia_response.data.query.pages[Object.keys(wikipedia_response.data.query.pages)[0]];

  let wikidata_id = first_page.pageprops.wikibase_item;

  let wikidata_query = "https://www.wikidata.org/w/api.php?action=wbgetentities&ids=" +
    wikidata_id +
    "&languages=en|zh&format=json&origin=*";

  return wikidata_query;
}

function getWikidataIdsFromProperty(prop) {
  let propIdArray = [];
  if (Array.isArray(prop)) {
    prop.forEach(val => {
      propIdArray.push(val);
    });
  }
  return propIdArray;
}

// Maximum number of values is 50 so it may need to be separated if too many fields are included
function getPropertyQuery(person, prop_lookup) {
  let ids = [];
  ids.push(...person.birth_places);
  ids.push(...person.death_places);
  ids.push(...person.burial_places);
  ids.push(...person.religion);
  ids.push(...person.gender);
  ids.push(...person.manner_of_death);
  ids.push(...person.cause_of_death);
  console.log(Object.keys(prop_lookup));

  let query = "https://www.wikidata.org/w/api.php?action=wbgetentities&ids=" +
    ids.join('|') +
    "&languages=en|zh&format=json&origin=*";
    
  return query;
}

export default { getPropertyQuery, getWikidataPropertyQuery, getWikidataQuery, getWikidataIdsFromProperty }