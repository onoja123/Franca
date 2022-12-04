const { schema } = require("../models/userModel");

class apiFeatures{
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


// tour.aggregate([
//     {
//         $match: {ratingAvr: {$gte: 4.5}}
//     },
//     {
//         $group: {
//             _id: null,
//             sumP: {$max: "price"},
//             avgR: {$avg: "ratingAvr"},
//             avgPrice: {$avg: "price"},
//             minPrice: {$min: "price"},
//             maxPrice: {$max: "price"}
//         }
//     }
// ])

// tour.agregate([
//     {
//         $unwind: {
//             $gte: "startDate"
//         },
//         {
//             $match: {
//                 startDate: {
//                     $gte: {`{year}-1-1`},
//                     $lte: {``}
//                 }
//             }
//         }
//     }
// ])


schenma.pre("svae", function(next){
   return this.duration / 7;

   next()
})

schema.virtuals("durationWeek").get(function(next){
    return this.duration /7 ;

    next()
})

schmea.pre("find", function(next){
    this.find({$ne: true})

    next()
})


shcmea.pre("save", function(next){
    this.slug = this.slugify(this.name, {loweCase: true})

    next()
})