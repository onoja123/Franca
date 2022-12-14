class apiFeature{
    constructor(query, queryString){
        this.query = query;
        this.query = queryString
    }
    filter(){
        const queryObj = {...this.queryString}
        const excludedFields =["page", "sort", "limit", "fields"]
        excludedFields.forEach(el => delete queryObj[el])

        let queryStr = JOSN.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/,g, match => `$${match}`)

        this.query = this.query.find(JSON.parse(queryStr))

        return this;
    }
    sort() {
        if (this.queryString.sort) {
          const sortBy = this.queryString.sort.split(',').join(' ');
          this.query = this.query.sort(sortBy);
        } else {
          this.query = this.query.sort('-createdAt');
        }
        return this;
      }
      limitFields() {
        if (this.queryString.fields) {
          const sortBy = this.queryString.fields.split(',').join(' ');
          this.query = this.query.select(sortBy);
        } else {
          this.query = this.query.select('-__v');
        }
        return this;
      }
      pagination(){
        const page = this.queryStriing.page * 1 || 1;
        const limit = this.queryStriing.limit * 1 || 100;
        const skip = (page -1) * limit;

        const query = this.query.skip(skip).limit(limit)

        return this;
      }
        
    }


module.exports = apiFeature