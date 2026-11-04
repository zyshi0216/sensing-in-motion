import {motionById} from './motionCatalog.js';
import {targetPose as originalPose} from './rig.js';
export function catalogPose(id,t,hz=1){
 const m=motionById.get(id);if(!m)return originalPose(id,t,hz);
 const a=originalPose(null,0);a.Larm=-1.42;a.Rarm=1.42;
 Object.assign(a,{rootX:0,LhipSide:0,RhipSide:0,LankleX:0,RankleX:0,Lshoulder:0,Rshoulder:0,LwristX:0,RwristX:0,LwristY:0,RwristY:0,LwristZ:0,RwristZ:0,Lfingers:0,Rfingers:0,Lindex:0,Rindex:0,headX:0,headY:0});
 const p=2*Math.PI*hz*t,s=Math.sin(p),c=Math.cos(p),q=(1-c)/2,A=m.amplitude;
 const sides=m.side==='both'?['L','R']:[m.side==='left'?'L':'R'];
 const sideQ=side=>m.side==='both'?(side==='L'?(1-c)/2:(1+c)/2):q;
 const arm=(side,front,lateral=-1.42)=>{a[side+'upperX']=front;a[side+'arm']=(side==='L'?1:-1)*lateral;};
 switch(m.kind){
 case 'gait':{const b=originalPose(m.sourceClip,t,hz);return {...a,...b};}
 case 'jump':return {...a,...originalPose('jump',t,hz),hipY:.96+.3*A*Math.max(0,s)};
 case 'jack':return {...a,...originalPose('jack',t,hz)};
 case 'march':return {...a,...originalPose('march',t,hz)};
 case 'squat':{const angle=.95*A*q;Object.assign(a,{hipY:.96+.82*(Math.cos(angle)-1),hipZ:-.08*q,torsoX:.22*q,Lleg:-angle,Rleg:-angle,Lknee:2*angle,Rknee:2*angle,LupperX:-1.3*q,RupperX:-1.3*q,hipR:m.stance||0});break;}
 case 'calf':for(const side of sides)a[side+'ankleX']=.4*q;break;
 case 'toe':for(const side of sides)a[side+'ankleX']=-.3*q;break;
 case 'heelTap':for(const side of sides){const x=sideQ(side);a[side+'leg']=-.28*x;a[side+'ankleX']=-.28*x;}break;
 case 'legFront':for(const side of sides)a[side+'leg']=-.65*q;break;
 case 'legBack':for(const side of sides)a[side+'leg']=.4*q;break;
 case 'legSide':for(const side of sides)a[side+'hipSide']=(side==='L'?1:-1)*.5*q;break;
 case 'kneeLift':for(const side of sides){a[side+'leg']=-1.05*q;a[side+'knee']=1.1*q;}break;
 case 'hamCurl':for(const side of sides)a[side+'knee']=1.5*q;break;
 case 'frontKick':for(const side of sides){a[side+'leg']=-.95*q;a[side+'knee']=.55*Math.sin(p)**2;}break;
 case 'lunge':{const side=sides[0],other=side==='L'?'R':'L';a[side+'leg']=-.8*q;a[side+'knee']=1.3*q;a[other+'leg']=.42*q;a[other+'knee']=.6*q;a.hipY-=.2*q;a.torsoX=.1*q;break;}
 case 'sideLunge':{const side=sides[0];a[side+'hipSide']=(side==='L'?1:-1)*.55*q;a[side+'leg']=-.45*q;a[side+'knee']=.85*q;a.rootX=(side==='L'?1:-1)*.12*q;a.hipY-=.12*q;break;}
 case 'sideStep':a.LhipSide=.3*Math.max(0,s);a.RhipSide=-.3*Math.max(0,-s);a.rootX=.08*s;a.Lknee=.16*Math.max(0,s);a.Rknee=.16*Math.max(0,-s);break;
 case 'stepTouch':a.LhipSide=.2*q;a.RhipSide=-.2*(1-q);a.Lknee=.3*(1-q);a.Rknee=.3*q;a.rootX=.1*c;break;
 case 'highKnees':a.Lleg=-1.15*Math.max(0,s);a.Rleg=-1.15*Math.max(0,-s);a.Lknee=1.4*Math.max(0,s);a.Rknee=1.4*Math.max(0,-s);a.LupperX=.5*s;a.RupperX=-.5*s;a.Lelbow=a.Relbow=.7;break;
 case 'buttKicks':a.Lknee=1.6*Math.max(0,s);a.Rknee=1.6*Math.max(0,-s);a.LupperX=.35*s;a.RupperX=-.35*s;break;
 case 'frontRaise':for(const side of sides)arm(side,-1.5*q);break;
 case 'lateralRaise':for(const side of sides)arm(side,0,-1.42+1.45*q);break;
 case 'overhead':for(const side of sides)arm(side,-2.85*q);break;
 case 'elbowCurl':for(const side of sides)a[side+'elbow']=1.65*q;break;
 case 'shrug':for(const side of sides)a[side+'shoulder']=.055*q;break;
 case 'armCircle':for(const side of sides){arm(side,.42*s*m.direction,-.25+.38*c);a[side+'elbow']=.12;}break;
 case 'armSwing':for(const side of sides)arm(side,.65*s);break;
 case 'crossbody':arm('L',-1.2,-.9+.45*s);arm('R',-1.2,.0-.45*s-.9);a.Lelbow=.35;a.Relbow=.25;break;
 case 'chestOpen':for(const side of sides){arm(side,-1.3*(1-q),-.25-1.17*(1-q));a[side+'elbow']=.15;}break;
 case 'press':for(const side of sides){arm(side,0,.05+.95*q);a[side+'elbow']=1.5*(1-q);}break;
 case 'row':for(const side of sides){arm(side,-1.4+1.6*q);a[side+'elbow']=1.4*q;}a.torsoX=.12;break;
 case 'punch':for(const side of sides){const x=sideQ(side);arm(side,-1.2-.35*x);a[side+'elbow']=1.4*(1-x);}a.torsoY=.12*s;break;
 case 'wave':for(const side of sides){arm(side,0,.15);a[side+'elbow']=1.45;a[side+'wristZ']=.5*s;}break;
 case 'wristFlex':for(const side of sides){arm(side,-1.1);a[side+'elbow']=.2;a[side+'wristY']=(side==='L'?-1:1)*.6*s;}break;
 case 'wristTurn':for(const side of sides){arm(side,-.9);a[side+'elbow']=.4;a[side+'wristX']=.95*s;}break;
 case 'fist':for(const side of sides){arm(side,-.8);a[side+'fingers']=1.2*q;}break;
 case 'fingerTap':for(const side of sides){arm(side,-1);a[side+'index']=.8*q;}break;
 case 'trunkForward':a.torsoX=.6*q;a.Lleg=a.Rleg=-.08*q;break;
 case 'trunkExtend':a.torsoX=-.22*A*q;break;
 case 'bend':a.torsoZ=m.side==='both'?.35*s:(m.side==='left'?1:-1)*.35*q;break;
 case 'twist':a.torsoY=m.side==='both'?.65*s:(m.side==='left'?1:-1)*.65*q;break;
 case 'headNod':a.headX=.25*s;break;
 case 'headTurn':a.headY=.6*s;break;
 case 'balance':{const side=m.side==='right'?'L':'R';a[side+'leg']=-.8;a[side+'knee']=1.35;a.torsoZ=.025*s;a.Larm=-.45;a.Rarm=.45;break;}
 case 'weightShift':a.rootX=.09*s;a.torsoZ=-.08*s;a.Lknee=.12*Math.max(0,s);a.Rknee=.12*Math.max(0,-s);break;
 case 'tandem':a.Lleg=-.23;a.Rleg=.23;a.Lknee=.15+.1*s;a.Rknee=.15-.1*s;a.hipZ=.06*s;a.torsoX=.06*s;break;
 default:throw new Error('Unknown authored motion kind: '+m.kind);
 }
 return a;
}
