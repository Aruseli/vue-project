<template>
  <div class="column mb-100 absolute logo_block">
    <div class="container">
      <div class="cube_transform">
        <div class="face top">
          <div class="relative-position">
            <div class="top_letter absolute">
              <div class="horizontal_line" />
              <div class="vertical_line" />
            </div>
          </div>
        </div>
        <div class="face bottom" />
        <div class="face left" />
        <div class="face front">
          <div class="front_letter absolute">
            <div class="horizontal_front_line" />
            <div class="vertical_front_left_line" />
            <div class="vertical_front_right_line" />
          </div>
        </div>
        <div class="face right">
          <div class="right_letter absolute">
            <div class="horizontal_top_line" />
            <div class="horizontal_bottom_line" />
            <div class="vertical_left_line" />
            <div class="r_cube_left_top_line" />
            <div class="r_cube_left_bottom_line" />
            <div class="r_cube_right_top_line" />
            <div class="r_cube_right_bottom_line" />
            <div class="cube_right_top_line" />
            <div class="cube_right_bottom_line" />
          </div>
        </div>
        <div class="face back" />
      </div>
    </div>
    <div class="row items-center justify-center">
      <div class="text-h3 text-uppercase high_animation mr-10">high</div>
      <div class="text-h3 text-uppercase case_animation">case</div>
    </div>
  </div>
</template>

<style scoped>
.logo_block {
  top: 2rem;
}
.container {
  width: 200px;
  height: 200px;
  perspective: 7000px;
  margin: 40px;
  scale: 0.7;
}

.cube_transform {
  /* transform:  rotateX(-30deg); */
  position: relative;
  width: 200px;
  height: 200px;
  transform-style: preserve-3d;
  animation: rotateAnimation 3s ease 0s 1 normal forwards;
}
.face {
  width: 200px;
  height: 200px;
  background: skyblue;
  /* border: 2px solid black; */
  position: absolute;
  opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
  font-size: 2rem;
}
.front {
  transform: translateZ(100px);
  background-color: #C7C7C7;
}
.back {
  transform: translateZ(-100px) rotateY(180deg);
  background-color: #C7C7C7;
}
.left {
  transform: translateX(-100px) rotateY(-90deg);
  background-color: #B0B0B0;
}

.right {
  transform: translateX(100px) rotateY(90deg);
  background-color: #B0B0B0;
}
.top {
  transform: translateY(-100px) rotateX(90deg);
  background-color: #D3D3D3;
}

.bottom {
  transform: translateY(100px) rotateX(-90deg);
  background-color: #D3D3D3;
}
@keyframes rotateAnimation {
  0% {
    transform: rotateX(0deg) rotateY(0deg);
  }
  50% {
    transform: rotateX(-30deg);
  }

  100% {
    transform: rotateX(-30deg) rotateY(-45deg);
  }
}
.top_letter {
  width: 12rem;
  height: 12rem;
  position: absolute;
  opacity: 0;
  animation: xAnimation 3s ease 1s 1 normal forwards;
}
@keyframes xAnimation {
  0% {
    opacity: 0;
    top: 50%;
    left: 350%;
    transform: translate(-50%, -350%);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.horizontal_line {
  width: 10rem;
  height: 2.2rem;
  background-color: #4f4f4f;
  transform: rotate(90deg) translateX(5rem) translateY(-0.8rem)
}
.vertical_line {
  width: 10rem;
  height: 2.2rem;
  background-color: #4f4f4f;
  transform: translateY(2.5rem) translateX(1rem);
}

.front_letter {
  width: 12rem;
  height: 12rem;
  position: absolute;
  opacity: 0;
  animation: hAnimation 3s ease 1s 1 normal forwards;
}

@keyframes hAnimation {
  0% {
    opacity: 0;
    top: -50%;
    left: -350%;
    transform: translate(50%, 350%);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.horizontal_front_line {
  width: 9rem;
  height: 2.2rem;
  background-color: #4f4f4f;
  transform: translateY(5rem) translateX(1.5rem);
}
.vertical_front_left_line {
  width: 10rem;
  height: 2.2rem;
  background-color: #4f4f4f;
  transform: rotate(90deg) translateX(2.6rem) translateY(3rem);
}
.vertical_front_right_line {
  width: 10rem;
  height: 2.2rem;
  background-color: #4f4f4f;
  transform: rotate(90deg) translateX(0.5rem) translateY(-5rem);
}

.right_letter {
  width: 12rem;
  height: 12rem;
  position: absolute;
  opacity: 0;
  animation: cAnimation 3s ease 1s 1 normal forwards;
}
@keyframes cAnimation {
  0% {
    opacity: 0;
    top: -50%;
    right: -350%;
    transform: translate(50%, 350%);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    top: 50%;
    right: 50%;
    transform: translate(-50%, -50%);
  }
}
.horizontal_top_line {
  width: 8rem;
  height: 2.2rem;
  background-color: #4f4f4f;
  transform: translateX(14rem) translateY(0.8rem);
}
.horizontal_bottom_line {
  width: 8rem;
  height: 2.2rem;
  background-color: #4f4f4f;
  transform: translateX(14rem) translateY(6.8rem);
}
.vertical_left_line {
  width: 8rem;
  height: 2.2rem;
  background-color: #4f4f4f;
  transform: rotate(90deg) translateX(0.5rem) translateY(-10rem);
}
.r_cube_left_top_line {
  width: 2.2rem;
  height: 1.6rem;
  background-color: #4f4f4f;
  transform: rotate(42deg) translateX(6.28rem) translateY(-12.7rem);
}
.r_cube_left_bottom_line {
  width: 1.7rem;
  height: 0.9rem;
  background-color: #4f4f4f;
  transform: rotate(48deg) translateX(9.89rem) translateY(-8.51rem);
}
.r_cube_right_top_line {
  width: 1rem;
  height: 1.7rem;
  background-color: #4f4f4f;
  transform: rotateZ(-48deg) translateX(20.66rem) translateY(10.75rem);
}
.r_cube_right_bottom_line {
  width: 1.7rem;
  height: 2.2rem;
  background-color: #4f4f4f;
  transform: rotateZ(-45deg) translateX(16.3rem) translateY(13.4rem);
}
.cube_right_top_line {
  width: 2.2rem;
  height: 2.5rem;
  background-color: #4f4f4f;
  transform: translateX(21.1rem) translateY(-11rem);
}
.cube_right_bottom_line {
  width: 2.2rem;
  height: 2.5rem;
  background-color: #4f4f4f;
  transform: translateX(21.01rem) translateY(-7.9rem);
}

.high_animation {
  /* position: absolute; */
  opacity: 0;
  color: #d3d3d3;
  animation: highAnimation 3s ease 0s 1 normal forwards;
}
.case_animation {
  /* position: absolute; */
  opacity: 0;
  color: #d3d3d3;
  animation: caseAnimation 3s ease 0s 1 normal forwards;
}
@keyframes highAnimation {
  0% {
    opacity: 0;
    transform: translateX(-20rem);
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
    transform: translateX(0rem);
  }
}
@keyframes caseAnimation {
  0% {
    opacity: 0;
    transform: translateX(20rem);
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
    transform: translateX(0rem);
  }
}
</style>
