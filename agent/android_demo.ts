var IS_DEBUG: boolean = true
var mWindowManager: any;
var mApplication: any;
var mWindowManagerGlobal: any;
var mInstrumentation: any;
var mMainActivityV2: any;
var mForegroundActivity: any;
var mTopActivityName: any;

const View_Name = "android.view.View"
const String_Name = "java.lang.String"

const View = Java.use(View_Name);
const System = Java.use("java.lang.System");
const Thread = Java.use("java.lang.Thread");
const Runtime = Java.use("java.lang.Runtime");
const VMStack = Java.use("dalvik.system.VMStack");
const ViewGroup = Java.use("android.view.ViewGroup")
const TextView = Java.use("android.widget.TextView")
const WindowManager = Java.use("android.view.WindowManager");
const Context = Java.use("android.content.Context");
const Build$VERSION = Java.use("android.os.Build$VERSION");
const WindowManagerGlobal = Java.use( "android.view.WindowManagerGlobal");
const ArrayList = Java.use('java.util.ArrayList');
const CharSequence = Java.use('java.lang.CharSequence')
const String = Java.use('java.lang.String')
const Instrumentation = Java.use('android.app.Instrumentation');
const SystemClock = Java.use('android.os.SystemClock');
const MotionEvent = Java.use('android.view.MotionEvent');
const Activity = Java.use('android.app.Activity');
const ActivityLifecycleCallbacks = Java.use('android.app.Application$ActivityLifecycleCallbacks');

/**
 * 启动过程中回调
 * @param fn 启动过程中回调，具体回调阶段看 hook 注入的时机
 */
export function example_on_launch_pre(fn:Function) {
    if (Java.available) {
        Java.performNow(() => {
            initPinkEnv();
            fn();
        });
    }
}

/**
 * 启动完成回调：Android端 MainActivity2 onResume 完成
 * @param fn 启动完成回调
 */
export async function example_on_launch_complete(fn:Function) {
    if (Java.available) {
        Java.perform(() => {
            initHiltApplication();
            initWindowManager();
            initInstrumentation();
            initMainActivity(fn);
        })
    }
}

/**
 * 对象转化成可读字符串并打印
 * @param obj 打印对象
 */
export function example_print(obj: Object) {
    if (Java.available && IS_DEBUG) {
        if (typeof obj === 'string') {
            console.log(obj)
        } else {
            try {
                console.log(Java.use('com.alibaba.fastjson.JSON').toJSONString(obj));
            } catch(ex) {
                console.log(obj)
            }
        }
    }
}

/**
 * 执行测试 case
 * @param testFunc 注册测试函数 
 */
export function example_test(testFunc: Function) {
    try {
        if (Java.available) {
            Java.perform(() => testFunc());
        } else {
            testFunc();
        }
    } catch (e) {
        console.log(e);
    }
}

/**
 * 通过 router 协议跳转到对应页面
 * @param url 基于 router 跳转页面
 */
export async function example_route(url: string) {
    if (Java.available) {
        example_print("[*] example_route:  " + url)
        const RouteRequest$Builder = Java.use('com.example.lib.blrouter.RouteRequest$Builder');
        var request = RouteRequest$Builder.$new(url).build()
        Java.use('com.example.lib.blrouter.BLRouter').routeTo(request, mApplication);
    }
}

/**
 * 查询内存中实例并回调，若应用没有创建对应实例，则没有回调；需要关注实例创建的时机
 * @param className class 名称，例如："com.example.test.HiltApplication"
 * @param match 找到内存对象并回调
 */
export async function example_search_instance(className: string, match:Function) {
    // example_print("[*] ---> example_search_instance: " + className)
    if (Java.available) {
        Java.choose(className, {
            onComplete: function() {
                // example_print("[*] ---> example_search_instance complete: " + className)
            },
            onMatch: function(instance) {
                // example_print("[*] ---> example_search_instance found: " + instance.toString())
                match(instance);
            }
        })
    }
}

/**
 * 基于文本点击元素
 * @param text 查找文本
 * @param index 文本出现的 index
 * @param timeout 等待文本出现的超时时间
 */
export async function example_click_on_text(text: string, index = 0, timeout = 3000) {
    if (Java.available) {
        let allViews : Array<any> = [];
        let collectedViews : Array<any> = [];
        let startTime = Date.now();

        while ((Date.now() - startTime) < timeout) {
            let views = getWindowDecorViews();
            for (var i = 0; i < views.size(); i++) {
                getAllViews(views.get(i), allViews);
            }

            collectedViews = allViews.filter((v : any) => { 
                if(!TextView.class.isInstance(v)) {
                    return false;
                }
                return Java.cast(v, TextView).getText().toString().includes(text);
            });
            
            if (collectedViews.length > 0) {
                break;
            }
            
            await sleep(1000)
        }

        if (index < collectedViews.length) {
            var view = collectedViews[index];
            click_view(view, 1000);
        }
    }
}

/**
 * 获取栈顶 Activity
 * @returns 返回 Java 对象
 */
export function example_get_top_activity() {
    if (Java.available) {
        //console.log("[*] Get foreground activity: " + mForegroundActivity.getClass());
        return mForegroundActivity;
    }
}

export async function example_wait_for_activity(activityName : string) {
    let retry = 0;
    while (!mForegroundActivity && retry < 5) {
        console.log("[*] Wait for foreground activity instance...");
        await sleep(500);
        retry++;
    }
    console.log(mForegroundActivity);

    retry = 0;
    while (mForegroundActivity.getClass() != activityName && retry < 5) {
        console.log("[*] Check foreground activity: " + mForegroundActivity.getClass() + " = " + activityName);
        await sleep(500);
        retry++;
    }
}

function click_view(view : any, time: number) {
    if (view == undefined) return;

    let xyToClick: Promise<number[]> = getClickCoordinates(view);
    xyToClick.then((nums) => {
        var x = nums[0];
		var y = nums[1];
        click_on_screen(x, y, view);
    })
}

function click_on_screen(x: number, y: number, view: any) {
    var successfull: boolean = false;
    var retry: number = 0;

    while(!successfull && retry < 20) {
        var downTime = SystemClock.uptimeMillis();
        var eventTime = SystemClock.uptimeMillis();
        var event = MotionEvent.obtain(downTime, eventTime, MotionEvent.ACTION_DOWN.value, x, y, 0);
        var event2 = MotionEvent.obtain(downTime, eventTime, MotionEvent.ACTION_UP.value, x, y, 0);
        try {
            mInstrumentation.sendPointerSync(event);
            mInstrumentation.sendPointerSync(event2);
            successfull = true;
        } catch(e) {
            console.log(e)
            retry++;
        }
    }
}

async function getClickCoordinates(view: any) : Promise<number[]> {
    var xyLocation = view.getLocationOnScreen();
    var trialCount = 0;
    var xyToClick = new Array<number>(2);

    while(xyLocation[0] == 0 && xyLocation[1] == 0 && trialCount < 10) {
        await sleep(300);
        view.getLocationOnScreen();
        trialCount++;
    }

    var viewWidth = view.getWidth();
    var viewHeight = view.getHeight();
    var x = xyLocation[0] + (viewWidth / 2.0);
    var y = xyLocation[1] + (viewHeight / 2.0);

    xyToClick[0] = x;
    xyToClick[1] = y;

    //console.log(xyToClick);
    return xyToClick;
}

function getAllViews(view: any, views: Array<any>) {
    let v;
    try {
        v = Java.cast(view, ViewGroup);
    } catch (e) {}

    if(v) {
        for (var i = 0; i < v.getChildCount(); i++) {
            getAllViews(v.getChildAt(i), views);
        }
    } else  {
        views.push(view);
    }
}

function getWindowDecorViews() {
    try {
        if (Build$VERSION.SDK_INT.value >= 17) {
            return mWindowManagerGlobal.mViews.value;
         } else {
            return null;
         }
    } catch (e) {
        console.log("[*] get window view error: " + e)
    }
}

function initPinkEnv() {
    const SystemLoad_2 = System.loadLibrary.overload(String_Name);
    SystemLoad_2.implementation = function(library: Object) {
        try {
            if(library === 'msaoaidsec') {
                console.log("[*] Inject Luna SDK Success")
                return;
            }
            const loaded = Runtime.getRuntime().loadLibrary0(VMStack.getCallingClassLoader(), library);
            return loaded;
        } catch(ex) {
            console.log(ex);
        }
    };
}

async function initWindowManager() {
    while(!mWindowManagerGlobal) {
        if (Build$VERSION.SDK_INT.value >= 17) {
            example_search_instance('android.view.WindowManagerGlobal', (instance: Object) => {
                console.log("[*] WindowManagerGlobal Init Success")
                mWindowManagerGlobal = instance;
            })
        } else {
            example_search_instance('android.view.WindowManagerImpl', (instance: Object) => {
                console.log("[*] WindowManagerImpl Init Success");
                mWindowManagerGlobal = instance;
            })
        }

        await sleep(3000)
    }
}

async function initInstrumentation() {
    while(!mInstrumentation) {
        example_search_instance('android.app.Instrumentation', (instance: Object) => {
            console.log("[*] Instrumentation Init Success");
            mInstrumentation = instance;
        })

        await sleep(3000)
    }
}

async function initMainActivity(launchComplete:Function) {
    while(!mMainActivityV2) {
        example_search_instance('com.example.test.MainActivityV2', (instance: Object) => {
            console.log("[*] MainActivityV2 Init Success");
            mMainActivityV2 = instance;
            launchComplete();
        })

        await sleep(3000)
    }
}

async function initHiltApplication() {
    while(!mApplication) {
        example_search_instance('com.example.test.HiltApplication', (instance: Object) => {
            console.log("[*] HiltApplication Init Success");
            mApplication = instance;
        })

        await sleep(3000)
    }
}

export function example_call_on_activity_load(activityName: string, callback:Function) {
    let ActivityLifecycleCallbacksImpl = Java.registerClass({
        name: 'com.example.qa.stub.ActivityLifecycleCallbacks',
        implements: [ActivityLifecycleCallbacks],
        methods: {
            onActivityCreated: function (activity: any, savedInstanceState: any) {
                
            },
            onActivityStarted: function (activity: any) {
                
            },
            onActivityResumed: function (activity: any) {
                console.log("[*] ActivityLifecycleCallbacksImpl: " + activity.getClass().getCanonicalName());
                mForegroundActivity = Java.retain(activity);
                if(activity.getClass().getCanonicalName() == activityName) {
                    callback(activity);
                }
            },
            onActivityPaused: function (activity: any) {
                
            },
            onActivityStopped: function (activity: any) {
                
            },
            onActivitySaveInstanceState: function (activity: any, outState: any) {
                
            },
            onActivityDestroyed: function (activity: any, savedInstanceState: any) {
                
            },
            onActivityPostStarted:function (activity: any) {
                
            },
            onActivityPreStarted:function (activity: any) {
                
            },
            onActivityPostStopped:function (activity: any) {
                
            },
            onActivityPrePaused:function (activity: any) {
                
            },
            onActivityPreStopped:function (activity: any) {
                
            },
            onActivityPreDestroyed:function (activity: any) {
                
            },
            onActivityPostResumed:function (activity: any) {
                
            },
            onActivityPostCreated:function (activity: any) {
                
            },
            onActivityPreCreated:function (activity: any) {
                
            },
            onActivityPreResumed:function (activity: any) {
                
            },
            onActivityPreSaveInstanceState:function (activity: any) {
                
            },
            onActivityPostSaveInstanceState:function (activity: any) {
                
            },
            onActivityPostPaused:function (activity: any) {
                
            },
            onActivityPostDestroyed:function (activity: any) {
                
            },
            onActivityConfigurationChanged:function (activity: any) {
                
            }
        }
    });
    mApplication.registerActivityLifecycleCallbacks(ActivityLifecycleCallbacksImpl.$new());
}

export function sleep(ms: number) {                                                                                                                                                                                       
    return new Promise((resolve) => setTimeout(resolve, ms));                                                                                                                                                
}


export function example_request(targetUrl: string, body: string, onReceive: (response: string) => void = function (response: string) { console.log("response: " + response); }) {
    Java.perform(function () {
        var HttpURLConnection = Java.use("java.net.HttpURLConnection");
        var URL = Java.use("java.net.URL");
        var BufferedReader = Java.use("java.io.BufferedReader");
        var BufferedWriter = Java.use("java.io.BufferedWriter");
        var BufferedOutputStream = Java.use("java.io.BufferedOutputStream");
        var OutputStreamWriter = Java.use("java.io.OutputStreamWriter");
        var StringBuilder = Java.use("java.lang.StringBuilder");
        var InputStreamReader = Java.use("java.io.InputStreamReader");

        var url = URL.$new(Java.use("java.lang.String").$new(targetUrl));
        var conn = url.openConnection();
        conn = Java.cast(conn, HttpURLConnection);
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setConnectTimeout(5000);
        conn.setReadTimeout(5000);
        conn.setDoInput(true);
        conn.setDoOutput(true);
        conn.setChunkedStreamingMode(0);

        const os = conn.getOutputStream();
        const out = BufferedOutputStream.$new(os);
        const osw = OutputStreamWriter.$new(out, Java.use("java.lang.String").$new("UTF-8"));
        var writer = BufferedWriter.$new(osw);
        let jsonBody = `{"data": "${body}"}`;
        console.log(`Posting: ${jsonBody}`);
        writer.$super.write(Java.use("java.lang.String").$new(jsonBody));
        writer.flush();
        writer.close();
        os.close();

        conn.connect();
        var code = conn.getResponseCode();
        console.log(`Response code: ${code}`);
        var ret = null;
        if (code == 200) {
            var inputStream = conn.getInputStream();
            var buffer = BufferedReader.$new(InputStreamReader.$new(inputStream));
            var sb = StringBuilder.$new();
            var line = null;
            while ((line = buffer.readLine()) != null) {
                sb.append(line);
            }
            var data = sb.toString();
        } else {
            ret = "error: " + code;
        }
        console.log("response: " + data);
        conn.disconnect();
        onReceive(data);
    });
}