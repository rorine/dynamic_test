const { BBPlayerKitSimpleApiManager, NSString, BOOL } = ObjC.classes
const pendingBlocks = new Set();

// 结果参数
var result_flag = 1;

//登录态点赞接口hook
var hook_like_api = ObjC.classes.BBPlayerKitSimpleApiManager["+ mossLikeSpecialAvid:isLiked:from:spmid:fromSpmid:trackId:cardGoto:completionBlock:"]
Interceptor.attach(hook_like_api.implementation, {
    onEnter: function(args) {

        //args[0]:self
        //args[1]:The selector
        //args[2]:方法的第一个参数开始
        var receiver = new ObjC.Object(args[0]);
		var sel = ObjC.selectorAsString(args[1]);

        var avid = args[2].toInt32()
        var isLiked = args[3].toInt32()
        var from = NSString.stringWithString_(ObjC.Object(args[4]))
        var spmid = NSString.stringWithString_(ObjC.Object(args[5]))
        var fromSpmid = NSString.stringWithString_(ObjC.Object(args[6]))
        var trackId = NSString.stringWithString_(ObjC.Object(args[7]))
        var cardGoto = NSString.stringWithString_(ObjC.Object(args[8]))

        const block = new ObjC.Block(args[9]);
        pendingBlocks.add(block);
        const appCallback = block.implementation;
        block.implementation = (success, error, toast) => {
            appCallback(success, error, toast);
            pendingBlocks.delete(block);
        };
  }
});

//未登录态点赞接口hook
var hook_unlogin_like_api = ObjC.classes.BBPlayerKitSimpleApiManager["+ unloginLikeWithAvid:isLiked:isTriple:from:spmid:fromSpmid:completionBlock:"];

Interceptor.attach(hook_unlogin_like_api.implementation, {
    onEnter: function(args) {
        //args[0]:self
        //args[1]:The selector
        //args[2]:方法的第一个参数开始
        var receiver = new ObjC.Object(args[0]);
		var sel = ObjC.selectorAsString(args[1]);

        var avid = args[2].toInt32()
        var isLiked = args[3].toInt32()
        var isTriple = args[4].toInt32()
        var from = NSString.stringWithString_(ObjC.Object(args[5]))
        var spmid = NSString.stringWithString_(ObjC.Object(args[6]))
        var fromSpmid = NSString.stringWithString_(ObjC.Object(args[7]))

        const block = new ObjC.Block(args[8]);
        pendingBlocks.add(block);
        const appCallback = block.implementation;
        block.implementation = (success, error, toast, needLogin) => {
            appCallback(success, error, toast, needLogin);
            pendingBlocks.delete(block);
        };
  }
});

//构造登录态点赞方法block参数
var block = new ObjC.Block({
    retType: 'void',
    argTypes: ['int','object','object'],
    implementation: function (success, error, toast) {
        send("登录态点赞 主动调用 isSuccess: " + success) //true
        send("登录态点赞 主动调用 error：" + error)
        send("登录态点赞 主动调用 toast：" + toast)

        //如果点赞成功 且 目前flag非成功态 ，修改flag
        if(!success) {
            result_flag = 0
        }
    }
});

//构造未登录态点赞方法block参数
var block_unlogin = new ObjC.Block({
    retType: 'void',
    argTypes: ['int','object','object','object'],
    implementation: function (success, error, toast, needLogin) {
        send("未登录态点赞 主动调用 isSuccess: " + success) //true
        send("未登录态点赞 主动调用 error：" + error)
        send("未登录态点赞 主动调用 toast：" + toast)
        send("未登录态点赞 主动调用 needLogin: " + needLogin)
    }
});

var spmid = NSString.stringWithString_("main.ugc-video-detail.0.0")
var fromSpmid = NSString.stringWithString_("creation.hot-tab.0.0")

//暂停使用未登录态点赞接口
// BBPlayerKitSimpleApiManager.unloginLikeWithAvid_isLiked_isTriple_from_spmid_fromSpmid_completionBlock_(220208978, 0, 0, "10", spmid, fromSpmid, block_unlogin);

//模拟多次请求登录态点赞接口，av219500823 为 2323 账号测试稿件
for (var i = 0 ; i < 10 ; i++) { 
    BBPlayerKitSimpleApiManager.likeSpecialAvid_isLiked_from_spmid_fromSpmid_completionBlock_(219500823, 0, "10", spmid, fromSpmid, block);
}

//输出结果
function print_res() {
    send("result: " + result_flag)
    console.log("result: " + result_flag)
}

// 等待接口回调完成，延迟输出结果
setTimeout(print_res,2000)
