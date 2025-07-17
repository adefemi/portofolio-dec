import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import * as TWEEN from '@tweenjs/tween.js';

function App() {
  const threeContainerRef = useRef<HTMLDivElement>(null);
  const cssContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, cssRenderer: CSS3DRenderer;
    let earth: THREE.Mesh, stars: THREE.Points, orbitControls: OrbitControls;
    let sections: any[] = [];
    let currentView = 'earth';
    let currentSectionIndex = -1;
    let isTransitioning = false;
    let hasNavigatedOnce = false;
    let animationFrameId: number;

    const textureLoader = new THREE.TextureLoader();

    const ACTIVE_SECTION_X = 0;
    const SECTION_Y = 0;
    const SECTION_Z = -40;
    const SECTION_SLIDE_OFFSET_X = 60;
    const PLANET_TRANSITION_DEPTH_OFFSET = -20;
    const SETTLE_DELAY_MS = 300;

    const EASING_FUNCTION = TWEEN.Easing.Quadratic.InOut;
    const SLIDE_DURATION = 1400;
    const ELEMENT_FADE_DURATION = 500;

    const sectionContents: Record<string, string> = {
      about: `
        <h3>About Me</h3>
        <p>Hi, I'm Adefemi Oseni, a Full Stack Software Engineer passionate about building innovative web solutions. With a strong foundation in Python, JavaScript, Java, C++, HTML, and CSS, I enjoy bringing ideas to life through code. My journey in tech is driven by a continuous desire to learn and create impactful applications. Let's connect and build something great together!</p>
      `,
      projects: `
        <h3>Projects</h3>
        <ul>
          <li><strong>Interactive 3D Portfolio (This Site):</strong> A dynamic showcase of my work using Three.js, HTML, CSS, and Vanilla JavaScript. Explores 3D navigation and interactive elements.</li>
          <li><strong><a href="https://djuix.io" target="_blank">Djuix.io</a></strong> A platform designed to simplify and accelerate the creation of Django projects. It enables users to generate complete Django applications within seconds.</li>
        </ul>
      `,
      experience: `
        <h3>Experience</h3>
        <p><strong>Founder</strong> | Djuix.io</p>
        <ul>
          <li><strong>Rapid Project Setup:</strong> Generate fully functional Django projects in seconds with minimal effort.</li>
          <li><strong>Cloud Deployment Support:</strong> Deploy projects quickly to test and demonstrate functionality.</li>
        </ul>
        <p><strong>Senior Software Engineer</strong> | Bleacher Report | Jun 2021 - Current</p>
        <ul> 
          <li><strong>Software Stability:</strong> Implemented GraphQL Federation upgrades, enhancing system reliability and reducing error rates.</li>
          <li><strong>Security Measures:</strong> Strengthened system security protocols, leading to increased protection against vulnerabilities.</li>
        </ul>
      `,
      skills: `
        <h3>Skills</h3>
        <p><strong>Languages:</strong> Python, JavaScript (ES6+), Java, C++, HTML5, CSS3</p>
        <p><strong>Frontend:</strong> React, Vue.js, Three.js, jQuery, Responsive Design</p>
        <p><strong>Backend:</strong> Node.js, Express.js, Django, Flask, Spring Boot</p>
        <p><strong>Databases:</strong> MongoDB, PostgreSQL, MySQL, SQL</p>
        <p><strong>Tools & Others:</strong> Git, AWS, Docker, REST APIs, Agile Methodologies, UI/UX Principles</p>
      `,
      contact: `
        <h3>Contact Me</h3>
        <p>Let's connect and discuss how I can help bring your projects to life!</p>
        <p><strong>Email:</strong> oseni.adefemigreat@gmail.com</p>
        <p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/adefemi-oseni/" target="_blank">linkedin.com/in/adefemi-oseni</a></p>
        <p><strong>GitHub:</strong> <a href="https://github.com/adefemi" target="_blank">github.com/adefemi</a></p>
      `,
    };

    const sectionData = [
      { id: 'about', name: 'About Me', planetTexture: '/planet_about.jpg', fallbackColor: 0xcc6633, planetRadius: 3.2 },
      { id: 'projects', name: 'Projects', planetTexture: '/planet_projects.jpg', fallbackColor: 0x6699cc, planetRadius: 4.2 },
      { id: 'experience', name: 'Experience', planetTexture: '/planet_experience.jpg', fallbackColor: 0xaaaaff, planetRadius: 2.8 },
      { id: 'skills', name: 'Skills', planetTexture: '/planet_skills.jpg', fallbackColor: 0xff4422, planetRadius: 3.5 },
      { id: 'contact', name: 'Contact', planetTexture: '/planet_contact.jpg', fallbackColor: 0x44cc88, planetRadius: 2.6 },
    ];

    const initialInfoElem = document.getElementById('info-initial') as HTMLDivElement;
    const prevButton = document.getElementById('prev-section') as HTMLButtonElement;
    const nextButton = document.getElementById('next-section') as HTMLButtonElement;

    function tweenToPromise(tween: TWEEN.Tween<any>) {
      return new Promise(resolve => {
        tween.onComplete(() => resolve(true));
      });
    }

    function updateNavButtons() {
      if (currentView === 'earth') {
        prevButton.disabled = true; 
        nextButton.disabled = sections.length === 0;
      } else { 
        prevButton.disabled = false; 
        nextButton.disabled = currentSectionIndex >= sections.length - 1;
      }
    }

    function init() {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
      camera.position.set(0, 8, 20);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      threeContainerRef.current!.appendChild(renderer.domElement);

      cssRenderer = new CSS3DRenderer();
      cssRenderer.setSize(window.innerWidth, window.innerHeight);
      cssContainerRef.current!.appendChild(cssRenderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.3);
      directionalLight.position.set(10, 8, 10);
      scene.add(directionalLight);

      createEarth();
      createStars();
      createSections();

      orbitControls = new OrbitControls(camera, renderer.domElement);
      orbitControls.enableDamping = true;
      orbitControls.dampingFactor = 0.05;
      orbitControls.enabled = false;

      window.addEventListener('resize', onWindowResize);

      prevButton.addEventListener('click', navigatePrev);
      nextButton.addEventListener('click', navigateNext);

      goToEarthView(true);
      updateNavButtons();
      animate();
    }

    function createEarth() {
      textureLoader.load('/2k_earth_daymap.jpg', (texture) => {
        const geometry = new THREE.SphereGeometry(5, 64, 64);
        const material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.8, metalness: 0.1 });
        earth = new THREE.Mesh(geometry, material);
        scene.add(earth);
      }, undefined, (err) => console.error('Earth texture load error:', err));
    }

    function createStars() {
      const starVertices = [];
      for (let i = 0; i < 20000; i++) {
        const x = THREE.MathUtils.randFloatSpread(3000); 
        const y = THREE.MathUtils.randFloatSpread(3000);
        const z = THREE.MathUtils.randFloatSpread(3000);
        starVertices.push(x, y, z);
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
      const starTexture = textureLoader.load('/star.png');
      const material = new THREE.PointsMaterial({
        color: 0xffffff, size: 2.0, map: starTexture,
        transparent: true, blending: THREE.AdditiveBlending, depthWrite: false 
      });
      stars = new THREE.Points(geometry, material);
      scene.add(stars);
    }

    function createSections() {
      sectionData.forEach((data) => {
        const sectionGroup = new THREE.Group();
        const planetRadius = data.planetRadius;

        const planetMaterial = new THREE.MeshStandardMaterial({
          color: data.fallbackColor,
          roughness: 0.8,
          metalness: 0.1,
        });
        const planetGeo = new THREE.SphereGeometry(planetRadius, 32, 32);
        const planetMesh = new THREE.Mesh(planetGeo, planetMaterial);
        sectionGroup.add(planetMesh);

        textureLoader.load(
          data.planetTexture,
          (tex) => {
            planetMaterial.map = tex;
            planetMaterial.color.set(0xffffff);
            planetMaterial.needsUpdate = true;
          },
          undefined,
          (err) => {
            console.error(`Texture load error for ${data.id}:`, err);
          }
        );

        const labelDiv = document.createElement('div');
        labelDiv.className = 'section-label';
        labelDiv.textContent = data.name;
        const label3D = new CSS3DObject(labelDiv);
        label3D.position.set(0, planetRadius + 1.5, 0);
        label3D.scale.set(0.02, 0.02, 0.02); 
        sectionGroup.add(label3D);

        const billboardDiv = document.createElement('div');
        billboardDiv.className = 'billboard-content';
        billboardDiv.innerHTML = sectionContents[data.id];
        const billboard3D = new CSS3DObject(billboardDiv);
        billboard3D.element.classList.add('billboard-html-wrapper');

        billboard3D.position.set(planetRadius + 3.5, 0.5, 3);
        if (window.innerWidth < 768) {
          billboard3D.position.set(planetRadius + -2.5, -6, 1);
        }

        billboard3D.scale.set(0.015, 0.015, 0.015);
        billboard3D.rotation.y = -Math.PI / 9;
        sectionGroup.add(billboard3D);
        
        sectionGroup.position.set(SECTION_SLIDE_OFFSET_X, SECTION_Y, SECTION_Z);
        sectionGroup.visible = false;
        billboard3D.element.style.opacity = '0';
        label3D.element.style.opacity = '0';
        scene.add(sectionGroup);

        let cameraPositionOffset = new THREE.Vector3(0, planetRadius * 0.5, planetRadius + 15 + 5);
        if (window.innerWidth < 768) {
          cameraPositionOffset = new THREE.Vector3(0, planetRadius * 0.5 - 8, planetRadius + 15 + 5);
        }
        sections.push({
          id: data.id, group: sectionGroup, planetMesh: planetMesh, label3D: label3D, billboard3D: billboard3D,
          planetRadius: planetRadius,
          cameraPositionOffset: cameraPositionOffset,
        });
      });
    }

    function handleFirstNavigation() {
      if (!hasNavigatedOnce) {
        initialInfoElem.style.opacity = '0';
        setTimeout(() => { initialInfoElem.style.display = 'none'; }, 500);
        hasNavigatedOnce = true;
      }
    }

    function navigatePrev() {
      if (isTransitioning) return;
      handleFirstNavigation();
      if (currentView === 'earth') {
        return; 
      } else if (currentView === 'section') {
        if (currentSectionIndex > 0) {
          goToSection(currentSectionIndex - 1);
        } else { 
          goToEarthView();
        }
      }
    }

    function navigateNext() {
      if (isTransitioning) return;
      handleFirstNavigation();
      if (currentView === 'earth') {
        if (sections.length > 0) {
          goToSection(0);
        }
      } else if (currentView === 'section') {
        if (currentSectionIndex < sections.length - 1) {
          goToSection(currentSectionIndex + 1);
        }
      }
    }

    async function hideSectionElements(section: any, duration = ELEMENT_FADE_DURATION) {
      if (!section || !section.group.visible) return Promise.resolve();
      const promises = [];
      if (parseFloat(section.billboard3D.element.style.opacity) > 0.01) {
        const tween = new TWEEN.Tween({ opacity: 1 }).to({ opacity: 0 }, duration).easing(EASING_FUNCTION)
          .onUpdate(obj => section.billboard3D.element.style.opacity = obj.opacity.toString());
        promises.push(tweenToPromise(tween.start()));
      }
      if (parseFloat(section.label3D.element.style.opacity) > 0.01) {
        const tween = new TWEEN.Tween({ opacity: 1 }).to({ opacity: 0 }, duration).easing(EASING_FUNCTION)
          .onUpdate(obj => section.label3D.element.style.opacity = obj.opacity.toString());
        promises.push(tweenToPromise(tween.start()));
      }
      if (promises.length > 0) await Promise.all(promises);
    }

    async function showSectionElements(section: any, duration = ELEMENT_FADE_DURATION, delay = 100) {
      if (!section) return Promise.resolve();
      section.label3D.element.style.opacity = '0';
      section.billboard3D.element.style.opacity = '0';
      const promises = [];
      const labelTween = new TWEEN.Tween({ opacity: 0 }).to({ opacity: 1 }, duration).easing(EASING_FUNCTION)
        .onUpdate(obj => section.label3D.element.style.opacity = obj.opacity.toString());
      promises.push(tweenToPromise(labelTween.start()));

      const billboardTween = new TWEEN.Tween({ opacity: 0 }).to({ opacity: 1 }, duration).delay(delay).easing(EASING_FUNCTION)
        .onUpdate(obj => section.billboard3D.element.style.opacity = obj.opacity.toString());
      promises.push(tweenToPromise(billboardTween.start()));
      await Promise.all(promises);
    }

    async function goToEarthView(instant = false) {
      if (isTransitioning && !instant) return;
      isTransitioning = true;
      orbitControls.enabled = false;

      const outgoingSection = (currentSectionIndex !== -1) ? sections[currentSectionIndex] : null;
      const animationPromises: Promise<any>[] = [];

      if (outgoingSection) {
        const slideOutTargetX = (outgoingSection.group.position.x > 0) ? SECTION_SLIDE_OFFSET_X : -SECTION_SLIDE_OFFSET_X;
        animationPromises.push(tweenToPromise(new TWEEN.Tween(outgoingSection.group.position)
          .to({ x: slideOutTargetX, z: SECTION_Z + PLANET_TRANSITION_DEPTH_OFFSET }, SLIDE_DURATION)
          .easing(EASING_FUNCTION).start()));
        animationPromises.push(hideSectionElements(outgoingSection, ELEMENT_FADE_DURATION));
      }

      currentView = 'earth';
      currentSectionIndex = -1;
      updateNavButtons();

      const earthTargetPos = new THREE.Vector3(0, 8, 20);
      const earthLookAt = new THREE.Vector3(0, 0, 0);

      if (instant) {
        if (outgoingSection) {
          const slideOutTargetX = (outgoingSection.group.position.x > 0) ? SECTION_SLIDE_OFFSET_X : -SECTION_SLIDE_OFFSET_X;
          outgoingSection.group.position.set(slideOutTargetX, SECTION_Y, SECTION_Z + PLANET_TRANSITION_DEPTH_OFFSET);
          outgoingSection.group.visible = false;
        }
        camera.position.copy(earthTargetPos);
        orbitControls.target.copy(earthLookAt);
        camera.lookAt(earthLookAt);
        orbitControls.enabled = true;
        orbitControls.minDistance = 7;
        orbitControls.maxDistance = 150;
        isTransitioning = false;
        return;
      }
      
      const currentLookAt = orbitControls.target.clone();
      animationPromises.push(tweenToPromise(new TWEEN.Tween(camera.position)
        .to(earthTargetPos, SLIDE_DURATION).easing(EASING_FUNCTION).start()));
      animationPromises.push(tweenToPromise(new TWEEN.Tween(currentLookAt)
        .to(earthLookAt, SLIDE_DURATION).easing(EASING_FUNCTION)
        .onUpdate(() => {
          orbitControls.target.copy(currentLookAt);
          camera.lookAt(orbitControls.target);
        }).start()));
      
      await Promise.all(animationPromises);
      if (outgoingSection) outgoingSection.group.visible = false;
      
      orbitControls.enabled = true;
      orbitControls.minDistance = 7;
      orbitControls.maxDistance = 150;
      orbitControls.target.copy(earthLookAt);
      isTransitioning = false;
    }

    async function goToSection(targetIndex: number, instant = false) {
      if ((isTransitioning && !instant) || targetIndex < 0 || targetIndex >= sections.length || targetIndex === currentSectionIndex) {
        return;
      }
      
      isTransitioning = true;
      orbitControls.enabled = false;

      const prevIndex = currentSectionIndex;
      currentView = 'section';
      currentSectionIndex = targetIndex;
      updateNavButtons();

      const incomingSection = sections[targetIndex];
      const outgoingSection = (prevIndex !== -1) ? sections[prevIndex] : null;
      const scrollDirection = (prevIndex === -1 || targetIndex > prevIndex) ? 1 : -1;

      const animationPromises: Promise<any>[] = [];

      if (outgoingSection) {
        const outgoingTargetX = (scrollDirection > 0) ? -SECTION_SLIDE_OFFSET_X : SECTION_SLIDE_OFFSET_X;
        animationPromises.push(tweenToPromise(new TWEEN.Tween(outgoingSection.group.position)
          .to({ x: outgoingTargetX, z: SECTION_Z + PLANET_TRANSITION_DEPTH_OFFSET }, SLIDE_DURATION)
          .easing(EASING_FUNCTION).start()));
        animationPromises.push(hideSectionElements(outgoingSection, ELEMENT_FADE_DURATION));
      }

      const incomingStartX = (scrollDirection > 0) ? SECTION_SLIDE_OFFSET_X : -SECTION_SLIDE_OFFSET_X;
      incomingSection.group.position.set(incomingStartX, SECTION_Y, SECTION_Z + PLANET_TRANSITION_DEPTH_OFFSET);
      incomingSection.group.visible = true;
      incomingSection.label3D.element.style.opacity = '0';
      incomingSection.billboard3D.element.style.opacity = '0';

      animationPromises.push(tweenToPromise(new TWEEN.Tween(incomingSection.group.position)
        .to({ x: ACTIVE_SECTION_X, z: SECTION_Z }, SLIDE_DURATION).easing(EASING_FUNCTION).start()));

      const finalCamPos = new THREE.Vector3(
        ACTIVE_SECTION_X + incomingSection.cameraPositionOffset.x,
        SECTION_Y + incomingSection.cameraPositionOffset.y,
        SECTION_Z + incomingSection.cameraPositionOffset.z
      );
      const planetCenter = new THREE.Vector3(ACTIVE_SECTION_X, SECTION_Y, SECTION_Z);
      const billboardPos = planetCenter.clone().add(incomingSection.billboard3D.position);
      const finalLookAt = planetCenter.clone().lerp(billboardPos, 0.5);
      
      if (instant) {
        if (outgoingSection) {
          const outgoingTargetX = (scrollDirection > 0) ? -SECTION_SLIDE_OFFSET_X : SECTION_SLIDE_OFFSET_X;
          outgoingSection.group.position.set(outgoingTargetX, SECTION_Y, SECTION_Z + PLANET_TRANSITION_DEPTH_OFFSET);
          outgoingSection.group.visible = false;
        }
        incomingSection.group.position.set(ACTIVE_SECTION_X, SECTION_Y, SECTION_Z);
        incomingSection.group.visible = true;
        incomingSection.label3D.element.style.opacity = '1';
        incomingSection.billboard3D.element.style.opacity = '1';
        camera.position.copy(finalCamPos);
        orbitControls.target.copy(finalLookAt);
        camera.lookAt(finalLookAt);
        
        orbitControls.enabled = true;
        orbitControls.minDistance = incomingSection.planetRadius + 1.5;
        orbitControls.maxDistance = incomingSection.planetRadius + 25;
        orbitControls.target.copy(finalLookAt);

        isTransitioning = false;
        return;
      }

      animationPromises.push(tweenToPromise(new TWEEN.Tween(camera.position)
        .to(finalCamPos, SLIDE_DURATION).easing(EASING_FUNCTION)
        .start()));

      const currentLookAt = orbitControls.target.clone();
      animationPromises.push(tweenToPromise(new TWEEN.Tween(currentLookAt)
        .to(finalLookAt, SLIDE_DURATION).easing(EASING_FUNCTION)
        .onUpdate(() => {
          orbitControls.target.copy(currentLookAt);
          camera.lookAt(orbitControls.target);
        }).start()));
      
      await Promise.all(animationPromises);
      if (outgoingSection) {
        outgoingSection.group.visible = false;
      }

      await showSectionElements(incomingSection, ELEMENT_FADE_DURATION, 100);
      
      orbitControls.enabled = true;
      orbitControls.minDistance = incomingSection.planetRadius + 1.5;
      orbitControls.maxDistance = incomingSection.planetRadius + 25;
      orbitControls.minPolarAngle = Math.PI / 3.5; 
      orbitControls.maxPolarAngle = Math.PI - Math.PI / 3.5;
      orbitControls.target.copy(finalLookAt);

      await new Promise(resolve => setTimeout(resolve, SETTLE_DELAY_MS));
      isTransitioning = false;
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      cssRenderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      TWEEN.update(performance.now());

      if (earth && currentView === 'earth' && orbitControls.enabled) {
        earth.rotation.y += 0.0003;
      }
      sections.forEach(section => {
        if(section.group.visible) section.planetMesh.rotation.y += 0.001; 
      });
      
      if (orbitControls.enabled) {
        orbitControls.update(); 
      }
      
      renderer.render(scene, camera);
      cssRenderer.render(scene, camera);
    }

    init();

    const threeContainer = threeContainerRef.current;
    const cssContainer = cssContainerRef.current;

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onWindowResize);
      prevButton.removeEventListener('click', navigatePrev);
      nextButton.removeEventListener('click', navigateNext);
      
      if (threeContainer) threeContainer.innerHTML = '';
      if (cssContainer) cssContainer.innerHTML = '';
    };
  }, []);

  return (
    <>
      <div id="info-initial">Click arrows to navigate sections</div>
      <div id="threejs-container" ref={threeContainerRef}></div>
      <div id="css3d-container" ref={cssContainerRef}></div>

      <div id="navigation-controls">
        <button id="prev-section" className="nav-arrow" title="Previous Section">←</button>
        <button id="next-section" className="nav-arrow" title="Next Section">→</button>
      </div>
    </>
  );
}

export default App;
