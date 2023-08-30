const { UIApplication, UIView, UIColor } = ObjC.classes;
const window = UIApplication.sharedApplication().delegate().window();

const frame = [[100,100],[100,100]];
ObjC.schedule(ObjC.mainQueue, () => {
    var view = UIView.alloc().initWithFrame_(frame);
    view.setBackgroundColor_(UIColor.grayColor());
    console.log(view.frame());

    var layer = view.layer();
    layer.setCornerRadius_(10);
    layer.setBorderWidth_(3);
    layer.setBorderColor_(UIColor.redColor().CGColor());
    window.addSubview_(view);
    window.makeKeyAndVisible();

});