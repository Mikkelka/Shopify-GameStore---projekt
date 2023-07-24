gsap.registerPlugin(ScrollTrigger);

// gsap.to(".logo", { x: 200, duration: 2 });

// gsap.from(".product-card", {
//     scrollTrigger: {
//         trigger: ".product-card",
//         start: "top button",
//         markers: true

//     },
//     y: 150,
//     duration: 5,
//     opacity: 0,
//     stagger: 0.1,
//     ease: "back.out(1.7)",
// });

// control once 
const once = false

// timeline

// let tl = gsap.timeline({
//     defaults: {
//         duration: 2,
//         ease: "power4.inOut"
//     }
// });

// tl.to(".logo", { 'clip-path': 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' });

let tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".join-benefits",
        start: "0 75%",
    }
});

tl.from(".join-line", {
    x: -100,
    opacity: 0,
    duration: 0.5,
    ease: "power2.inOut"
})
    .from(".join-benefits__block", {
        x: -100,
        opacity: 0,
        duration: 0.5,
        stagger: 0.2,
        ease: "power2.inOut",
        delay: 0.5
    });



ScrollTrigger.batch(".product-card", {
    once: once,
    onEnter: batch => {
        gsap.fromTo(batch,
            { y: 150, opacity: 0 },  // start from
            { y: 0, opacity: 1, duration: .5, stagger: 0.1, ease: "back.out(1.7)" }  // animate to
        );
    }
})

// 
gsap.from(".image-con", {
    scrollTrigger: {
        trigger: ".image-con",
        start: "0 90%",
        end: "0 30%",
        scrub: true,
        // markers: true,
        opacity: 0,
        once: once,

    },
    x: 800,
    rotation: 90,
    duration: 2,
})

// 
gsap.from(".text-con", {
    scrollTrigger: {
        trigger: ".text-con",
        start: "0 90%",
        end: "0 30%",
        scrub: true,
        // markers: true,
        once: once,
    },
    x: -800,
    rotation: 90,
    duration: 2,
})

