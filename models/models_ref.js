//  db collections model reference
exports.models_ref = {
  // test
  test: require('./test'),
  // user
  user: require('./user'),
  // pateint
  emergency_contact: require('./employee/emergency_contact'),
  // pateint Docs
  external_medical_doc: require('./employee/external_medical_doc'),
  //service
  service_department: require('./service/service_department'),
  service: require('./service/service'),
  // employee
  employee: require('./employee/employee'),
  employee_archive: require('./employee/employee_archive'),
  contract: require('./employee/contract'),
  disciplinary_record: require('./employee/disciplinary_record'),
  rest_leave: require('./employee/rest_leave'),
  attendance: require('./employee/attendance'),
  payed_share: require('./employee/payed_share'),
  // config
  // for reference
  // store
  store_item: require('./store/store_item'),
  store_request: require('./store/store_request'),
  // HR
  vacancy: require('./HR/vacancy'),
  vacancy_application: require('./HR/vacancy_application'),
  // others
  department: require('./department'),
  // company website
  blog: require('./compnay_website/blog'),
  blog_comment: require('./compnay_website/blog_comment'),
  newsletter: require('./compnay_website/news_letter'),
  newsletter_sub: require('./compnay_website/newsletter_subs'),
}