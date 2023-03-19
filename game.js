const ALLCOLORS=["#FDB813","#FF6666","#5E5E5E","#FFFFFF","#8A2BE2","#00FF7F","#FFB6C1","#FFFF00","#4169E1","#008080","#FFA07A","#00CED1","#FFDAB9","#7B68EE","#FF1493","#00BFFF","#8B008B","#FFC0CB","#87CEFA","#FA8072"]
const board=document.getElementById('board')
const startbtn=document.getElementById('start');
const score=document.getElementById('score');
const levelelem=document.getElementById('level');
const  timer=document.getElementById('timer');
const highscore=document.getElementById('highscore');

let firstCard=null;
let secondCard=null;
let numMatches = 0;
let level=1;
let multiplier=6;


let timerid=null;



startbtn.addEventListener('click',function createboard(){

    document.getElementById('statuscard').style.display="flex";
    const numpairs=document.getElementById('numpairs').value;
    timeRemaining=numpairs*multiplier;
    level=1;
    score.textContent=0;

    highscore.textContent=window.localStorage.getItem(numpairs);
    
    document.getElementById('outcome').textContent=""

    creategame(numpairs);

    timerid=starttimer(numpairs);
    

});


function creategame(numpairs)
{
    const cards=generatepairs(numpairs);
    console.log("ans "+cards)
    levelelem.textContent=level;

    board.innerHTML='';

    firstCard=null;
    secondCard=null;
    numMatches=0;

    for (color in cards)
    {
        console.log("here "+ color);
        const card=createCard(cards[color]);
        board.appendChild(card);
        card.style.pointerEvents="auto";

    }

}

function starttimer(numpairs){

    timer.textContent=numpairs * 2 * (4-level)

    clearInterval(timerid);

    timerid = setInterval(() => {timer.textContent=Number(timer.textContent)-1;
        if (Number(timer.textContent) == 0) {
            clearInterval(timerid);
            alert('Time is up!');
            document.getElementById('outcome').textContent="GAME OVER!"
            let cars=document.querySelectorAll('.card');
            [...cars].forEach((car)=>{
                car.style.pointerEvents="none";
            })
          } 
    }, 1000);

    

    return timerid;


}





function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }



function generatepairs(numpairs){
    let cards=[]

    for(i=0;i<numpairs;i++)
    {
        rndindx=Math.floor(Math.random() * (ALLCOLORS.length) );
        cards.push(ALLCOLORS[rndindx]);
        cards.push(ALLCOLORS[rndindx]);
    }
    console.log(cards);

    return shuffle(cards);
}

function createCard(color){
    const card = document.createElement('div')
    card.classList.add('card');
    card.dataset.color=color;


    card.addEventListener('click',function flip(){

        if (card.classList.contains('matched') || card === secondCard||card=== firstCard) {
            return;
          }
        
        
        card.classList.toggle('flipped');

        
        

        card.style.outline = "none";
        
        card.style.backgroundColor = card.dataset.color;
        
        

        if(!firstCard)
        {firstCard=card;}
        else
        {
        secondCard=card;

        

        if (firstCard.dataset.color === secondCard.dataset.color) {
            
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            numMatches+=1;

            let existing=localStorage.getItem(document.getElementById('numpairs').value);
            if(Number(existing)<numMatches){
                window.localStorage.setItem(document.getElementById('numpairs').value,numMatches);
            
            }
            highscore.textContent=window.localStorage.getItem(document.getElementById('numpairs').value);

            score.textContent= Number(score.textContent)+1;
        
            firstCard = null;
            secondCard = null;

            

            
        }
        else{
            setTimeout(() => {

                firstCard.style.backgroundColor = '#CBE4DE';
                secondCard.style.backgroundColor = '#CBE4DE';
                firstCard.style.outline = "solid 2px #0E8388";
                secondCard.style.outline ="solid 2px #0E8388";
                firstCard.classList.toggle('flipped');
                secondCard.classList.toggle('flipped');
                
               
                firstCard = null;
                secondCard = null;
              }, 750);
        }
        
            

        }

        if(numMatches==document.getElementById('numpairs').value)
        {
            setTimeout(() => {
                alert("Level Cleared!");
                level+=1;
                multiplier-=1;
                if(level<=3)
                {
                    timerid=starttimer(document.getElementById('numpairs').value);
                    creategame(document.getElementById('numpairs').value)
                }
                if(level==4){
                    document.getElementById('outcome').textContent="GAME WON!"
                }
                
              }, 750);
           


        }

        
    })
    return card;
}


