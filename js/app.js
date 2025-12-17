/*------------------------ Cached Elements ------------------------*/
const startScreen = document.querySelector(".start-screen");
const gameScreen = document.querySelector(".game-screen");

const startBtn = document.querySelector("#start");
const backBtn = document.querySelector("#back");
const resetBtn = document.querySelector("#reset");

const board = document.querySelector("#board");
const player = document.querySelector("#player");

/*------------------------ Variables ------------------------*/
let gameActive = false;
let gameInterval;
let bombInterval;

let bullets = [];
let bombs = []; 
let enemies = [];
let score = 0;
let lives = 3;

