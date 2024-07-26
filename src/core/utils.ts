export const capfirst = word => {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const stackedInventory = function(inv) {
  /*
    Takes a list of items and consolidates those with identical template IDs
    to the count of the already encountered item.
  */

  var c_inv: any[] = []; // the inventory with template id counts
  var t_items = {}; // template items cache

  for (let item of inv) {
    var tid = item.template_id;

    // Templated item
    if (tid && !item.is_container) {
      if (t_items[tid] === undefined) {
        item.display_key = tid;
        t_items[tid] = item;
        item.count = 1;
        item.showCount = false;
        c_inv.push(item);
      } else {
        // Modify item in cache
        if (t_items[tid].count === 1) t_items[tid].showCount = true;
        t_items[tid].count += 1;
      }

    // Generated Item
    } else {
      item.display_key = item.key;
      c_inv.push(item);
    }
  }

  return c_inv;
};

export const getTargetInGroup = (entity, group, actor?) => {
  // Often when trying to generate a text command for an item or a mob,
  // there could be multiple copies of the item or the mob in the context
  // that is being considered.
  //
  // This function returns a target string which qualifies the entity
  // in the context of the rom it is in.
  //
  // Returns 0 if one could not be found.

  // Since we know at least the entity itself is a duplicate of itself,
  // we start at 1.
  let duplicateCount = 1,
    found = false;

  for (const thing of group) {
    if (actor && thing.key === actor.key) {
      continue;
    }

    if (entity.key === thing.key) {
      found = true;
      if (entity.key.split(".")[0] === "player") {
        return entity.name;
      }
      break;
    }
    const foundIndex = thing.keywords.split(" ").indexOf(entity.keyword);
    if (foundIndex !== -1) {
      duplicateCount += 1;
    }
  }
  if (!found) {
    return 0;
  }

  let target = entity.keyword;
  if (duplicateCount > 1) {
    target = `${duplicateCount}.${target}`;
  }
  return target;
};


export const parseLinks = (line) => {
  return line.replace(
      /((http|https):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g,
      "<a href='$1' class='interactive' target='_blank'>$1</a>"
  );
};