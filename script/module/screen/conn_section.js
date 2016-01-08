'use strict';

var Cache = require('../cache');

var connSection = (function() {
  var myPref;
  var chatModule;
  var chatSection;

  // cache DOM
  var $connSec;
  var $userListContext;
  var userTemplate;

  var userCache = new Cache();

  function _initialize(pref, chatMo, chatSec) {
    myPref = pref;
    chatModule = chatMo;
    chatSection = chatSec;

    $connSec = $(".connection_section");
    $userListContext = $connSec.find('.users_area .list');
    userTemplate = $userListContext.find('#user-template').html();

    $userListContext.delegate("li", "click", function() {
      $userListContext.find("li.active").removeClass("active");
      var $targetList = $(this);
      $targetList.addClass("active");

      chatSection.changeChatView($targetList.data("emplid"), $targetList.data("loginid"));
    });
  }

  function initConnSection(pref, chatMo, chatSec) {
    _initialize(pref, chatMo, chatSec);
    _initEmployees();
  }

  function _initEmployees() {
    var coId = myPref.login.coId;
    console.log("call _initEmployees[coId:%s]", coId);

    var params = {
      "coId": coId
    };
    restResourse.empl.getListByCoid(params, function(data) {
      if (data.rows) {
        $.each(data.rows, function(idx, row) {
          userCache.set(row.emplId, row); // add each employee into userCache.
          if (row.emplId === myPref.login.emplId)
            return;

          // img file (TODO 이후 사용자 이미지를 서버에 저장할 경우 photoLoc 정보를 이용하여 서버에서 가져와 로컬에 저장)
          var imgIdx = row.emplId % 10;
          var imgFile = "file://" + path.join(__dirname, '../../../img/profile_img' + imgIdx + '.jpg');
          var userData = {
            "user": [{
              "emplId": row.emplId,
              "loginId": row.loginId,
              "img": imgFile,
              "imgAlt": row.name
            }]
          };
          $userListContext.append(Mustache.render(userTemplate, userData));
        });

        chatModule.initClient([], userCache.getKeyArray());
      }
    });
  }

  function getCurrentTargetUser() {
    var $activeTarget = $userListContext.find('.active');
    if ($activeTarget.length !== 0) {
      return $activeTarget.data("emplid");
    }
    return undefined;
  }

  function setCurrentTargetUser(peerid, force) {
    force = force || false;

    var findTarget = true;
    if (!force) {
      var $activeTarget = $userListContext.find('.active');
      if ($activeTarget.length !== 0) {
        findTarget = false;
      }
    }

    var $targetPeer;
    if (findTarget) {
      $targetPeer = $userListContext.find('[data-emplid="' + peerid + '"]');
    }

    console.log("peerid:%s, force:%s, $targetPeer:%o", peerid, force, $targetPeer);

    if ($targetPeer !== undefined)
      $targetPeer.trigger("click");
  }

  function getUserObj(emplId) {
    return userCache.get(emplId);
  }

  return {
    initConnSection: initConnSection,
    getCurrentTargetUser: getCurrentTargetUser,
    setCurrentTargetUser: setCurrentTargetUser,
    getUserObj: getUserObj
  };
})();

module.exports = connSection;
