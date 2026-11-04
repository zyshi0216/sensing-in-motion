# Wearable Sensing Explorer — V3 学术展示界面

原界面名称 SWLab 改为 Wearable Sensing Explorer。页眉／页脚加入 NUS、National University of Singapore 和 Liu Lab 文字标签。标签表示本项目的科研背景，不使用仿制校徽或“官方平台”表述。

视觉：深蓝／暖灰色、衬线展示标题、轻量分隔、功能数字概览、三分区编号、精简的节点检查器、可展开模型／数据说明。保留人体、38 节点、10 动作、合成信号、播放控制与导出。

## 已经使用 V2，如何更新 GitHub

本次只需替换以下 3 个文件：

- 仓库根目录：index.html
- src/main.js
- src/style.css

在仓库打开相应目录，Add file → Upload files，上传同名新版文件并 Commit changes。Actions 完成后 Ctrl+F5 刷新。src 内的模型／数据模块和 public/models/human.glb 保留原版。

如果不确定当前版本，上传完整包内 src、public、tests 三个文件夹及 index.html。不要增加一层外部工程文件夹；package.json 应仍处在仓库根目录。现有 .github/workflows/deploy.yml 无需修改。

## 完整包

包括全部源代码、模型、自动部署配置、现成 dist、第三方资产说明及先前版本的运行指南。部署方式和 V2 相同。dist 可直接通过 HTTP 静态服务器运行。

## 检查

生产构建成功；浏览器已确认新名称、机构文字标签、人物加载、动作／节点选择及图表面板。
