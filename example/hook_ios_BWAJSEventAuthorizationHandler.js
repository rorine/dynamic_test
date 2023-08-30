const { BWAJSEventAuthorizationHandler, BFCAbilityJSBridge, NSDictionary, NSString } = ObjC.classes;

const jsbMethod = "- handleWithEvent:params:callback:"
const mParam = NSDictionary.dictionaryWithObject_forKey_("hook", "hook")
var handler = new ObjC.Block({
    retType: 'void',
    argTypes: ['int','object','object'],
    implementation: function (code, data, message) {
        console.log(code)
        console.log(data)
        console.log(message)
    }
})

const jsbHandler = BWAJSEventAuthorizationHandler.alloc().init()
jsbHandler[jsbMethod](NSString.stringWithString_("getLocation"), mParam, handler)
jsbHandler[jsbMethod](NSString.stringWithString_("getUserInfo"), mParam, handler)
jsbHandler[jsbMethod](NSString.stringWithString_("chooseAddress"), mParam, handler)
