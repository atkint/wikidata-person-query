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
function getNamesOrAliases(data, property = "labels") {
  let results = [];
  if (data[property] != null) {
    Object.keys(data[property]).forEach(lang => {
      console.log(lang);
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
      // Array of the objects
      data.claims[property].forEach(p => {
        results.push(p.mainsnak.datavalue.value.id);
      });
      return results;
    }
  }
  return null;
}

// For the whole datavalue object. Eg. for dates/times
function getPropertyObject(data, property, single_value = false) {
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
        // Basic array of the values
        results.push(p.mainsnak.datavalue.value);
      });
      return results;
    }
  }
  return null;
}

export default { getNamesOrAliases, getPropertyId, getPropertyObject, getPropertyValue }