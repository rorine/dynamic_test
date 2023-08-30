Java.perform(function() {       
    // 获取 Kotlin class 引用
    var RiskControlH5ConfBean = Java.use('com.mall.ui.page.common.logic.bean.RiskControlH5ConfBean')
    // Hook Kotlin 函数
    RiskControlH5ConfBean.describeContents.implementation = function() {
        console.log("[*] RiskControlH5ConfBean.kt describeContents hook");
        return this.describeContents();
    }
    // 调用 Kotlin 函数
    console.log(RiskControlH5ConfBean.$new().describeContents())
});