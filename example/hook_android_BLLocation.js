Java.perform(function() {       
    const simulated_latitude = 23.23
    const simulated_longitude = 23.23

    // 获取 class 引用
    const BLLocation = Java.use('com.example.test.location.BLLocation')
    const Location = Java.use('android.location.Location')

    // 创建 android.location.Location 实例并引用
    var location = Location.$new("gps")
    location.setLatitude(simulated_latitude)
    location.setLongitude(simulated_longitude)

    // 创建 com.example.test.location.BLLocation 实例并引用
    var location = BLLocation.$new(location)
    console.log(location.getLat())
});