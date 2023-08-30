// Forces the VM to execute everything with its interpreter. 
// Necessary to prevent optimizations from bypassing method hooks in some cases,
// and allows ART’s Instrumentation APIs to be used for tracing the runtime.
// Java.deoptimizeEverything();

// Hook System.loadLibrary, prevent oaid so crash main process
Java.perform(function() {
    const System = Java.use('java.lang.System');
    const Runtime = Java.use('java.lang.Runtime');
    const SystemLoad_2 = System.loadLibrary.overload('java.lang.String');
    const VMStack = Java.use('dalvik.system.VMStack');

    SystemLoad_2.implementation = function(library) {
        console.log("[*] Loading dynamic library => " + library);
        try {
            if(library === 'msaoaidsec') {
                return;
            }
            const loaded = Runtime.getRuntime().loadLibrary0(VMStack.getCallingClassLoader(), library);
            return loaded;
        } catch(ex) {
            console.log(ex);
        }
    };
});
