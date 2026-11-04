import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {createSkinnedRig} from '../src/skinnedRig.js';
import {sensors,motions} from '../src/data.js';
globalThis.ProgressEvent??=class {constructor(type,args){this.type=type;Object.assign(this,args)}};
const bytes=fs.readFileSync(new URL('../public/models/human.glb',import.meta.url));
const gltf=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
test('skinned human loads with real mesh, complete fingers, all anchors and 100 lazy animations',()=>{const rig=createSkinnedRig(gltf);assert.equal(rig.meshes.length,2);assert.ok(rig.meshes.reduce((n,m)=>n+m.geometry.attributes.position.count,0)>20000);assert.ok(rig.bones.LeftHandIndex2);assert.ok(rig.clips.size<100);for(const s of sensors)assert.ok(rig.sensorAnchors[s.id]);for(const id of ['walk','run'])assert.ok(rig.clips.get(id).tracks.length>100);
for(const motion of motions){rig.seek();rig.update(motion.id,0,1,true);rig.seek();for(let i=0;i<9;i++){rig.update(motion.id,rig.clips.get(motion.id).duration*i/8,.1,true);for(const b of Object.values(rig.bones))assert.ok([...b.position.toArray(),...b.quaternion.toArray()].every(Number.isFinite));rig.meshes.forEach(m=>{const v=m.getVertexPosition(0,new T.Vector3());assert.ok(v.toArray().every(Number.isFinite))});}}
});
test('squat actually bends mesh skeleton, feet remain near ground and seeking is deterministic',()=>{const rig=createSkinnedRig(gltf);rig.ensureClip('squat');const t=rig.clips.get('squat').duration/2;rig.update('squat',t,1,true);assert.ok(rig.bones.LeftUpLeg.quaternion.x<-.3);assert.ok(rig.bones.LeftLeg.quaternion.x>.6);const first=rig.bones.LeftFoot.getWorldPosition(new T.Vector3());assert.ok(first.y>.0&&first.y<.2);rig.update('run',.25,1,true);rig.update('squat',t,1,true);assert.ok(first.distanceTo(rig.bones.LeftFoot.getWorldPosition(new T.Vector3()))<1e-6);});
