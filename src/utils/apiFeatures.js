class ApiFeatures {
  constructor(mongooseQuery, searchQuery) {
    this.mongooseQuery = mongooseQuery;
    this.searchQuery = searchQuery;
  }

  /* ========= Pagination ========= */
  pagination = () => {
    let pageNumber = this.searchQuery.page * 1 || 1;
    if (pageNumber < 1) pageNumber = 1;

    const limit = 20;
    let skip = (pageNumber - 1) * limit;
    this.pageNumber = pageNumber;

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    return this;
  };

  /* ========= Filter ========= */
  filter = () => {
    let filterProduct = structuredClone(this.searchQuery);

    filterProduct = JSON.stringify(filterProduct);
    filterProduct = filterProduct.replace(
      /(gte|gt|lt|lte)/g,
      (value) => `$${value}`
    );
    filterProduct = JSON.parse(filterProduct);

    const excludedFields = ["page", "sort", "fields", "search"];
    excludedFields.forEach((field) => delete filterProduct[field]);

    this.mongooseQuery = this.mongooseQuery.find(filterProduct);

    return this;
  };

  /* ========= Sort ========= */
  sort = () => {
    if (this.searchQuery.sort) {
      let sortedBy = this.searchQuery.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortedBy);
    }

    return this;
  };

  /* ========= Selecting specific fields ========= */
  fields = () => {
    if (this.searchQuery.fields) {
      let selectedFields = this.searchQuery.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(selectedFields);
    }

    return this;
  };

  /* ========= Search ========= */
  search = () => {
    if (this.searchQuery.search) {
      this.mongooseQuery = this.mongooseQuery.find({
        $or: [
          { title: { $regex: this.searchQuery.search, $options: "i" } },
          { description: { $regex: this.searchQuery.search, $options: "i" } },
        ],
      });
    }
    return this;
  };

  /* ========= Count Documents ========= */
  countDocuments = async () => {
    let count = await this.mongooseQuery.model.countDocuments(
      this.mongooseQuery.getQuery()
    );
    return count;
  };
}

export default ApiFeatures;
