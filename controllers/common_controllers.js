const app_error_feedback = require('../err_handling/app_error_feedback');     
const qs = require("qs");
const { Op, } = require('sequelize');
const { sequelize } = require('../db conection/db');

exports.common_controller =  (model)=>{
  //----------------------------------IF mysql---------------------------------------//

  // if the db if my sql
  const create = async(req,res,next)=>{
    if (!model) return next(new app_error_feedback(500, `Model ${model} not found`));
    try {
      const createObj = {...req.body} 
      // if the route_ref has add_createdBy then get the user from the req.user and {createdBy: req.user._id} will be added to the req.body
      if(req.route_ref.controller.add_createdBy) createObj.createdBy = req.user._id
      const data = await model.create(createObj)
      res.status(200).json({ 
        status: 'success',
        data
      })
    } catch (err) {
      next(err) // globalerrhandler will  handle this err
    }

  } 

  const getList = async (req,res,next)=>{
    //?page=1&perPage=10&sort=-createdAt,name&fields=name,description,price&search=laptop&price>=100&price<=500&category=electronics&populate=category,brand
    if (!model) return next(new app_error_feedback(500, `Model ${model} not found`));
    try {
      // Decode URI and parse query string properly
      const decodedURI = decodeURIComponent(req.url);
      let queryStr = Object.keys(req.query).length ? decodedURI.split('?')[1] : null;
      console.log(`queryStr on getList request: ${queryStr ?? 'no queryStr found'}`);
      // Parse query using `qs` to handle advanced queries
      const queryObj = qs.parse(queryStr, { allowDots: true });
      // Default Pagination: If `page` exists, convert it to `offset`
      let page = parseInt(queryObj.page) || 1;
      let limit = parseInt(queryObj.perPage) || 10;
      let offset = (page - 1) * limit;
      // Sorting: Convert query sorting to Sequelize format
      let order = [];
      if (queryObj.sort) {
        let sortFields = queryObj.sort.split(",");
        order = sortFields.map(field => {
          return field.startsWith("-") ? [field.substring(1), "DESC"] : [field, "ASC"];
        });
      }
      // Projection (Select specific fields)
      let attributes = queryObj.fields ? queryObj.fields.split(",") : undefined ;
      // Filtering (convert MongoDB-like syntax to Sequelize `Op` operators)
      let where = {};
      Object.keys(queryObj).forEach(key => {
        if (["page", "perPage", "sort", "fields", "search"].includes(key)) return;
        let value = queryObj[key];
        if (typeof value === "string") {
          if (value.startsWith(">=")) where[key] = { [Op.gte]: value.slice(2) };
          else if (value.startsWith("<=")) where[key] = { [Op.lte]: value.slice(2) };
          else if (value.startsWith(">")) where[key] = { [Op.gt]: value.slice(1) };
          else if (value.startsWith("<")) where[key] = { [Op.lt]: value.slice(1) };
          else where[key] = value;
        } else {
          where[key] = value;
        }
      });
      // Text Search (if `search` exists, apply LIKE filter on string fields)

      if (queryObj.search) {
        const stringFields = Object.keys(model.getAttributes())
        .filter(key => model.getAttributes()[key].type.constructor.name === 'STRING')
        .map(key => model.getAttributes()[key].field);
        where[Op.and] = sequelize.literal(
          `MATCH(${stringFields.join(", ")}) AGAINST ('${queryObj.search}' IN BOOLEAN MODE)`
        );
      }

      // Include Relationships (Population)
      let include = [];
      // if (queryObj.populate) {
      //   let relations = queryObj.populate.split(",");
      //   include = relations.map(relation => ({ model: require(`../models/${relation}`) }));
      // }
      // Execute Query with Sequelize
      let data = await model.findAll({
        where,
        offset,
        limit,
        order,
        attributes,
        include,
      });
  
      res.status(200).json({
        status: "success",
        count: data.length,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  // to get one single doc from mongodb 
  const getOne = async (req,res,next)=>{
    if (!model) return next(new app_error_feedback(500, `Model ${model} not found`))
    const { id } = req.params
    try {
      const data = await  model.findByPk(id)
      if (!data) return next(new app_error_feedback(400,`No data found by this Id ${id}`))
      res.status(200).json({ status: 'success', data})
    } catch (err) {
      next(err) 
    }
  }

  // to update many
  const update = async ( req,res,next )=>{
    if (!model) return next(new app_error_feedback(500, `Model ${model} not found`))
    // Any prop value can be sent with in the req body but only what's defined on the route_ref will be updated
    const { id } = req.params
    try {
      const data = await model.update(req.body, { where: { id }})
      if(data[0] === 0) return next(new app_error_feedback(400, `no data found with id: ${id}`) )
      res.status(200).json({ status: 'success',data })
    } catch (err) {
      next(err)
    }
  }

  //controller to delete manny
  const Delete = async(req,res,next)=>{
    if (!model) return next(new app_error_feedback(500, `Model ${model} not found`))
      const { id } = req.params
      try {
        await model.destroy({ where: { id }})
        res.status(204).json({ status: 'success'})
      } catch (err) {next(err)}
  }

  return {    // if we are using mongodb 
    create,
    getList,
    getOne,
    update,
    Delete,
  }
}
