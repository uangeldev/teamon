var emplResource = require("../script/module/rest/empl");
var loginResource = require("../script/module/rest/login");

var restResourse = {
  empl : new emplResource(),
  login : new loginResource()
};
