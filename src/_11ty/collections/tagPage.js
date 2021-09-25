const slugify = require("../filters/slugify");
const getTagList = require("../filters/tagList");
const sortByUpdated = require("../filters/sortByUpdated");
const getPublished = require("../filters/published");

module.exports = (collection) => {
  let paginationSize = 8;
  let tagMap = [];

  let tagList = getTagList(collection);

  for (let tagName of tagList) {
    let tagItems = collection.getFilteredByTag(tagName);
    tagItems = sortByUpdated(getPublished(tagItems));
    let pagedItems = chunk(tagItems, paginationSize);

    // create array of page slugs
    let tagPageSlugs = [];
    for (let i = 0; i < pagedItems.length; i++) {
      let tagSlug = slugify(tagName);
      let pageSlug = i == 0 ? `/tag/${tagSlug}/` : `/tag/${tagSlug}/${i + 1}/`;
      tagPageSlugs.push(pageSlug);
    }
    
    for (let pageNumber = 0, max = pagedItems.length; pageNumber < max; pageNumber++) {
      tagMap.push({
        tagName: tagName,
        pageSlug: tagPageSlugs[pageNumber],
        pageData: pagedItems[pageNumber],
        totalPages: tagPageSlugs.length,
        // minimal reproduction of pagination structure
        // https://www.11ty.dev/docs/pagination/
        pagination: {
          pageNumber: pageNumber,
          hrefs: tagPageSlugs,
          href: {
            all: tagPageSlugs,
            next: tagPageSlugs[pageNumber + 1] || null,
            previous: tagPageSlugs[pageNumber - 1] || null,
            first: tagPageSlugs[0] || null,
            last: tagPageSlugs[tagPageSlugs.length - 1] || null,
          },
        },
      });
    }
  }

  // console.log(tagMap);
  return tagMap;
};

function slice(array, start, end) {
  let length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  start = start == null ? 0 : start;
  end = end === undefined ? length : end;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  let index = -1;
  const result = new Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

function chunk(array, size = 1) {
  size = Math.max(size, 0);
  const length = array == null ? 0 : array.length;
  if (!length || size < 1) {
    return [];
  }
  let index = 0;
  let resIndex = 0;
  const result = new Array(Math.ceil(length / size));

  while (index < length) {
    result[resIndex++] = slice(array, index, (index += size));
  }
  return result;
}