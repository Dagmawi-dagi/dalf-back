// these below are server api routes

// NOTE 
// the options for d|t ways of upload are..
  // {
  //  uploadType: 'single' || 'array' || 'array_'
  //  fileType: 'text/html' || 'image' || 'application/pdf'....
  //  fieldName: 'coverImg' || { name: 'avatar', maxCount: 1 } ---? if uploadType === 'array_'
  //  maxCount: 10 // only if uploadType === 'array'
  // },
  // use this example below to define the routes
    // {
    //   route_for : 'event',
    //   base_url : '/event',
    //   controller_file: 'event', 
    //   api: [
    //     { 
    //       url: '/:id', 
    //       req_method: 'get', 
    //       auth: false,
    //       restrict_to: ['aaa'],
    //       upload: { uploadType: 'single', fileType: 'image', fieldName: 'coverImg'},
    //       image_upload : true,
    //       save_file_to: 'event',
    //       filter_reqBody_with:['field',"field"], // must be for every put and patch req
    //       req_body_validation:{bool:true,schemaName:'blog'}, // if you want to validate the req.body based on the model schema
    //       controller:{
    //          crud_method: 'create',
    //          model: 'emergency_contact',
    //          common: true,
    //          add_createdBy:true // to add createdBy field to req.body that will be used to create the document in db
    //        },
    //     },
    //   ],
    // }

// after setting up sheama correctly do your front End 
// and add what the api routes you need for your Front End logics here 
// use the routes_ref to create postman Api routes testing  // make this automatic DONOT spent time creating  postman Api routes for every route_refs that is just stupid

exports.routes_ref = [
  {
    route_for : 'test',
    base_url : '/test',
    controller_file: 'test', 
    api: [
      { 
        url: '/', 
        req_method: 'post',
        auth: false,
        restrict_to:[],
        upload: {},
        image_upload:false,
        save_file_to: '',
        req_body_validation:{bool:true,schemaName:'test'},
        filter_reqBody_with:[],
        controller:{
          model: 'user',
          crud_method: 'create',
          common: true,
          add_createdBy: false,
        },
      },
      { 
        url: '/', 
        req_method: 'get',
        auth: false,
        restrict_to:[],
        upload: {},
        image_upload:false,
        save_file_to: '',
        req_body_validation:false,
        filter_reqBody_with:[],
        controller:{
          model: 'user',
          crud_method: 'getList',
          common: true,
          add_createdBy: false,
        },
      },
      { 
        url: '/:id', 
        req_method: 'get',
        auth: false,
        restrict_to:[],
        upload: {},
        image_upload:false,
        save_file_to: '',
        req_body_validation:false,
        filter_reqBody_with:[],
        controller:{
          model: 'test',
          crud_method: 'getOne',
          common: true,
          add_createdBy: false,
        },
      },
      { 
        url: '/:id', 
        req_method: 'patch',
        auth: false,
        restrict_to:[],
        upload: {},
        image_upload:false,
        save_file_to: '',
        req_body_validation:false,
        filter_reqBody_with:[],
        controller:{
          model: 'test',
          crud_method: 'update',
          common: true,
          add_createdBy: false,
        },
      },
      { 
        url: '/:id', 
        req_method: 'delete',
        auth: false,
        restrict_to:[],
        upload: {},
        image_upload:false,
        save_file_to: '',
        req_body_validation:false,
        filter_reqBody_with:[],
        controller:{
          model: 'test',
          crud_method: 'Delete',
          common: true,
          add_createdBy: false,
        },
      },
    ],
  },
  // complete user routes for any project
  {
    route_for : 'user',
    base_url : '/user',
    controller_file: 'user', 
    api: [
      { 
        url: '/users', 
        req_method: 'get',
        auth: true,
        restrict_to:[],
        upload: {},
        image_upload:false,
        save_file_to: '',
        req_body_validation:false,
        filter_reqBody_with:[],
        controller:{
          model: 'user',
          crud_method: 'getList',
          common: true
        },
      },
      { 
        url: '/sign_up', 
        req_method: 'post',
        auth: false,
        restrict_to:[],
        upload: {},
        image_upload:false,
        save_file_to: '',
        req_body_validation:{bool: true,schemaName: "user" },
        filter_reqBody_with:[],
        controller:{
          model: 'user',
          crud_method: 'sign_up',
          common: false
        },
      },
      { 
        url: '/create',  // for some reason if we want to create user with out giveing them login token Eg: if admin wants to create user
        req_method: 'post',
        auth: true,
        restrict_to:[],
        upload: {},
        image_upload:false,
        save_file_to: '',
        req_body_validation:true,
        filter_reqBody_with:[],
        controller:{
          model: 'user',
          crud_method: 'create',
          common: true
        },
      },
      { 
        url: '/sign_in', 
        req_method: 'post',
        auth: false,
        restrict_to:[],
        upload: {},
        image_upload:false,
        save_file_to: '',
        req_body_validation:false,
        filter_reqBody_with:['phoneNumber','userPassword'],
        controller:{
          crud_method: 'sign_in',
          common: false
        },
      },
      { 
        url: '/get_me', 
        req_method: 'get',
        auth: true,
        restrict_to:[],
        upload: {},
        image_upload:false,
        save_file_to: '',
        req_body_validation:false,
        filter_reqBody_with:[],
        controller:{
          crud_method: 'get_me',
          common: false
        },
      },
      { 
        url: '/get_user/:id', 
        req_method: 'get',
        auth: false,
        restrict_to:[],
        upload: {},
        image_upload:false,
        save_file_to: '',
        req_body_validation:false,
        filter_reqBody_with:[],
        controller:{
          crud_method: 'get_user',
          common: false
        },
      },
      { 
        url: '/update_password', 
        req_method: 'patch',
        auth: true,
        restrict_to:[],
        upload: {},
        image_upload:false,
        save_file_to: '',
        req_body_validation:false,
        filter_reqBody_with:['currentPassword','newPassword'],
        auth: true,
        controller:{
          crud_method: 'update_password',
          common: false
        },
      },
      // if we want to check password before updating PhoneNumber
      { 
        url: '/update_phoneNumber', 
        req_method: 'patch',
        auth: true,
        restrict_to:[],
        upload: {},
        image_upload:false,
        save_file_to: '',
        req_body_validation:false,
        filter_reqBody_with:['currentPassword','newPhoneNumber'],
        controller:{
          crud_method: 'update_phoneNumber',
          common: false
        },
      },
      // if we want to check password before updating email
      { 
        url: '/update_email', 
        req_method: 'patch',
        auth: true,
        restrict_to:[],
        upload: {},
        image_upload:false,
        save_file_to: '',
        req_body_validation:false,
        filter_reqBody_with:['currentPassword','email'],
        auth: true,
        controller:{
          crud_method: 'update_email',
          common: false
        },
      },
      { 
        url: '/update_me', 
        req_method: 'patch',
        auth: true,
        restrict_to:[],
        upload: { uploadType: 'single', fileType: 'image', fieldName: 'avatar'},
        image_upload:true,
        save_file_to: 'users',
        req_body_validation:false,
        filter_reqBody_with:[],
        controller:{
          crud_method: 'update_me',
          common: false
        },
      },
      { 
        url: '/forgot_password', 
        req_method: 'post',
        auth: true,
        restrict_to:[],
        upload: {},
        image_upload:false,
        save_file_to: '',
        req_body_validation:false,
        filter_reqBody_with:['email'],
        controller:{
          crud_method: 'forgot_password',
          common: false
        },
      },
      { 
        url: '/reset_password/:resetToken', 
        req_method: 'post',
        auth: false,
        restrict_to:[],
        upload: {},
        image_upload:false,
        save_file_to: '',
        req_body_validation:false,
        filter_reqBody_with:['newPassword'],
        controller:{
          crud_method: 'reset_password',
          common: false
        },
      },
      { 
        url: '/delete_me', 
        req_method: 'delete',
        auth: true,
        restrict_to:[],
        upload: {},
        image_upload:false,
        save_file_to: '',
        req_body_validation:false,
        filter_reqBody_with:[],
        controller:{
          crud_method: 'delete_me',
          common: false
        },
      },
    ],
  },
  // // ------------------------ Blog ----------------------------------------//
  // {
  //   route_for : 'blog',
  //   base_url : '/blog',
  //   controller_file: 'blog', 
  //   api: [
  //     // create blog post
  //     { 
  //       url: '/', 
  //       req_method: 'post',
  //       auth: true,
  //       restrict_to:[],
  //       upload: { uploadType: 'single', fileType: 'image', fieldName: 'coverImg'},
  //       image_upload:true,
  //       save_file_to: 'blog',
  //       req_body_validation:{bool:true,schemaName:'blog'},
  //       filter_reqBody_with:[],
  //       controller:{
  //         model: 'blog',
  //         crud_method: 'create',
  //         common: true,
  //         add_createdBy: true,
  //       },
  //     },
  //     // getlist 
  //     { 
  //       url: '/', 
  //       req_method: 'get',
  //       auth: false,
  //       restrict_to:[],
  //       upload: {},
  //       image_upload:false,
  //       save_file_to: '',
  //       req_body_validation:false,
  //       filter_reqBody_with:[],
  //       controller:{
  //         model: 'blog',
  //         crud_method: 'getList',
  //         common: true,
  //         add_createdBy: false,
  //       },
  //     },
  //     // getOne
  //     { 
  //       url: '/:id', 
  //       req_method: 'get',
  //       auth: true,
  //       restrict_to:[],
  //       upload: {},
  //       image_upload:false,
  //       save_file_to: '',
  //       req_body_validation:false,
  //       filter_reqBody_with:[],
  //       controller:{
  //         model: 'blog',
  //         crud_method: 'getOne',
  //         common: true,
  //         add_createdBy: false,
  //       },
  //     },
  //     // to update any of the value for the blog doc
  //     { 
  //       url: '/:id', 
  //       req_method: 'patch',
  //       auth: true,
  //       restrict_to:[],
  //       upload: {},
  //       image_upload:false,
  //       save_file_to: '',
  //       req_body_validation:false,
  //       filter_reqBody_with:[],
  //       controller:{
  //         model: 'blog',
  //         crud_method: 'update',
  //         common: true,
  //         add_createdBy: false,
  //       },
  //     },

  //     // delete blog post
  //     { 
  //       url: '/:id', 
  //       req_method: 'delete',
  //       auth: true,
  //       restrict_to:[],
  //       upload: {},
  //       image_upload:false,
  //       save_file_to: '',
  //       req_body_validation:false,
  //       filter_reqBody_with:[],
  //       controller:{
  //         model: 'blog',
  //         crud_method: 'Delete',
  //         common: true,
  //         add_createdBy: false,
  //       },
  //     },
  //     // delete blog comment
  //     { 
  //       url: '/comment/:id', 
  //       req_method: 'delete',
  //       auth: true,
  //       restrict_to:[],
  //       upload: {},
  //       image_upload:false,
  //       save_file_to: '',
  //       req_body_validation:false,
  //       filter_reqBody_with:[],
  //       controller:{
  //         model: 'blog_comment',
  //         crud_method: 'Delete',
  //         common: true,
  //         add_createdBy: false,
  //       },
  //     },
  //   ],
  // },
  // // ------------------------ vacancy -------------------------------------//
  // {
  //   route_for : 'vacancy',
  //   base_url : '/vacancy',
  //   controller_file: 'vacancy', 
  //   api: [
  //     { 
  //       url: '/', 
  //       req_method: 'get',
  //       auth: false,
  //       restrict_to:[],
  //       upload: {},
  //       image_upload:false,
  //       save_file_to: '',
  //       req_body_validation:false,
  //       filter_reqBody_with:[],
  //       controller:{
  //         model: 'vacancy',
  //         crud_method: 'getList',
  //         common: true,
  //         add_createdBy: false,
  //       },
  //     },
  //     { 
  //       url: '/:id', 
  //       req_method: 'get',
  //       auth: true,
  //       restrict_to:[],
  //       upload: {},
  //       image_upload:false,
  //       save_file_to: '',
  //       req_body_validation:false,
  //       filter_reqBody_with:[],
  //       controller:{
  //         model: 'vacancy',
  //         crud_method: 'getOne',
  //         common: true,
  //         add_createdBy: false,
  //       },
  //     },
  //     { 
  //       url: '/', 
  //       req_method: 'post',
  //       auth: true,
  //       restrict_to:[],
  //       upload: {},
  //       image_upload:false,
  //       save_file_to: '',
  //       req_body_validation:false,
  //       filter_reqBody_with:[],
  //       controller:{
  //         model: 'vacancy',
  //         crud_method: 'create',
  //         common: true,
  //         add_createdBy: true,
  //       },
  //     },
  //     { 
  //       url: '/apply', 
  //       req_method: 'post',
  //       auth: false,
  //       restrict_to:[],
  //       upload: { uploadType: 'array', fileType: 'application/pdf', fieldName: 'uploaded_files',maxCount: 10  },
  //       image_upload:false,
  //       save_file_to: 'vacancy_appilictions',
  //       req_body_validation:false,
  //       filter_reqBody_with:[],
  //       controller:{
  //         model: 'vacancy_application',
  //         crud_method: 'create',
  //         common: true,
  //       },
  //     },
  //     { 
  //       url: '/:id', 
  //       req_method: 'patch',
  //       auth: true,
  //       restrict_to:[],
  //       upload: {},
  //       image_upload:false,
  //       save_file_to: '',
  //       req_body_validation:false,
  //       filter_reqBody_with:[],
  //       controller:{
  //         model: 'vacancy',
  //         crud_method: 'update',
  //         common: true,
  //         add_createdBy: false,
  //       },
  //     },
  //     { 
  //       url: '/:id', 
  //       req_method: 'delete',
  //       auth: true,
  //       restrict_to:[],
  //       upload: {},
  //       image_upload:false,
  //       save_file_to: '',
  //       req_body_validation:false,
  //       filter_reqBody_with:[],
  //       controller:{
  //         model: 'vacancy',
  //         crud_method: 'Delete',
  //         common: true,
  //         add_createdBy: false,
  //       },
  //     },
  //   ],
  // },
  // // ------------------------ news letter ---------------------------------//
  // {
  //   route_for : 'newsletter',
  //   base_url : '/newsletter',
  //   controller_file: 'newsletter', 
  //   api: [
  //     // create newsletter
  //     { 
  //       url: '/', 
  //       req_method: 'post',
  //       auth: true,
  //       restrict_to:[],
  //       upload: {},
  //       image_upload:false,
  //       save_file_to: '',
  //       req_body_validation:false,
  //       filter_reqBody_with:[],
  //       controller:{
  //         model: 'newsletter',
  //         crud_method: 'create',
  //         common: true,
  //         add_createdBy: true,
  //       },
  //     },
  //     // create newsletter subscriber
  //     { 
  //       url: '/subscribe', 
  //       req_method: 'post',
  //       auth: false,
  //       restrict_to:[],
  //       upload: {},
  //       image_upload:false,
  //       save_file_to: '',
  //       req_body_validation:false,
  //       filter_reqBody_with:[],
  //       controller:{
  //         model: 'newsletter_sub',
  //         crud_method: 'create',
  //         common: true,
  //         add_createdBy: false,
  //       },
  //     },
  //     // confirm subscribtion
  //     { 
  //       url: '/confirmSub/:id', 
  //       req_method: 'patch',
  //       auth: false,
  //       restrict_to:[],
  //       upload: {},
  //       image_upload:false,
  //       save_file_to: '',
  //       req_body_validation:false,
  //       filter_reqBody_with:['confirmed'],
  //       controller:{
  //         model: 'newsletter_sub',
  //         crud_method: 'update',
  //         common: true,
  //         add_createdBy: false,
  //       },
  //     },
  //     // unsubscribe just confirm === false
  //     { 
  //       url: '/unSub/:id', 
  //       req_method: 'patch',
  //       auth: false,
  //       restrict_to:[],
  //       upload: {},
  //       image_upload:false,
  //       save_file_to: '',
  //       req_body_validation:false,
  //       filter_reqBody_with:['confirmed'],
  //       controller:{
  //         model: 'newsletter_sub',
  //         crud_method: 'update',
  //         common: true,
  //         add_createdBy: false,
  //       },
  //     },

  //     // get all newsletters
  //     { 
  //       url: '/', 
  //       req_method: 'get',
  //       auth: true,
  //       restrict_to:[],
  //       upload: {},
  //       image_upload:false,
  //       save_file_to: '',
  //       req_body_validation:false,
  //       filter_reqBody_with:[],
  //       controller:{
  //         model: 'newsletter',
  //         crud_method: 'getList',
  //         common: true,
  //         add_createdBy: false,
  //       },
  //     },
  //     // get all subscribers
  //     { 
  //       url: '/subscriber', 
  //       req_method: 'get',
  //       auth: false,
  //       restrict_to:[],
  //       upload: {},
  //       image_upload:false,
  //       save_file_to: '',
  //       req_body_validation:false,
  //       filter_reqBody_with:[],
  //       controller:{
  //         model: 'newsletter_sub',
  //         crud_method: 'getList',
  //         common: true,
  //         add_createdBy: false,
  //       },
  //     },
  //     // get one newsletter
  //     { 
  //       url: '/:id', 
  //       req_method: 'get',
  //       auth: true,
  //       restrict_to:[],
  //       upload: {},
  //       image_upload:false,
  //       save_file_to: '',
  //       req_body_validation:false,
  //       filter_reqBody_with:[],
  //       controller:{
  //         model: 'newsletter',
  //         crud_method: 'getOne',
  //         common: true,
  //         add_createdBy: false,
  //       },
  //     },
  //     // get one subscriber
  //     { 
  //       url: '/subscriber/:id', 
  //       req_method: 'get',
  //       auth: true,
  //       restrict_to:[],
  //       upload: {},
  //       image_upload:false,
  //       save_file_to: '',
  //       req_body_validation:false,
  //       filter_reqBody_with:[],
  //       controller:{
  //         model: 'newsletter_sub',
  //         crud_method: 'getOne',
  //         common: true,
  //         add_createdBy: false,
  //       },
  //     },
  //   ],
  // },
]