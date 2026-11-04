import * as T from 'three';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {sensors,motions} from './data.js';
import {catalogPose as targetPose} from './exercisePose.js';
import {motionById} from './motionCatalog.js';
const vec=new T.Vector3(),axisX=new T.Vector3(1,0,0),axisY=new T.Vector3(0,1,0),axisZ=new T.Vector3(0,0,1);
export async function loadHuman(){return createSkinnedRig(await new GLTFLoader().loadAsync(import.meta.env.BASE_URL+'models/human.glb'));}
export function createSkinnedRig(gltf){
 const root=new T.Group(),model=clone(gltf.scene);root.add(model);const bones={},meshes=[];model.traverse(o=>{if(o.isBone)bones[o.name.replace(/mixamorig[:]?/,'')]=o;if(o.isSkinnedMesh){o.material=new T.MeshStandardMaterial({color:o.name.includes('Joints')?0xa8bdcb:0xc2d2dc,roughness:.52,metalness:.12});o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;meshes.push(o);}});
 const rest=new Map(Object.values(bones).map(b=>[b,{p:b.position.clone(),q:b.quaternion.clone(),s:b.scale.clone()}]));
 const restore=()=>{for(const [b,r]of rest){b.position.copy(r.p);b.quaternion.copy(r.q);b.scale.copy(r.s);}root.position.set(0,0,0);root.updateMatrixWorld(true);};
 const rotate=(name,axis,angle)=>bones[name].quaternion.multiply(new T.Quaternion().setFromAxisAngle(axis,angle));
 const world=name=>bones[name].getWorldPosition(new T.Vector3());
 restore();const height=new T.Box3().setFromObject(model,true);root.position.y=-height.min.y;const groundOffset=root.position.y;
 function procedural(id,t,hz){restore();const a=targetPose(id,t,hz),hip=bones.Hips;hip.position.y+=(a.hipY-.96)*100;hip.position.z+=(a.hipZ||0)*100;rotate('Spine',axisX,(a.torsoX||0)*.6);rotate('Spine1',axisX,(a.torsoX||0)*.4);rotate('Spine',axisY,a.torsoY*.5);rotate('Spine1',axisY,a.torsoY*.5);hip.position.x+=(a.rootX||0)*100;rotate('Head',axisX,a.headX||0);rotate('Head',axisY,a.headY||0);rotate('Spine',axisZ,a.torsoZ*.5);rotate('Spine1',axisZ,a.torsoZ*.5);
 for(const side of ['L','R']){const prefix=side==='L'?'Left':'Right',sign=side==='L'?1:-1;rotate(prefix+'Arm',axisX,a[side+'upperX']);rotate(prefix+'Arm',axisZ,a[side+'arm']);rotate(prefix+'ForeArm',axisY,-sign*a[side+'elbow']);rotate(prefix+'UpLeg',axisX,a[side+'leg']);rotate(prefix+'UpLeg',axisZ,sign*a.hipR+(a[side+'hipSide']||0));rotate(prefix+'Leg',axisX,a[side+'knee']);rotate(prefix+'Foot',axisX,-a[side+'leg']-a[side+'knee']+(a[side+'ankleX']||0));bones[prefix+'Shoulder'].position.y+=(a[side+'shoulder']||0)*100;for(const [axis,key]of [[axisX,'wristX'],[axisY,'wristY'],[axisZ,'wristZ']])rotate(prefix+'Hand',axis,a[side+key]||0);for(const finger of ['Thumb','Index','Middle','Ring','Pinky'])for(let joint=1;joint<=3;joint++)rotate(prefix+'Hand'+finger+joint,axisY,-sign*((a[side+'fingers']||0)+(finger==='Index'?(a[side+'index']||0):0))*(finger==='Thumb'?.5:.7));}
 root.position.y=groundOffset;root.updateMatrixWorld(true);
 // Ground constraint for authored exercises. Airborne motions retain their jump height.
 if(id&&!['jump','jack'].includes(motionById.get(id)?.kind)){const sole=Math.min(...['LeftFoot','RightFoot','LeftToeBase','RightToeBase'].map(n=>world(n).y));root.position.y+=restSole-sole;root.updateMatrixWorld(true);}
 }
 root.updateMatrixWorld(true);const restSole=Math.min(...['LeftFoot','RightFoot','LeftToeBase','RightToeBase'].map(n=>world(n).y));
 // All procedural exercises are baked as quaternion tracks on this exact skeleton.
 const clips=new Map();
 for(const motion of motions.filter(m=>m.sourceClip)){const source=gltf.animations.find(a=>a.name===motion.sourceClip);if(!source)throw new Error('Required animation missing: '+motion.sourceClip);const clip=source.clone();clip.name=motion.id;clip.tracks=clip.tracks.filter(t=>!t.name.endsWith('.scale'));const pace=motion.pace||1;for(const track of clip.tracks)track.times=Float32Array.from(track.times,t=>t/pace);clip.duration=source.duration/pace;clips.set(motion.id,clip);motion.hz=1/clip.duration;motion.duration=clip.duration*8;}
 function bake(motion){const times=[],qs=new Map(Object.keys(bones).map(n=>[n,[]])),positions=[];const duration=1/motion.hz,steps=72;for(let i=0;i<=steps;i++){const t=i/steps*duration;procedural(motion.id,t,motion.hz);times.push(t);for(const n of Object.keys(bones))bones[n].quaternion.toArray(qs.get(n),i*4);positions.push(bones.Hips.position.x,bones.Hips.position.y+root.position.y*100,bones.Hips.position.z);}const tracks=[...qs].map(([n,v])=>new T.QuaternionKeyframeTrack(bones[n].name+'.quaternion',times,v));tracks.push(new T.VectorKeyframeTrack(bones.Hips.name+'.position',times,positions));for(const side of ['Left','Right']){const values=[];for(const time of times)values.push(...rest.get(bones[side+'Shoulder']).p.toArray().map((v,i)=>v+(i===1?(targetPose(motion.id,time,motion.hz)[(side==='Left'?'L':'R')+'shoulder']||0)*100:0)));tracks.push(new T.VectorKeyframeTrack(bones[side+'Shoulder'].name+'.position',times,values));}return new T.AnimationClip(motion.id,duration,tracks);}
 restore();root.position.y=groundOffset;root.updateMatrixWorld(true);meshes.forEach(m=>m.skeleton.update());
 // Sensor coordinates are rebuilt for this model, including individual finger bones.
 const anchors={};const ray=new T.Raycaster();
 function anchor(s,bone,point){root.updateMatrixWorld(true);const origin=point.clone();origin.z=.8;ray.set(origin,new T.Vector3(0,0,-1));const hit=ray.intersectObjects(meshes,false)[0];if(hit&&Math.abs(hit.point.z-point.z)<.25)point=hit.point.clone().add(new T.Vector3(0,0,.012));else point.z+=.018;const g=new T.Group();g.name='sensor-anchor-'+s.id;g.position.copy(bone.worldToLocal(point.clone()));g.scale.setScalar(100);bone.add(g);anchors[s.id]=g;}
 const lerp=(a,b,f)=>world(a).lerp(world(b),f);
 for(const s of sensors){const side=s.id.includes('-L-')?'Left':'Right',i=Number(s.id.split('-').at(-1))-1;let bone,point;
 if(s.category==='middle'){const names=['Spine2','Spine1','Spine','Hips'];bone=bones[names[i]];point=world(names[i]);point.y+=i===3?.12:.025;point.z=.13;}
 else if(s.category==='edge'){const name=side+(i<3?'Arm':'ForeArm');bone=bones[name];point=lerp(name,side+(i<3?'ForeArm':'Hand'),i<3?[.02,.35,.75][i]:[.22,.72][i-3]);point.z=.075;}
 else if(s.category==='gloves'){const suffix=i===0?'Hand':['HandThumb2','HandIndex2','HandMiddle2','HandRing2','HandPinky2'][i-1];bone=bones[side+suffix];point=world(side+suffix);if(!i)point=lerp(side+'Hand',side+'HandMiddle1',.55);point.z+=.025;}
 else if(s.category==='pants'){const name=side+(i<2?'UpLeg':'Leg');bone=bones[name];point=lerp(name,side+(i<2?'Leg':'Foot'),i%2?.78:.24);point.z+=i<2?.09:.06;}
 else{bone=bones[side+(i?'ToeBase':'Foot')];point=world(side+(i?'ToeBase':'Foot'));point.y+=.045;}
 anchor(s,bone,point);}
 const samplers=new Map();
 function ensureClip(id){if(!id||samplers.has(id))return;const before=capture();if(!clips.has(id)){const rootPosition=root.position.clone();clips.set(id,bake(motionById.get(id)));for(const [b,r]of before){b.position.copy(r.p);b.quaternion.copy(r.q);}root.position.copy(rootPosition);}if(!samplers.has(id))samplers.set(id,clips.get(id).tracks.map(track=>{const binding=T.PropertyBinding.parseTrackName(track.name),node=model.getObjectByName(binding.nodeName);if(!node)throw new Error('Unbound animation track: '+track.name);return {node,property:binding.propertyName,interpolant:track.createInterpolant()};}));}
 const capture=()=>new Map([...rest.keys()].map(b=>[b,{p:b.position.clone(),q:b.quaternion.clone()}]));let active=null,blend=null;
 const bindPose=capture();
 function setMotion(id){blend={from:capture(),elapsed:0};active=id;}
 function update(id,time,dt,playing){ensureClip(id);if(id!==active)setMotion(id);
 if(id){for(const [b,r]of rest){b.position.copy(r.p);b.quaternion.copy(r.q);b.scale.copy(r.s);}const sampleTime=time%clips.get(id).duration;for(const {node,property,interpolant}of samplers.get(id))node[property].fromArray(interpolant.evaluate(sampleTime));root.position.y=groundOffset;const hip=bones.Hips;if(motionById.get(id)?.sourceClip){hip.position.x=rest.get(hip).p.x;hip.position.z=rest.get(hip).p.z;}
 }else{for(const [b,r]of bindPose){b.position.copy(r.p);b.quaternion.copy(r.q);}root.position.y=groundOffset;}
 if(blend){if(playing||!id)blend.elapsed+=dt;const x=Math.min(1,blend.elapsed/.35),alpha=x*x*(3-2*x);for(const [b,r]of blend.from){b.position.lerpVectors(r.p,b.position,alpha);b.quaternion.slerpQuaternions(r.q,b.quaternion.clone(),alpha);}if(x===1)blend=null;}
 root.updateMatrixWorld(true);if(motionById.get(id)?.sourceClip){// correct only penetration; retain the run's airborne phase
 const sole=Math.min(...['LeftFoot','RightFoot','LeftToeBase','RightToeBase'].map(n=>world(n).y));if(sole<restSole){root.position.y+=restSole-sole;root.updateMatrixWorld(true);}}
 meshes.forEach(m=>m.skeleton.update());
 }
 const seek=()=>{blend=null;};
 return {ensureClip,root,bones,sensorAnchors:anchors,clips,meshes,update,setMotion,seek,capture,model,restSole};
}
