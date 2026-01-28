// main.js
// Core 3D Arabic chemistry lab built with Babylon.js

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("renderCanvas");
  const startReactionBtn = document.getElementById("start-reaction-btn");
  const explanationPanel = document.getElementById("explanation-panel");
  const closeExplanationBtn = document.getElementById("close-explanation-btn");
  const explanationText = document.getElementById("explanation-text");
  const equationText = document.getElementById("equation-text");
  const applicationText = document.getElementById("application-text");
  const feedback = document.getElementById("feedback");
  const starsContainer = document.getElementById("stars");
  const experimentNameEl = document.getElementById("experiment-name");
  const experimentObjectiveEl = document.getElementById("experiment-objective");
  const chemicalsListEl = document.getElementById("chemicals-list");
  const toolsListEl = document.getElementById("tools-list");

  const engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
  });

  // ---------- Experiment Definitions (Educational Layer) ----------

  const experiments = [
    {
      id: "acid_base",
      name: "تجربة التعادل بين حمض وقاعدة",
      objective:
        "فهم كيف يتفاعل حمض قوي مع قاعدة قوية لتكوين ملح وماء، وتقريبًا محلول متعادل.",
      requiredChemicals: ["hcl", "naoh", "indicator"],
      type: "neutralization",
      explanation:
        "عند خلط حمض الهيدروكلوريك (حمض قوي) مع هيدروكسيد الصوديوم (قاعدة قوية)، يتفاعل أيون الهيدروجين +H مع أيون الهيدروكسيد -OH ليكونا جزيئات ماء. يتكوّن أيضًا ملح كلوريد الصوديوم. يتغيّر لون الدليل اللوني ليشير إلى الاقتراب من التعادل.",
      equation: "HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)",
      application:
        "تستخدم تفاعلات التعادل في معالجة حموضة المعدة، ومعالجة مياه الصرف الصحي، وفي الصناعات الدوائية والغذائية لضبط درجة الحموضة.",
    },
    {
      id: "precipitation",
      name: "تجربة تكوين راسب (ترسيب)",
      objective:
        "ملاحظة تكوين راسب صلب غير ذائب عند خلط محلولين مائيين مناسبين.",
      requiredChemicals: ["nacl", "agno3"],
      type: "precipitation",
      explanation:
        "عند خلط محلول كلوريد الصوديوم مع نترات الفضة، تتبادل الأيونات أماكنها. يتكوّن كلوريد الفضة، وهو مركب ضعيف الذوبان في الماء، فيظهر على شكل راسب أبيض معلق في المحلول.",
      equation: "NaCl(aq) + AgNO₃(aq) → AgCl(s)↓ + NaNO₃(aq)",
      application:
        "تستخدم تفاعلات الترسيب في تحليل المياه، وفي الكشف عن أنواع معينة من الأيونات في المختبر، وفي بعض عمليات تنقية المواد.",
    },
    {
      id: "indicator_color",
      name: "تجربة تغيّر لون الدليل",
      objective:
        "استخدام دليل لوني لملاحظة الفرق بين الوسط الحمضي والقاعدي من خلال تغيّر اللون.",
      requiredChemicals: ["acid_solution", "indicator_only"],
      type: "indicator",
      explanation:
        "تحتوي الدلائل اللونية على مواد يتغيّر تركيبها البنيوي قليلًا حسب درجة الحموضة، مما يؤدي إلى تغيّر اللون. في الوسط الحمضي قد يكون اللون أحمر، وفي الوسط القاعدي قد يتحول إلى أزرق أو أرجواني حسب نوع الدليل.",
      equation: "HIn(حمضي) ⇌ In⁻(قاعدي) + H⁺ (تغيّر في اللون)",
      application:
        "تستخدم الدلائل اللونية في معايرات الأحماض والقواعد في المختبرات التعليمية والصناعية، كما تُستخدم شرائح عباد الشمس لمراقبة درجة الحموضة بشكل سريع.",
    },
    {
      id: "gas_release",
      name: "تجربة انطلاق غاز ثاني أكسيد الكربون",
      objective:
        "ملاحظة تكون فقاعات غازية عند تفاعل حمض مع كربونات، مما يدل على انطلاق غاز.",
      requiredChemicals: ["acid_solution", "carbonate"],
      type: "gas_release",
      explanation:
        "عند تفاعل حمض مع كربونات الكالسيوم أو كربونات أخرى، يتكوّن ثاني أكسيد الكربون على شكل فقاعات غازية ترتفع من القاع إلى سطح المحلول. كما يتكوّن ماء وملح ذائب في المحلول.",
      equation: "2HCl(aq) + CaCO₃(s) → CaCl₂(aq) + CO₂(g)↑ + H₂O(l)",
      application:
        "تستخدم هذه التفاعلات في صنع بعض المشروبات الغازية، وفي إزالة الترسبات الكلسية، كما تحدث بشكل طبيعي عند تفاعل الأمطار الحمضية مع الصخور الكلسية.",
    },
  ];

  let currentExperimentIndex = 0;

  // ---------- Star Rating UI ----------

  function setStars(count) {
    const stars = starsContainer.querySelectorAll(".star");
    stars.forEach((star) => {
      const val = parseInt(star.dataset.star, 10);
      if (val <= count) star.classList.add("active");
      else star.classList.remove("active");
    });
  }

  function updateExperimentHeader() {
    const exp = experiments[currentExperimentIndex];
    experimentNameEl.textContent = `تجربة: ${exp.name}`;
    experimentObjectiveEl.textContent = `الهدف: ${exp.objective}`;
  }

  // ---------- Chemical & Tool Definitions for UI + 3D ----------

  const chemicalDefinitions = [
    {
      id: "hcl",
      name: "حمض الهيدروكلوريك",
      tag: "حمض قوي",
      color: new BABYLON.Color3(0.9, 0.9, 1.0),
    },
    {
      id: "naoh",
      name: "هيدروكسيد الصوديوم",
      tag: "قاعدة قوية",
      color: new BABYLON.Color3(0.85, 0.95, 1.0),
    },
    {
      id: "indicator",
      name: "دليل لوني (محلول)",
      tag: "يتغيّر لونه",
      color: new BABYLON.Color3(0.7, 0.1, 0.7),
    },
    {
      id: "nacl",
      name: "محلول كلوريد الصوديوم",
      tag: "محلول ملحي",
      color: new BABYLON.Color3(0.9, 0.95, 1.0),
    },
    {
      id: "agno3",
      name: "محلول نترات الفضة",
      tag: "مؤكسد",
      color: new BABYLON.Color3(0.8, 0.8, 1.0),
    },
    {
      id: "acid_solution",
      name: "محلول حمضي عام",
      tag: "حمضي",
      color: new BABYLON.Color3(0.95, 0.4, 0.4),
    },
    {
      id: "indicator_only",
      name: "دليل لوني فقط",
      tag: "حساس للحموضة",
      color: new BABYLON.Color3(0.2, 0.4, 0.9),
    },
    {
      id: "carbonate",
      name: "كربونات (مثل كربونات الكالسيوم)",
      tag: "صلب مسحوق",
      color: new BABYLON.Color3(0.95, 0.95, 0.95),
    },
  ];

  const toolsDefinitions = [
    {
      id: "beaker",
      name: "كأس زجاجية",
      tag: "في وسط الطاولة",
    },
    {
      id: "test_tube",
      name: "أنبوب اختبار",
      tag: "لنقل كميات صغيرة",
    },
    {
      id: "dropper",
      name: "قطّارة",
      tag: "لإضافة قطرات",
    },
    {
      id: "spoon",
      name: "ملعقة قياس",
      tag: "للمساحيق",
    },
    {
      id: "scale",
      name: "ميزان رقمي",
      tag: "لقياس الكتلة",
    },
  ];

  function buildSidePanels() {
    // Chemicals
    chemicalsListEl.innerHTML = "";
    chemicalDefinitions.forEach((ch) => {
      const card = document.createElement("div");
      card.className = "item-card";
      const name = document.createElement("div");
      name.className = "item-name";
      name.textContent = ch.name;
      const tag = document.createElement("div");
      tag.className = "item-tag";
      tag.textContent = ch.tag;
      card.appendChild(name);
      card.appendChild(tag);
      chemicalsListEl.appendChild(card);
    });

    // Tools
    toolsListEl.innerHTML = "";
    toolsDefinitions.forEach((tool) => {
      const card = document.createElement("div");
      card.className = "item-card";
      const name = document.createElement("div");
      name.className = "item-name";
      name.textContent = tool.name;
      const tag = document.createElement("div");
      tag.className = "item-tag";
      tag.textContent = tool.tag;
      card.appendChild(name);
      card.appendChild(tag);
      toolsListEl.appendChild(card);
    });
  }

  // ---------- Scene Creation ----------

  let scene;
  let beakerMesh;
  let beakerLiquidMesh;
  let beakerGlowLayer;
  let reactionInProgress = false;
  let pouredChemicals = []; // array of chemical ids added to beaker
  let particleSystems = [];

  function clearParticleSystems() {
    particleSystems.forEach((ps) => ps.dispose());
    particleSystems = [];
  }

  function createScene() {
    scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.02, 0.03, 0.08, 1.0);

    // Camera (fixed cinematic)
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      BABYLON.Tools.ToRadians(130),
      BABYLON.Tools.ToRadians(60),
      6,
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    camera.lowerBetaLimit = BABYLON.Tools.ToRadians(40);
    camera.upperBetaLimit = BABYLON.Tools.ToRadians(80);
    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = 7;
    camera.wheelPrecision = 120;
    camera.panningSensibility = 0;
    camera.attachControl(canvas, true);

    // Lights
    const hemiLight = new BABYLON.HemisphericLight(
      "hemiLight",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    hemiLight.intensity = 0.7;

    const spot = new BABYLON.SpotLight(
      "spot",
      new BABYLON.Vector3(0, 5, 3),
      new BABYLON.Vector3(0, -1, -0.4),
      Math.PI / 2.2,
      20,
      scene
    );
    spot.intensity = 1.1;
    spot.diffuse = new BABYLON.Color3(1, 1, 0.9);

    // Lab room (subtle)
    const room = BABYLON.MeshBuilder.CreateBox(
      "room",
      { width: 18, depth: 12, height: 6, sideOrientation: BABYLON.Mesh.BACKSIDE },
      scene
    );
    const roomMat = new BABYLON.StandardMaterial("roomMat", scene);
    roomMat.diffuseColor = new BABYLON.Color3(0.06, 0.09, 0.15);
    roomMat.specularColor = new BABYLON.Color3(0, 0, 0);
    room.material = roomMat;

    // Lab table
    const table = BABYLON.MeshBuilder.CreateBox(
      "table",
      { width: 5.5, depth: 3, height: 0.2 },
      scene
    );
    table.position.y = 0.75;
    table.position.z = 0.3;
    const tableMat = new BABYLON.StandardMaterial("tableMat", scene);
    tableMat.diffuseColor = new BABYLON.Color3(0.08, 0.12, 0.16);
    tableMat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.25);
    tableMat.emissiveColor = new BABYLON.Color3(0.03, 0.04, 0.06);
    table.material = tableMat;

    // Beaker (central)
    const beakerOuter = BABYLON.MeshBuilder.CreateCylinder(
      "beakerOuter",
      { diameterTop: 1.5, diameterBottom: 1.5, height: 2, tessellation: 48, thickness: 0.05 },
      scene
    );
    beakerOuter.position = new BABYLON.Vector3(0, 1.8, 0);
    const beakerMat = new BABYLON.StandardMaterial("beakerMat", scene);
    beakerMat.diffuseColor = new BABYLON.Color3(0.9, 0.95, 1.0);
    beakerMat.alpha = 0.15;
    beakerMat.specularPower = 100;
    beakerMat.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
    beakerMat.emissiveColor = new BABYLON.Color3(0.05, 0.07, 0.12);
    beakerMat.indexOfRefraction = 1.5;
    beakerOuter.material = beakerMat;
    beakerMesh = beakerOuter;

    // Liquid inside beaker
    beakerLiquidMesh = BABYLON.MeshBuilder.CreateCylinder(
      "beakerLiquid",
      { diameterTop: 1.4, diameterBottom: 1.4, height: 0.1, tessellation: 32 },
      scene
    );
    beakerLiquidMesh.position = new BABYLON.Vector3(0, 1.1, 0);
    const liquidMat = new BABYLON.StandardMaterial("liquidMat", scene);
    liquidMat.diffuseColor = new BABYLON.Color3(0.8, 0.95, 1.0);
    liquidMat.alpha = 0.7;
    liquidMat.specularPower = 64;
    beakerLiquidMesh.material = liquidMat;

    // Glow layer for exothermic reactions
    beakerGlowLayer = new BABYLON.GlowLayer("glow", scene, {
      mainTextureFixedSize: 1024,
      blurKernelSize: 32,
    });
    beakerGlowLayer.intensity = 0;

    // Tools (basic 3D props)
    createToolsMeshes(scene, table);

    // Chemical containers (draggable)
    createChemicalBottles(scene, table);

    // Ground under table
    const ground = BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: 30, height: 20 },
      scene
    );
    ground.position.y = 0;
    const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
    groundMat.diffuseColor = new BABYLON.Color3(0.05, 0.06, 0.09);
    groundMat.specularColor = new BABYLON.Color3(0, 0, 0);
    ground.material = groundMat;

    // Subtle camera motion during reactions
    scene.onBeforeRenderObservable.add(() => {
      if (reactionInProgress) {
        const t = performance.now() * 0.001;
        camera.radius = 5.6 + Math.sin(t * 1.5) * 0.08;
        camera.alpha = BABYLON.Tools.ToRadians(130) + Math.sin(t * 0.8) * 0.04;
      }
    });

    return scene;
  }

  // ---------- 3D Tools ----------

  function createToolsMeshes(scene, table) {
    // Test tube holder
    const holder = BABYLON.MeshBuilder.CreateBox(
      "holder",
      { width: 1.2, depth: 0.4, height: 0.05 },
      scene
    );
    holder.position = table.position.clone();
    holder.position.x = -1.5;
    holder.position.y = table.position.y + 0.12;
    const holderMat = new BABYLON.StandardMaterial("holderMat", scene);
    holderMat.diffuseColor = new BABYLON.Color3(0.12, 0.14, 0.2);
    holder.material = holderMat;

    // Test tubes
    for (let i = 0; i < 3; i++) {
      const tube = BABYLON.MeshBuilder.CreateCylinder(
        `testTube_${i}`,
        { diameterTop: 0.15, diameterBottom: 0.15, height: 0.8, tessellation: 32 },
        scene
      );
      tube.position = new BABYLON.Vector3(
        holder.position.x - 0.4 + i * 0.4,
        holder.position.y + 0.4,
        holder.position.z
      );
      const tubeMat = new BABYLON.StandardMaterial(`tubeMat_${i}`, scene);
      tubeMat.diffuseColor = new BABYLON.Color3(0.9, 0.95, 1.0);
      tubeMat.alpha = 0.4;
      tube.material = tubeMat;
    }

    // Dropper
    const dropperBody = BABYLON.MeshBuilder.CreateCylinder(
      "dropperBody",
      { diameterTop: 0.1, diameterBottom: 0.1, height: 0.7 },
      scene
    );
    dropperBody.position = new BABYLON.Vector3(1.8, table.position.y + 0.7, -0.3);
    const dropperMat = new BABYLON.StandardMaterial("dropperMat", scene);
    dropperMat.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.75);
    dropperBody.material = dropperMat;

    const dropperTip = BABYLON.MeshBuilder.CreateCylinder(
      "dropperTip",
      { diameterTop: 0.02, diameterBottom: 0.05, height: 0.25 },
      scene
    );
    dropperTip.position = dropperBody.position.add(new BABYLON.Vector3(0, -0.5, 0.05));
    const tipMat = new BABYLON.StandardMaterial("tipMat", scene);
    tipMat.diffuseColor = new BABYLON.Color3(0.9, 0.3, 0.3);
    dropperTip.material = tipMat;

    // Spoon
    const spoonHandle = BABYLON.MeshBuilder.CreateBox(
      "spoonHandle",
      { width: 0.02, height: 0.02, depth: 0.5 },
      scene
    );
    spoonHandle.position = new BABYLON.Vector3(1.6, table.position.y + 0.65, 0.6);
    const spoonBowl = BABYLON.MeshBuilder.CreateSphere(
      "spoonBowl",
      { diameterX: 0.15, diameterY: 0.05, diameterZ: 0.2 },
      scene
    );
    spoonBowl.position = spoonHandle.position.add(new BABYLON.Vector3(0, 0, 0.3));
    const spoonMat = new BABYLON.StandardMaterial("spoonMat", scene);
    spoonMat.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.85);
    spoonHandle.material = spoonMat;
    spoonBowl.material = spoonMat;

    // Digital scale
    const scaleBase = BABYLON.MeshBuilder.CreateBox(
      "scaleBase",
      { width: 0.9, depth: 0.7, height: 0.08 },
      scene
    );
    scaleBase.position = new BABYLON.Vector3(-2.1, table.position.y + 0.12, 0.6);
    const scaleMat = new BABYLON.StandardMaterial("scaleMat", scene);
    scaleMat.diffuseColor = new BABYLON.Color3(0.15, 0.18, 0.24);
    scaleBase.material = scaleMat;

    const scaleScreen = BABYLON.MeshBuilder.CreateBox(
      "scaleScreen",
      { width: 0.4, depth: 0.12, height: 0.04 },
      scene
    );
    scaleScreen.position = scaleBase.position.add(new BABYLON.Vector3(0, 0.1, -0.15));
    const screenMat = new BABYLON.StandardMaterial("screenMat", scene);
    screenMat.emissiveColor = new BABYLON.Color3(0.2, 0.8, 0.6);
    screenMat.diffuseColor = new BABYLON.Color3(0.05, 0.18, 0.16);
    scaleScreen.material = screenMat;
  }

  // ---------- 3D Chemical Bottles + Drag & Pour ----------

  const bottleMeshes = [];

  function createChemicalBottles(scene, table) {
    const startX = -2.2;
    const spacing = 0.7;

    chemicalDefinitions.forEach((chem, index) => {
      const bottle = BABYLON.MeshBuilder.CreateCylinder(
        `bottle_${chem.id}`,
        { diameterTop: 0.4, diameterBottom: 0.45, height: 1.2, tessellation: 32 },
        scene
      );
      const x = startX + (index % 4) * spacing;
      const row = Math.floor(index / 4);
      const z = -0.5 + row * 0.6;
      bottle.position = new BABYLON.Vector3(x, table.position.y + 0.8, z);

      const bottleMat = new BABYLON.StandardMaterial(`bottleMat_${chem.id}`, scene);
      bottleMat.diffuseColor = new BABYLON.Color3(0.9, 0.9, 0.9);
      bottleMat.specularPower = 64;
      bottle.material = bottleMat;

      // Liquid inside bottle
      const liquid = BABYLON.MeshBuilder.CreateCylinder(
        `bottleLiquid_${chem.id}`,
        { diameterTop: 0.33, diameterBottom: 0.33, height: 0.6, tessellation: 24 },
        scene
      );
      liquid.parent = bottle;
      liquid.position.y = -0.1;
      const liquidMat = new BABYLON.StandardMaterial(`bottleLiquidMat_${chem.id}`, scene);
      liquidMat.diffuseColor = chem.color;
      liquidMat.alpha = 0.8;
      liquidMat.specularPower = 32;
      liquid.material = liquidMat;

      bottle.metadata = {
        type: "chemicalBottle",
        chemicalId: chem.id,
        basePosition: bottle.position.clone(),
        pouredTimes: 0,
      };

      // Drag behavior (3D drag & drop)
      const dragBehavior = new BABYLON.PointerDragBehavior({
        dragPlaneNormal: new BABYLON.Vector3(0, 1, 0),
      });
      dragBehavior.moveAttached = true;
      dragBehavior.updateDragPlane = false;
      bottle.addBehavior(dragBehavior);

      dragBehavior.onDragStartObservable.add(() => {
        if (reactionInProgress) return;
        feedback.textContent = "حرّك الزجاجة فوق الكأس ثم أملها قليلاً لصبّ المادة.";
      });

      dragBehavior.onDragEndObservable.add(() => {
        if (reactionInProgress) return;
        // Snap to base position if far from table
        if (bottle.position.y < 1.0) {
          bottle.position.y = 1.0;
        }
      });

      // On double click / double tap: tilt and pour if over beaker
      let lastClickTime = 0;
      scene.onPointerObservable.add((pointerInfo) => {
        if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) {
          const evt = pointerInfo.event;
          const pickResult = scene.pick(
            scene.pointerX,
            scene.pointerY,
            (m) => m === bottle
          );
          if (pickResult && pickResult.hit) {
            const now = performance.now();
            if (now - lastClickTime < 350) {
              attemptPourFromBottle(bottle);
            }
            lastClickTime = now;
          }
        }
      });

      bottleMeshes.push(bottle);
    });
  }

  function isBottleOverBeaker(bottle) {
    const bPos = bottle.position;
    const beakerPos = beakerMesh.position;
    const dx = bPos.x - beakerPos.x;
    const dz = bPos.z - beakerPos.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    return distance < 0.9 && bPos.y > beakerPos.y + 0.2;
  }

  function attemptPourFromBottle(bottle) {
    if (reactionInProgress) return;
    if (!isBottleOverBeaker(bottle)) {
      feedback.textContent =
        "لتفريغ المادة في الكأس، ضع الزجاجة فوق الكأس ثم انقر عليها مرتين.";
      return;
    }
    const chemId = bottle.metadata.chemicalId;

    // Tilt animation
    const originalRotation = bottle.rotation.clone();
    const targetRotation = new BABYLON.Vector3(
      originalRotation.x + BABYLON.Tools.ToRadians(70),
      originalRotation.y,
      originalRotation.z
    );

    const anim = new BABYLON.Animation(
      `tilt_${chemId}`,
      "rotation.x",
      60,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    const keys = [
      { frame: 0, value: originalRotation.x },
      { frame: 10, value: targetRotation.x },
      { frame: 40, value: originalRotation.x },
    ];
    anim.setKeys(keys);
    bottle.animations = [anim];

    scene.beginAnimation(bottle, 0, 40, false);

    // Liquid pour visual + update beaker contents
    triggerPourEffect(chemId, bottle);
  }

  function triggerPourEffect(chemId, bottle) {
    // Small falling liquid stream
    const stream = new BABYLON.ParticleSystem(`stream_${chemId}`, 600, scene);
    stream.particleTexture = new BABYLON.Texture(
      "https://playground.babylonjs.com/textures/flare.png",
      scene
    );
    stream.emitter = bottle;
    stream.minEmitBox = new BABYLON.Vector3(0, -0.3, 0);
    stream.maxEmitBox = new BABYLON.Vector3(0, -0.35, 0);
    const chemDef = chemicalDefinitions.find((c) => c.id === chemId);
    const cColor = chemDef ? chemDef.color : new BABYLON.Color3(0.8, 0.9, 1);
    stream.color1 = new BABYLON.Color4(cColor.r, cColor.g, cColor.b, 0.7);
    stream.color2 = new BABYLON.Color4(cColor.r, cColor.g, cColor.b, 0.3);
    stream.minSize = 0.02;
    stream.maxSize = 0.05;
    stream.minLifeTime = 0.2;
    stream.maxLifeTime = 0.5;
    stream.emitRate = 300;
    stream.direction1 = new BABYLON.Vector3(0, -1.5, 0);
    stream.direction2 = new BABYLON.Vector3(0.1, -1.6, 0.1);
    stream.gravity = new BABYLON.Vector3(0, -2.5, 0);
    stream.disposeOnStop = true;
    stream.targetStopDuration = 0.4;
    stream.start();
    particleSystems.push(stream);

    // Update beaker liquid level & color (simple blend)
    pouredChemicals.push(chemId);
    const currentColor = beakerLiquidMesh.material.diffuseColor.clone();
    const t = 0.45;
    const blended = new BABYLON.Color3(
      currentColor.r * (1 - t) + cColor.r * t,
      currentColor.g * (1 - t) + cColor.g * t,
      currentColor.b * (1 - t) + cColor.b * t
    );
    beakerLiquidMesh.material.diffuseColor = blended;

    // Increase liquid height up to a limit
    const maxHeight = 0.9;
    const newHeight = Math.min(
      maxHeight,
      beakerLiquidMesh.scaling.y * beakerLiquidMesh.getBoundingInfo().boundingBox.maximum.y +
        0.07
    );
    beakerLiquidMesh.scaling.y = 1 + pouredChemicals.length * 0.1;
    if (beakerLiquidMesh.scaling.y > 1.8) beakerLiquidMesh.scaling.y = 1.8;

    feedback.textContent =
      "تمت إضافة المادة إلى الكأس. يمكنك إضافة مواد أخرى أو الضغط على زر \"ابدأ التفاعل\".";
  }

  // ---------- Reaction Logic & Visuals ----------

  function analyzeReaction() {
    const exp = experiments[currentExperimentIndex];
    if (pouredChemicals.length === 0) {
      feedback.textContent = "لم يتم إضافة أي مادة إلى الكأس بعد.";
      setStars(0);
      return { correct: false, score: 0 };
    }

    const requiredSet = new Set(exp.requiredChemicals);
    const pouredSet = new Set(pouredChemicals);

    let matchedRequired = 0;
    requiredSet.forEach((id) => {
      if (pouredSet.has(id)) matchedRequired += 1;
    });

    const extraChemicals = pouredChemicals.filter(
      (id) => !requiredSet.has(id)
    );

    let score = 0;
    if (matchedRequired === requiredSet.size && extraChemicals.length === 0) {
      score = 3;
      feedback.textContent =
        "أحسنت! اخترت المواد الصحيحة وبالترتيب المناسب تقريبًا. تابع قراءة الشرح لفهم التفاعل بشكل أعمق.";
    } else if (matchedRequired > 0) {
      score = 2;
      feedback.textContent =
        "جزء من التفاعل صحيح، لكن توجد مواد ناقصة أو إضافية. لا بأس، الهدف هنا هو التعلم بالتجربة!";
    } else {
      score = 1;
      feedback.textContent =
        "المواد المختارة لا تمثل هذا النوع من التفاعل بشكل دقيق، ولكنك تتدرّب على التفكير التجريبي. جرّب مرة أخرى.";
    }

    setStars(score);
    return { correct: score === 3, score };
  }

  function triggerReactionVisuals() {
    const exp = experiments[currentExperimentIndex];
    reactionInProgress = true;

    clearParticleSystems();

    // Base bubbling effect from bottom of beaker
    const bubbles = new BABYLON.ParticleSystem("bubbles", 800, scene);
    bubbles.particleTexture = new BABYLON.Texture(
      "https://playground.babylonjs.com/textures/flare.png",
      scene
    );
    bubbles.emitter = beakerLiquidMesh;
    bubbles.minEmitBox = new BABYLON.Vector3(-0.3, -0.1, -0.3);
    bubbles.maxEmitBox = new BABYLON.Vector3(0.3, 0, 0.3);
    bubbles.color1 = new BABYLON.Color4(0.9, 0.95, 1, 0.9);
    bubbles.color2 = new BABYLON.Color4(0.7, 0.85, 1, 0.4);
    bubbles.minSize = 0.03;
    bubbles.maxSize = 0.09;
    bubbles.minLifeTime = 0.6;
    bubbles.maxLifeTime = 1.2;
    bubbles.emitRate = 500;
    bubbles.direction1 = new BABYLON.Vector3(0, 1.2, 0);
    bubbles.direction2 = new BABYLON.Vector3(0.2, 1.5, 0.2);
    bubbles.gravity = new BABYLON.Vector3(0, -0.5, 0);
    bubbles.disposeOnStop = true;
    bubbles.targetStopDuration = 3;
    bubbles.start();
    particleSystems.push(bubbles);

    // Type-specific visuals
    if (exp.type === "neutralization") {
      // Warm glow (exothermic)
      beakerGlowLayer.intensity = 0.5;
      const startColor = beakerLiquidMesh.material.diffuseColor.clone();
      const warmColor = new BABYLON.Color3(1, 0.7, 0.4);
      animateLiquidColor(startColor, warmColor);
    } else if (exp.type === "precipitation") {
      // Cloudy precipitate
      const startColor = beakerLiquidMesh.material.diffuseColor.clone();
      const cloudyColor = new BABYLON.Color3(0.95, 0.95, 0.98);
      animateLiquidColor(startColor, cloudyColor);

      const precipitate = new BABYLON.ParticleSystem("precip", 600, scene);
      precipitate.particleTexture = new BABYLON.Texture(
        "https://playground.babylonjs.com/textures/flare.png",
        scene
      );
      precipitate.emitter = beakerLiquidMesh;
      precipitate.minEmitBox = new BABYLON.Vector3(-0.3, 0.05, -0.3);
      precipitate.maxEmitBox = new BABYLON.Vector3(0.3, 0.1, 0.3);
      precipitate.color1 = new BABYLON.Color4(1, 1, 1, 0.9);
      precipitate.color2 = new BABYLON.Color4(0.9, 0.9, 0.95, 0.4);
      precipitate.minSize = 0.02;
      precipitate.maxSize = 0.06;
      precipitate.minLifeTime = 1;
      precipitate.maxLifeTime = 1.8;
      precipitate.emitRate = 300;
      precipitate.direction1 = new BABYLON.Vector3(0, -0.4, 0);
      precipitate.direction2 = new BABYLON.Vector3(0.1, -0.5, 0.1);
      precipitate.gravity = new BABYLON.Vector3(0, -0.8, 0);
      precipitate.disposeOnStop = true;
      precipitate.targetStopDuration = 3;
      precipitate.start();
      particleSystems.push(precipitate);
    } else if (exp.type === "indicator") {
      // Color change indicator
      const startColor = beakerLiquidMesh.material.diffuseColor.clone();
      const basicColor = new BABYLON.Color3(0.2, 0.4, 0.9);
      animateLiquidColor(startColor, basicColor);
    } else if (exp.type === "gas_release") {
      // Strong gas bubbles + steam/mist
      const gas = new BABYLON.ParticleSystem("gas", 800, scene);
      gas.particleTexture = new BABYLON.Texture(
        "https://playground.babylonjs.com/textures/flare.png",
        scene
      );
      gas.emitter = beakerLiquidMesh;
      gas.minEmitBox = new BABYLON.Vector3(-0.2, 0.05, -0.2);
      gas.maxEmitBox = new BABYLON.Vector3(0.2, 0.1, 0.2);
      gas.color1 = new BABYLON.Color4(0.95, 0.95, 0.95, 0.8);
      gas.color2 = new BABYLON.Color4(0.9, 0.9, 1, 0.2);
      gas.minSize = 0.04;
      gas.maxSize = 0.1;
      gas.minLifeTime = 1.2;
      gas.maxLifeTime = 2;
      gas.emitRate = 500;
      gas.direction1 = new BABYLON.Vector3(0, 1.4, 0);
      gas.direction2 = new BABYLON.Vector3(0.2, 1.7, 0.2);
      gas.gravity = new BABYLON.Vector3(0, -0.3, 0);
      gas.disposeOnStop = true;
      gas.targetStopDuration = 4;
      gas.start();
      particleSystems.push(gas);
    }

    // End reaction after a short while
    setTimeout(() => {
      beakerGlowLayer.intensity = 0;
      reactionInProgress = false;
      showExplanation();
    }, 3500);
  }

  function animateLiquidColor(startColor, targetColor) {
    const anim = new BABYLON.Animation(
      "liquidColorAnim",
      "material.diffuseColor",
      60,
      BABYLON.Animation.ANIMATIONTYPE_COLOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    const keys = [
      { frame: 0, value: startColor },
      { frame: 30, value: targetColor },
      { frame: 120, value: targetColor },
    ];
    anim.setKeys(keys);
    beakerLiquidMesh.animations = [anim];
    scene.beginAnimation(beakerLiquidMesh, 0, 120, false);
  }

  function showExplanation() {
    const exp = experiments[currentExperimentIndex];
    explanationText.textContent = exp.explanation;
    equationText.textContent = exp.equation;
    applicationText.textContent = exp.application;
    explanationPanel.classList.remove("hidden");
  }

  function resetExperimentState() {
    pouredChemicals = [];
    beakerLiquidMesh.scaling.y = 1;
    beakerLiquidMesh.material.diffuseColor = new BABYLON.Color3(0.8, 0.95, 1.0);
    clearParticleSystems();
    beakerGlowLayer.intensity = 0;
    setStars(0);
  }

  // ---------- UI Events ----------

  startReactionBtn.addEventListener("click", () => {
    if (reactionInProgress) return;
    const result = analyzeReaction();
    triggerReactionVisuals();
  });

  closeExplanationBtn.addEventListener("click", () => {
    explanationPanel.classList.add("hidden");
    feedback.textContent =
      "يمكنك الآن اختيار تجربة أخرى أو إعادة التجربة مع تعديل اختيار المواد.";

    // Move to next experiment (loop)
    currentExperimentIndex = (currentExperimentIndex + 1) % experiments.length;
    updateExperimentHeader();
    resetExperimentState();
  });

  // ---------- Bootstrap ----------

  buildSidePanels();
  updateExperimentHeader();

  scene = createScene();

  engine.runRenderLoop(() => {
    if (scene) {
      scene.render();
    }
  });

  window.addEventListener("resize", () => {
    engine.resize();
  });
});

