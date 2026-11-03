# V2 骨骼人体升级 / GitHub 网页上传指南

## 版本变化

由球体拼接人体改为 Xbot 连续蒙皮人体：两个蒙皮网格、约 2.84 万个顶点条目（包括接缝重复顶点）、约 4.91 万个三角形，完整手指骨骼。灰蓝中性材质。

走路／跑步：使用模型配套的骨骼动画片段，保持原有髋膝踝、躯干和摆臂协调，并按原片段时长播放。无需不同骨架之间重定向。

其余八个动作：在新骨架上烘焙的程序化四元数关键帧，不是动捕。包含下蹲屈膝修正、躯干分段旋转和脚部高度校正。不是完整接触 IK 或动力学求解，仍可能有滑步、身体穿插。

动作约 0.35 秒混合；暂停／变速／时间轴定位与曲线共用时间。38 个节点已重新定位，手部节点跟随相应手指。节点仍是示意安装点，不是实验标定位置。

## 已有 GitHub 仓库如何更新（不用安装 Git）

解压完整包，进入 swlab-motion-demo 文件夹。

1. 打开 GitHub 仓库的 `src` 文件夹 → Add file → Upload files，将新版 `src` 内全部文件拖进去，Commit changes。
2. 打开仓库的 `public` 文件夹 → Add file → Upload files，将新版 `public` 内的 `models` 文件夹和 `ASSET_NOTICES.md`、`ThirdPartyNotices.txt` 拖进去。最终必须能看到 `public/models/human.glb`。
3. 打开仓库的 `tests` 文件夹，上传新版 tests 内所有文件。包含新增的 `skinned.test.js`，Commit changes。
4. Actions 最新运行成功后打开原网站，Ctrl+F5 强制刷新。新界面顶部应显示 `SKINNED HUMAN`，走路与跑步下方显示 `Imported skeletal animation`。

最重要：不要只替换 rig.js。本次新增 skinnedRig.js 和 human.glb，并修改 main.js、softwareRenderer.js、style.css。

## 如果想一次上传

在仓库根目录 Upload files，直接拖入解压后的 src、public、tests 三个文件夹。确认保留目录结构后提交。原 package.json、package-lock.json、vite.config.js、index.html 和现有 .github 工作流不需要修改。

更新源码后 GitHub Actions 自动重新生成 dist。不要把新版 dist 和旧版 assets 混在一起手动部署。

## 本地运行

Node.js 22：`npm ci` → `npm test` → `npm run dev`。
正式构建：`npm run build`。`dist` 是已经构建好的完整静态页面。
不装 npm 预览：`python -m http.server 8080 --directory dist`，然后打开 http://localhost:8080 。不要双击 index.html。

## 验收重点

- 首屏是完整蒙皮人体，能分辨手指。
- 从侧面检查走路和跑步的前后摆腿、屈膝与摆臂。
- 从侧面检查下蹲，膝盖朝身体前方，脚底保持接近地面。
- 暂停后拖动时间轴，姿态、曲线和数值同时改变。
- 切回 T-pose，骨架恢复绑定姿态。
- 选 GL-L-3、PA-R-2、SH-L-1 等节点，检查高亮与随动。

WebGL 是推荐运行环境；软件后备模式可以显示蒙皮，但在无 GPU 环境下帧率明显更低。浏览器需开启硬件加速以获得流畅效果。

## 资产说明

模型及配套动画来自 Three.js r170 的 Xbot 示例（Adobe Mixamo 来源），作为该应用的运行时组件使用。来源与使用说明在 public/ASSET_NOTICES.md。应用源码 MIT 许可不覆盖第三方模型。不要将模型单独作为资产包再分发。
