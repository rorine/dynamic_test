const { BFCPaymentManager, NSDictionary } = ObjC.classes;

const manager = BFCPaymentManager.shareInstance();
const payMethod = "- payOrder:result:";

var BFCPaymentManagerHook = BFCPaymentManager[payMethod]
const payParamDict = NSDictionary.dictionaryWithObject_forKey_("displayAccount", "test2323888")
var resultBlock = new ObjC.Block({
    retType: 'void',
    argTypes: ['object'],
    implementation: function (response) {
        console.log(response.showMsg())
    }
})

manager[payMethod](payParamDict, resultBlock)
/*
 * args[0]：self
 * args[1]：The selector (openURL:)
 * args[2]：The first param
 */
Interceptor.attach(BFCPaymentManagerHook.implementation, {
  onEnter: function(args) {
    var dictionary = NSDictionary.dictionaryWithDictionary_(args[2]);
    console.log("param:" + dictionary);
  }
});