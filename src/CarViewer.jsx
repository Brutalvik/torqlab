import {useSelector} from 'react-redux';
import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
export default function CarViewer(){
 const paint=useSelector(s=>s.booking.paint);
 const host=useRef(null);const [status,setStatus]=useState('Loading your workshop…');
 useEffect(()=>{
 let disposed=false,model,frame; const el=host.current;let renderer;
 try {renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});}catch{setStatus('3D preview is unavailable on this device. You can still explore our services below.');return;}
 renderer.setClearColor(0x000000,0);renderer.setClearAlpha(0);
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;el.appendChild(renderer.domElement);
 const scene=new THREE.Scene();scene.background=null;const camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(5.4,2.25,5.4);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=true;controls.minDistance=3.6;controls.maxDistance=15;controls.maxPolarAngle=Math.PI*.49;controls.target.set(0,.7,0);controls.autoRotateSpeed=.65;controls.autoRotate=true;
 let resumeRotation;
 const pauseRotation=()=>{clearTimeout(resumeRotation);controls.autoRotate=false;};
 const resumeShowcase=()=>{clearTimeout(resumeRotation);resumeRotation=setTimeout(()=>{if(!disposed)controls.autoRotate=true;},2000);};
 controls.addEventListener('start',pauseRotation);controls.addEventListener('end',resumeShowcase);
 const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),environment=pmrem.fromScene(room,.08);scene.environment=environment.texture;scene.environmentIntensity=.55;room.dispose();pmrem.dispose();
 scene.add(new THREE.HemisphereLight(0xe5f0f4,0x42504b,2));const light=new THREE.DirectionalLight(0xfff3df,2.4);light.position.set(3,7,5);scene.add(light);
 
 const frameCar=(name='Perspective')=>{const directions={Perspective:[1,.29,1],Side:[1,.13,0],Front:[0,.17,1]};const direction=new THREE.Vector3(...directions[name]).normalize();const halfFov=THREE.MathUtils.degToRad(camera.fov/2);const distance=Math.max(3.8,2.85/(Math.tan(halfFov)*Math.min(camera.aspect,1.7)));controls.target.set(0,.7,0);camera.position.copy(controls.target).addScaledVector(direction,distance);controls.update();};
 let viewport={x:0,width:1,height:1};
 const resize=()=>{const w=el.clientWidth,h=el.clientHeight;const reserved=window.innerWidth>760?Math.round(w*.39):0;viewport={x:reserved,width:w-reserved,height:h};renderer.setSize(w,h);camera.aspect=viewport.width/h;camera.updateProjectionMatrix();frameCar();};const observer=new ResizeObserver(resize);observer.observe(el);resize();
 const disposeModel=(root)=>root.traverse(o=>{if(o.isMesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material]){for(const value of Object.values(m))if(value?.isTexture)value.dispose();m.dispose();}}});
 new GLTFLoader().load('/models/bmw-m5.glb',g=>{if(disposed){disposeModel(g.scene);return;}model=g.scene;const bounds=new THREE.Box3().setFromObject(model),size=bounds.getSize(new THREE.Vector3());model.scale.setScalar(5.1/Math.max(size.x,size.y,size.z));const box=new THREE.Box3().setFromObject(model),center=box.getCenter(new THREE.Vector3());model.position.sub(new THREE.Vector3(center.x,box.min.y,center.z));
 model.traverse(o=>{if(!o.isMesh)return;for(const m of Array.isArray(o.material)?o.material:[o.material]){m.envMapIntensity=.55;if(m.transmission>0){m.transmission=0;m.transparent=true;m.opacity=/Window/i.test(m.name) ? 0.38 : 0.65;m.depthWrite=false;m.roughness=.12;m.needsUpdate=true;}if(/Paint/i.test(m.name)){m.color.set(paint.hex);m.roughness=paint.roughness;m.metalness=paint.metalness;if('clearcoat' in m){m.clearcoat=.24;m.clearcoatRoughness=.28;}if('specularIntensity' in m)m.specularIntensity=.4;}if(/Interior|Carbon/i.test(m.name)){m.roughness=Math.max(m.roughness,.6);} }});scene.add(model);frameCar();setStatus('');},p=>{if(p.total)setStatus(`Preparing 3D model · ${Math.round(p.loaded/p.total*100)}%`);},()=>setStatus('The model could not load. Refresh to try again.'));
 const clock=new THREE.Clock();const tick=()=>{frame=requestAnimationFrame(tick);controls.update(clock.getDelta());renderer.setScissorTest(false);renderer.setViewport(0,0,el.clientWidth,el.clientHeight);renderer.clear();renderer.setViewport(viewport.x,0,viewport.width,viewport.height);renderer.setScissor(viewport.x,0,viewport.width,viewport.height);renderer.setScissorTest(true);renderer.render(scene,camera)};tick();
 return()=>{disposed=true;clearTimeout(resumeRotation);controls.removeEventListener('start',pauseRotation);controls.removeEventListener('end',resumeShowcase);cancelAnimationFrame(frame);observer.disconnect();controls.dispose();if(model)disposeModel(model);environment.dispose();renderer.dispose();renderer.domElement.remove();};
 },[]);
 return <div className="viewer"><div className="viewer-top"><span><i className="live-dot"/> THE DRIVEWAY EXPERIENCE</span><span className="paint-label"><i style={{background:paint.hex}}/>{paint.name}</span></div><div ref={host} className="canvas-host" aria-label="Interactive car model. Drag to orbit, scroll or pinch to zoom, right drag or two-finger drag to pan."/>{status&&<div className="model-status" role="status">{status}</div>}<p className="drag-hint">Drag to explore <span>·</span> Scroll or pinch to zoom</p></div>
}
