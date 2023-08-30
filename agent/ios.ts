import { example_on_launch_pre, example_on_launch_complete, example_test } from "./ios_demo.js";

// init android pre-launch stage
example_on_launch_pre(() => {
    //example_test(launch_test);
})

// init android launch-complete stage
example_on_launch_complete(() => {
    // example_test(http_monitor);
});