const { BFCHistoryAVModel } = ObjC.classes;

// 获取函数内存地址
const oldImpl = BFCHistoryAVModel["- getDataGotoType"].implementation
// 函数替换
BFCHistoryAVModel["- getDataGotoType"].implementation = ObjC.implement(BFCHistoryAVModel["- getDataGotoType"], (handle, selector) => {
  console.log("BFCHistoryAVModel.getDataGotoType hooked")
  // 返回值替换
  return ObjC.classes.NSString.stringWithString_("hello, world");
});

// 初始化对象
const model = BFCHistoryAVModel.alloc().init();
// 调用对象为 hook 函数
console.log(model.getDataGotoType());
// 解除 hook
BFCHistoryAVModel["- getDataGotoType"].implementation = oldImpl;
// 调用原函数
console.log(model.getDataGotoType());
