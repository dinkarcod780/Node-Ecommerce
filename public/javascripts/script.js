
    
    const menu = document.querySelector(".nav-left i");
    const cross = document.querySelector(".cross");
    
    const tl = gsap.timeline();
    
    tl.to(".nav-right",{
        x:-299,
        duration:0.7
    })
    tl.from(".nav-right>li >a",{
        x:200,
        // opacity:0,
        stagger:.4,
        duration:0.6
    })
    tl.pause()
    
    menu.addEventListener("click",function(){
        tl.play()
    })
    cross.addEventListener("click",function(){
        tl.reverse()
    })
    

var swiper = new Swiper(".mySwiper", {
    // direction: 'vertical',
      spaceBetween: 30,
      centeredSlides: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });

