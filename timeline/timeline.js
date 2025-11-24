console.clear();

gsap.registerPlugin(
  ScrollTrigger,
  DrawSVGPlugin,
  MotionPathPlugin,
  Physics2DPlugin
);
gsap.defaults({ ease: "none" });

gsap.from(".masonry-img", {
  scrollTrigger: {
    trigger: ".panel.red", // SECTION yang lo mau trigger
    start: "top 80%", // mulai animasi saat 80% viewport
    toggleActions: "play none none reverse",
  },
  opacity: 0,
  y: 40,
  duration: 0.8,
  ease: "power2.out",
  stagger: {
    amount: 1.2, // total durasi stagger
    from: "random", // random biar kerasa natural
  },
});

// Horizontal scroll
// let svgpath  = svg.querySelector("path")
// let scrollLength = document.querySelector(".svg-container").scrollWidth;

// // gsap.set(svgpath , {strokeDasharray: 10})

// gsap.to(".svg-container", {
//   x: () => `-${scrollLength - window.innerWidth}`,
//   ease: "none",
//   scrollTrigger: {
//     trigger: ".horizontal-wrapper",
//     start: "top top",
//     end: () => `+=${scrollLength}`,
//     scrub: true,
//     pin: true,
//     anticipatePin: 1,
//   },
// });

// const pulses = gsap
//   .timeline({
//     defaults: {
//       duration: 0.05,
//       autoAlpha: 1,
//       scale: 2,
//       transformOrigin: "center",
//       ease: "elastic(2.5, 1)",
//     },
//   })
//   .to(".ball02", {}, 0.3)
//   .to(".ball03", {}, 0.64)
//   .to(".ball04", {}, 1);

// const main = gsap
//   .timeline({
//     defaults: { duration: 1 },
//     scrollTrigger: {
//       trigger: ".horizontal-wrapper",
//       scrub: true,
//       start: "top top",
//       end: () => `+=${scrollLength}`,
//       markers: true,
//     },
//   })
//   .to(".ball01", { duration: 0.01, autoAlpha: 1 })
//   .from(".theLine", { drawSVG: 0 }, 0)
//   .to(
//     ".ball01",
//     {
//       motionPath: {
//         path: ".theLine",
//         align: ".theLine",
//         alignOrigin: [0.5, 0.5],
//       },
//     },
//     0
//   )
//   .add(pulses, 0);


const container = document.querySelector("#masonry-wrapper");
const section = document.querySelector("#hori-section");

// Biar GSAP tahu ukuran final image masonry
ScrollTrigger.refresh();

gsap.to(container, {
  x: () => -(container.scrollWidth - window.innerWidth),
  ease: "none",
  scrollTrigger: {
    trigger: section,
    start: "top top",
    end: () => `+=${container.scrollWidth - window.innerWidth}`,
    scrub: 1,
    pin: true,
    invalidateOnRefresh: true,
  },
});

let panels = gsap.utils.toArray(".panel");
// we'll create a ScrollTrigger for each panel just to track when each panel's top hits the top of the viewport (we only need this for snapping)
let tops = panels.map((panel) =>
  ScrollTrigger.create({ trigger: panel, start: "top top" })
);

gsap.to(".ig-img", {
  scrollTrigger: {
    trigger: ".explore-gallery",
    start: "top 80%",
    end: "bottom 60%",
    toggleActions: "play none none reverse",
  },
  opacity: 1,
  y: 0,
  scale: 1,
  duration: 0.8,
  ease: "power2.out",
  stagger: {
    each: 0.07,
    from: "random",
  },
});

panels.forEach((panel, i) => {
  if (i == panels.length - 1) {
    // ScrollTrigger.create({
    // trigger: panel,
    // start: () => panel.offsetHeight < window.innerHeight ? "top top" : "bottom bottom", // if it's shorter than the viewport, we prefer to pin it at the top
    // pin: true,
    // markers : true,
    // pinSpacing: false
    // });
    return;
  }
  ScrollTrigger.create({
    trigger: panel,
    start: () =>
      panel.offsetHeight < window.innerHeight ? "top top" : "bottom bottom", // if it's shorter than the viewport, we prefer to pin it at the top
    pin: true,
    // markers : true,
    pinSpacing: false,
  });
});

ScrollTrigger.create({
  snap: {
    snapTo: (progress, self) => {
      // let panelStarts = tops.map(st => st.start), // an Array of all the starting scroll positions. We do this on each scroll to make sure it's totally responsive. Starting positions may change when the user resizes the viewport
      // snapScroll = gsap.utils.snap(panelStarts, self.scroll()); // find the closest one
      // return gsap.utils.normalize(0, ScrollTrigger.maxScroll(window), snapScroll); // snapping requires a progress value, so convert the scroll position into a normalized progress value between 0 and 1
    },
    duration: 0.5,
  },
});

console.clear();

const masterTl = gsap.timeline({
  paused: true,
});
const cannon = document.querySelector(".cannon");
const angle = 20;
const tl1 = gsap
  .timeline()
  .to(cannon, {
    rotation: -angle,
    duration: 0.65,
    ease: "power1.inOut",
  })
  .to(cannon, {
    rotation: angle,
    ease: "power1.inOut",
    duration: 1,
    repeat: 3,
    yoyo: true,
  })
  .to(cannon, {
    rotation: 0,
    duration: 0.65,
    ease: "power1.inOut",
  });

const bullets = [];
const bulletsContainer = document.querySelector(".flair-container");
const tl1Time = tl1.duration();

for (i = 0; i < 1000; i++) {
  const className = "flair--" + gsap.utils.random(1, 35, 1);
  flairBullet = document.createElement("div");
  flairBullet.setAttribute("class", "flair flair-bullet " + className);
  bulletsContainer.appendChild(flairBullet);
  bullets.push(flairBullet);
  gsap.set(flairBullet, { scale: "random(0.4, 0.6)" });
}

const tl2 = gsap
  .timeline()
  .to(bullets, {
    opacity: 1,
    duration: 0.25,
    stagger: {
      amount: tl1Time,
    },
  })
  .to(
    bullets,
    {
      duration: tl1Time,
      physics2D: {
        velocity: "random(600, 850)",
        angle: () => 270 + gsap.getProperty(cannon, "rotation"),
        gravity: 600,
      },
      stagger: {
        amount: tl1Time,
      },
    },
    0
  );

masterTl.add(tl1, 0).add(tl2, 0).play();
window.addEventListener("click", () => masterTl.restart());

// // PIN section
// ScrollTrigger.create({
//   trigger: ".fun-section",
//   start: "top top",
//   end: "+=150%",
//   pin: true,
//   scrub: true
// });

// // 🎈 1. Emoji Rocket terbang ke kanan atas
// gsap.to(".emoji-fly", {
//   x: 300,
//   y: -200,
//   rotation: 30,
//   scrollTrigger: {
//     trigger: ".fun-section",
//     start: "top center",
//     end: "bottom center",
//     scrub: true
//   }
// });

// // 🎯 2. Emoji target muter2
// gsap.to(".emoji-spin", {
//   rotation: 720,
//   scale: 1.5,
//   scrollTrigger: {
//     trigger: ".fun-section",
//     start: "top center",
//     end: "bottom center",
//     scrub: true
//   }
// });

// // 🐸 3. Emoji kodok mantul-mantul
// gsap.to(".emoji-bounce", {
//   y: -50,
//   repeat: -1,
//   yoyo: true,
//   ease: "power1.inOut",
//   duration: 0.5
// });

// // 🐉 4. Naga jalan di motion path (SVG atau path invisible)
// gsap.to(".emoji-path", {
//   motionPath: {
//     path: [
//       { x: 0, y: 0 },
//       { x: 50, y: -30 },
//       { x: 100, y: 10 },
//       { x: 200, y: -50 },
//       { x: 300, y: 0 }
//     ],
//     curviness: 1.25
//   },
//   duration: 3,
//   ease: "power1.inOut",
//   scrollTrigger: {
//     trigger: ".fun-section",
//     start: "top top",
//     end: "bottom top",
//     scrub: true
//   }
// });

// Balon kiri naik looping
gsap.to(".balloon-left", {
  y: -600,
  duration: 6,
  repeat: -1,
  ease: "sine.inOut",
  yoyo: true,
});

// Balon kanan naik looping
gsap.to(".balloon-right", {
  y: -650,
  duration: 7,
  repeat: -1,
  ease: "sine.inOut",
  yoyo: true,
});

// Cake masuk smooth
gsap.from(".cake-container", {
  opacity: 0,
  y: 60,
  duration: 1.8,
  ease: "power3.out",
});
