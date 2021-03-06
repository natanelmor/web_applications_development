var reversi = {
    
    father: null,
	score: null,
	statisticItems: null,
    rows: 10,
    cols: 10,
    min: null,
    sec: null,
    grid: [],
    timeBlack: [],
    timeWhite: [],
    timerVar: null,
    states: {
        'blank': { 'id' : 0, 'color': 'white'},
        'white': { 'id' : 1, 'color': 'white'},
        'black': { 'id' : 2, 'color': 'black' },
        'red': { 'id' : 3, 'color': 'red' },
        'green': { 'id' : 4, 'color': 'green' }
    },
	turn: null,

    init: function(selector) {
        
        this.father = document.getElementById(selector);
        
        // make sure we have a valid element selected
        if (null === this.father) {
            
            return;
        }
        
        // append .reversi class to the father element
        this.father.className = (this.father.className ? this.father.className + ' ' : '') + 'reversi';
        
        // prepare and draw grid
        this.prepareGrid();
        
        // place initial items
        this.initGame();
        
        this.stopGame();
        


    },
    
    stopTimer: function() {
        clearInterval(this.timerVar);
    },
	
	startTimer: function(){
        var timer = scoreBar = document.createElement('div');
        
        timer.className = 'timer-node';
        timer.innerHTML = '00:00';
		this.father.appendChild(timer);
        
        var totalSeconds = 0;
        var self = this;
        self.timerVar = setInterval(setTime, 1000);

		function setTime() {
        ++totalSeconds;
        self.sec = pad(totalSeconds % 60);
        self.min = pad(parseInt(totalSeconds / 60));
		timer.innerHTML = self.min + ':' + self.sec;
		}

		function pad(val) {
		var valString = val + "";
		if (valString.length < 2) {
			return "0" + valString;
		} else {
			return valString;
			}
		}
	},
    
    initGame: function() {
        
        // the black player begins the game
        this.setTurn(this.states.black);
       // this.tick();
             
        // init placement
        this.setItemState(6, 6, this.states.white);
        this.setItemState(6, 5, this.states.black);
        this.setItemState(5, 6, this.states.black);
        this.setItemState(5, 5, this.states.white);
        
        this.initStatistic();
          
    },

    initStatistic: function(){
         //set number of turns
         this.setTurnNum(0);
         //start the timer
        this.stopTimer();
         this.startTimer();
         //init 2 disc
         this.setTwoDisc(1);
         //init avg turn time 
         this.setAvgTime(1);
         this.tick();
        // set initial score
        this.setScore(2, 2);
    },
    
    passTurn: function() {
    
        var turn = (this.turn.id === this.states.black.id) ? this.states.white : this.states.black;

     
        this.setTurn(turn);
        	
    },
    
    setTurn: function(state) {
        
        this.turn = state;

        var isBlack = (state.id === this.states.black.id);
  
        this.score.black.elem.style.textDecoration = isBlack ? 'underline': '';
		this.score.white.elem.style.textDecoration = isBlack ? '': 'underline';
        this.setTurnNum(1);
        this.tick();
        
        this.setTwoDisc(0);
        
    },
    
    initItemState: function(elem) {
        
        return {
            'state': this.states.blank,
            'elem': elem
        };
    },
    
    isVisible: function(state) {
        
        return (state.id === this.states.white.id || state.id === this.states.black.id|| state.id === this.states.red.id|| state.id === this.states.green.id);
    },
    
    isVisibleItem: function(row, col) {
        
        return this.isVisible(this.grid[row][col].state);
    },
    
    isValidPosition: function(row, col) {
        
        return (row >= 1 && row <= this.rows) && (col >= 1 && col <= this.cols);
    },
    
    setItemState: function(row, col, state) {

        if ( ! this.isValidPosition(row, col)) {
            
            return;
        }

        this.grid[row][col].state = state;
        this.grid[row][col].elem.style.visibility =  this.isVisible(state) ? 'visible' : 'hidden';
        this.grid[row][col].elem.style.backgroundColor = state.color;
    },

    stopGame: function(){
    
        var self = this;
        // 1. Create the button
        var button = document.createElement("button");
        button.innerHTML = "END GAME";

        // 2. Append somewhere
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(button);

        // 3. Add event handler
        button.onclick = function(event){
            var winner = (self.turn.id === self.states.black.id) ? self.states.white.color : self.states.black.color;
            self.stopTimer();
            self.endGameMsg(winner);  
                 
        };
    },

    startGame: function(){
    
        var self = this;
        // 1. Create the button
        var button = document.createElement("button");
        button.innerHTML = "NEW GAME";
        button.style.backgroundColor='green';
        button.style.background='green';
        button.style.border='green';
     
        // 2. Append somewhere
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(button);
     

        // 3. Add event handler
        button.onclick = function(event){ 
          location.reload();        
        };
    },
    
    prepareGrid: function() {

        // create table structure for grid
		var table = document.createElement('table');

        // apply some base styling for table
        table.setAttribute('border', 0);
        table.setAttribute('cellpadding', 0);
        table.setAttribute('cellspacing', 0);
        
        for (var i = 1; i <= this.rows; i++) {
            
            var tr = document.createElement('tr');
            
            table.appendChild(tr);
            
            this.grid[i] = [];
            
            for (var j = 1; j <= this.cols; j++) {
                
                var td = document.createElement('td');
                
                tr.appendChild(td);
                
                // bind move action to onclick event on each item
                //this.colormove(td, i, j);
                this.bindMove(td, i, j);
                
                // we are also storing html element for better manipulation later
                this.grid[i][j] = this.initItemState(td.appendChild(document.createElement('span')));
            }
        }

        // prepare score bar
		var scoreBar = document.createElement('div'),
            statistic = document.createElement('div'),
            
            white = document.createElement('div'),
            black = document.createElement('div'),

           

            scoreBlack = document.createElement('div'),
			scoreWhite = document.createElement('div'),
			
			turns = document.createElement('div'),
			avgTimeWhite = document.createElement('div'),
			avgTimeBlack = document.createElement('div'),
			twoDiscBlack = document.createElement('div'),
			twoDiscWhite = document.createElement('div');
			
            white.className = 'white-con';
            black.className = 'black-con';

            // scoreBlack.className = 'black-con';
            // avgTimeBlack.className = 'black-con';
          //  twoDiscBlack.className = 'black-con';
           
           // scoreWhite.className = 'white-con';
           // twoDiscWhite.className = 'white-con';
           // avgTimeWhite.className = 'white-con';

            turns.className = 'statistic-node';
            
 
        // append score bar items
        black.appendChild(scoreBlack);
		white.appendChild(scoreWhite);
		
		//append statistic
		statistic.appendChild(turns);
		black.appendChild(avgTimeBlack);
		white.appendChild(avgTimeWhite);
		black.appendChild(twoDiscBlack);
		white.appendChild(twoDiscWhite);
        
        // append to father
		//this.father.appendChild(scoreBar);
        this.father.appendChild(statistic);
        this.father.appendChild(white);
        this.father.appendChild(black);
        
        // set the score object
        this.score = {
            'white': { 
                'elem': scoreWhite,
                'state': 0,
                'avgTime' :0,
			},
            'black': { 
                'elem': scoreBlack,
                'state': 0,
                'avgTime' :0,
            },
		}
		
		this.statisticItems = {
			'turns': {
				'elem' : turns,
				'state' : -1
            },
            'twoDiscWhite':{
                'elem' :twoDiscWhite,
                'state' :1
            },
            'avgTimeWhite':{
                'elem' :avgTimeWhite,
                'state' :0
            },
            'twoDiscBlack':{
                'elem' :twoDiscBlack,
                'state' :1
            },
            'avgTimeBlack':{
                'elem' :avgTimeBlack,
                'state' :0
            }

		}

        // append table
		this.father.appendChild(table);
		
		
    },
    
    recalcuteScore: function()  {
        
        var scoreWhite = 0,
            scoreBlack = 0;
            
        for (var i = 1; i <= this.rows; i++) {

            for (var j = 1; j <= this.cols; j++) {
                
                if (this.isValidPosition(i, j) && this.isVisibleItem(i, j)) {
                    
                    if (this.grid[i][j].state.id === this.states.black.id) {
                        
                        scoreBlack++;
                    } else {
                        
                        scoreWhite++;
                    }
                }
            }
        }
        
        this.setScore(scoreBlack, scoreWhite);
       

	},
	
    setScore: function(scoreBlack, scoreWhite) {
        
        this.score.black.state = scoreBlack;
        this.score.white.state = scoreWhite;

        this.score.black.elem.innerHTML = '&nbsp;' + scoreBlack + '&nbsp;';
        this.score.white.elem.innerHTML = '&nbsp;' + scoreWhite + '&nbsp;';

    },
    
    setTwoDisc: function(start){
        
        var isBlack = (this.turn.id === this.states.black.id);

        if(start == 1){
            this.statisticItems.twoDiscBlack.state=1;
            this.statisticItems.twoDiscWhite.state=1;
        }
        else{
            if(isBlack)
            {
                if(this.score.black.state == 2) {this.statisticItems.twoDiscBlack.state++};
            }
            else
            {
                if( this.score.white.state == 2) {this.statisticItems.twoDiscWhite.state++};
            } 
        }   
        this.statisticItems.twoDiscWhite.elem.innerHTML = '2 disc: ' + this.statisticItems.twoDiscWhite.state;
        this.statisticItems.twoDiscBlack.elem.innerHTML = '2 disc: ' + this.statisticItems.twoDiscBlack.state;
       
    },
	
	setTurnNum: function(counting) {
        
        var number;

        if(counting == 1){
		number = this.statisticItems.turns.state + 1;
        }
        else{
            number = 0;   
        }
        this.statisticItems.turns.state = number;
        this.statisticItems.turns.elem.innerHTML = 'turns: ' + number + '&nbsp;';
	},
    
    isValidMove: function(row, col) {
        var current = this.turn,
            rowCheck,
            colCheck,
            toCheck = (current.id === this.states.black.id) ? this.states.white : this.states.black;
            
        if (!this.isValidPosition(row, col) || (this.isVisibleItem(row, col)) && !(this.grid[row][col].state === this.states.green)) {
            
            return false;
        }
        
        // check all eight directions
        for (var rowDir = -1; rowDir <= 1; rowDir++) {
            
            for (var colDir = -1; colDir <= 1; colDir++) {
                
                // dont check the actual position
                if (rowDir === 0 && colDir === 0) {
                    
                    continue;
                }
                
                // move to next item
                rowCheck = row + rowDir;
                colCheck = col + colDir;
          
                
             
                while (this.isValidPosition(rowCheck, colCheck) && this.isVisibleItem(rowCheck, colCheck)) {
                    
                    return true;
              
                }
           
            }
        }
        
        return false;
    },
    
       
    isValidClick: function(row, col) {

        var current = this.turn,
            rowCheck,
            colCheck;
            
        //check if there is no current turn color in the borad --> end the game
        if(this.score.black.state === 0 || this.score.white.state === 0){
            this.endGame();
        }   
            
        if (!this.isValidPosition(row, col) || (this.isVisibleItem(row, col)) && !(this.grid[row][col].state === this.states.green)) {
            
            return false;
        }
        
        // check all eight directions
        for (var rowDir = -1; rowDir <= 1; rowDir++) {
            
            for (var colDir = -1; colDir <= 1; colDir++) {
                
                // dont check the actual position
                if (rowDir === 0 && colDir === 0) {
                    
                    continue;
                }
                
                // move to next item
                rowCheck = row + rowDir;
                colCheck = col + colDir;
                // were any items found ?
                var itemFound = false;
                
            
                while (this.isValidPosition(rowCheck, colCheck) && this.isVisibleItem(rowCheck, colCheck)) {
                    
                    this.setItemState(row, col, current);
                  
                    return true;
                
                }
              
            }
        }
        
        return false;
    },



    tick: function(){
        var d1 =performance.now(),// Date.now(),
        self = this,
        current = self.turn;

        if(current.id === self.states.black.id){
            self.timeBlack.push(d1);
        } 
        else{
            self.timeWhite.push(d1);
        }
    },

    tock: function(){
        var d2,
        d1,
        current = this.turn,
        currentcolor;
      
        d2=performance.now();// Date.now();
        if(current.id === this.states.black.id){
            currentcolor = this.timeBlack;
        } 
        else{
            currentcolor = this.timeWhite;
        }
          
            d1 = currentcolor[(currentcolor.length) -1];
            currentcolor[currentcolor.length -1] = Math.round((d2-d1)/1000);

            //console.log( currentcolor[currentcolor.length -1] );
           
    },

    setAvgTime: function(start){
       // debugger;
        var whiteAvg =0,
        blackAvg =0;

        if(start ==1)
        {
            this.timeBlack = [];
            this.timeWhite = [];
        }
        else{
            for (var item in this.timeBlack) {
                
                blackAvg +=this.timeBlack[item];
             }
             for (var item in this.timeWhite) {
                     
                 whiteAvg += this.timeWhite[item];
             }
             if(this.timeBlack.length>0){
                blackAvg /= this.timeBlack.length;

             }
             if(this.timeWhite.length>0){
                whiteAvg /= this.timeWhite.length;
             }

             
        }
        
        this.statisticItems.avgTimeWhite.state = Math.round(whiteAvg);
        this.statisticItems.avgTimeBlack.state = Math.round(blackAvg);
        
        this.statisticItems.avgTimeWhite.elem.innerHTML = 'avg time: ' + this.secToTime( this.statisticItems.avgTimeWhite.state);
        this.statisticItems.avgTimeBlack.elem.innerHTML = 'avg time: ' + this.secToTime(this.statisticItems.avgTimeBlack.state);

    },

    secToTime: function (s) {
        var mins=0,hrs=0;
            
            if(s>=60){
                mins = Math.round(s / 60);
                s=s%60;
                if(mins>=60){
                    hrs = Math.round(mins / 60);
                    mins=mins%60;
                    return hrs + ':' + mins + ':' + s;
                }
                return mins + ':' + s ;
            }
            
      
        return s+ 'sec';
    },

    canMove: function() {

        for (var i = 1; i <= this.rows; i++) {

            for (var j = 1; j <= this.cols; j++) {
                
                if (this.isValidMove(i, j)) {
                    
                    return true;
                }
            }
        }
        
        return false;
    },

    colortoken: function(row, col){
        var self = this;
            current = this.turn,
            currentcolor = (current.id === this.states.black.id) ?  this.states.black: this.states.white;

            if (((!self.isValidMove(row, col)) || (!this.isValidPosition(row, col))) && (!this.isVisibleItem(row, col))) {       
                this.mouseColor(row, col,this.states.red);
                }
            if(self.isValidMove(row, col)){
                //currentcolor=  this.states.blue;
                this.mouseColor(row, col,this.states.green);
            }

    },

    hiddetoken: function(row, col){
        if (this.grid[row][col].state===this.states.red || this.grid[row][col].state===this.states.green ) { 
            this.grid[row][col].state = this.states.blank;
            this.grid[row][col].elem.style.visibility = 'hidden';
            this.grid[row][col].elem.style.backgroundColor =this.states.blank.color;
        }
    },

    mouseColor: function(row, col,state){

        this.grid[row][col].state = state;
        this.grid[row][col].elem.style.visibility = this.isVisible(state) ? 'visible' : 'hidden';
        this.grid[row][col].elem.style.backgroundColor = state.color;

    },

    bindMove: function(elem, row, col) {
        
        var self = this;
  
        elem.onclick= function(event) {

            if (self.canMove()) {

                // if have a valid move
                if (self.isValidClick(row, col)) {

                    
                    self.tock();
                    self.setAvgTime(0);

                    // make the move
                    self.move(row, col);
                    
                    // check whether the another player can now move, if not, pass turn back to other player
                    if (!self.canMove()){
                        
                        self.passTurn();
                  

                        // check the end of the game
                        if (!self.canMove()) {

                            self.endGame();
                        }
                    }
                  
                    // in case of full grid, end the game
                    if (self.checkEnd()){
                        self.endGame();
                    }
                }
            }
        
    };
        elem.onmouseover= function(event) {
                self.colortoken(row, col);
        };
        elem.onmouseout= function(event) {
                self.hiddetoken(row, col);
        };
        
    },
    
    endGame: function() {
        
        var result = (this.score.black.state > this.score.white.state) 
            ? 
                1 
            : ( 
                (this.score.white.state > this.score.black.state) ? -1 : 0 
            ), message;
        
        switch (result) {
            
            case 1:  { message = 'BLACK'; } break;
            case -1: { message = 'WHITE'; } break;
            case 0:  { message = 'TIE'; } break;
        }
 
        this.endGameMsg(message);
        this.stopTimer();
        
        
    },
    
    clear: function() {
        
        for (var i = 1; i <= this.rows; i++) {

            for (var j = 1; j <= this.cols; j++) {
                
                this.setItemState(i, j, this.states.blank);
            }
        }
    },
    
    reset: function() {

        // clear items
        this.clear();
        
        // reinit game
        this.initGame();
    },
    
    checkEnd: function(lastMove) {
        
        for (var i = 1; i <= this.rows; i++) {

            for (var j = 1; j <= this.cols; j++) {
                
                if (this.isValidPosition(i, j) && ! this.isVisibleItem(i, j)) {
                    
                    return false;
                }
            }
        }
        
        return true;
    },

    checkEndByColor: function(lastMove) {

        current = this.turn,
            rowCheck,
            colCheck,
            toCheck = (current.id === this.states.black.id) ? this.states.black : this.states.white;
        
        for (var i = 1; i <= this.rows; i++) {

            for (var j = 1; j <= this.cols; j++) {
                
                if(this.grid[i][j].state.id === toCheck.id){
                    return false;
                }
            }
        }
        
        return true;
    },

    move: function(row, col) {
        
        var finalItems = [],
            current = this.turn,
            rowCheck,
            colCheck,
            toCheck = (current.id === this.states.black.id) ? this.states.white : this.states.black;
        
        // check all eight directions
        for (var rowDir = -1; rowDir <= 1; rowDir++) {
            
            for (var colDir = -1; colDir <= 1; colDir++) {
                
                // dont check the actual position
                if (rowDir === 0 && colDir === 0) {
                    
                    continue;
                }
                
                // move to next item
                rowCheck = row + rowDir;
                colCheck = col + colDir;
                
                // possible items array
                var possibleItems = [];

                // look for valid items
                // look for visible items
                // look for items with opposite color
                while (this.isValidPosition(rowCheck, colCheck) && this.isVisibleItem(rowCheck, colCheck) 
                        && (this.grid[rowCheck][colCheck].state.id === toCheck.id)) {
                    
                    possibleItems.push([rowCheck, colCheck]);
                    
                    // move to next position
                    rowCheck += rowDir;
                    colCheck += colDir;
                }
                
                // if some items were found
                if (possibleItems.length) {

                    // now we need to check that the next item is one of ours
                    if (this.isValidPosition(rowCheck, colCheck) && this.isVisibleItem(rowCheck, colCheck) && this.grid[rowCheck][colCheck].state.id === current.id) {

                        
                        // push each item actual line
                        for (var item in possibleItems) {
                            
                            finalItems.push(possibleItems[item]);
                        }
                    }
                }
            }
        }
        
        // check for items to check
        if (finalItems.length) {
            
            for (var item in finalItems) {
                
                this.setItemState(finalItems[item][0], finalItems[item][1], current);
            }
        }

        // recalculate score each turn
        this.recalcuteScore();
      
          // pass turn to the other player
        this.setTurn(toCheck);

      
    },

    endGameMsg: function(res){
        
        var numberOfTurns = 'No. of turns: ' + this.statisticItems.turns.state + ' ';
        var gameTime = 'Game time: ' + this.min + ':' + this.sec+ ' ';

        var blackAvg = 'Avg turn time: ' + this.secToTime(this.statisticItems.avgTimeBlack.state)+ ' ';
        var whiteAvg = 'Avg turn time: ' + this.secToTime(this.statisticItems.avgTimeWhite.state)+ ' ';


        var black2Disc = 'No. of 2 disc: ' + this.statisticItems.twoDiscBlack.state + ' ' ;
        var white2Disc = 'No. of 2 disc: ' +this.statisticItems.twoDiscWhite.state + ' ';

        var blackScore = 'Score: ' + this.score.black.state+ ' ';
        var whiteScore = 'Score: ' + this.score.white.state+ ' ';

        var current = this.turn;
        var winner= res;

        alert('THE WINNER IS: '+ winner + '\n' + numberOfTurns +'\n'+gameTime + '\nBlack Statistic:\n'+blackScore+blackAvg+ black2Disc +'\nWhite Statistic:\n'+ whiteScore+whiteAvg+ white2Disc);
        this.startGame();
    }
};