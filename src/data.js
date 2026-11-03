export const categories={middle:{label:'Sweater middle',color:'#69abd2'},edge:{label:'Sweater edge',color:'#5bcbb7'},gloves:{label:'Gloves',color:'#efb247'},pants:{label:'Pants',color:'#ab80cc'},shoes:{label:'Shoes',color:'#ee786c'}};
export const motions=[['walk','Walking',1.05],['run','Running',1.65],['jump','Jumping',.85],['squat','Squats',.42],['jack','Jumping jacks',.8],['march','Marching',.8],['raise','Arm raises',.45],['twist','Trunk rotation',.4],['bend','Side bends',.35],['balance','Single-leg stance',.25]].map(([id,label,hz])=>({id,label,hz,duration:8/hz}));
export const sensors=[];
function add(id,label,category,bone,offset){sensors.push({id,label,category,bone,offset,color:categories[category].color});}
for(let i=0;i<4;i++)add(`SM-${i+1}`,['Upper chest','Chest','Mid trunk','Lower trunk'][i],'middle','torso',[0,.57-i*.17,.145]);
for(const [side,sign] of [['L',1],['R',-1]]){
 const names=['Shoulder','Upper arm proximal','Upper arm distal','Forearm proximal','Forearm distal'];
 for(let i=0;i<5;i++)add(`SE-${side}-${i+1}`,`${side} · ${names[i]}`,'edge',`${side}${i<3?'upper':'fore'}`,[i===0?0:sign*(i<3?.13+(i-1)*.13:.08+(i-3)*.16),0,.095]);
 for(let i=0;i<6;i++)add(`GL-${side}-${i+1}`,`${side} · ${i===0?'Back of hand':['Thumb','Index','Middle','Ring','Little'][i-1]}`,'gloves',`${side}hand`,[sign*(i===0?.055:i===1?.06:.19),i===0?0:.09-(i-1)*.045,.065]);
 for(let i=0;i<4;i++)add(`PA-${side}-${i+1}`,`${side} · ${['Upper thigh','Lower thigh','Upper shin','Lower shin'][i]}`,'pants',`${side}${i<2?'thigh':'shin'}`,[0,-(.1+(i%2)*.24),.105]);
 for(let i=0;i<2;i++)add(`SH-${side}-${i+1}`,`${side} · ${i===0?'Foot instep':'Toe'}`,'shoes',`${side}foot`,[0,.06,.07+i*.15]);
}
// This is the reference diagram's structural topology, not a fitted anatomical model.
export const links=[];
const chain=(ids,type='local')=>ids.slice(1).forEach((id,i)=>links.push([ids[i],id,type]));
chain([1,2,3,4].map(i=>`SM-${i}`));
for(const side of ['L','R']){chain([1,2,3,4,5].map(i=>`SE-${side}-${i}`));chain([1,2,3,4,5,6].map(i=>`GL-${side}-${i}`));chain([1,2,3,4].map(i=>`PA-${side}-${i}`));chain([`SH-${side}-1`,`SH-${side}-2`]);links.push([`SE-${side}-5`,`GL-${side}-1`,'local'],[`PA-${side}-4`,`SH-${side}-1`,'local'],['SM-4',`PA-${side}-1`,'trunk']);for(let i=1;i<=5;i++)links.push([`SM-${Math.max(1,5-i)}`,`SE-${side}-${i}`,'bridge']);}
for(const [prefix,n] of [['SE',5],['GL',6],['PA',4],['SH',2]])for(let i=1;i<=n;i++)links.push([`${prefix}-L-${i}`,`${prefix}-R-${i}`,'symmetry']);
export function signal(motion,sensor,t){if(!motion)return [0,9.81,0,0,0,0];const p=2*Math.PI*motion.hz*t;const ix=sensors.indexOf(sensor);const phase=(sensor.id.includes('-R-')?Math.PI:0)+ix*.075;const gain={middle:.3,edge:.65,gloves:1,pants:.9,shoes:1.4}[sensor.category];const energy={walk:1,run:2.2,jump:2,squat:.65,jack:1.7,march:1.1,raise:.5,twist:.4,bend:.35,balance:.08}[motion.id];const a=gain*energy;return [a*2*Math.sin(p+phase),9.81+a*3*(Math.cos(2*p+phase)),a*1.4*Math.sin(p+phase+.7),a*65*Math.cos(p+phase),a*40*Math.sin(p+phase+.4),a*25*Math.cos(2*p+phase)];}
export class PlaybackClock{constructor(){this.time=0;this.speed=1;this.playing=false;this.duration=10;}tick(dt){if(this.playing)this.time=(this.time+Math.min(dt,.1)*this.speed)%this.duration;return this.time;}seek(fraction){this.time=Math.min(.999999,Math.max(0,fraction))*this.duration;}}
