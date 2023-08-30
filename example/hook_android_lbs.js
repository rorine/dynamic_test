Java.perform(function() {        
    var BLLocation = Java.use('com.example.location.BLLocation');
    BLLocation.getCityId.implementation = function () {
        send('location getCityId() called');
        return "315300";
    };
    
    BLLocation.getCityName.implementation = function () {
        send('location getCityName() called');
        return "宁波市";
    };
    
    BLLocation.getNationName.implementation = function () {
        send('location getNationName() called');
        return "中国";
    };
    
    BLLocation.getType.implementation = function () {
        send('location getType() called');
        return "TX";
    };
    
    BLLocation.getLat.implementation = function () {
        send('location getLat() called');
        return 23.23;
    };
    
    BLLocation.getLon.implementation = function () {
        send('location getLon() called');
        return 23.23;
    };
});