Java.perform(function() {
    const mProxy = Java.use('com.example.lib.jsbridge.legacy.WebProxyV2');
    mProxy.jsonCallback.implementation = function(webview, params) {
        console.log("[*] jsonCallback: " + params);
        this.jsonCallback(webview, params);

        var callbackId = params[0];
        var jsonData = JSON.parse(params[1]);

        if (callbackId == "getUserInfo_callback") {
            console.log("[*] assert getUserInfo_callback: " + (jsonData["mid"] == 14135892))
        }
    }

    mProxy.evaluateJavascript.implementation = function(webview, method_name, params) {
        console.log("[*] evaluateJavascript: method: " + method_name + ", params: " + params);
        this.evaluateJavascript(webview, method_name, params);

        var callbackId = params[0];
        var jsonData = JSON.parse(params[1]);

        if (callbackId == "openScheme_callback") {
            console.log("[*] assert openScheme_callback: " + (jsonData["code"] == 0));
        } else if (callbackId == "loginWithGoBackUrl_callback") {
            console.log("[*] assert loginWithGoBackUrl_callback: " + (jsonData["code"] == 0));
        }
    }

    Java.use('com.example.lib.jsbridge.legacy.Routers').intentTo.implementation = function(context, uri) { return true;}
    setTimeout(function() {
        Java.choose('com.example.lib.jsbridge.legacy.JavaScriptBridgeCommV2', {
            onComplete: function() {
                console.log("---> search instance complete");
            },
            onMatch: function(instance) {
                if(instance.mProxy.value.getReliableContextWrapper() == null) return;

                instance.openScheme("{'url':'example://rank/rank', 'callbackId':'openScheme_callback'}");
                instance.loginWithGoBackUrl("{'url':'example://rank/rank', 'callbackId':'loginWithGoBackUrl_callback'}");
                instance.getUserInfo("{'url':'example://rank/rank', 'callbackId':'getUserInfo_callback'}");
            }
        });
    }, 3000);
})