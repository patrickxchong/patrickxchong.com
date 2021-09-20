module.exports = (arr) => {
  return arr.sort((a, b) => {
    aDate = a.data.updatedAt || a.date;
    bDate = b.data.updatedAt || b.date;
    return bDate - aDate;

  });
};

