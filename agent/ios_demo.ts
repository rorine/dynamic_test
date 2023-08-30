/**
 * 启动过程中回调
 * @param fn 启动过程中回调，具体回调阶段看 hook 注入的时机
 */
 export function example_on_launch_pre(fn:Function) {
    if (ObjC.available) {
        fn();
    }
}

/**
 * 启动完成回调：Android端 MainActivity2 onResume 完成
 * @param fn 启动完成回调
 */
export async function example_on_launch_complete(fn:Function) {
    if (ObjC.available) {
        fn();
    }
}

/**
 * 对象转化成可读字符串并打印
 * @param obj 打印对象
 */
export function example_print(obj: Object) {
    if (ObjC.available) {
        
    }
}

/**
 * 执行测试 case
 * @param testFunc 注册测试函数 
 */
export function example_test(testFunc: Function) {
    try {
        testFunc();
    } catch (e) {
        console.log(e);
    }
}

/**
 * 通过 router 协议跳转到对应页面
 * @param url 基于 router 跳转页面：example://video/774648941
 */
export async function example_route(url: string) {
    if (ObjC.available) {
        
    }
}

/**
 * 查询内存中实例并回调，若应用没有创建对应实例，则没有回调；需要关注实例创建的时机
 * @param className class 名称，例如："com.example.test.HiltApplication"
 * @param match 找到内存对象并回调
 */
export async function example_search_instance(className: string, match:Function) {
    if (ObjC.available) {
        
    }
}

/**
 * 基于文本点击元素
 * @param text 查找文本
 * @param index 文本出现的 index
 * @param timeout 等待文本出现的超时时间
 */
export async function example_click_on_text(text: string, index = 0, timeout = 3000) {
    if (ObjC.available) {
        
    }
}

export function sleep(ms: number) {                                                                                                                                                                                       
    return new Promise((resolve) => setTimeout(resolve, ms));                                                                                                                                                
}
