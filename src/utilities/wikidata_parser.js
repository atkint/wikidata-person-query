/*
Properties I care about:
P18     Images
P19     Place of birth
P20     Place of death
P21     Gender
P119    Place of burial
P140    Religion
P509    Cause of death
P569    Date of birth
P570    Date of death
P1196   Manner of death
*/

function createPropertyLookup(response, current_lookup) {
  let props_lookup = {};
  Object.keys(response.data.entities).forEach(prop => {
    if (response.data.entities[prop].labels.en != null || response.data.entities[prop].labels.zh != null) {
      props_lookup[prop] = response.data.entities[prop].labels.en.value || response.data.entities[prop].labels.zh.value;
    }
  });
  return { ...current_lookup, ...props_lookup };
}

function createPersonFromWikidata(response) {
  let person_object = {};

  let person =
    response.data.entities[Object.keys(response.data.entities)[0]];

  let aliases = [];
  let names = [];

  // Add the labels (Wikipedia page common name)
  Object.keys(person.labels).forEach(lang => {
    names.push(person.labels[lang]);
  });
  person_object.names = getNamesOrAliases(person);

  // Add the aliases
  Object.keys(person.aliases).forEach(lang => {
    person.aliases[lang].forEach(a => {
      aliases.push(a);
    });
  });
  person_object.aliases = getNamesOrAliases(person, "aliases");

  // Add properties
  person_object.gender = getPropertyId(person, "P21");
  person_object.images = getPropertyValue(person, "P18");
  person_object.birth_dates = getPropertyObject(person, "P569");
  person_object.death_dates = getPropertyObject(person, "P570");
  person_object.birth_places = getPropertyId(person, "P19");
  person_object.death_places = getPropertyId(person, "P20");
  person_object.burial_places = getPropertyId(person, "P119");
  person_object.religion = getPropertyId(person, "P140");
  person_object.manner_of_death = getPropertyId(person, "P1196");
  person_object.cause_of_death = getPropertyId(person, "P509");
  person_object.wikidata_id = person["id"];
  person_object.wikilinks = person.sitelinks;

  // Add the wikimedia commons gallery property P373 (for more images)
  person_object.wiki_commons = getPropertyValue(
    person,
    "P373",
    true
  );

  // Add the date that this was retrieved so updates can be done later
  person_object.scrape_date = new Date();

  return person_object;
}

function getNamesOrAliases(data, property = "labels") {
  let results = [];
  if (data[property] != null) {
    Object.keys(data[property]).forEach(lang => {
      // Names/labels are a single object
      if (property == "labels") {
        results.push(data[property][lang]);
      }
      // Aliases are an array
      else {
        data[property][lang].forEach(a => {
          results.push(a);
        });
      }
    });
  }
  return results;
}

// For wikidata entities. Eg. Other places/people where the id is what's needed
function getPropertyId(data, property, single_value = false) {
  let results = [];
  if (data.claims[property] != null) {
    if (single_value) {
      // Single value result
      return data.claims[property][0].mainsnak.datavalue.value.id;
    } else {
      // Array of the ids
      data.claims[property].forEach(p => {
        try {
          results.push(p.mainsnak.datavalue.value.id);
        }
        catch(err) {
          console.log("Error parsing: "+err);
          console.log(p);
        }
      });
      return results;
    }
  }
  return results;
}

// For the whole datavalue object. Eg. for dates/times
function getPropertyObject(data, property, single_value = false) {
  let results = [];
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
  return results;
}

// For properties that have a string or integer value
function getPropertyValue(data, property, single_value = false) {
  let results = [];
  if (data.claims[property] != null) {
    if (single_value) {
      // Single value result
      return data.claims[property][0].mainsnak.datavalue.value;
    } else {
      data.claims[property].forEach(p => {
        // Array of the values
        results.push(p.mainsnak.datavalue.value);
      });
      return results;
    }
  }
  return results;
}

export default { createPropertyLookup, createPersonFromWikidata, getNamesOrAliases, getPropertyId, getPropertyObject, getPropertyValue }