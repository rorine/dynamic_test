Interceptor.attach(ObjC.classes["srcs_app_BBGameCenter_BBGameCenter_Game_bbgamecenter_game_library.BBGameCenterGameBaseVC"]['- viewDidLoad'].implementation, {
  onEnter: function (args) {
    console.log('Entering - viewDidLoad!');
  },
  onLeave: function (retval) {
    console.log('Leaving - viewDidLoad');
  },
});