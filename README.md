# Wearable Sensing Explorer — V4

当前为 **100 项动作与变式＋中英文搜索**。请优先阅读 UPDATE_V4.md。旧版文档中的 10 动作描述已被 V4 替代，模型资产和许可说明保持有效。

# SWLab Motion Explorer — V2

当前版本已替换为连续蒙皮人体。运行和 GitHub 更新请优先阅读 **UPGRADE_V2.md**。

下方保留第一版操作说明，涉及“程序化拼接人体”“没有外部模型”的描述已被 V2 替代；当前模型与动作来源以 public/ASSET_NOTICES.md 为准。

# SWLab Motion Explorer

38 节点人体动作交互演示。纯前端，无后端、无账号、无真实传感器接入。英文界面。

## 包含什么

- 初始 T 字姿态，10 个循环动作，约 0.4 秒姿态过渡。
- 38 个彩色节点：上衣中线 4、上衣边缘 10、手套 12、裤子 8、鞋 4。
- 点击节点或用下拉框选择，显示六轴曲线与数值，导出该动作所选节点的 50 Hz CSV。
- 拖动旋转、滚轮缩放、正侧背面切换、节点编号、拓扑开关。
- 播放／暂停、0.5–2 倍速、时间轴定位、恢复 T 字姿态。
- WebGL 优先；不可用时自动使用 CPU 软件透视渲染，帧率较低。
- `dist/` 是已构建的静态站点，无需在服务器安装 Node。

## 范围和限制（务必先读）

这是演示工程：使用 Three.js 分层关节与几何体构建的人体，并非写实人体或动作捕捉模型。动作是程序化近似，足部接地、膝关节和手指不含逆运动学／生物力学约束。手指不单独执行抓握动作。

信号由固定、可重复的周期函数生成，按动作和身体区域区分；与人物共用时间，但不是由人体动力学求得的真实 IMU 输出。曲线初始窗口会循环读取该动作的前一周期，不代表已经采集的历史数据。动作混合阶段的信号直接切换至新动作。

节点位置根据参考图按类别示意布置，没有经具体安装位置表校准。拓扑中的手套局部链按参考图的抽象顺序连接，并不表示手指之间的骨骼连接。不能用于传感器选型、临床判断或科研性能验证。

## 本地启动（Windows / macOS / Linux）

先安装 Node.js 22 LTS（包含 npm），解压，进入包含 package.json 的目录。

```bash
npm ci
npm test
npm run dev
```

浏览器打开终端打印的本地地址，通常是 http://localhost:5173 。不要直接双击源码 index.html。

检查正式构建：

```bash
npm run build
npm run preview
```

打开终端给出的 preview 地址（通常 http://localhost:4173）。构建输出为 dist。

### 直接预览随包 dist（不装 npm 依赖）

如果已有 Python 3，在工程目录执行：

```bash
python -m http.server 8080 --directory dist
```

打开 http://localhost:8080 。Windows 也可用 `py -m http.server 8080 --directory dist`。
构建后的页面资源都在本地，无 CDN、字体或模型下载依赖；首次 npm ci 需要访问 npm。

## GitHub Pages 部署（已附自动工作流）

1. 在 GitHub 创建仓库，把工程内容放到仓库根目录：必须包含 package.json、package-lock.json、src、index.html、vite.config.js，以及 .github/workflows/deploy.yml。不要上传 node_modules。
2. 仓库 Settings → Pages → Build and deployment → Source 选择 GitHub Actions。
3. 将代码推送到 main 分支；如使用其他分支，修改 deploy.yml 的 branches。
4. 在 Actions 中查看 Deploy to GitHub Pages。测试、构建、部署全部成功后，打开部署任务提供的 page_url。
5. 工作流已使用相对资源路径，适用于带仓库子路径的 Pages 站点。

注意：浏览器上传文件时可能漏掉隐藏的 .github 文件夹。推荐使用 GitHub Desktop 或 git，确认仓库中确实存在工作流。

## Vercel 部署

导入该 Git 仓库，选择 Vite，Build Command 填 `npm run build`，Output Directory 填 `dist`。不需要环境变量。部署成功后用 Vercel 返回的网址访问。也可以把 dist 上传到支持静态站点的其他服务器，保持 assets 的相对目录不变。

## 手动验收清单

| 检查 | 操作 | 预期 |
|---|---|---|
| 初始界面 | 新标签打开网页 | T 字站姿、38 个节点、静止信号 |
| 10 个动作 | 逐个点击左侧动作，观察两个周期 | 人体持续运动，无循环重置跳变 |
| 动作切换 | 走路切换下蹲 | 姿态短暂平滑过渡，标题与信号变更 |
| 暂停 | 播放中点击 Pause，等待 3 秒 | 人体、进度、曲线和数值不再变化 |
| 恢复与速度 | Play，再选择 2× | 人体与信号一起加速 |
| 定位 | 暂停后拖动时间轴 | 人体姿态、时间、数值与曲线同时更新 |
| 节点点选 | 暂停，点胸部或脚部彩色圆点 | 检查器变为对应编号，节点放大 |
| 小节点 | 用下拉框选 GL-L-3 | 对应手套节点高亮，可通过缩放观察 |
| 视角 | 正面、侧面、背面及鼠标拖动缩放 | 人体和节点保持绑定 |
| 显示开关 | Sensors、Topology、Node IDs | 对应显示层改变 |
| 数据导出 | Export selected sensor CSV | 下载 DEMO_动作_节点.csv，7 列，50 Hz |
| T 字复位 | 点击 T-pose | 回到 T 字姿态并停止，静态重力示意值 |
| 正式资源 | 在部署地址刷新 | 无空白页、无 assets 404 |

自动检查：`npm test` 验证节点数量／类别／骨骼、拓扑引用、动作和信号循环边界、时间轴、信号可重复性。浏览器验收记录见 VALIDATION.md。

## 工程维护

- src/data.js：38 节点配置、拓扑、动作表和固定信号函数。offset 为父关节局部坐标，单位米。GL-L-1 为左手背，2–6 为拇／食／中／环／小指示意位置。
- src/rig.js：三维人体层级、10 个程序化姿态、姿态应用。
- src/main.js：UI、渲染场景、拾取、播放、图表和 CSV 导出。
- src/softwareRenderer.js：无 WebGL 环境的 CPU 后备投影渲染。
- src/style.css：响应式布局。
- tests/core.test.js：核心校验。
- .github/workflows/deploy.yml：GitHub Pages 自动测试及部署。

第一版为减少依赖使用 Vite + 原生 JavaScript 模块 + Three.js，而非 React/TypeScript。模型和信号接口已分开；以后换 GLB 模型时，需要重新映射骨骼名称与节点局部位置，不应直接套用。

## 故障排查

- 白屏：通过 HTTP 服务访问，检查 assets 路径是否完整，不要用 file:// 双击。
- WebGL 不可用：自动后备渲染可继续操作；如需高帧率，在自己的浏览器设置中开启硬件加速并重启浏览器。
- 节点太小：放大视图或用右侧下拉框。旋转到另一面避免遮挡。
- Pages 没有部署任务：检查 .github 工作流、main 分支和 Pages Source 设置。
- npm ci 失败：确认 Node 22 和可访问 npm；不要删除 lock 文件后随意换版本。

## 依赖与许可

应用示例源码采用 MIT 许可；Three.js（MIT）及 Vite（MIT）的许可证随各自 npm 包提供，构建包保留 ThirdPartyNotices.txt。人体由代码生成，未使用外部模型或动作资产。
