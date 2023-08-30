Java.perform(function() {        
    var InetAddress = Java.use('java.net.InetAddress');
    InetAddress.getHostAddress.implementation = function () {
        var hostAddress = this.getHostAddress();
        console.log('[*] Hook getHostAddress() success, return value:' + hostAddress);
        return hostAddress;
    };

    setTimeout(function() {
        Java.choose('com.example.lib.httpdns.HttpDNS', {
            onComplete: function() {

            },
            onMatch: function(instance) {
                console.log("[*] find instance: " + instance);
                var HttpDNS = Java.use('com.example.lib.httpdns.HttpDNS');
            
                HttpDNS.getHosts.implementation = function () {
                    var res = this.getHosts();
                    console.log('[*] Hook HttpDNS.getHosts() success, return value:' + res);
                    return res;
                }

                print(instance.getHosts());
            }
        })
    }, 3000);
})