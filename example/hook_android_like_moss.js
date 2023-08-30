Java.perform(function () {
    const VideoLikeRouteService = Java.use('com.example.test.player.router.VideoLikeRouteService');
    const ActionLikeCallback = Java.use('com.example.playerbizcommon.IVideoLikeRouteService$ActionLikeCallback');
    const ActionLikePolymerBuilder = Java.use('com.example.playerbizcommon.IVideoLikeRouteService$ActionLikePolymer$Builder');

    VideoLikeRouteService.reportActionLike.implementation = function (polymer, callback) {
        console.log('aid:  ' + polymer.aid.value);
        console.log('like:  ' + polymer.like.value);
        console.log('type:  ' + polymer.type.value);
        console.log('fromSpmid:  ' + polymer.fromSpmid.value);
        console.log('from:  ' + polymer.from.value);
        console.log('spmid:  ' + polymer.spmid.value);
        console.log('trackId:  ' + polymer.trackId.value);
        console.log('goTo:  ' + polymer.goTo.value);
        this.reportActionLike(polymer, callback);
    };

    const PolymerBuilder = ActionLikePolymerBuilder.$new();
    console.log('PolymerBuilder:' + PolymerBuilder);
    const Long = Java.use('java.lang.Long');
    const Integer = Java.use('java.lang.Integer');
    PolymerBuilder.aid.value = Long.$new(56708261);
    PolymerBuilder.like.value = Integer.$new(0);
    PolymerBuilder.type.value = Integer.$new(0);
    PolymerBuilder.from.value = "2";
    PolymerBuilder.fromSpmid.value = "main.ugc-video-detail.relatedvideo.0";
    PolymerBuilder.spmid.value = "main.ugc-video-detail.0.0";
    // ActionLikePolymer实例
    const LikePolymer = PolymerBuilder.build();
    console.log('LikePolymer: ' + LikePolymer);

    // 构造ActionLikeCallback接口实现类
    const ActionLikeCallbackImpl = Java.registerClass({
        name: 'com.example.qa.stub.ActionLikeCallbackImpl',
        implements: [ActionLikeCallback],
        methods: {
            isCancel: function () {
                console.log('action like isCancel');
                return false;

            },
            onRequestSuccess: function (toast) {
                console.log('action like isSuccess');
                console.log('success toast: ' + toast);

            },
            onResponseIllegal: function () {
                console.log('action like isIllegal');
            },
            onRequestFailed: function (t) {
                console.log('action like isFailed');
                console.log('error Msg: ' + t.getMessage());
            }
        }
    });

    //ActionLikeCallback实例
    const CallBackObj = ActionLikeCallbackImpl.$new();
    console.log('CallBackObj: ' + CallBackObj);

    // VideoLikeRouteService实例
    const ServiceObj = Java.use('com.example.lib.blrouter.BLRouter').$new().get(Java.use('com.example.playerbizcommon.IVideoLikeRouteService').class, 'video_like');
    // console.log('ServiceObj ' + ServiceObj);
    // ServiceObj.reportActionLike(LikePolymer, CallBackObj);

    Java.choose('com.example.test.player.router.VideoLikeRouteService', {
        onComplete: function () {

        },
        onMatch: function (instance) {
            for (let i = 0; i < 10; i++) {
                instance.reportActionLike(LikePolymer, CallBackObj);

            }

        }
    });

})