const { BWAJSEventAuthorizationHandler, CLLocation } = ObjC.classes;

var hook_cllocation = ObjC.classes.CLLocation["- coordinate"]
Interceptor.attach(hook_cllocation.implementation, {
  onLeave: function(return_value) {
    var spoofed_return_value = (new ObjC.Object(return_value)).initWithLatitude_longitude_(20.5937, 78.9629)
    return_value.replace(spoofed_return_value)
  }
});

var jsbHook = BWAJSEventAuthorizationHandler["- handleWithEvent:params:callback:"]
Interceptor.attach(jsbHook.implementation, {
  onEnter: function() {
    console.log("BWAJSEventAuthorizationHandler hooked")
  }
});