const app_error_feedback = require('../err_handling/app_error_feedback');     
const api_query_params = require('api-query-params');
const Fuse = require("fuse.js");
const departments = require('../models/test2')
const qs = require("qs");
const { Op, } = require('sequelize');
const { sequelize } = require('../db conection/db');

exports.common_controller =  (model)=>{
  //----------------------------------IF mysql---------------------------------------//

  // if the db if my sql
  const create_sequelize = async(req,res,next)=>{
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

  const getList_sequelize = async (req,res,next)=>{
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
  const getOne_sequelize = async (req,res,next)=>{
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
  const update_sequelize = async ( req,res,next )=>{
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
  const Delete_sequelize = async(req,res,next)=>{
    if (!model) return next(new app_error_feedback(500, `Model ${model} not found`))
      const { id } = req.params
      try {
        await model.update(req.body, { where: { id }})
        res.status(204).json({ status: 'success'})
      } catch (err) {next(err)}
  }

  //----------------------------------IF mongodd---------------------------------------//


  // controller to create a mogodb doc
  const create = async(req,res,next)=>{
    if (!model) next(new app_error_feedback(500, `Model ${model} not found`))
    try {
      const createObj = {...req.body} 
      // if the route_ref has add_createdBy then get the user from the req.user and {createdBy: req.user._id} will be added to the req.body
      if(req.route_ref.controller.add_createdBy) createObj.createdBy = req.user._id
      const data = await model.create([createObj],{validateBeforeSave:true})
      res.status(200).json({ 
        status: 'success',
        data
      })
    } catch (err) {
      next(err) // globalerrhandler will  handle this err
    }
  }

  // controller to getList of mongodb documents
  // we can use this to get list OR single Doc if we need to populate or projection on the fly
  // but it is REcomended for faster queary result to use the getOne if we are only getting the doc Using Only the doc "Id" and do the populate or projection using schema middleware
  const getList = async (req,res,next)=>{
    if (!model) next(new app_error_feedback(500, `Model ${model} not found`))
    try {
      // what must be passed for this controllers is according to the api_query_params way of doing things
      // meaning the req.query must be long string (api_query_params way) not Key/value pairs
      // OR use decodeURIComponent to decode like %20 cus thier will be if passing > < + ^ signs
      // which we will pass > < for advanced queries other 
      // refer the api_query_params lib for more info on what to pass https://www.npmjs.com/package/api-query-params?activeTab=readme#usage
      const decodedURI = decodeURIComponent(req.url);
      // we need to split the query if there is any
      let queryStr;
      if(Object.keys(req.query).length != 0 ){
        queryStr = decodedURI.split('?')[1]
        // handle {key: >value} || {key: <value} || {key: >=value} || {key: <=value} query params
        queryStr = queryStr.replace(/=([><])/g, '$1');
      }

      console.log(`queryStr on getList request ${queryStr ?? 'no queryStr found' }`)

      let { filter, skip, limit, sort, projection, population } = api_query_params(queryStr, {
        limitKey: 'perPage',
        skipKey: 'page',
      });

      // since we are passing the number of page for pagination calculate how much doc to skip
      skip = skip < 1 || !skip ?  0 : (skip - 1) * limit
      // Text Search: Check if a `search` parameter is provided
      if (req.query.search) {
        filter = { $text: { $search: req.query.search } }; //Before using $search, ensure the fields you want to search have a text index:
      }

      let data = await model.find(filter)
      .skip(skip) 
      .limit(limit)
      .sort(sort)
      .select(projection)
      .populate(population) // if you want you can populate virtual OR local fields

      //  if we ant to Do text search for all of the Docs Not ideal for large Data set   
      // if(req.query.search){
      //   if (!data.length) return console.log("No data found.");
      //   const stringFields = Object.keys(data[0]).filter(key => typeof data[0][key] === "string" ); // Identify only string fields dynamically
      //   console.log(stringFields);
      //   const fuse = new Fuse(data,{ threshold: 0.3, keys: stringFields});
      //   const fuse_data = fuse.search(req.query.search).map(result => result.item)
      //   data = fuse_data
      // }  

      res.status(200).json({
        status: 'success',
        count: data.length,
        data,
      })
    } catch (err) {
      next(err) 
    }
  }

  // to get one single doc from mongodb 
  const getOne = async (req,res,next)=>{
    if (!model) next(new app_error_feedback(500, `Model ${model} not found`))
    const { id } = req.params
    try {
      const data = await   model.findById(id)
      if (!data) return next(new app_error_feedback(400,`No data found by this Id ${id}`))
      res.status(200).json({ status: 'success', data})
    } catch (err) {
      next(err) 
    }
  }

  // to updateOne
  const update = async ( req,res,next )=>{
    if (!model) next(new app_error_feedback(500, `Model ${model} not found`))
    // Any prop value can be sent with in the req body but only what's defined on the route_ref will be updated
    const { id } = req.params
    try {
      const data = await   model.findByIdAndUpdate({_id: id },req.body,{new:true})
      if(!data) return next(new app_error_feedback(400, `no data found with id: ${id}`) )
      res.status(200).json({ status: 'success',data })
    } catch (err) {
      next(err)
    }
  }

  // here add controllre to update lots of docs at ones
  const updateMany = ()=>{
  }

  //controller to delete a doc
  const Delete = async(req,res,next)=>{
    if (!model) next(new app_error_feedback(500, `Model ${model} not found`))
    const { id } = req.params
    try {
      await  model.findOneAndDelete({ _id : id })
      res.status(204).json({ status: 'success'})
    } catch (err) {next(err)}
  }


  // here add controller to delete many doc at once
  const deleteMany = ()=>{
  }


  return{
    // if we are using mysql 
    create_sequelize,
    create_sequelize,
    getList_sequelize,
    getOne_sequelize,
    update_sequelize,
    Delete_sequelize,

    // if we are using mongodb 
    create,
    getList,
    getOne,
    update,
    Delete,
  }
}
