"use strict";var Ce=Object.create;var _=Object.defineProperty;var Ee=Object.getOwnPropertyDescriptor;var Ie=Object.getOwnPropertyNames;var Re=Object.getPrototypeOf,Me=Object.prototype.hasOwnProperty;var De=(t,e)=>{for(var o in e)_(t,o,{get:e[o],enumerable:!0})},ne=(t,e,o,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of Ie(e))!Me.call(t,n)&&n!==o&&_(t,n,{get:()=>e[n],enumerable:!(i=Ee(e,n))||i.enumerable});return t};var E=(t,e,o)=>(o=t!=null?Ce(Re(t)):{},ne(e||!t||!t.__esModule?_(o,"default",{value:t,enumerable:!0}):o,t)),$e=t=>ne(_({},"__esModule",{value:!0}),t);var ke={};De(ke,{activate:()=>Se});module.exports=$e(ke);var P=E(require("vscode")),be=E(require("fs"));var oe=E(require("os"));function Y(t){return t.type==="lldb"?"watch":"repl"}async function I(t,e,o,i){let n=Y(t);return Promise.race([t.customRequest("evaluate",{expression:e,frameId:o,context:n}),new Promise((r,s)=>setTimeout(()=>s(new Error("Evaluation request timed out")),i))])}async function N(t){try{let e=await t.customRequest("threads",{});if(e.threads&&e.threads.length>0){let o=e.threads[0].id,i=await t.customRequest("stackTrace",{threadId:o,startFrame:0,levels:1});if(i.stackFrames&&i.stackFrames.length>0)return i.stackFrames[0].id}}catch(e){console.log("Error getting frame ID:",e)}return 0}async function B(t,e,o,i){let r=oe.cpus().length||4,s=Math.min(8,Math.max(2,r)),c=Math.ceil(o/8388608),l=new Array(c).fill(null),a=0,w=0,p=!1,g=async()=>{for(;a<c&&!p;){let x=a++,d=x*8388608,f=Math.min(8388608,o-d);try{let m=await t.customRequest("readMemory",{memoryReference:e,offset:d,count:f});if(m&&m.data&&!p){let y=Buffer.from(m.data,"base64");if(l[x]=y,w+=y.length,i){let b=Math.round(w/o*100);i.report({message:`Reading memory: ${b}% (${Math.round(w/1024/1024)}MB / ${Math.round(o/1024/1024)}MB)`,increment:y.length/o*100})}}else p||(console.error(`readMemory returned no data for chunk ${x}`),p=!0)}catch(m){console.error(`Error reading memory chunk ${x}:`,m.message||m),p=!0}}},u=Array(s).fill(null).map(()=>g());if(await Promise.all(u),p||l.some(x=>x===null)){let x=l.filter(d=>d!==null);return x.length===0?null:Buffer.concat(x)}return Buffer.concat(l)}async function D(t,e,o,i,n){for(let r of o)try{let s=await t.customRequest("evaluate",{expression:r,frameId:i,context:n});if(s&&s.result){let c=s.result.match(/0x[0-9a-fA-F]+/);if(c)return c[0]}if(s&&s.memoryReference)return s.memoryReference}catch(s){console.log(`Expression "${r}" failed:`,s)}return null}function z(t){return t.type==="lldb"}function q(t){return t.type==="cppdbg"}function J(t){return t.type==="cppvsdbg"}function re(t){let e=t.type||"",o=e.includes("std::vector<cv::Point3d>")||e.includes("std::vector<cv::Point3_<double>")||e.includes("std::__1::vector<cv::Point3_<double>")||e.includes("class std::vector<class cv::Point3_<double>")||/std::.*vector\s*<\s*cv::Point3d\s*>/.test(e)||/std::.*vector\s*<\s*cv::Point3_<double>/.test(e),i=e.includes("std::vector<cv::Point3f>")||e.includes("std::vector<cv::Point3_<float>")||e.includes("std::__1::vector<cv::Point3_<float>")||e.includes("class std::vector<class cv::Point3_<float>")||/std::.*vector\s*<\s*cv::Point3f\s*>/.test(e)||/std::.*vector\s*<\s*cv::Point3_<float>/.test(e),n=/std::.*vector\s*<\s*cv::Point3[fd]?\s*>/.test(e);return{isPoint3:o||i||n,isDouble:o}}function ae(t){let e=t.type||"";return e.includes("cv::Mat")||e.includes("class cv::Mat")||e.includes("class cv::Mat")||/cv::Mat_</.test(e)||/cv::Mat\b/.test(e)}function se(t){if(!t||typeof t!="object")return{isPCL:!1,hasRGB:!1};let e=(t.type||"").trim(),o=t.result||"",i=e;if(/::Ptr(?:\s*=\s*shared_ptr<.*>)?$/.test(e)&&(i=e.replace(/::Ptr(?:\s*=\s*shared_ptr<.*>)?$/,"").trim()),!(i.includes("pcl::PointCloud<")||i.includes("class pcl::PointCloud<")||/^PointCloud<.*>/.test(i)||/PointCloud<.*>.*\bpoints\b/.test(o)&&o.includes("<")))return{isPCL:!1,hasRGB:!1};let s="",c=i.match(/pcl::PointCloud<\s*(?:pcl::)?([^>\s]+)\s*>/);if(c)s=c[1];else{let a=o.match(/PointCloud<\s*([^>\s]+)\s*>/);a&&(s=a[1])}return s=s.replace(/^class\s+/,""),{isPCL:!0,hasRGB:s==="PointXYZRGB"||s==="PointXYZRGBA"||s==="pcl::PointXYZRGB"||s==="pcl::PointXYZRGBA"}}function K(t){switch(t){case 0:case 1:return 1;case 2:case 3:return 2;case 4:case 5:return 4;case 6:return 8;default:return 1}}async function ie(t,e,o,i){try{let n=`hasattr(${e}, 'shape') and hasattr(${e}, 'dtype') and str(type(${e})) == "<class 'numpy.ndarray'>"`;return(await t.customRequest("evaluate",{expression:n,frameId:o,context:"repl"})).result==="True"}catch{return!1}}async function ce(t,e,o,i){try{let n=`str(type(${e})) == "<class 'PIL.Image.Image'>"`;return(await t.customRequest("evaluate",{expression:n,frameId:o,context:"repl"})).result==="True"}catch{return!1}}async function le(t,e,o,i){try{let n=`hasattr(${e}, 'shape') and hasattr(${e}, 'device') and str(type(${e})) == "<class 'torch.Tensor'>"`;return(await t.customRequest("evaluate",{expression:n,frameId:o,context:"repl"})).result==="True"}catch{return!1}}async function de(t,e,o,i){try{if((await t.customRequest("evaluate",{expression:`str(type(${e}))`,frameId:o,context:"watch"})).result.includes("open3d.cpu.pybind.geometry.PointCloud")){let s=await t.customRequest("evaluate",{expression:`${e}.has_colors()`,frameId:o,context:"watch"});return{isO3D:!0,hasColors:s.result==="True"||s.result===!0}}let r=await t.customRequest("evaluate",{expression:`hasattr(${e}, 'points')`,frameId:o,context:"watch"});return r.result==="True"||r.result===!0?{isO3D:!0,hasColors:!1}:{isO3D:!1,hasColors:!1}}catch(n){return console.error("Open3D type check error:",n),{isO3D:!1,hasColors:!1}}}async function pe(t,e,o){let i=`
(__import__("numpy").array(${o}).ndim == 2 and
 __import__("numpy").array(${o}).shape[1] == 3)
`;try{let n=await t.customRequest("evaluate",{expression:i,frameId:e,context:"watch"});return String(n.result).trim()==="True"}catch{return!1}}var h=E(require("vscode"));function V(){return`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>3D Point Viewer</title>
      <style>
          body { margin: 0; overflow: hidden; font-family: Arial, sans-serif; background: #1a1a2e; color: white; }
          #loadingInfo {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              text-align: center;
              background: rgba(0, 0, 0, 0.7);
              padding: 20px;
              border-radius: 8px;
              z-index: 1000;
          }
          #loadingInfo h3 { margin: 0 0 10px; font-size: 18px; }
          #loadingInfo p { margin: 5px 0; opacity: 0.8; }
  
          /* \u590D\u7528\u4F60\u539F\u6709\u7684 UI \u5143\u7D20\u6837\u5F0F\uFF08\u9690\u85CF\u76F4\u5230\u6570\u636E\u52A0\u8F7D\uFF09 */
          #info, #controls, #axisView, #colorbar {
              display: none;
          }
          #info {
              position: absolute;
              top: 10px;
              left: 10px;
              background: rgba(0, 0, 0, 0.7);
              color: white;
              padding: 10px 15px;
              border-radius: 5px;
              font-size: 14px;
              z-index: 100;
          }
          #info h3 { margin: 0 0 8px 0; font-size: 16px; }
          #info p { margin: 4px 0; }
          #controls {
              position: absolute;
              top: 10px;
              right: 10px;
              background: rgba(0, 0, 0, 0.7);
              color: white;
              padding: 10px 15px;
              border-radius: 5px;
              z-index: 100;
          }
          #controls button {
              background: #4a9eff;
              color: white;
              border: none;
              padding: 8px 12px;
              margin: 3px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 12px;
          }
          #controls button:hover { background: #3a8eef; }
          #controls button.active { background: #2a7edf; }
          #controls label { font-size: 12px; margin-right: 5px; }
          #controls input[type="number"] {
              width: 60px;
              padding: 4px;
              border: 1px solid #555;
              border-radius: 3px;
              background: #333;
              color: white;
              font-size: 12px;
          }
          #axisView {
              position: absolute;
              bottom: 10px;
              right: 10px;
              width: 120px;
              height: 120px;
              background: rgba(20, 20, 30, 0.9);
              border-radius: 5px;
              border: 1px solid rgba(255, 255, 255, 0.3);
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
          }
          #axisView svg {
              width: 100%;
              height: 100%;
              display: block;
          }
          #colorbar {
              position: absolute;
              bottom: 140px;
              right: 10px;
              background: rgba(0, 0, 0, 0.7);
              color: white;
              padding: 10px;
              border-radius: 5px;
              display: none;
          }
          #colorbar-gradient {
              width: 20px;
              height: 120px;
              background: linear-gradient(to top, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000);
              margin-right: 10px;
          }
          #colorbar-labels {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              height: 120px;
              font-size: 11px;
          }
          #colorbar-container { display: flex; }
      </style>
      <script type="importmap">
      {
          "imports": {
              "three": "https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.module.js",
              "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.149.0/examples/jsm/"
          }
      }
      </script>
  </head>
  <body>
      <div id="loadingInfo">
          <h3>Loading Point Cloud</h3>
          <p>Please wait while data is being prepared...</p>
      </div>
  
      <!-- \u9884\u7559 UI \u5BB9\u5668\uFF08\u521D\u59CB\u9690\u85CF\uFF09 -->
      <div id="info">
          <h3>Point Cloud Viewer</h3>
          <p>Points: <span id="pointCount">0</span></p>
          <p>X Range: <span id="boundsX">-</span></p>
          <p>Y Range: <span id="boundsY">-</span></p>
          <p>Z Range: <span id="boundsZ">-</span></p>
      </div>
      <div id="controls">
          <div style="margin-bottom: 8px;">
              <label>Point Size:</label>
              <input type="number" id="pointSizeInput" value="0.1" step="0.05" min="0.01" max="20">
          </div>
          <button id="btnResetView">Reset View</button>
          <button id="btnSavePointCloud" style="margin-top: 8px; background: #28a745;">Save PCD</button>
      </div>
      <div id="axisView"></div>
      <div id="colorbar">
          <div id="colorbar-container">
              <div id="colorbar-gradient"></div>
              <div id="colorbar-labels">
                  <span id="colorbar-max">1.0</span>
                  <span id="colorbar-mid">0.5</span>
                  <span id="colorbar-min">0.0</span>
              </div>
          </div>
      </div>
  
      <script type="module">
          import * as THREE from 'three';
          import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  
          let points = null;
          let isColor = false;
          let scene, camera, renderer, controls, pointsObj;
  
          const vscode = acquireVsCodeApi();
  
          // ======================
          // \u6838\u5FC3\uFF1A\u76D1\u542C\u4E3B\u8FDB\u7A0B\u6D88\u606F
          // ======================
          window.addEventListener('message', event => {
              const message = event.data;
              if (message.type === 'initPointCloud') {
                  points = message.pointsArray;
                  isColor = message.hasColor;
                  initializeViewer();
              } else if (message.type === 'error') {
                  document.getElementById('loadingInfo').innerHTML = 
                      '<h3>Error</h3><p>' + message.message + '</p>';
              }
          });
  
          function initializeViewer() {
              // \u9690\u85CF loading
              document.getElementById('loadingInfo').style.display = 'none';
              // \u663E\u793A UI
              document.getElementById('info').style.display = 'block';
              document.getElementById('controls').style.display = 'block';
              document.getElementById('axisView').style.display = 'block';
  
              // Calculate bounds
                let minX = Infinity, maxX = -Infinity;
                let minY = Infinity, maxY = -Infinity;
                let minZ = Infinity, maxZ = -Infinity;

                points.forEach(p => {
                    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
                    minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
                    minZ = Math.min(minZ, p.z); maxZ = Math.max(maxZ, p.z);
                });
  
              document.getElementById('pointCount').textContent = points.length;
              document.getElementById('boundsX').textContent = \`[\${minX.toFixed(2)}, \${maxX.toFixed(2)}]\`;
              document.getElementById('boundsY').textContent = \`[\${minY.toFixed(2)}, \${maxY.toFixed(2)}]\`;
              document.getElementById('boundsZ').textContent = \`[\${minZ.toFixed(2)}, \${maxZ.toFixed(2)}]\`;
  
              scene = new THREE.Scene();
              scene.background = new THREE.Color(0x1a1a2e);
  
              camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100000);
              renderer = new THREE.WebGLRenderer({ antialias: true });
              renderer.setSize(window.innerWidth, window.innerHeight);
              renderer.autoClear = false;
              document.body.appendChild(renderer.domElement);
  
              const geometry = new THREE.BufferGeometry();
              const positions = new Float32Array(points.length * 3);
              const colors = new Float32Array(points.length * 3);
  
              points.forEach((p, i) => {
                  positions[i * 3] = p.x;
                  positions[i * 3 + 1] = p.z;
                  positions[i * 3 + 2] = -p.y;
  
                  colors[i * 3] = 0.5;
                  colors[i * 3 + 1] = 0.7;
                  colors[i * 3 + 2] = 1.0;
              });
  
              geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
              geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
              const size_range = Math.max(maxX - minX, maxY - minY, maxZ - minZ) || 1;
              let currentPointSize = Math.min(0.1, size_range / 1000);
              currentPointSize = Math.max(0.001, currentPointSize);
              document.getElementById('pointSizeInput').value = currentPointSize;
  
              const material = new THREE.PointsMaterial({
                  size: currentPointSize,
                  vertexColors: true,
                  sizeAttenuation: true
              });
  
              pointsObj = new THREE.Points(geometry, material);
              scene.add(pointsObj);
  
              controls = new OrbitControls(camera, renderer.domElement);
  
              function resetView() {
                  const centerX = (minX + maxX) / 2;
                  const centerY = (minZ + maxZ) / 2;
                  const centerZ = -(minY + maxY) / 2;
                  const dist = Math.max(maxX - minX, maxY - minY, maxZ - minZ);
                  camera.position.set(centerX + dist, centerY + dist, centerZ + dist);
                  camera.lookAt(centerX, centerY, centerZ);
                  controls.target.set(centerX, centerY, centerZ);
                  controls.update();
              }
  
              resetView();
  
              function updateColors(mode) {
                  const colorAttr = geometry.attributes.color;
                  const colorbar = document.getElementById('colorbar');
                  const colorbarMax = document.getElementById('colorbar-max');
                  const colorbarMid = document.getElementById('colorbar-mid');
                  const colorbarMin = document.getElementById('colorbar-min');
  
                  if (mode === 'color') {
                      colorbar.style.display = 'none';
                      for (let i = 0; i < points.length; i++) {
                          const p = points[i];
                          colorAttr.setXYZ(i, p.r/255, p.g/255, p.b/255);
                      }
                  } else if (mode === 'solid') {
                      colorbar.style.display = 'none';
                      for (let i = 0; i < points.length; i++) {
                          colorAttr.setXYZ(i, 0.5, 0.7, 1.0);
                      }
                  } else {
                      colorbar.style.display = 'block';
                      let min, max;
                      if (mode === 'x') { min = minX; max = maxX; }
                      else if (mode === 'y') { min = minY; max = maxY; }
                      else if (mode === 'z') { min = minZ; max = maxZ; }
  
                      colorbarMax.textContent = max.toFixed(2);
                      colorbarMid.textContent = ((min + max) / 2).toFixed(2);
                      colorbarMin.textContent = min.toFixed(2);
  
                      const range = max - min || 1;
                      for (let i = 0; i < points.length; i++) {
                          const p = points[i];
                          let val = mode === 'x' ? p.x : mode === 'y' ? p.y : p.z;
                          const t = (val - min) / range;
  
                          let jetR = 0, jetG = 0, jetB = 0;
                          if (t < 0.25) { jetR = 0; jetG = 4 * t; jetB = 1; }
                          else if (t < 0.5) { jetR = 0; jetG = 1; jetB = 1 - 4 * (t - 0.25); }
                          else if (t < 0.75) { jetR = 4 * (t - 0.5); jetG = 1; jetB = 0; }
                          else { jetR = 1; jetG = 1 - 4 * (t - 0.75); jetB = 0; }
  
                          colorAttr.setXYZ(i, jetR, jetG, jetB);
                      }
                  }
                  colorAttr.needsUpdate = true;
              }
  
              if (isColor) updateColors('color');
              else updateColors('z');
  
              document.getElementById('btnResetView').onclick = resetView;
              document.getElementById('pointSizeInput').oninput = (e) => {
                  material.size = parseFloat(e.target.value);
              };
              document.getElementById('btnSavePointCloud').onclick = () => {
                  vscode.postMessage({ command: 'savePcd' });
              };
  
              // Axis view SVG (\u7B80\u5316\u7248\uFF0C\u53EF\u6309\u9700\u589E\u5F3A)
              const axisContainer = document.getElementById('axisView');
              const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
              svg.setAttribute('viewBox', '0 0 120 120');
              axisContainer.appendChild(svg);
  
            //   function updateAxisView() {
            //       svg.innerHTML = '';
            //       // \u7B80\u5316\uFF1A\u56FA\u5B9A XYZ \u8F74\uFF08\u5B9E\u9645\u53EF\u6309\u76F8\u673A\u65B9\u5411\u66F4\u65B0\uFF09
            //       drawArrow(svg, 60, 60, 90, 60, '#ff3333', 'X');
            //       drawArrow(svg, 60, 60, 60, 30, '#33ff33', 'Y');
            //       drawArrow(svg, 60, 60, 60, 90, '#3333ff', 'Z');
            //   }
                // Function to update axis arrows based on camera direction
                function updateAxisView() {
                    // Clear previous content
                    svg.innerHTML = '';
                    
                    // Get camera basis vectors
                    const cameraDir = new THREE.Vector3();
                    camera.getWorldDirection(cameraDir);
                    const cameraUp = camera.up.clone();
                    const cameraRight = new THREE.Vector3();
                    cameraRight.crossVectors(cameraDir, cameraUp).normalize();
                    const cameraUpCorrected = new THREE.Vector3();
                    cameraUpCorrected.crossVectors(cameraRight, cameraDir).normalize();
                    
                    // Define axis directions in world space
                    const worldX = new THREE.Vector3(1, 0, 0);
                    const worldY = new THREE.Vector3(0, 0, -1); // Y is forward (negative Z in Three.js)
                    const worldZ = new THREE.Vector3(0, 1, 0);
                    
                    // Project to 2D using camera basis
                    // Project onto the plane perpendicular to camera direction
                    function project3DTo2D(worldVec) {
                        // Project onto camera right and up vectors
                        const projRight = worldVec.dot(cameraRight);
                        const projUp = worldVec.dot(cameraUpCorrected);
                        return { x: projRight, y: projUp };
                    }
                    
                    const centerX = 60, centerY = 60;
                    const axisLength = 30;
                    const arrowSize = 8;
                    
                    // Project axes
                    const xProj = project3DTo2D(worldX);
                    const yProj = project3DTo2D(worldY);
                    const zProj = project3DTo2D(worldZ);
                    
                    // Normalize and scale
                    const scale = axisLength;
                    const xEnd = {
                        x: centerX + xProj.x * scale,
                        y: centerY - xProj.y * scale // Flip Y for SVG
                    };
                    const yEnd = {
                        x: centerX + yProj.x * scale,
                        y: centerY - yProj.y * scale
                    };
                    const zEnd = {
                        x: centerX + zProj.x * scale,
                        y: centerY - zProj.y * scale
                    };
                    
                    // Draw arrows
                    drawArrow(svg, centerX, centerY, xEnd.x, xEnd.y, '#ff3333', 'X');
                    drawArrow(svg, centerX, centerY, yEnd.x, yEnd.y, '#33ff33', 'Y');
                    drawArrow(svg, centerX, centerY, zEnd.x, zEnd.y, '#3333ff', 'Z');
                }
  
              function drawArrow(svg, x1, y1, x2, y2, color, label) {
                  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                  line.setAttribute('x1', x1); line.setAttribute('y1', y1);
                  line.setAttribute('x2', x2); line.setAttribute('y2', y2);
                  line.setAttribute('stroke', color); line.setAttribute('stroke-width', '2');
                  svg.appendChild(line);
                  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                  text.setAttribute('x', x2 + 5); text.setAttribute('y', y2 - 5);
                  text.setAttribute('fill', color); text.setAttribute('font-size', '12');
                  text.textContent = label;
                  svg.appendChild(text);
              }
  
              updateAxisView();
  
              // Animation loop
              function animate() {
                  requestAnimationFrame(animate);
                  controls.update();
                  updateAxisView();
                  renderer.render(scene, camera);
              }
              animate();
  
              window.addEventListener('resize', () => {
                  camera.aspect = window.innerWidth / window.innerHeight;
                  camera.updateProjectionMatrix();
                  renderer.setSize(window.innerWidth, window.innerHeight);
              });
          }
      </script>
  </body>
  </html>
  `}function Q(){return`
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>Open3D Viewer Ultimate</title>
    
    <style>
    html,body{
        margin:0;
        padding:0;
        overflow:hidden;
        width:100%;
        height:100%;
        background:#1a1a2e;
        color:#fff;
        font-family:Arial,Helvetica,sans-serif;
    }
    
    #loadingInfo{
        position:absolute;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
        background:rgba(0,0,0,.75);
        padding:20px 28px;
        border-radius:8px;
        z-index:1000;
        text-align:center;
    }
    
    #info,#controls,#axisView,#colorbar{
        display:none;
    }
    
    #info{
        position:absolute;
        top:10px;
        left:10px;
        background:rgba(0,0,0,.72);
        padding:10px 14px;
        border-radius:6px;
        font-size:13px;
        z-index:100;
    }
    
    #info h3{
        margin:0 0 8px 0;
        font-size:15px;
    }
    
    #info p{
        margin:3px 0;
    }
    
    #controls{
        position:absolute;
        top:10px;
        right:10px;
        background:rgba(0,0,0,.72);
        padding:10px 14px;
        border-radius:6px;
        z-index:100;
        min-width:170px;
    }
    
    #controls button{
        width:100%;
        margin-top:6px;
        padding:8px;
        border:none;
        border-radius:4px;
        cursor:pointer;
        color:#fff;
        background:#4a9eff;
    }
    
    #controls button:hover{
        background:#318cff;
    }
    
    #controls input{
        width:70px;
        margin-left:8px;
        background:#222;
        color:#fff;
        border:1px solid #555;
        border-radius:4px;
        padding:4px;
    }
    
    #axisView{
        position:absolute;
        right:10px;
        bottom:10px;
        width:120px;
        height:120px;
        background:rgba(0,0,0,.45);
        border:1px solid rgba(255,255,255,.2);
        border-radius:6px;
        z-index:100;
    }
    
    #axisView svg{
        width:100%;
        height:100%;
    }
    
    #colorbar{
        position:absolute;
        right:10px;
        bottom:140px;
        background:rgba(0,0,0,.72);
        padding:10px;
        border-radius:6px;
        z-index:100;
    }
    
    #cbWrap{
        display:flex;
    }
    
    #cbGrad{
        width:20px;
        height:120px;
        background:linear-gradient(to top,#0000ff,#00ffff,#00ff00,#ffff00,#ff0000);
    }
    
    #cbText{
        margin-left:8px;
        height:120px;
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        font-size:11px;
    }
    </style>
    
    <script type="importmap">
    {
     "imports":{
       "three":"https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.module.js",
       "three/addons/":"https://cdn.jsdelivr.net/npm/three@0.149.0/examples/jsm/"
     }
    }
    </script>
    </head>
    
    <body>
    
    <div id="loadingInfo">
        <h3>Loading Point Cloud</h3>
        <p>Please wait...</p>
    </div>
    
    <div id="info">
        <h3>Point Cloud Viewer</h3>
        <p>Points: <span id="pointCount">0</span></p>
        <p>X: <span id="boundsX">-</span></p>
        <p>Y: <span id="boundsY">-</span></p>
        <p>Z: <span id="boundsZ">-</span></p>
    </div>
    
    <div id="controls">
        <div>
            Size:
            <input id="pointSizeInput" type="number" step="0.01" min="0.001" value="0.05">
        </div>
        <button id="btnResetView">Reset View</button>
        <button id="btnSavePointCloud">Save PCD</button>
    </div>
    
    <div id="axisView"></div>
    
    <div id="colorbar">
        <div id="cbWrap">
            <div id="cbGrad"></div>
            <div id="cbText">
                <span id="cbMax">1</span>
                <span id="cbMid">0.5</span>
                <span id="cbMin">0</span>
            </div>
        </div>
    </div>
    
    <script type="module">
    
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    
    const vscode = acquireVsCodeApi();
    
    let scene=null;
    let camera=null;
    let renderer=null;
    let controls=null;
    let pointsObj=null;
    
    let rawPoints=null;
    let rawColors=null;
    let hasColor=false;
    
    window.addEventListener('message',(event)=>{
    
        const msg = event.data;
    
        if(msg.type === 'initCloud'){
            rawPoints = msg.points;
            rawColors = msg.colors;
            hasColor = msg.hasColor;
            initializeViewer();
        }
    
        if(msg.type === 'error'){
            document.getElementById('loadingInfo').innerHTML =
                '<h3>Error</h3><p>'+msg.message+'</p>';
        }
    });
    
    function initializeViewer(){
    
        disposeOld();
    
        document.getElementById('loadingInfo').style.display='none';
        document.getElementById('info').style.display='block';
        document.getElementById('controls').style.display='block';
        document.getElementById('axisView').style.display='block';
    
        const pointCount = Math.floor(rawPoints.length / 3);
    
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a2e);
    
        camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth/window.innerHeight,
            0.1,
            100000
        );
    
        renderer = new THREE.WebGLRenderer({
            antialias:true
        });
    
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        renderer.setSize(window.innerWidth,window.innerHeight);
    
        document.body.appendChild(renderer.domElement);
    
        controls = new OrbitControls(camera,renderer.domElement);
        controls.enableDamping = true;
    
        const positions = new Float32Array(pointCount * 3);
    
        let minX=Infinity,maxX=-Infinity;
        let minY=Infinity,maxY=-Infinity;
        let minZ=Infinity,maxZ=-Infinity;
    
        for(let i=0;i<pointCount;i++){
    
            const x = rawPoints[i*3];
            const y = rawPoints[i*3+1];
            const z = rawPoints[i*3+2];
    
            // Open3D -> Three.js
            positions[i*3]   = x;
            positions[i*3+1] = z;
            positions[i*3+2] = -y;
    
            if(x<minX) minX=x;
            if(x>maxX) maxX=x;
    
            if(y<minY) minY=y;
            if(y>maxY) maxY=y;
    
            if(z<minZ) minZ=z;
            if(z>maxZ) maxZ=z;
        }
    
        let colorArr = new Float32Array(pointCount * 3);
    
        if(hasColor && rawColors){
    
            for(let i=0;i<rawColors.length;i++){
                colorArr[i] = rawColors[i] / 255.0;
            }
    
            document.getElementById('colorbar').style.display='none';
    
        }else{
    
            document.getElementById('colorbar').style.display='block';
    
            document.getElementById('cbMax').textContent = maxZ.toFixed(2);
            document.getElementById('cbMid').textContent = ((minZ+maxZ)/2).toFixed(2);
            document.getElementById('cbMin').textContent = minZ.toFixed(2);
    
            const range = (maxZ-minZ) || 1;
    
            for(let i=0;i<pointCount;i++){
    
                const z = rawPoints[i*3+2];
                const t = (z-minZ)/range;
    
                let r=0,g=0,b=0;
    
                if(t<0.25){
                    r=0; g=4*t; b=1;
                }else if(t<0.5){
                    r=0; g=1; b=1-4*(t-0.25);
                }else if(t<0.75){
                    r=4*(t-0.5); g=1; b=0;
                }else{
                    r=1; g=1-4*(t-0.75); b=0;
                }
    
                colorArr[i*3]   = r;
                colorArr[i*3+1] = g;
                colorArr[i*3+2] = b;
            }
        }
    
        const geometry = new THREE.BufferGeometry();
    
        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positions,3)
        );
    
        geometry.setAttribute(
            'color',
            new THREE.BufferAttribute(colorArr,3)
        );
    
        const sizeRange = Math.max(
            maxX-minX,
            maxY-minY,
            maxZ-minZ
        ) || 1;
    
        const defaultSize = Math.max(0.01,sizeRange/500);
    
        document.getElementById('pointSizeInput').value =
            defaultSize.toFixed(3);
    
        const material = new THREE.PointsMaterial({
            size:defaultSize,
            vertexColors:true,
            sizeAttenuation:true
        });
    
        pointsObj = new THREE.Points(geometry,material);
        scene.add(pointsObj);
    
        updateInfo(pointCount,minX,maxX,minY,maxY,minZ,maxZ);
    
        function resetView(){
    
            const cx = (minX+maxX)/2;
            const cy = (minZ+maxZ)/2;
            const cz = -(minY+maxY)/2;
    
            const dist = Math.max(
                maxX-minX,
                maxY-minY,
                maxZ-minZ
            ) || 1;
    
            camera.position.set(
                cx+dist,
                cy+dist,
                cz+dist
            );
    
            controls.target.set(cx,cy,cz);
            controls.update();
        }
    
        resetView();
    
        document.getElementById('btnResetView').onclick = resetView;
    
        document.getElementById('pointSizeInput').oninput = (e)=>{
            material.size = parseFloat(e.target.value) || defaultSize;
        };
    
        document.getElementById('btnSavePointCloud').onclick = ()=>{
            vscode.postMessage({command:'savePcd'});
        };
    
        setupAxisWidget();
    
        animate();
    }
    
    function updateInfo(count,minX,maxX,minY,maxY,minZ,maxZ){
    
        document.getElementById('pointCount').textContent = String(count);
        document.getElementById('boundsX').textContent =
            '['+minX.toFixed(2)+', '+maxX.toFixed(2)+']';
    
        document.getElementById('boundsY').textContent =
            '['+minY.toFixed(2)+', '+maxY.toFixed(2)+']';
    
        document.getElementById('boundsZ').textContent =
            '['+minZ.toFixed(2)+', '+maxZ.toFixed(2)+']';
    }
    
    let axisSvg=null;
    let axisLines=[];
    let axisTexts=[];
    
    function setupAxisWidget(){
    
        const box = document.getElementById('axisView');
        box.innerHTML='';
    
        axisSvg = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg'
        );
    
        axisSvg.setAttribute('viewBox','0 0 120 120');
        box.appendChild(axisSvg);
    
        const names=['X','Y','Z'];
        const colors=['#ff3333','#33ff33','#3399ff'];
    
        for(let i=0;i<3;i++){
    
            const line=document.createElementNS(
                'http://www.w3.org/2000/svg','line');
    
            line.setAttribute('stroke',colors[i]);
            line.setAttribute('stroke-width','2');
    
            axisSvg.appendChild(line);
            axisLines.push(line);
    
            const text=document.createElementNS(
                'http://www.w3.org/2000/svg','text');
    
            text.setAttribute('fill',colors[i]);
            text.setAttribute('font-size','12');
            text.textContent=names[i];
    
            axisSvg.appendChild(text);
            axisTexts.push(text);
        }
    }
    
    function updateAxis(){
    
        if(!camera || !axisSvg) return;
    
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
    
        const up = camera.up.clone();
    
        const right = new THREE.Vector3();
        right.crossVectors(dir,up).normalize();
    
        const up2 = new THREE.Vector3();
        up2.crossVectors(right,dir).normalize();
    
        const basis = [
            new THREE.Vector3(1,0,0),
            new THREE.Vector3(0,1,0),
            new THREE.Vector3(0,0,1)
        ];
    
        const cx=60, cy=60, len=30;
    
        for(let i=0;i<3;i++){
    
            const p = basis[i];
    
            const px = p.dot(right);
            const py = p.dot(up2);
    
            const x2 = cx + px*len;
            const y2 = cy - py*len;
    
            axisLines[i].setAttribute('x1',cx);
            axisLines[i].setAttribute('y1',cy);
            axisLines[i].setAttribute('x2',x2);
            axisLines[i].setAttribute('y2',y2);
    
            axisTexts[i].setAttribute('x',x2+4);
            axisTexts[i].setAttribute('y',y2-4);
        }
    }
    
    function animate(){
        requestAnimationFrame(animate);
    
        if(controls) controls.update();
        updateAxis();
    
        if(renderer && scene && camera){
            renderer.render(scene,camera);
        }
    }
    
    function disposeOld(){
    
        if(renderer){
    
            renderer.dispose();
    
            if(renderer.domElement &&
               renderer.domElement.parentNode){
    
                renderer.domElement.parentNode
                    .removeChild(renderer.domElement);
            }
        }
    
        scene=null;
        camera=null;
        renderer=null;
        controls=null;
        pointsObj=null;
    }
    
    window.addEventListener('resize',()=>{
    
        if(!camera || !renderer) return;
    
        camera.aspect =
            window.innerWidth/window.innerHeight;
    
        camera.updateProjectionMatrix();
    
        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    });
    
    </script>
    </body>
    </html>
    `}function j(t,e="binary"){if(e==="ascii"){let o=`ply
format ascii 1.0
element vertex ${t.length}
property float x
property float y
property float z
end_header
`,i=t.map(n=>`${n.x} ${n.y} ${n.z}`).join(`
`);return new TextEncoder().encode(o+i)}else{let o=`ply
format binary_little_endian 1.0
element vertex ${t.length}
property float x
property float y
property float z
end_header
`,i=new TextEncoder().encode(o),n=new Uint8Array(t.length*12),r=new DataView(n.buffer);for(let c=0;c<t.length;c++){let l=c*12;r.setFloat32(l,t[c].x,!0),r.setFloat32(l+4,t[c].y,!0),r.setFloat32(l+8,t[c].z,!0)}let s=new Uint8Array(i.length+n.length);return s.set(i),s.set(n,i.length),s}}function H(t){let e=t.some(r=>r.r!==void 0||r.g!==void 0||r.b!==void 0),i=["VERSION 0.7",e?"FIELDS x y z rgb":"FIELDS x y z",e?"SIZE 4 4 4 4":"SIZE 4 4 4",e?"TYPE F F F U":"TYPE F F F",e?"COUNT 1 1 1 1":"COUNT 1 1 1",`WIDTH ${t.length}`,"HEIGHT 1","VIEWPOINT 0 0 0 1 0 0 0",`POINTS ${t.length}`,"DATA ascii"].join(`
`)+`
`,n=t.map(r=>{if(e){let s=Math.max(0,Math.min(255,Math.round(r.r??0))),c=Math.max(0,Math.min(255,Math.round(r.g??0))),l=Math.max(0,Math.min(255,Math.round(r.b??0))),p=(Math.max(0,Math.min(255,Math.round(r.a??255)))<<24|s<<16|c<<8|l)>>>0;return`${r.x} ${r.y} ${r.z} ${p}`}else return`${r.x} ${r.y} ${r.z}`}).join(`
`);return new TextEncoder().encode(i+n)}function me(t,e){let o=Math.floor(t.length/3),i=!!e&&e.length>=o*3,r=["VERSION 0.7",i?"FIELDS x y z rgb":"FIELDS x y z",i?"SIZE 4 4 4 4":"SIZE 4 4 4",i?"TYPE F F F U":"TYPE F F F",i?"COUNT 1 1 1 1":"COUNT 1 1 1",`WIDTH ${o}`,"HEIGHT 1","VIEWPOINT 0 0 0 1 0 0 0",`POINTS ${o}`,"DATA ascii"].join(`
`)+`
`;for(let s=0;s<o;s++){let c=t[s*3],l=t[s*3+1],a=t[s*3+2];if(i){let w=e[s*3],p=e[s*3+1],g=e[s*3+2],x=(255<<24|w<<16|p<<8|g)>>>0;r+=`${c} ${l} ${a} ${x}
`}else r+=`${c} ${l} ${a}
`}return new TextEncoder().encode(r)}var T=E(require("vscode")),R=class{static panels=new Map;static getOrCreatePanel(e,o,i,n){let r=`${e}:::${i}:::${n}`;if(this.panels.has(r)){let c=this.panels.get(r);return c.panel.title=o,c.panel.reveal(T.ViewColumn.One),c.panel}let s=T.window.createWebviewPanel(e,o,T.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0});return this.panels.set(r,{panel:s}),s.onDidDispose(()=>{this.panels.delete(r)}),s}static updateStateToken(e,o,i,n){let r=`${e}:::${o}:::${i}`,s=this.panels.get(r);s&&(s.lastStateToken=n)}static isPanelFresh(e,o,i,n){let r=`${e}:::${o}:::${i}`;return this.panels.get(r)?.lastStateToken===n}static closeSessionPanels(e){for(let[o,i]of this.panels.entries()){let n=o.split(":::");n.length>=2&&n[1]===e&&i.panel.dispose()}}};async function fe(t,e,o,i=!1){try{console.log("Drawing point cloud with debugger type:",t.type),console.log("variableInfo:",JSON.stringify(e,null,2));let n=[];if(e.evaluateName)try{n=await h.window.withProgress({location:h.ProgressLocation.Notification,title:"Loading OpenCV Data",cancellable:!1},async c=>(c.report({message:"Reading point cloud data ..."}),await Fe(t,e.evaluateName,e,i,c)))}catch(c){console.log("readMemory approach failed:",c)}if(console.log(`Loaded ${n.length} points`),n.length===0){h.window.showWarningMessage("No points found in the vector. Make sure the vector is not empty.");return}let r=`View: PointCloud ${o}`,s=R.getOrCreatePanel("3DPointViewer",r,t.id,o);s.webview.html=V(),h.window.withProgress({location:h.ProgressLocation.Notification,title:"Loading PCL Data",cancellable:!1},async c=>{c.report({message:"Preparing point cloud..."});try{let l=n.some(a=>a.r!==void 0||a.g!==void 0||a.b!==void 0);s.webview.postMessage({type:"initPointCloud",pointsArray:n,hasColor:l})}catch(l){console.error(l),s.webview.postMessage({type:"error",message:"Failed to load point cloud data."})}}),s._messageListener&&s._messageListener.dispose(),s._messageListener=s.webview.onDidReceiveMessage(async c=>{if(c.command==="savePLY")try{let l=j(n,c.format),a=await h.window.showSaveDialog({defaultUri:h.Uri.file(`${o}.ply`),filters:{"PLY Files":["ply"],"All Files":["*"]}});if(a){await h.workspace.fs.writeFile(a,l);let w=c.format==="ascii"?"ASCII":"Binary";h.window.showInformationMessage(`Point cloud saved to ${a.fsPath} (${w} format)`)}}catch(l){h.window.showErrorMessage(`Failed to save PLY file: ${l}`),console.error("Error saving PLY:",l)}else if(c.command==="savePcd")try{let l=H(n),a=await h.window.showSaveDialog({defaultUri:h.Uri.file(`${o}.pcd`),filters:{"PLY Files":["pcd"],"All Files":["*"]}});a&&(await h.workspace.fs.writeFile(a,l),h.window.showInformationMessage(`Point cloud saved to ${a.fsPath}`))}catch(l){h.window.showErrorMessage(`Failed to save Pcd file: ${l}`),console.error("Error saving Pcd:",l)}},void 0,void 0)}catch(n){throw console.error("Error in drawPointCloud:",n),n}}async function Fe(t,e,o,i,n){let r=[],s=o?.frameId||await N(t),c=Y(t),l=0;if(o&&o.result){let u=o.result.match(/size\s*=\s*(\d+)/);u&&(l=parseInt(u[1]))}if(l<=0)try{let u=await t.customRequest("evaluate",{expression:`(int)${e}.size()`,frameId:s,context:c});l=parseInt(u.result),!isNaN(l)&&l>0&&console.log(`Got vector size from evaluate: ${l}`)}catch(u){console.log("Failed to evaluate size() expression:",u)}if(isNaN(l)||l<=0)return console.log("Could not get vector size or size is 0"),r;n.report({message:`Reading ${l} points...`});let a=null;if(J(t)){let u=[`(long long)&${e}[0]`,`reinterpret_cast<long long>(&${e}[0])`,`(long long)${e}.data()`,`reinterpret_cast<long long>(${e}.data())`,`&(${e}.operator[](0))`];a=await D(t,e,u,s,c)}else if(z(t)){if(console.log("Using LLDB-specific approaches"),o&&o.variablesReference>0)try{console.log(`Trying to get data pointer through variables, variablesReference=${o.variablesReference}`);let u=await t.customRequest("variables",{variablesReference:o.variablesReference});if(u.variables&&u.variables.length>0){let x=u.variables.slice(0,10).map(d=>d.name).join(", ");console.log(`Found ${u.variables.length} variables (first 10: ${x}...)`);for(let d of u.variables){let f=d.name;if(f==="__begin_"||f.includes("__begin")){if(console.log(`Found __begin_ variable: name="${f}", value="${d.value}", memoryReference="${d.memoryReference}"`),d.value){let m=d.value.match(/0x[0-9a-fA-F]+/);if(m){a=m[0],console.log(`Extracted pointer from __begin_ variable: ${a}`);break}}if(!a&&d.memoryReference){a=d.memoryReference,console.log(`Using memoryReference from __begin_ variable: ${a}`);break}}}if(!a){let d=u.variables.find(f=>f.name==="[0]");if(d){if(console.log(`Found [0] element: value="${d.value}", memoryReference="${d.memoryReference}"`),d.memoryReference)a=d.memoryReference,console.log(`Using memoryReference from [0] element as data pointer: ${a}`);else if(d.value){let f=d.value.match(/0x[0-9a-fA-F]+/);f&&(a=f[0],console.log(`Extracted pointer from [0] element value: ${a}`))}if(!a&&d.variablesReference>0)try{let f=await t.customRequest("variables",{variablesReference:d.variablesReference});if(console.log("[0] has sub-variables, checking for address..."),f.variables){for(let m of f.variables)if(m.memoryReference){a=m.memoryReference,console.log(`Found memoryReference in [0] sub-variable: ${a}`);break}}}catch(f){console.log("Failed to get [0] sub-variables:",f)}}}}a||console.log("Could not get data pointer through variables")}catch(u){console.log("Failed to get data pointer through variables:",u)}if(!a){let u=[`${e}.__begin_`,`reinterpret_cast<long long>(${e}.__begin_)`,`${e}.data()`,`reinterpret_cast<long long>(${e}.data())`,`&${e}[0]`,`reinterpret_cast<long long>(&${e}[0])`];a=await D(t,e,u,s,c)}}else if(q(t)){let u=[`(long long)${e}._M_impl._M_start`,`reinterpret_cast<long long>(${e}._M_impl._M_start)`,`(long long)${e}.data()`,`reinterpret_cast<long long>(${e}.data())`,`(long long)&${e}[0]`];a=await D(t,e,u,s,c)}else{let u=[`(long long)&${e}[0]`,`(long long)${e}._M_impl._M_start`,`(long long)${e}.__begin_`,`(long long)${e}.data()`,`reinterpret_cast<long long>(${e}.data())`];a=await D(t,e,u,s,c)}if(!a)return console.log("Could not extract data pointer with any approach"),r;let p=l*(i?24:12),g=await B(t,a,p,n);if(g){if(i)for(let u=0;u<l&&u*24+23<g.length;u++){let x=u*24,d=g.readDoubleLE(x),f=g.readDoubleLE(x+8),m=g.readDoubleLE(x+16);r.push({x:d,y:f,z:m})}else for(let u=0;u<l&&u*12+11<g.length;u++){let x=u*12,d=g.readFloatLE(x),f=g.readFloatLE(x+4),m=g.readFloatLE(x+8);r.push({x:d,y:f,z:m})}console.log(`Loaded ${r.length} points via readMemory`)}return r}async function ue(t,e,o,i){try{let n=[];if(e.evaluateName)try{n=await h.window.withProgress({location:h.ProgressLocation.Notification,title:"Loading PCL Data",cancellable:!1},async c=>(c.report({message:"Reading point cloud data ..."}),await Ae(t,e.evaluateName,e,i,c)))}catch(c){console.log("readMemory approach failed:",c)}if(n.length===0){h.window.showWarningMessage("No points found in the vector. Make sure the vector is not empty.");return}let r=`View: PointCloud ${o}`,s=R.getOrCreatePanel("3DPointViewer",r,t.id,o);s.webview.html=V(),h.window.withProgress({location:h.ProgressLocation.Notification,title:"Loading PCL Data",cancellable:!1},async c=>{c.report({message:"Preparing point cloud..."});try{let l=n.some(a=>a.r!==void 0||a.g!==void 0||a.b!==void 0);s.webview.postMessage({type:"initPointCloud",pointsArray:n,hasColor:l})}catch(l){console.error(l),s.webview.postMessage({type:"error",message:"Failed to load point cloud data."})}}),s._messageListener&&s._messageListener.dispose(),s._messageListener=s.webview.onDidReceiveMessage(async c=>{if(c.command==="savePLY")try{let l=j(n,c.format),a=await h.window.showSaveDialog({defaultUri:h.Uri.file(`${o}.ply`),filters:{"PLY Files":["ply"],"All Files":["*"]}});if(a){await h.workspace.fs.writeFile(a,l);let w=c.format==="ascii"?"ASCII":"Binary";h.window.showInformationMessage(`Point cloud saved to ${a.fsPath} (${w} format)`)}}catch(l){h.window.showErrorMessage(`Failed to save PLY file: ${l}`),console.error("Error saving PLY:",l)}else if(c.command==="savePcd")try{let l=H(n),a=await h.window.showSaveDialog({defaultUri:h.Uri.file(`${o}.pcd`),filters:{"PLY Files":["pcd"],"All Files":["*"]}});a&&(await h.workspace.fs.writeFile(a,l),h.window.showInformationMessage(`Point cloud saved to ${a.fsPath}`))}catch(l){h.window.showErrorMessage(`Failed to save Pcd file: ${l}`),console.error("Error saving Pcd:",l)}},void 0,void 0)}catch(n){throw console.error("Error in drawPointCloud:",n),n}}async function Ae(t,e,o,i,n){let r=[],s=o?.frameId||await N(t),c=Y(t),l=o?.type||"",a;l.includes("boost::shared_ptr<")?a=`${e}.px->points`:l.includes("::Ptr")||l.includes("shared_ptr<")?a=`(*${e}).points`:l.includes("::Ptr")?a=`${e}.get().points`:a=`${e}.points`;let w=0;if(o?.result){let f=o.result.match(/with\s+(\d+)\s+points/);f&&(w=parseInt(f[1],10))}if(w<=0)try{let f=await t.customRequest("evaluate",{expression:`(int)${a}.size()`,frameId:s,context:c}),m=parseInt(f.result,10);!isNaN(m)&&m>0&&(w=m)}catch(f){console.warn("Failed to get .points.size()",f)}if(w<=0)return console.log("Empty or unknown size"),r;n.report({message:`Reading ${w} points...`});let p=null,g=[`&${a}[0]`,`${a}.data()`];if(J(t)){let f=[`(long long)&${a}[0]`,`(long long)${a}.data()`];p=await D(t,e,f,s,c)}else if(z(t)){if(o?.variablesReference)try{let m=(await t.customRequest("variables",{variablesReference:o.variablesReference})).variables?.find(y=>y.name==="points");if(m?.variablesReference){let y=await t.customRequest("variables",{variablesReference:m.variablesReference});for(let b of y.variables||[]){if(b.name==="__begin_"&&b.value?.match(/0x[0-9a-fA-F]+/)){p=b.value.match(/0x[0-9a-fA-F]+/)[0];break}if(b.name==="[0]"&&b.memoryReference){p=b.memoryReference;break}}}}catch{}if(!p){let f=[`${a}.__begin_`,`&${a}[0]`];p=await D(t,e,f,s,c)}}else if(q(t)){let f=[`(long long)${a}._M_impl._M_start`,`(long long)&${a}[0]`,`(long long)${a}.data()`];p=await D(t,e,f,s,c)}else p=await D(t,e,g,s,c);if(!p)return console.error(`\u274C Failed to get data pointer for ${a}points`),r;p.startsWith("0x")||p.startsWith("0X")?p="0x"+p.substring(2).toLowerCase():/^[0-9a-fA-F]+$/.test(p)&&(p="0x"+p.toLowerCase());let u=i?32:16,x=w*u,d=await B(t,p,x,n);if(!d||d.length<16)return console.error("\u274C Failed to read memory or buffer too small"),r;for(let f=0;f<w;f++){let m=f*u;if(m+15>=d.length)break;let y=d.readFloatLE(m),b=d.readFloatLE(m+4),S=d.readFloatLE(m+8),A={x:y,y:b,z:S};if(i){let G=d[m+16],k=d[m+17],L=d[m+18],X=d[m+19];A.r=L,A.g=k,A.b=G,X!==255&&(A.a=X)}r.push(A)}return console.log(`\u2705 Loaded ${r.length} points ${i?"with RGB":""}`),r}var M=E(require("vscode"));function ge(t,e,o,i,n,r){let s=JSON.stringify(r?.base64||""),c=Le();return`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${t.cspSource} 'nonce-${c}'; script-src 'nonce-${c}';">
          <title>Matrix Image Viewer</title>
          <style nonce="${c}">
              body { margin: 0; overflow: hidden; font-family: Arial, sans-serif; background-color: #333; }
              #controls { 
                  position: absolute; 
                  top: 10px; 
                  left: 10px; 
                  background: rgba(255,255,255,0.9); 
                  padding: 10px; 
                  border-radius: 5px;
                  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                  cursor: move;
                  user-select: none;
                  z-index: 1000;
              }
              #controls:hover { background: rgba(255,255,255,1); }
              #pixelInfo { 
                  position: absolute; 
                  bottom: 10px; 
                  left: 10px; 
                  background: rgba(255,255,255,0.9); 
                  color: black; 
                  padding: 10px; 
                  border-radius: 5px;
                  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
              }
              button { 
                  margin-right: 5px; 
                  padding: 5px 10px; 
                  cursor: pointer;
                  border: 1px solid #ccc;
                  border-radius: 3px;
                  background: white;
              }
              button:hover { background: #f0f0f0; }
              #container { position: relative; width: 100vw; height: 100vh; overflow: hidden; }
              canvas { position: absolute; top: 0; left: 0; }
              #grid-canvas { 
                  position: absolute; 
                  top: 0; 
                  left: 0; 
                  pointer-events: none;
                  z-index: 1;
              }
          </style>
      </head>
      <body>
        <div id="loading">
            <div class="spinner"></div>
        </div>
          <div id="container">
              <canvas id="canvas"></canvas>
              <canvas id="grid-canvas"></canvas>
          </div>
          <div id="controls">
              <button id="reset">Reset</button>
              <button id="downloadPng">Save PNG</button>
              <span id="zoomLevel">Zoom: 100%</span>
              <span id="Resolution">Size: 0x0</span>
          </div>
          <div id="pixelInfo"></div>
          <script nonce="${c}">
              (function() {
                  const container = document.getElementById('container');
                  const canvas = document.getElementById('canvas');
                  const gridCanvas = document.getElementById('grid-canvas');
                  const ctx = canvas.getContext('2d');
                  const gridCtx = gridCanvas.getContext('2d');
                  const pixelInfo = document.getElementById('pixelInfo');
                  const zoomLevelDisplay = document.getElementById('zoomLevel');
                  const ResolutionDisplay = document.getElementById('Resolution');
                  const controls = document.getElementById('controls');
                  
                  const rows = ${e};
                  const cols = ${o};
                  const channels = ${i};
                  const depth = ${n};

                // Listen for complete data from extension
                const vscode = acquireVsCodeApi();
                window.addEventListener('message', event => {
                    const message = event.data;
                    if (message.command === 'completeData') {
                        const rawBytes = message.data; // This is a Uint8Array
                        // console.log('Received binary data: ' + rawBytes.length + ' bytes');
                        
                        // Use setTimeout to allow UI to update
                        setTimeout(() => {
                            try {
                                initializeImageViewer(rawBytes);
                            } catch (e) {
                                console.error('Initialization failed:', e);
                            }
                        }, 10);
                    }
                });
                function bytesToTypedArray(bytes, depth) {
                    const buf = bytes.buffer;
                    const offset = bytes.byteOffset;
                    const length = bytes.byteLength;
                    switch (depth) {
                        case 0: return new Uint8Array(buf, offset, length);    // CV_8U
                        case 1: return new Int8Array(buf, offset, length);     // CV_8S
                        case 2: return new Uint16Array(buf, offset, length / 2);   // CV_16U
                        case 3: return new Int16Array(buf, offset, length / 2);    // CV_16S
                        case 4: return new Int32Array(buf, offset, length / 4);    // CV_32S
                        case 5: return new Float32Array(buf, offset, length / 4);  // CV_32F
                        case 6: return new Float64Array(buf, offset, length / 8);  // CV_64F
                        default: return new Uint8Array(buf, offset, length);
                    }
                }
                let rawData = null;
                let renderMode = 'byte';
                let scale = 1;
                let isDragging = false;
                let startX = 0;
                let startY = 0;
                let offsetX = 0;
                let offsetY = 0;

                // Make controls draggable
                let controlsDragging = false;
                let controlsStartX = 0;
                let controlsStartY = 0;

                controls.addEventListener('mousedown', (e) => {
                    if (e.target === controls) {
                        controlsDragging = true;
                        controlsStartX = e.clientX - controls.offsetLeft;
                        controlsStartY = e.clientY - controls.offsetTop;
                        e.preventDefault();
                    }
                });

                document.addEventListener('mousemove', (e) => {
                    if (controlsDragging) {
                        controls.style.left = (e.clientX - controlsStartX) + 'px';
                        controls.style.top = (e.clientY - controlsStartY) + 'px';
                    }
                });

                document.addEventListener('mouseup', () => {
                    controlsDragging = false;
                });

                // Create off-screen canvas for the original image
                const offscreenCanvas = document.createElement('canvas');
                offscreenCanvas.width = cols;
                offscreenCanvas.height = rows;
                const offscreenCtx = offscreenCanvas.getContext('2d');
                const imgData = offscreenCtx.createImageData(cols, rows);

                function initializeImageViewer(rawBytes) {
                    rawData = bytesToTypedArray(rawBytes, depth);
                    updateOffscreenFromRaw();
                    resetView();
                    // if (pendingSyncState) {
                    //     applyViewState(pendingSyncState);
                    //     pendingSyncState = null;
                    // } else {
                    //     resetView();
                    // }
                    // isInitialized = true;
                    // requestRender();
                }

                function clampByte(v) {
                    if (v < 0) return 0;
                    if (v > 255) return 255;
                    return v | 0;
                }

                function getMinMax() {
                    if (cachedMinMax) return cachedMinMax;
                    let min = Infinity;
                    let max = -Infinity;
                    const len = rawData.length;
                    for (let i = 0; i < len; i++) {
                        const v = rawData[i];
                        if (v < min) min = v;
                        if (v > max) max = v;
                    }
                    if (min === Infinity || max === -Infinity) {
                        min = 0; max = 1;
                    }
                    cachedMinMax = { min, max };
                    return cachedMinMax;
                }

                function mapToByte(v) {
                    if (renderMode === 'norm01') {
                        return clampByte(v * 255);
                    }
                    if (renderMode === 'minmax') {
                        const mm = getMinMax();
                        const denom = (mm.max - mm.min) || 1;
                        return clampByte(((v - mm.min) / denom) * 255);
                    }
                    if (renderMode === 'clamp255') {
                        return clampByte(v);
                    }
                    // 'byte' default
                    return clampByte(v);
                }

                function updateOffscreenFromRaw() {
                    if (!rawData) return;
                    // Fill image data based on selected render mode
                    cachedMinMax = null;
                    if (renderMode === 'minmax') getMinMax();

                    const data = imgData.data;
                    const len = rows * cols;
                    
                    if (depth === 0 && renderMode === 'byte') {
                        // Fast path for CV_8U + byte mode
                        if (channels === 1) {
                            for (let i = 0; i < len; i++) {
                                const val = rawData[i];
                                const outIdx = i << 2;
                                data[outIdx] = data[outIdx + 1] = data[outIdx + 2] = val;
                                data[outIdx + 3] = 255;
                            }
                        } else if (channels === 3) {
                            for (let i = 0; i < len; i++) {
                                const inIdx = i * 3;
                                const outIdx = i << 2;
                                data[outIdx] = rawData[inIdx + 2];
                                data[outIdx + 1] = rawData[inIdx + 1];
                                data[outIdx + 2] = rawData[inIdx];
                                data[outIdx + 3] = 255;
                            }
                        }
                    } else {
                        // General path
                        for (let i = 0; i < len; i++) {
                            const outIdx = i << 2;
                            if (channels === 1) {
                                const value = mapToByte(rawData[i]);
                                data[outIdx] = data[outIdx + 1] = data[outIdx + 2] = value;
                            } else {
                                const inIdx = i * channels;
                                data[outIdx] = mapToByte(rawData[inIdx + 2]);
                                data[outIdx + 1] = mapToByte(rawData[inIdx + 1]);
                                data[outIdx + 2] = mapToByte(rawData[inIdx]);
                            }
                            data[outIdx + 3] = 255;
                        }
                    }
                    offscreenCtx.putImageData(imgData, 0, 0);
                }
                // Fill image data
                //   for (let i = 0; i < rows; i++) {
                //       for (let j = 0; j < cols; j++) {
                //           const idx = (i * cols + j) * channels;
                //           const pixelIdx = (i * cols + j) * 4;
                //           if (channels === 1) {
                //               // Grayscale
                //               const value = data[idx];
                //               imgData.data[pixelIdx] = value;
                //               imgData.data[pixelIdx + 1] = value;
                //               imgData.data[pixelIdx + 2] = value;
                //               imgData.data[pixelIdx + 3] = 255;
                //           } else if (channels === 3) {
                //               // RGB
                //               imgData.data[pixelIdx] = data[idx + 2];
                //               imgData.data[pixelIdx + 1] = data[idx + 1];
                //               imgData.data[pixelIdx + 2] = data[idx];
                //               imgData.data[pixelIdx + 3] = 255;
                //           }
                //       }
                //   }
                // Put the image data on the offscreen canvas
                //   offscreenCtx.putImageData(imgData, 0, 0);

                let hasAutoFit = false; // \u6807\u8BB0\u662F\u5426\u5DF2\u7ECF\u81EA\u52A8\u9002\u914D\u8FC7
                function updateCanvasSize() {
                    const container = canvas.parentElement;
                    if (!container) return;
                    canvas.width = container.clientWidth;
                    canvas.height = container.clientHeight;
                    if (!hasAutoFit && rows > 0 && cols > 0) {
                        // \u8BA1\u7B97\u7F29\u653E\u6BD4\u4F8B\uFF1A\u4FDD\u6301\u5BBD\u9AD8\u6BD4\uFF0C\u4F7F\u56FE\u50CF\u5B8C\u6574\u663E\u793A\u5E76\u5C3D\u53EF\u80FD\u586B\u6EE1\u5BB9\u5668
                        const scaleX = canvas.width / cols;
                        const scaleY = canvas.height / rows;
                        const fitScale = Math.min(scaleX, scaleY); // 'contain' \u6A21\u5F0F\uFF1B\u82E5\u60F3 'cover' \u5219\u7528 Math.max
                        scale = Math.max(0.1, Math.min(80, fitScale)); // \u9650\u5236\u5728\u5408\u7406\u8303\u56F4\u5185
                        // \u5C45\u4E2D\u504F\u79FB
                        const imageDisplayWidth = cols * scale;
                        const imageDisplayHeight = rows * scale;
                        offsetX = (canvas.width - imageDisplayWidth) / 2;
                        offsetY = (canvas.height - imageDisplayHeight) / 2;
                        hasAutoFit = true; // \u53EA\u81EA\u52A8\u9002\u914D\u4E00\u6B21
                    }
                    gridCanvas.width = canvas.width;
                    gridCanvas.height = canvas.height;
                    draw();
                    drawGrid();
                }

                // \u5148\u5B9E\u73B0\u7F3A\u5931\u7684\u5BF9\u6BD4\u5EA6\u8BA1\u7B97\u51FD\u6570
                function getContrastYIQ(r, g, b) {
                // \u6807\u51C6YIQ\u516C\u5F0F\u8BA1\u7B97\u4EAE\u5EA6\uFF0C\u5224\u65AD\u662F\u5426\u4E3A\u6D45\u8272\u80CC\u666F\uFF08\u8FD4\u56DEtrue\u5219\u7528\u9ED1\u8272\u6587\u672C\uFF0C\u5426\u5219\u767D\u8272\uFF09
                const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
                return yiq >= 128; // \u4EAE\u5EA6\u2265128\u4E3A\u6D45\u8272\uFF0C\u7528\u9ED1\u8272\u6587\u672C
                }
                function drawGrid() {
                    if (scale < 10) {
                    gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
                    return;
                    }
                    gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
                    gridCtx.strokeStyle = 'rgba(128,128,128,0.5)';
                    gridCtx.lineWidth = 0.5;
                    // ===== \u8BA1\u7B97\u53EF\u89C1\u7F51\u683C\u8303\u56F4 =====
                    const startCol = Math.max(0, Math.floor((-offsetX) / scale));
                    const endCol   = Math.min(cols, Math.ceil((gridCanvas.width - offsetX) / scale));
                    const startRow = Math.max(0, Math.floor((-offsetY) / scale));
                    const endRow   = Math.min(rows, Math.ceil((gridCanvas.height - offsetY) / scale));
                    // ===== \u7ED8\u5236\u7F51\u683C\u7EBF\uFF08\u53EA\u753B\u53EF\u89C1\uFF09=====
                    gridCtx.beginPath();
                    for (let x = startCol; x <= endCol; x++) {
                    const px = x * scale + offsetX;
                    gridCtx.moveTo(px, startRow * scale + offsetY);
                    gridCtx.lineTo(px, endRow * scale + offsetY);
                    }
                    for (let y = startRow; y <= endRow; y++) {
                    const py = y * scale + offsetY;
                    gridCtx.moveTo(startCol * scale + offsetX, py);
                    gridCtx.lineTo(endCol * scale + offsetX, py);
                    }
                    gridCtx.stroke();
                    // ===== scale < 60 \u4E0D\u753B RGB =====
                    if (scale < 60) return;
                    // ===== \u6587\u672C\u6837\u5F0F =====
                    const fontSize = Math.floor(scale / 5);
                    gridCtx.font = \`\${fontSize}px Arial\`;
                    gridCtx.textAlign = 'center';
                    gridCtx.textBaseline = 'middle';
                    // =====\u53EA\u7ED8\u5236\u53EF\u89C1\u50CF\u7D20\u503C =====
                    for (let y = startRow; y < endRow; y++) {
                    for (let x = startCol; x < endCol; x++) {
                        const cellX = x * scale + offsetX;
                        const cellY = y * scale + offsetY;
                        const cx = cellX + scale / 2;
                        const idx = (y * cols + x) * channels;
                        if (channels === 3) {
                        const r = rawData[idx + 2];
                        const g = rawData[idx + 1];
                        const b = rawData[idx];
                        gridCtx.fillStyle =
                            getContrastYIQ(r, g, b) ? 'black' : 'white';
                        gridCtx.fillText(r, cx, cellY + scale * 0.30);
                        gridCtx.fillText(g, cx, cellY + scale * 0.50);
                        gridCtx.fillText(b, cx, cellY + scale * 0.70);

                        } else if (channels === 1) {
                        const v = rawData[idx];
                        gridCtx.fillStyle =
                            getContrastYIQ(v, v, v) ? 'black' : 'white';
                        gridCtx.fillText(v, cx, cellY + scale / 2);
                        }
                    }
                    }
                }


                function draw() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    // Calculate scaled dimensions
                    const scaledWidth = cols * scale;
                    const scaledHeight = rows * scale;
                    // Draw from top-left corner with offset
                    const x = offsetX;
                    const y = offsetY;
                    ctx.imageSmoothingEnabled = scale < 4; // Disable smoothing when zoomed in
                    ctx.drawImage(offscreenCanvas, x, y, scaledWidth, scaledHeight);
                    // Draw grid when zoomed in
                    drawGrid();
                    // Update zoom level display
                    zoomLevelDisplay.textContent = \`Scale: \${Math.round(scale * 100)}% | \`;
                    ResolutionDisplay.textContent = \`Size: \${cols}x${e}\`;
                }

                function resetView() {
                    hasAutoFit = false;
                    updateCanvasSize();
                    draw();
                }
                document.getElementById('reset').addEventListener('click', () => {
                    resetView();
                });

                // Download PNG
                document.getElementById('downloadPng').addEventListener('click', () => {
                    const link = document.createElement('a');
                    link.download = 'image.png';
                    link.href = offscreenCanvas.toDataURL('image/png');
                    link.click();
                });

                canvas.addEventListener('wheel', (e) => {
                    e.preventDefault();
                    const rect = canvas.getBoundingClientRect();
                    const mouseX = e.clientX - rect.left;
                    const mouseY = e.clientY - rect.top;
                    // \u5F53\u524D\u9F20\u6807\u5728\u56FE\u50CF\u5750\u6807\u7CFB\u4E2D\u7684\u4F4D\u7F6E\uFF08\u672A\u7F29\u653E\u524D\u7684\u5750\u6807\uFF09
                    const imageXBefore = (mouseX - offsetX) / scale;
                    const imageYBefore = (mouseY - offsetY) / scale;
                    const zoomFactor = e.deltaY > 0 ? 0.8 : 1.25;
                    const newScale = Math.max(0.1, Math.min(80, scale * zoomFactor));// Increased max zoom to 80x
                    // \u7F29\u653E\u540E\uFF0C\u8BA9\u56FE\u50CF\u5750\u6807 (imageXBefore, imageYBefore) \u4ECD\u7136\u5BF9\u9F50\u5230\u9F20\u6807\u4F4D\u7F6E
                    const newOffsetX = mouseX - imageXBefore * newScale;
                    const newOffsetY = mouseY - imageYBefore * newScale;
                    scale = newScale;
                    offsetX = newOffsetX;
                    offsetY = newOffsetY;

                    draw();
                });

                canvas.addEventListener('mousedown', (e) => {
                    if (e.target === canvas) {
                        isDragging = true;
                        startX = e.clientX - offsetX;
                        startY = e.clientY - offsetY;
                    }
                });

                canvas.addEventListener('mousemove', (e) => {
                    if (isDragging) {
                        offsetX = e.clientX - startX;
                        offsetY = e.clientY - startY;
                        draw();
                    }

                    // Update pixel info
                    const rect = canvas.getBoundingClientRect();
                    const mouseX = e.clientX - rect.left;
                    const mouseY = e.clientY - rect.top;
                    
                    // Convert mouse coordinates to image coordinates
                    const imageX = Math.floor((mouseX - offsetX) / scale);
                    const imageY = Math.floor((mouseY - offsetY) / scale);

                    if (imageX >= 0 && imageX < cols && imageY >= 0 && imageY < rows) {
                        const idx = (imageY * cols + imageX) * channels;
                        let pixelInfoText = \`Position: (\${imageX}, \${imageY}) | \`;

                        if (channels === 1) {
                            const value = rawData[idx];
                            pixelInfoText += \`Grayscale: \${value}\`;
                        } else if (channels === 3) {
                            const r = rawData[idx + 2];
                            const g = rawData[idx + 1];
                            const b = rawData[idx];
                            pixelInfoText += \`RGB: (\${r}, \${g}, \${b})\`;
                        }
                        pixelInfo.textContent = pixelInfoText;
                    } else {
                        pixelInfo.textContent = '';
                    }
                });

                canvas.addEventListener('mouseup', () => {
                    isDragging = false;
                });

                canvas.addEventListener('mouseleave', () => {
                    isDragging = false;
                });

                window.addEventListener('resize', () => {
                    // hasAutoFit = false;
                    updateCanvasSize();
                    draw();
                });

                // Initialize
                hasAutoFit = false;
                updateCanvasSize();
                draw();
            })();
            </script>
        </body>
        </html>
    `}function Le(){let t="",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(let o=0;o<32;o++)t+=e.charAt(Math.floor(Math.random()*e.length));return t}async function we(t,e,o,i){try{let n=z(t),r,s,c,l,a="";if(n)if(e.variablesReference&&e.variablesReference>0){let d=await O(t,e.variablesReference);r=d.rows,s=d.cols,c=d.channels,l=d.depth,a=d.dataPtr}else{let d=await t.customRequest("scopes",{frameId:o}),f=null;for(let m of d.scopes){let y=await t.customRequest("variables",{variablesReference:m.variablesReference});for(let b of y.variables)if(b.name===i||b.evaluateName===i){f=b;break}if(f)break}if(f&&f.variablesReference>0){let m=await O(t,f.variablesReference);r=m.rows,s=m.cols,c=m.channels,l=m.depth,a=m.dataPtr}else throw new Error("Cannot access Mat variable in LLDB. Make sure it's a valid cv::Mat.")}else if(e.variablesReference&&e.variablesReference>0){let d=await O(t,e.variablesReference);r=d.rows,s=d.cols,c=d.channels,l=d.depth,a=d.dataPtr}else{let d=`${i}.rows`,f=`${i}.cols`,m=`${i}.flags`,y=`${i}.data`,[b,S,A,G]=await Promise.all([I(t,d,o,1e4),I(t,f,o,1e4),I(t,m,o,1e4),I(t,y,o,1e4)]);r=parseInt(b.result),s=parseInt(S.result),a=G.result;let k=parseInt(A.result);if(isNaN(k)){let L=`${i}.channels()`,X=`${i}.depth()`,[ve,Pe]=await Promise.all([I(t,L,o,1e4),I(t,X,o,1e4)]);c=parseInt(ve.result),l=parseInt(Pe.result)}else{let L=k&4095;l=L&7,c=(L>>3&63)+1}}if(isNaN(r)||isNaN(s)||isNaN(c)||isNaN(l))throw new Error("Invalid matrix dimensions or type");if(r<=0||s<=0)throw new Error("Matrix is empty");let w=r*s*c,p=await M.window.withProgress({location:M.ProgressLocation.Notification,title:"Loading OpenCV Mat",cancellable:!1},async d=>(d.report({message:"Reading image data..."}),n&&a?await Be(t,a,o,w,l,d):await Ye(t,`${i}.data`,o,w,l,d))),g=`View: Image ${i}`,u=R.getOrCreatePanel("MatImageViewer",g,t.id,i);u.webview.html=ge(u.webview,r,s,c,l,{base64:""});let x=p.buffer;if(!x)throw new Error("Failed to read Mat data");await u.webview.postMessage({command:"completeData",data:new Uint8Array(x)})}catch(n){throw console.error("Error drawing Mat image:",n),n}}async function O(t,e){let o=await t.customRequest("variables",{variablesReference:e}),i=0,n=0,r=1,s=0,c="",l=0;for(let a of o.variables){let w=a.name,p=a.value;if((w==="cv::Mat"||w.includes("cv::Mat")||w==="Mat"&&p.includes("rows"))&&a.variablesReference>0){let g=await O(t,a.variablesReference);if(i=g.rows,n=g.cols,r=g.channels,s=g.depth,c=g.dataPtr,i>0&&n>0&&c)return{rows:i,cols:n,channels:r,depth:s,dataPtr:c}}}for(let a of o.variables){let w=a.name,p=a.value;if(w==="rows")i=parseInt(p);else if(w==="cols")n=parseInt(p);else if(w==="data"){if(a.memoryReference)c=a.memoryReference;else{let g=p.match(/0x[0-9a-fA-F]+/);g&&(c=g[0])}if(!c&&a.variablesReference>0)try{let g=await t.customRequest("variables",{variablesReference:a.variablesReference});for(let u of g.variables){if(u.memoryReference){c=u.memoryReference;break}let x=u.value?.match(/0x[0-9a-fA-F]+/);if(x){c=x[0];break}}}catch(g){console.log("Failed to expand data variable:",g)}}else if(w==="flags"){l=parseInt(p);let g=l&4095;s=g&7,r=(g>>3&63)+1}}return r===1&&l>0&&console.log("Warning: channels might be incorrect, defaulting to inferred value"),{rows:i,cols:n,channels:r,depth:s,dataPtr:c}}async function Ye(t,e,o,i,n,r){let s=K(n),c=i*s;r.report({message:"Getting data pointer..."});let l=null;try{let w=(await I(t,e,o,5e3)).result.match(/0x[0-9a-fA-F]+/);w&&(l=w[0])}catch(a){console.log("Failed to get data pointer:",a)}if(!l)return M.window.showErrorMessage("Cannot get data pointer from Mat"),{buffer:null};r.report({message:`Reading ${c} bytes...`});try{let a=await B(t,l,c,r);return a?{buffer:a}:(M.window.showErrorMessage("readMemory returned no data"),{buffer:null})}catch(a){return M.window.showErrorMessage(`readMemory failed: ${a.message||a}. Please use cppvsdbg or lldb.`),{buffer:null}}}async function Be(t,e,o,i,n,r){let s=K(n),c=i*s;if(!e||e==="")return M.window.showErrorMessage("Cannot read Mat data: data pointer is null"),{buffer:null};r.report({message:`Reading ${c} bytes...`});try{let l=await B(t,e,c,r);return l?{buffer:l}:(M.window.showErrorMessage("LLDB readMemory returned no data"),{buffer:null})}catch(l){return M.window.showWarningMessage(`LLDB readMemory failed: ${l.message||l}. Creating placeholder image.`),{buffer:null}}}var $=E(require("vscode")),ee=E(require("path")),Z=E(require("fs")),xe=E(require("os"));function U(){return`
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <style>
            html,
            body {
                margin: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
                background: #1e1e1e;
                font-family: Arial, Helvetica, sans-serif;
            }
    
            #container {
                position: relative;
                width: 100vw;
                height: 100vh;
                overflow: hidden;
            }
    
            canvas {
                position: absolute;
                top: 0;
                left: 0;
            }
    
            #grid {
                pointer-events: none;
                z-index: 2;
            }
    
            #controls {
                position: absolute;
                top: 10px;
                left: 10px;
                background: rgba(255, 255, 255, .92);
                padding: 10px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, .25);
                cursor: move;
                user-select: none;
                z-index: 1000;
            }
    
            button {
                margin-right: 5px;
                padding: 6px 10px;
                cursor: pointer;
                border: 1px solid #bbb;
                border-radius: 5px;
                background: #fff;
                transition: .15s;
            }
    
            button:hover {
                background: #f0f0f0;
            }
    
            button.active {
                background: #2563eb;
                color: #fff;
                border-color: #2563eb;
            }
    
            #status {
                margin-left: 6px;
                font-size: 12px;
            }
    
            #pixel {
                position: absolute;
                bottom: 10px;
                left: 10px;
                background: rgba(255, 255, 255, .92);
                color: #000;
                padding: 10px;
                border-radius: 6px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, .2);
                font-size: 12px;
            }
        </style>
    </head>
    
    <body>
        <div id="container"><canvas id="canvas"></canvas><canvas id="grid"></canvas></div>
        <div id="controls"><button id="fit">Reset</button><button id="save">Save PNG</button><button
                id="swap">RGB \u21C4 BGR</button><span id="status">Loading...</span></div>
        <div id="pixel"></div>
        <script>
(function () {
    const vscode = acquireVsCodeApi();
    const canvas = document.getElementById('canvas');
    const grid = document.getElementById('grid');
    const ctx = canvas.getContext('2d');
    const gtx = grid.getContext('2d');
    const container = document.getElementById('container');
    const pixel = document.getElementById('pixel');
    const status = document.getElementById('status');
    const controls = document.getElementById('controls');
    const swapBtn = document.getElementById('swap');
    const img = new Image();
    let rawPixels = null;
    let rgbMode = true;
    let scale = 1,
        offsetX = 0,
        offsetY = 0,
        dragging = false,
        dragX = 0,
        dragY = 0,
        ctrlDragging = false,
        ctrlDX = 0,
        ctrlDY = 0;

    window.addEventListener('message', e => {
        if (e.data.command === 'show') {
            img.src = e.data.uri + '?t=' + Date.now();
        }
    });
    vscode.postMessage({ command: 'ready' });

    img.onload = () => {
        const temp = document.createElement('canvas');
        temp.width = img.width;
        temp.height = img.height;
        const tctx = temp.getContext('2d');
        tctx.drawImage(img, 0, 0);
        rawPixels = tctx.getImageData(0, 0, img.width, img.height);
        resizeCanvas();
        fitImage();
        draw();
    };

    function resizeCanvas() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        grid.width = canvas.width;
        grid.height = canvas.height;
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
        draw();
    });

    function fitImage() {
        if (!img.width) return;
        const sx = canvas.width / img.width,
            sy = canvas.height / img.height;
        scale = Math.min(sx, sy);
        offsetX = (canvas.width - img.width * scale) / 2;
        offsetY = (canvas.height - img.height * scale) / 2;
    }

    function getDisplayImageData() {
        if (!rawPixels) return null;
        const data = new Uint8ClampedArray(rawPixels.data);
        if (!rgbMode) {
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                data[i] = data[i + 2];
                data[i + 2] = r;
            }
        }
        return new ImageData(data, rawPixels.width, rawPixels.height);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (rawPixels) {
            const tmp = document.createElement('canvas');
            tmp.width = rawPixels.width;
            tmp.height = rawPixels.height;
            tmp.getContext('2d').putImageData(getDisplayImageData(), 0, 0);
            ctx.imageSmoothingEnabled = scale < 6;
            ctx.drawImage(tmp, offsetX, offsetY, img.width * scale, img.height * scale);
        }
        drawGrid();
        status.textContent = 'Scale:' + Math.round(scale * 100) + '% | Size:' + img.width + 'x' + img.height + ' | ' + (rgbMode ? 'RGB' : 'BGR');
        // swapBtn.textContent = rgbMode ? 'RGB' : 'BGR';
        swapBtn.textContent = rgbMode ? 'RGB \u21C4 BGR' : 'RGB \u21C4 BGR';
        swapBtn.classList.toggle('active', !rgbMode);
    }

    function drawGrid() {
        gtx.clearRect(0, 0, grid.width, grid.height);
        if (scale < 12 || !rawPixels) return;
        gtx.strokeStyle = 'rgba(255,255,255,0.16)';
        gtx.lineWidth = 1;
        for (let x = 0; x <= rawPixels.width; x++) {
            const px = offsetX + x * scale;
            gtx.beginPath();
            gtx.moveTo(px, offsetY);
            gtx.lineTo(px, offsetY + rawPixels.height * scale);
            gtx.stroke();
        }
        for (let y = 0; y <= rawPixels.height; y++) {
            const py = offsetY + y * scale;
            gtx.beginPath();
            gtx.moveTo(offsetX, py);
            gtx.lineTo(offsetX + rawPixels.width * scale, py);
            gtx.stroke();
        }
    }

    canvas.addEventListener('wheel', e => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left,
            my = e.clientY - rect.top;
        const ix = (mx - offsetX) / scale,
            iy = (my - offsetY) / scale;
        const ns = Math.max(0.05, Math.min(80, scale * (e.deltaY < 0 ? 1.2 : 0.84)));
        offsetX = mx - ix * ns;
        offsetY = my - iy * ns;
        scale = ns;
        draw();
    }, { passive: false });

    canvas.addEventListener('mousedown', e => {
        dragging = true;
        dragX = e.clientX - offsetX;
        dragY = e.clientY - offsetY;
    });

    window.addEventListener('mouseup', () => {
        dragging = false;
        ctrlDragging = false;
    });

    window.addEventListener('mousemove', e => {
        if (dragging) {
            offsetX = e.clientX - dragX;
            offsetY = e.clientY - dragY;
            draw();
        }
        if (ctrlDragging) {
            controls.style.left = (e.clientX - ctrlDX) + 'px';
            controls.style.top = (e.clientY - ctrlDY) + 'px';
        }
        updatePixelInfo(e);
    });

    function updatePixelInfo(e) {
        if (!img.width || !rawPixels) return;
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left - offsetX) / scale),
            y = Math.floor((e.clientY - rect.top - offsetY) / scale);
        if (x >= 0 && x < img.width && y >= 0 && y < img.height) {
            const idx = (y * img.width + x) * 4;
            let r = rawPixels.data[idx],
                g = rawPixels.data[idx + 1],
                b = rawPixels.data[idx + 2];
            if (!rgbMode) {
                const t = r;
                r = b;
                b = t;
            }
            pixel.textContent = 'Position:(' + x + ',' + y + ') | ' + (rgbMode ? 'RGB' : 'BGR') + ':(' + r + ',' + g + ',' + b + ')';
        } else {
            pixel.textContent = '';
        }
    }

    controls.addEventListener('mousedown', e => {
        if (e.target.tagName === 'BUTTON') return;
        ctrlDragging = true;
        ctrlDX = e.clientX - controls.offsetLeft;
        ctrlDY = e.clientY - controls.offsetTop;
    });

    document.getElementById('fit').onclick = () => {
        fitImage();
        draw();
    };
    document.getElementById('save').onclick = () => {
        const a = document.createElement('a');
        a.download = 'image.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
    };
    swapBtn.onclick = () => {
        rgbMode = !rgbMode;
        draw();
    };
})();
</script>
    </body>
    
    </html>`}async function W(t,e,o,i){let n=e.evaluateName||e.name;if(!n){$.window.showErrorMessage("No variable name");return}let r=ee.join(xe.tmpdir(),"vscode-2d3d-viewer");Z.existsSync(r)||Z.mkdirSync(r,{recursive:!0});let s=ee.join(r,`${Date.now()}_${Math.random().toString(36).slice(2)}.png`);await ze(t,o,n,s);let c=$.window.createWebviewPanel("pythonImage",`Image: ${n}`,$.ViewColumn.Active,{enableScripts:!0,retainContextWhenHidden:!0,localResourceRoots:[$.Uri.file(r)]}),l=c.webview.asWebviewUri($.Uri.file(s));c.webview.html=U(),c.webview.onDidReceiveMessage(a=>{a.command==="ready"&&c.webview.postMessage({command:"show",uri:l.toString()})})}async function ze(t,e,o,i){let n=`
import numpy as np

obj = ${o}

# -----------------------------------
# torch -> numpy
# -----------------------------------
try:
    if hasattr(obj, "detach"):
        obj = obj.detach().cpu().numpy()
except:
    pass

# -----------------------------------
# PIL -> numpy
# -----------------------------------
try:
    if "PIL." in str(type(obj)):
        obj = np.array(obj)
except:
    pass

arr = np.array(obj)

# ===================================
# AUTO SHAPE FIX
# \u652F\u6301:
# (H,W)
# (H,W,3)
# (3,H,W)
# (1,3,H,W)
# (N,C,H,W) \u53D6\u7B2C\u4E00\u5F20
# ===================================

# ---------- 2D ----------
if arr.ndim == 2:
    arr = np.stack([arr]*3, axis=-1)

# ---------- 3D ----------
elif arr.ndim == 3:

    # CHW -> HWC
    if arr.shape[0] in (1,3,4) and arr.shape[-1] not in (1,3,4):
        arr = np.transpose(arr, (1,2,0))

# ---------- 4D ----------
elif arr.ndim == 4:

    # (1,3,H,W) / (N,C,H,W)
    if arr.shape[1] in (1,3,4):
        arr = arr[0]                    # \u53D6batch0
        arr = np.transpose(arr,(1,2,0)) # CHW -> HWC

    # (1,H,W,3)
    elif arr.shape[-1] in (1,3,4):
        arr = arr[0]

    else:
        arr = arr[0]

# ---------- channel fix ----------
if arr.ndim == 3:

    if arr.shape[2] == 1:
        arr = np.repeat(arr, 3, axis=2)

    if arr.shape[2] > 4:
        arr = arr[:,:,:3]

# ===================================
# dtype normalize
# ===================================
if arr.dtype != np.uint8:

    arr = arr.astype(np.float32)

    mn = float(arr.min())
    mx = float(arr.max())

    if abs(mx - mn) < 1e-12:
        arr[:] = 0
    else:
        arr = (arr - mn) / (mx - mn) * 255

    arr = np.clip(arr,0,255).astype(np.uint8)

# ===================================
# save png
# ===================================
from PIL import Image
Image.fromarray(arr).save(r'''${i.replace(/\\/g,"/")}''')

print("ok")
`;await t.customRequest("evaluate",{expression:n,frameId:e,context:"repl",silent:!0})}var C=E(require("vscode")),v=E(require("fs")),te=E(require("os")),F=E(require("path"));async function he(t,e,o){try{let i=F.join(te.tmpdir(),"vscode-2d3d-viewer");v.mkdirSync(i,{recursive:!0});let n=Date.now(),r=F.join(i,`o3d_pts_${n}.bin`),s=F.join(i,`o3d_col_${n}.bin`),c=F.join(i,`o3d_meta_${n}.txt`),l=JSON.stringify(o),a=`
import numpy as np
import os

pcd = ${o}

pts = np.asarray(pcd.points, dtype=np.float32)
pts = np.ascontiguousarray(pts)

has_color = False
cols = None

try:
  cols = np.asarray(pcd.colors, dtype=np.float32)
  if cols is not None and len(cols) == len(pts):
      cols = cols[:, :3]
      has_color = True
except:
  has_color = False

MAX_POINTS = 1200000

count = len(pts)

if count > MAX_POINTS:
  step = max(1, count // MAX_POINTS)
  pts = pts[::step]
  pts = np.ascontiguousarray(pts)

  if has_color:
      cols = cols[::step]
      cols = np.ascontiguousarray(cols)

pts.tofile(r'''${r.replace(/\\/g,"/")}''')

if has_color:
  cols = np.clip(cols * 255.0, 0, 255).astype(np.uint8)
  cols = np.ascontiguousarray(cols)
  cols.tofile(r'''${s.replace(/\\/g,"/")}''')

with open(r'''${c.replace(/\\/g,"/")}''', "w", encoding="utf-8") as f:
  f.write(str(len(pts)) + "\\n")
  f.write("1\\n" if has_color else "0\\n")

print("ok")
`;if(await I(t,a,e,6e4),!v.existsSync(c))throw new Error("Meta file not generated.");let w=v.readFileSync(c,"utf8").trim().split(/\r?\n/),p=parseInt(w[0],10),g=w[1]==="1";if(!p||p<=0){C.window.showWarningMessage("Open3D point cloud empty.");return}if(!v.existsSync(r))throw new Error("Point file not generated.");let u=v.readFileSync(r),x=new Float32Array(u.buffer.slice(u.byteOffset,u.byteOffset+u.byteLength)),d=null;if(g&&v.existsSync(s)){let m=v.readFileSync(s);d=new Uint8Array(m.buffer.slice(m.byteOffset,m.byteOffset+m.byteLength))}let f=R.getOrCreatePanel("3DPointViewer",`View: PointCloud ${o}`,t.id,o);f.webview.options={enableScripts:!0},f.webview.html=Q(),await C.window.withProgress({location:C.ProgressLocation.Notification,title:"Loading Point Cloud",cancellable:!1},async m=>{m.report({message:"Preparing point cloud..."});try{await f.webview.postMessage({type:"initCloud",points:Array.from(x),colors:d?Array.from(d):null,count:p,hasColor:g})}catch(y){console.error(y),await f.webview.postMessage({type:"error",message:"Failed to load point cloud data."})}}),f._messageListener&&f._messageListener.dispose(),f._messageListener=f.webview.onDidReceiveMessage(async m=>{if(m.command==="savePcd")try{let y=me(x,d),b=await C.window.showSaveDialog({defaultUri:C.Uri.file(`${o}.pcd`),filters:{"PCD Files":["pcd"],"All Files":["*"]}});b&&(await C.workspace.fs.writeFile(b,y),C.window.showInformationMessage(`Point cloud saved to ${b.fsPath}`))}catch(y){C.window.showErrorMessage(`Failed to save PCD file: ${y}`),console.error("Error saving PCD:",y)}})}catch(i){C.window.showErrorMessage("Open3D viewer failed: "+String(i)),console.error(i)}}async function ye(t,e,o){try{let{pts:i,count:n}=await Te(t,e,o);if(!n||n<=0){C.window.showWarningMessage("Empty Nx3 numpy array.");return}let r=R.getOrCreatePanel("3DPointViewer","View: PointCloud "+o,t.id,o);r.webview.options={enableScripts:!0},r.webview.html=Q(),await C.window.withProgress({location:C.ProgressLocation.Notification,title:"Loading Point Cloud",cancellable:!1},async()=>{await r.webview.postMessage({type:"initCloud",points:Array.from(i),colors:null,count:n,hasColor:!1})})}catch(i){C.window.showErrorMessage("Failed to visualize numpy Nx3: "+String(i)),console.error(i)}}async function Te(t,e,o){let i=F.join(te.tmpdir(),"vscode-2d3d-viewer");v.mkdirSync(i,{recursive:!0});let n=Date.now(),r=F.join(i,`numpy_pts_${n}.bin`),s=F.join(i,`numpy_meta_${n}.txt`),c=`
import numpy as np

arr = np.asarray(${o}, dtype=np.float32)

if arr.ndim != 2 or arr.shape[1] != 3:
  raise Exception("Need shape (N,3)")

arr = np.ascontiguousarray(arr)

MAX_POINTS = 1200000

count = len(arr)

if count > MAX_POINTS:
  step = max(1, count // MAX_POINTS)
  arr = arr[::step]
  arr = np.ascontiguousarray(arr)

arr.tofile(r'''${r.replace(/\\/g,"/")}''')

with open(r'''${s.replace(/\\/g,"/")}''', "w", encoding="utf-8") as f:
  f.write(str(len(arr)) + "\\n")

print("ok")
`;if(await I(t,c,e,6e4),!v.existsSync(s))throw new Error("Meta file not generated.");let l=v.readFileSync(s,"utf8").trim().split(/\r?\n/),a=parseInt(l[0],10);if(!a||a<=0)throw new Error("No point data.");if(!v.existsSync(r))throw new Error("Point file not generated.");let w=v.readFileSync(r),p=new Float32Array(w.buffer.slice(w.byteOffset,w.byteOffset+w.byteLength));try{v.unlinkSync(r)}catch{}try{v.unlinkSync(s)}catch{}return{pts:p,count:a}}function Se(t){let e=P.commands.registerCommand("extension.viewVariable",async i=>{let n=P.debug.activeDebugSession;if(!n){P.window.showErrorMessage("No active debug session.");return}try{let r=i.variable;if(!r||!r.name&&!r.evaluateName){P.window.showErrorMessage("No variable selected.");return}let c=(await n.customRequest("threads")).threads[0].id,a=(await n.customRequest("stackTrace",{threadId:c,startFrame:0,levels:5})).stackFrames[0].id,w=n.type==="lldb",p,g=r.evaluateName||r.name;if(w)try{let m=await n.customRequest("evaluate",{expression:g,frameId:a,context:"watch"});p={result:m.result||r.value,type:m.type||r.type,variablesReference:m.variablesReference||r.variablesReference,evaluateName:g}}catch{p={result:r.value,type:r.type,variablesReference:r.variablesReference,evaluateName:g}}else{let m=Y(n);p=await n.customRequest("evaluate",{expression:g,frameId:a,context:m}),p.evaluateName=g}if(n.type==="python"||n.type==="debugpy"){if(await ie(n,g,a,p)){await pe(n,a,g)?await ye(n,a,g):await W(n,p,a,"numpy");return}if(await ce(n,g,a,p)){await W(n,p,a,"pil");return}if(await le(n,g,a,p)){await W(n,p,a,"torch");return}if((await de(n,g,a,p)).isO3D){await he(n,a,g);return}}let x=re(p),d=ae(p),f=se(p);x.isPoint3?await fe(n,p,g,x.isDouble):d?await we(n,p,a,g):f.isPCL?await ue(n,p,g,f.hasRGB):P.window.showErrorMessage("Variable is not a supported type.")}catch(r){P.window.showErrorMessage(`Error: ${r.message||r}`)}});t.subscriptions.push(e);let o=P.commands.registerCommand("imageViewer.viewImageFile",async i=>{try{let n;if(i&&i.scheme==="file")n=i;else{let l=await P.window.showOpenDialog({canSelectMany:!1,filters:{Images:["jpg","jpeg","png","bmp","gif"]}});if(!l||l.length===0)return;n=l[0]}if(!be.existsSync(n.fsPath)){P.window.showErrorMessage(`File not found: ${n.fsPath}`);return}let r=n.fsPath,s=P.window.createWebviewPanel("Image",`Image: ${r}`,P.ViewColumn.Active,{enableScripts:!0,retainContextWhenHidden:!0}),c=s.webview.asWebviewUri(P.Uri.file(r));s.webview.html=U(),s.webview.onDidReceiveMessage(l=>{l.command==="ready"&&s.webview.postMessage({command:"show",uri:c.toString()})})}catch(n){P.window.showErrorMessage(`Error viewing image: ${n.message}`)}});t.subscriptions.push(o)}0&&(module.exports={activate});
