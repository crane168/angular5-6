文件云启动首先安装node，查看node版本要为新版node。
开始：npm install执行加载依赖，
然后：npm start 执行启动项目。

关于代码里面如需做修改后端ip：如下操作路径查看
src→app→pages→service→context.service.ts文件中：
public host(): string {
    if (this.developMode) {
        return 'http://192.168.6.244:8888';
    } else {
        return 'http://192.168.9.19:8888';
    }
}
做出修改
