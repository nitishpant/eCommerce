class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: 1,
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    console.log("queryCopy initially ", queryCopy);

    // const allowed = ["category"]; when we want to allow only specific params

    // const filterdQuery = Object.keys(queryCopy)
    //   .filter((key) => allowed.includes(key))
    //   .reduce((obj, key) => {
    //     obj[key] = queryCopy[key];
    //     return obj;
    //   }, {});

    // console.log("queryCopy filterdQuery ", filterdQuery);

    // this.query = this.query.find(filterdQuery);

    const removeField = ["keyword", "limit", "page"];
    removeField.forEach((key) => {
      delete queryCopy[key];
    });
    console.log("queryCopy after removingFields ", queryCopy);

    let queryCopyArray = JSON.stringify(queryCopy);
    queryCopyArray = queryCopyArray.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (key) => `$${key}`
    );

    console.log("queryCopy after price filter", queryCopyArray);
    this.query = this.query.find(JSON.parse(queryCopyArray));
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const pagesBeforeCurrentPage = currentPage - 1;
    const skipProducts = pagesBeforeCurrentPage * resultPerPage;
    this.query.limit(resultPerPage).skip(skipProducts);
    return this;
  }
}

module.exports = ApiFeatures;
