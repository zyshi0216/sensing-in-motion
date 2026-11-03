import * as T from 'three';
export function createRig(){const root=new T.Group(),bones={};const mat=new T.MeshStandardMaterial({color:0xcedde0,roughness:.58,metalness:.12});const jointMat=new T.MeshStandardMaterial({color:0x788f9e,roughness:.65});
function group(name,parent,x,y,z=0){const g=new T.Group();g.position.set(x,y,z);parent.add(g);bones[name]=g;return g;}
function ell(parent,x,y,z,sx,sy,sz,material=mat){const m=new T.Mesh(new T.SphereGeometry(1,12,8),material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m;}
const hip=group('hip',root,0,.96);ell(hip,0,0,0,.24,.16,.14);const torso=group('torso',hip,0,.12);ell(torso,0,.29,0,.27,.35,.14);const head=group('head',torso,0,.78);ell(head,0,0,0,.13,.17,.13);ell(head,0,-.2,0,.065,.08,.065);const face=new T.MeshStandardMaterial({color:0x456572});ell(head,-.045,.025,.116,.014,.012,.009,face);ell(head,.045,.025,.116,.014,.012,.009,face);
for(const [side,s] of [['L',1],['R',-1]]){const upper=group(`${side}upper`,torso,s*.29,.53);ell(upper,0,0,0,.09,.09,.09,jointMat);ell(upper,s*.16,0,0,.19,.075,.075);const fore=group(`${side}fore`,upper,s*.33,0);ell(fore,0,0,0,.065,.065,.065,jointMat);ell(fore,s*.14,0,0,.16,.058,.058);const hand=group(`${side}hand`,fore,s*.3,0);ell(hand,s*.06,0,0,.09,.075,.045);for(let i=0;i<5;i++)ell(hand,s*(i===0?.09:.17),.09-i*.045,0,i===0?.045:.065,.016,.019);
const thigh=group(`${side}thigh`,hip,s*.135,-.05);ell(thigh,0,-.2,0,.105,.24,.11);const shin=group(`${side}shin`,thigh,0,-.43);ell(shin,0,0,0,.075,.075,.075,jointMat);ell(shin,0,-.19,0,.075,.22,.08);const foot=group(`${side}foot`,shin,0,-.39);ell(foot,0,0,.07,.08,.065,.16);}
return {root,bones};}
export function targetPose(id,t,hz=1){const p=2*Math.PI*hz*t,s=Math.sin(p),c=Math.cos(p),q=(1-c)/2;const a={hipY:.96,hipX:0,hipR:0,torsoY:0,torsoZ:0,Larm:0,Rarm:0,LupperX:0,RupperX:0,Lelbow:0,Relbow:0,Lleg:0,Rleg:0,Lknee:0,Rknee:0};if(!id)return a;
a.Larm=-1.42;a.Rarm=1.42;
if(['walk','run','march'].includes(id)){const amp=id==='run'?.85:.45;a.Lleg=amp*s;a.Rleg=-amp*s;a.Lknee=Math.max(0,-s)*(id==='run'?1.25:.65);a.Rknee=Math.max(0,s)*(id==='run'?1.25:.65);a.LupperX=-amp*s;a.RupperX=amp*s;a.hipY+=Math.abs(c)*(id==='run'?.1:.025);if(id==='march'){a.Lleg=-Math.max(0,s);a.Rleg=-Math.max(0,-s);a.Lknee=Math.max(0,s);a.Rknee=Math.max(0,-s);}if(id==='run')a.Lelbow=a.Relbow=-.9;}
if(id==='jump'){a.hipY+=.3*Math.max(0,s);a.Lleg=a.Rleg=-.22*Math.max(0,-s);a.Lknee=a.Rknee=.45*Math.max(0,-s);a.Larm=-1.3+q;a.Rarm=1.3-q;}
if(id==='squat'){a.hipY-=.32*q;a.Lleg=a.Rleg=-.8*q;a.Lknee=a.Rknee=1.6*q;a.LupperX=a.RupperX=-1.3*q;}
if(id==='jack'){a.hipY+=.09*Math.abs(s);a.Larm=-1.42+2.65*q;a.Rarm=1.42-2.65*q;a.hipR=.35*q;}
if(id==='raise'){a.Larm=-1.42+2.7*q;a.Rarm=1.42-2.7*q;}
if(id==='twist')a.torsoY=.65*s;
if(id==='bend')a.torsoZ=.35*s;
if(id==='balance'){a.Rleg=-.8;a.Rknee=1.35;a.torsoZ=.02*s;a.Larm=-.45;a.Rarm=.45;}
return a;}
export function applyPose(rig,a){const b=rig.bones;b.hip.position.y=a.hipY;b.hip.rotation.z=a.hipX;b.torso.rotation.set(0,a.torsoY,a.torsoZ);for(const side of ['L','R']){b[`${side}upper`].rotation.set(a[`${side}upperX`],0,a[`${side}arm`]);b[`${side}fore`].rotation.y=a[`${side}elbow`];b[`${side}thigh`].rotation.set(a[`${side}leg`],0,(side==='L'?1:-1)*a.hipR);b[`${side}shin`].rotation.x=a[`${side}knee`];}}
