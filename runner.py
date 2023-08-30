import sys
import subprocess

if __name__ == '__main__':
    platform = sys.argv[1] if len(sys.argv) >= 2 else ""
    extraParam = " ".join(sys.argv[2:]) if len(sys.argv) >= 4 else ""

    if platform == 'android':
        bundle = sys.argv[2] if len(sys.argv) == 3 else "com.example.test"

        subprocess.call(
            f"adb shell am force-stop {bundle} && adb shell am start -n {bundle}/.MainActivity", shell=True)
        subprocess.call(
            f"sleep 10 && frida -U -l _android.js -F {extraParam}", shell=True)
    elif platform == 'ios':
        bundle = sys.argv[2] if len(sys.argv) == 3 else "com.example.test"

        subprocess.call(f"frida -U -f {bundle}  {extraParam} &", shell=True)
        subprocess.call(
            f"sleep 10 && frida -U -l _ios.js -n Gadget {extraParam}", shell=True)
    else:
        print("[*] Invalid platform " + platform)
