// Curated movements and explicitly named side / range / tempo variants.
const entries=[];
function add(id,label,zh,kind,category='Upper body',options={}){entries.push({id,label,zh,kind,category,hz:.45,energy:.55,amplitude:1,side:'both',...options});}
add('walk','Walking','走路 步行 散步','gait','Locomotion',{sourceClip:'walk',pace:1,hz:1.05,energy:1});
add('run','Running','跑步 奔跑','gait','Locomotion',{sourceClip:'run',pace:1,hz:1.65,energy:2.2});
for(const [id,label,zh,kind,category,hz,energy]of [['jump','Jumping','原地跳 跳跃','jump','Lower body',.85,2],['squat','Squats','下蹲 深蹲','squat','Lower body',.42,.65],['jack','Jumping jacks','开合跳','jack','Lower body',.8,1.7],['march','Marching','原地踏步 抬腿','march','Locomotion',.8,1.1],['raise','Arm raises','双臂侧平举 抬臂','lateralRaise','Upper body',.45,.5],['twist','Trunk rotation','躯干旋转 转体','twist','Trunk & neck',.4,.4],['bend','Side bends','左右侧弯','bend','Trunk & neck',.35,.35],['balance','Single-leg stance · left support','左腿支撑 单腿站立 平衡','balance','Balance',.25,.08]])add(id,label,zh,kind,category,{hz,energy});
for(const [id,label,zh,sourceClip,pace]of [['walk-slow','Slow walking','慢走','walk',.65],['walk-brisk','Brisk walking','快走','walk',1.25],['walk-fast','Fast walking','快速步行','walk',1.5],['run-jog','Light jogging','慢跑','run',.75],['run-fast','Fast running','快速跑步','run',1.2],['run-sprint','Sprint cadence','冲刺节奏跑步','run',1.45]])add(id,label,zh,'gait','Locomotion',{sourceClip,pace,energy:sourceClip==='walk'?pace:2*pace});
for(const [id,label,zh,amplitude,hz,stance]of [['squat-half','Half squats','半蹲',.55,.5,0],['squat-deep','Deep squats','较深下蹲',1.12,.32,0],['squat-pulse','Squat pulses','小幅蹲起',.35,1,0],['squat-wide','Wide-stance squats','宽距下蹲',.8,.4,.18]])add(id,label,zh,'squat','Lower body',{amplitude,hz,stance});
function trio(id,label,zh,kind,category,options={}){add(id,label,zh,kind,category,options);for(const side of ['left','right'])add(`${id}-${side}`,`${label} · ${side}`,`${side==='left'?'左侧':'右侧'} ${zh}`,kind,category,{...options,side});}
function pair(id,label,zh,kind,category,options={}){for(const side of ['left','right'])add(`${id}-${side}`,`${label} · ${side}`,`${side==='left'?'左侧':'右侧'} ${zh}`,kind,category,{...options,side});}
trio('calf-raise','Calf raises','提踵 踮脚','calf','Lower body');
trio('toe-raise','Toe raises','抬脚尖','toe','Lower body');
trio('heel-tap','Heel taps','脚跟点地','heelTap','Lower body');
pair('leg-front','Forward leg raises','向前抬腿','legFront','Lower body');
pair('leg-back','Backward leg raises','向后抬腿','legBack','Lower body');
pair('leg-side','Lateral leg raises','侧抬腿','legSide','Lower body');
pair('knee-lift','Knee lifts','单侧提膝','kneeLift','Lower body');
pair('ham-curl','Standing hamstring curls','站立屈膝 后勾腿','hamCurl','Lower body');
pair('front-kick','Front kicks','前踢腿','frontKick','Lower body');
pair('lunge','Forward lunges','前弓步','lunge','Lower body');
pair('side-lunge','Lateral lunges','侧弓步','sideLunge','Lower body');
add('side-step','Alternating side steps','左右横向踏步','sideStep','Locomotion',{hz:.6});
add('step-touch','Step touches','并步点地','stepTouch','Locomotion',{hz:.65});
add('high-knees','High-knee marching','高抬腿踏步','highKnees','Locomotion',{hz:.9,energy:1.4});
add('butt-kicks','Alternating heel curls','交替后勾腿','buttKicks','Locomotion',{hz:.85,energy:1.2});
add('small-hops','Small two-foot hops','双脚小跳','jump','Lower body',{amplitude:.35,hz:1.2,energy:.8});
trio('front-raise','Front arm raises','手臂前平举','frontRaise','Upper body');
pair('lateral-raise','Lateral arm raises','单侧侧平举','lateralRaise','Upper body');
trio('overhead-reach','Overhead reaches','向上伸手 举手','overhead','Upper body');
trio('elbow-curl','Elbow curls','屈肘 弯举','elbowCurl','Upper body');
trio('shrug','Shoulder shrugs','耸肩','shrug','Upper body');
add('arm-circle-forward','Forward arm circles','手臂向前绕环','armCircle','Upper body',{direction:1});
add('arm-circle-back','Backward arm circles','手臂向后绕环','armCircle','Upper body',{direction:-1});
trio('arm-swing','Forward–back arm swings','手臂前后摆动','armSwing','Upper body');
add('crossbody','Cross-body arm swings','手臂交叉摆动','crossbody');
add('chest-open','Chest opening','扩胸','chestOpen');
add('overhead-press','Overhead presses','过头推举','press');
add('row','Standing rows','站姿划船','row');
trio('punch','Straight punches','直拳 出拳','punch','Upper body',{hz:.8,energy:.9});
pair('wave','Hand waving','挥手','wave','Upper body',{hz:.65});
trio('wrist-flex','Wrist flexion / extension','手腕屈伸','wristFlex','Hands & wrists');
trio('wrist-turn','Forearm rotation','前臂旋转 旋前 旋后','wristTurn','Hands & wrists');
trio('fist','Hand opening / closing','握拳 张手 手指屈伸','fist','Hands & wrists');
pair('finger-tap','Index-finger tapping','食指敲击','fingerTap','Hands & wrists',{hz:1.1,energy:.12});
add('trunk-forward','Forward trunk bends','躯干前屈 鞠躬','trunkForward','Trunk & neck');
add('trunk-extend','Gentle trunk extension','躯干后伸','trunkExtend','Trunk & neck',{amplitude:.6});
pair('side-bend','One-sided trunk bends','单侧侧弯','bend','Trunk & neck');
pair('trunk-turn','One-sided trunk turns','单侧转体','twist','Trunk & neck');
add('head-nod','Head nodding','点头 颈部屈伸','headNod','Trunk & neck',{energy:.12});
add('head-turn','Head turning','摇头 转头','headTurn','Trunk & neck',{energy:.12});
add('balance-right','Single-leg stance · right support','右腿支撑 单腿站立 平衡','balance','Balance',{side:'right',hz:.25,energy:.08});
add('weight-shift','Lateral weight shifts','左右重心转移','weightShift','Balance',{hz:.3,energy:.12});
add('tandem-shift','Staggered-stance weight shifts','前后重心转移 前后脚站立','tandem','Balance',{hz:.3,energy:.12});
const common=['walk','run','jump','squat','jack','march','raise','front-raise','overhead-reach','twist','bend','calf-raise','high-knees','elbow-curl','wave-right','lunge-left','leg-side-left','wrist-flex','fist','balance'];
export const motions=entries.map((m,i)=>({...m,rank:common.includes(m.id)?common.indexOf(m.id):common.length+i,duration:8/m.hz,source:m.sourceClip?'imported':'authored',tags:[m.zh,m.category,m.sourceClip?(m.sourceClip==='walk'?'走路 步行 动画片段':'跑步 奔跑 动画片段'):'程序化 示意']})).sort((a,b)=>a.rank-b.rank).map((m,i)=>({...m,order:i+1}));
export const motionGroups=[...new Set(motions.map(m=>m.category))];
export const motionById=new Map(motions.map(m=>[m.id,m]));
export function filterMotions(query='',category='all'){const terms=query.normalize('NFKC').toLowerCase().trim().split(/\s+/).filter(Boolean);return motions.filter(m=>(category==='all'||m.category===category)&&terms.every(t=>`${m.label} ${m.zh} ${m.tags.join(' ')} ${m.id}`.normalize('NFKC').toLowerCase().includes(t)));}
