import { example_on_launch_pre, example_on_launch_complete, example_test } from "./android_demo.js";

// init android pre-launch stage
example_on_launch_pre(() => {
    // example_test(launch_test);
    // example_test(modify_system);
})

// init android launch-complete stage
example_on_launch_complete(() => {
    // example_test(image_test);
    // example_test(http_test);
    // example_test(share_test);
});
