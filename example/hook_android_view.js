Java.perform(function() {        
    const View = Java.use('android.view.View');
    View.setOnClickListener.implementation = function (v) {
        this.setOnClickListener(v);
    };
});