Vue.component('row-m', {
  data: function () {
    return {
      choosenCharacters: [],
      characters: JSON.parse(JSON.stringify(this.shuffledCharacters)),
    }
  },
  props: ['shuffledCharacters'], 
  created() {
    this.$on('sendToParent', (obj) => {
    	this.choosenCharacters.push(obj);
    })
  },
methods: {  
  checkForCombination: function() {
    let brojCrvenih = 0;
    if (this.choosenCharacters.length < 4){
    	return;
    }
    // red loop
    for (i = 0; i < this.choosenCharacters.length; i++) {
      if(this.choosenCharacters[i].name == this.characters[i].name){
        this.choosenCharacters[i].crveni = true;
        this.characters[i].crveni = true;
        brojCrvenih++; 
      }
    }
    // yellow loop
    for (i = 0; i < this.choosenCharacters.length; i++) {
    	for (y = 0; y < this.choosenCharacters.length; y++) {  
        if (this.characters[y].crveni || this.characters[y].zuti){
          continue;
        }
        if(this.choosenCharacters[i].name == this.characters[y].name){
          	this.choosenCharacters[i].zuti = true;
            this.characters[y].zuti = true;
            break;  
        }
      }
   }
   this.choosenCharacters.push(null);
   this.choosenCharacters.pop();
    
   this.$parent.$emit('incrementActiveIndex');
   
    if (brojCrvenih == 4){
      this.$parent.$emit('gameWon');
    }
  },
    
},      
  template:`<div>
  				     <button-m></button-m>
        	     <button-m></button-m>
      		     <button-m></button-m>
      		     <button-m></button-m>
               <button v-on:click="checkForCombination()">ok</button>
              <div class="rezultat">
                <span             
                  v-for="character in choosenCharacters"
                  v-bind:class="{ 'tacno' : character.crveni == true }">
                </span>
                <span              
                  v-for="character in choosenCharacters"
                  v-bind:class="{ 'netacno' : character.zuti == true }">
                </span>
              </div>
            </div>`,      
         });  
         
Vue.component('button-m', {
    data: function () {
      return {
        characters: JSON.parse(JSON.stringify(Characters)),
      }
 },
  
  methods: {
    chooseACharacter: function(event) {
  		var choosen_char;
      this.characters.forEach(function(char) {
         if(char.name == event.target.name){
             char.display = true;
             char.active = true;
             choosen_char = char;             
         } else {
             char.display = false;
         }          
      });
      this.$parent.$emit('sendToParent', choosen_char);
    },
},
      
  template: `<div class="button"><input type="image"
            :name="character.name"
            v-for="character in characters"
            v-on:click="chooseACharacter($event)"
            v-bind:class="{active : character.active}"
            v-if="character.display"
            :src="character.image"></div>`
     });     
              
var Characters = [
  { name: "tref", image: "http://tvslagalica.com/images/skocko/tref.png", id: "tref", display: true},
  { name: "pik", image: "http://tvslagalica.com/images/skocko/pik.png", id: "pik", display: true},
  { name: "herc", image: "http://tvslagalica.com/images/skocko/herc.png", id: "herc", display: true},
  { name: "karo", image: "http://tvslagalica.com/images/skocko/karo.png", id: "karo", display: true},
  { name: "zvezda", image: "http://tvslagalica.com/images/skocko/zvezda.png", id: "zvezda", display: true},
  { name: "skocko", image: "http://www.rts.rs/upload/thumbnail/2017/09/20/5029521_slagalicajpg", id: "skocko", display: true},
];

var vm = new Vue({
  el: '#components-demo',
  data: {
     active_row: 0,
     gameStatus: '',
     shuffledChars: shuffleArray(Characters),
	 winningChars: []
  },
  computed: {
    status: function () {
      if(this.gameStatus == '' && this.active_row == 7){
	   this.winningChars = this.shuffledChars.slice(0,4);
       return 'Game over'; 
      }
      return this.gameStatus;
    }
  },
  created() {
    this.$on('incrementActiveIndex', () => {
    	this.active_row++;
    }),
    this.$on('gameWon', () => {
    	this.gameStatus = 'Game won';
      this.active_row = -1;
	  this.winningChars = this.shuffledChars.slice(0,4);
    }),
    console.log(JSON.stringify(this.shuffledChars));
  },
});

/**
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(inArray){
		var array = JSON.parse(JSON.stringify(inArray));
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
  
