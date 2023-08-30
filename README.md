# 动态代码测试
动态代码测试框架

### Frida 环境配置
1. 安装 Python 3.X 
2. 安装 Frida
``` 
  pip install frida
  pip install frida-tools 
```
3. 安装 node
``` 
  brew install node
```
4. 环境配置完毕后，在工程目录安装项目依赖
``` 
  npm install
```

### 工程目录介绍
- dynamic-test-script 项目根目录
  - example/ 包含双端示例代码
  - agent/android.ts Android 测试集合，测试用例通过 import 方式导入
  - agent/ios.ts iOS 测试集合，测试用例通过 import 方式导入

### 编译执行测试代码
1. 安装包含 Frida SDK 测试包，通过 USB 线将手机与电脑连接
2. 编译 JavaScript 用例代码，编译生成 _android.js、_ios.js 两个文件，文件内包含 import 测试用例
``` 
  npm run build
```
3. 执行测试
``` 
  npm run test_android -- com.example.test
  npm run test_ios -- com.example.test
```
## 学习资料
1. Frida JavaScript API - Frida 功能非常强大，所有可用的 API 可以参考官网的文档：https://frida.re/docs/javascript-api/ 
2. Frida 官网提供了很多优秀的 JavaScript 案例学习代码：https://codeshare.frida.re/browse
3. Frida 学习笔记：https://juejin.cn/post/6847902219757420552