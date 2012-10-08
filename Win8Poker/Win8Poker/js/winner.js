var max_players=8;
var max_shown_cards = 5;
var hands = [];
var shown_cards = [];
var cards = [];
var best_hands = [];
var max_cards = 2*max_players + max_shown_cards;
var temp;
for(var i=0;i<max_players;i++)
{
    hands.push([]);
}

while(cards.length<max_cards)
{
    temp = Math.floor(Math.random()*52+1);
    if(cards.indexOf(temp)===-1)
	cards.push(temp);
}

for (var i=0;i<max_players;i++)
{
	hands[i][0]=cards[i];
	hands[i][1]=cards[i+max_players];
}

for (var i=0;i<max_shown_cards;i++)
{
	shown_cards[i]=cards[i+2*max_players];
}

var non_flush = function(rank_count){
	var four_kind = [];
	var three_kind = [];
	var two_kind = [];
	var one_kind = [];
	
	var result = [];
	var result_cards = [];
	var key;
	for(var i in rank_count)
	{
		switch(rank_count[i])
		{
			case 1:
			one_kind.push(parseInt(i));
			break;
			case 2:
			two_kind.push(parseInt(i));
			break;
			case 3:
			three_kind.push(parseInt(i));
			break;
			case 4:
			four_kind.push(parseInt(i));
			break;
		}
	}
	four_kind.sort(function(a,b){return b-a;});
	three_kind.sort(function(a,b){return b-a;});
	two_kind.sort(function(a,b){return b-a;});
	one_kind.sort(function(a,b){return b-a;});
	
	if(one_kind.length===7)
	{
		key=0;
		result_cards=one_kind.slice(0,5);
	}
	else if(four_kind.length!==0)
	{
		key=7;
		result_cards = four_kind.concat(three_kind,two_kind,one_kind).slice(0,2);
	}
	else if(three_kind.length!==0)
	{
		if(two_kind.length===0)
		{
			key=3;
			result_cards = three_kind.concat(one_kind).slice(0,3);
		}
		else
		{
			key=6;
			result_cards = three_kind.concat(two_kind,one_kind).slice(0,2);
		}
	}
	else if(two_kind.length===1)
	{
		key=1;
		result_cards = two_kind.concat(one_kind).slice(0,4);
	}
	else if(two_kind.length>=2)
	{
		key=2;
		result_cards = two_kind.concat(one_kind).slice(0,3);
	}
	result.push(key);
	result.push(result_cards);
	return result;
};

//1-13: Club
//14 - 26 : Diamond
//27-39: Heart
//40-52: Spades
var combos = [
    "High Card",
    "Pair",
    "Two Pair",
    "Three of a kind",
    "Straight",
    "Flush",
    "Full House",
    "Four of a Kind",
    "Straight Flush",
    "Royal Flush"
];
function Card(suit,rank)
{
    this.suit=suit;
    this.rank=rank;
}

function CardArrayGen(player)
{
    var cards = [];
    var suit;
    var rank;
    for (var i = 0; i < player.length; i++)
    {
        switch (Math.floor((player[i] - 1) / 13))
        {
            case 0:
                suit = "Club";
                rank = ((player[i] - 1) % 13) + 1;
                break;
            case 1:
                suit = "Diamond";
                rank = ((player[i] - 1) % 13) + 1;
                break;
            case 2:
                suit = "Heart";
                rank = ((player[i] - 1) % 13) + 1;
                break;
            case 3:
                suit = "Spade";
                rank = ((player[i] - 1) % 13) + 1;
                break;
        }
        if (rank === 1)
            rank = 14;
        var card = new Card(suit,rank);
        cards.push(card);
    }
    return cards;
}

function Flush(suitCount)
{
    if (suitCount["Club"] === 5 || suitCount["Diamond"] === 5 || suitCount["Heart"] === 5 || suitCount["Spade"] === 5)
        return true;
    else
        return false;
}

function StraightFlush(final_cards, suit_count)
{
    var numbers = [];
    var result = [];
    var FlushSuit;
    for (var i in suit_count)
    {
        if (suit_count[i] === 5)
        {
            FlushSuit = i;
            break;
        }

    }
    for (var i = 0; i < final_cards.length; i++)
    {
        if (final_cards[i].suit === FlushSuit)
            numbers.push(final_cards[i].rank);
    }
    if (numbers.indexOf(14) !== -1 && numbers.indexOf(2) !== -1 && numbers.indexOf(3) !== -1 && numbers.indexOf(4) !== -1 && numbers.indexOf(5) !== -1)
    {
        result.push(true);
        result.push(1);
        return result;
    }
    else
    {
        numbers.sort(function (a, b) { return (b-a) });
        if (numbers[0] - numbers[4] === 4) {
            result.push(true);
            result.push(numbers[0]);
            return result;
        }
        else
        {
            result.push(false);
            result.push(numbers);
            return result;
        }
    }

}
function Straight(rank_count)
{
    var cards_rank = [];
    var result = [];
    for (var i in rank_count)
    {
        cards_rank.push(parseInt(i));
    }
    cards_rank.sort(function (a, b) { return (b - a) });
    if (cards_rank.indexOf(14) !== -1 && cards_rank.indexOf(2) !== -1 && cards_rank.indexOf(3) !== -1 && cards_rank.indexOf(4) !== -1 && cards_rank.indexOf(5) !== -1) {
        result[0] = true;
        result[1] = 1;
        return result;
    }
    else if (cards_rank[0] - cards_rank[4] === 4) {
        result[0] = true;
        result[1] = cards_rank[0];
        return result;
    }
    else
    {
        result[0] = false;
        result[1] = "";
        return result;
    }
}

function RoyalFlush(rank_count)
{
	return((10 in rank_count) && (11 in rank_count) && (12 in rank_count) && (13 in rank_count) && (14 in rank_count))
}

function player_besthand(player, display)
{
    var total = [];
    var final_cards;
    total.push(player[0]);
    total.push(player[1]);
    total.push(display[0]);
    total.push(display[1]);
    total.push(display[2]);
    total.push(display[3]);
    total.push(display[4]);
    final_cards = CardArrayGen(total);
    var suit_count = { "Club": 0, "Diamond": 0, "Heart": 0, "Spade": 0 };
    var rank_count = {};
    for (var i = 0; i < final_cards.length; i++)
    {
        switch(final_cards[i].suit)
        {
            case "Club":
                suit_count["Club"]++;
                break;
            case "Diamond":
                suit_count["Diamond"]++;
                break;
            case "Heart":
                suit_count["Heart"]++;
                break;
            case "Spade":
                suit_count["Spade"]++;
                break;
        }
    }
    for (var i = 0; i < final_cards.length; i++)
    {
        if (final_cards[i].rank in rank_count) {
            rank_count[final_cards[i].rank]++;
        }
        else
        {
            rank_count[final_cards[i].rank] = 1;
        }
    }
    if (Flush(suit_count))
    {
        var straight_flush_result=StraightFlush(final_cards,suit_count);
        if (RoyalFlush(rank_count))
        {
            var array = [10, 11, 12, 13, 14];
            var result = [9];
            result.push(array);
            return result;
        }
        else if (straight_flush_result[0]) {
            var result_card = [];
            result_card.push(straight_flush_result[1]);
            var result = [8];
            result.push(result_card);
            return result;
        }
        else
        {
            var result=[5];
            result.push(straight_flush_result[1]);
            return result;
        }
    }
    else
    {
        var straight_result = Straight(rank_count);
        if (straight_result[0]) {
            var result_card = [];
            result_card.push(straight_result[1]);
            var result=[4];
            result.push(result_card);
            return result;
        }
        else
        {
            return non_flush(rank_count);
        }
    }
}

for(i=0; i<max_players;i++)
{
    best_hands.push(player_besthand(hands[i],shown_cards));
}

var winner = function(best_hands){
	
	var first_results =[-1];
	var first_largest = -1;
	for (i=0;i<max_players;i++)
	{
		if(best_hands[i][0] > first_largest)
		{
			first_results=[];
			first_results.push(i);
            first_largest = best_hands[i][0];
		}
		else if(best_hands[i][0] === first_largest)
		{
			first_results.push(i);
		}
	}
	if(first_results.length!==1)
	{
		var temp=[];
		var sec_results = first_results;
		var counter = 0;
		var max;
        var max_counter = best_hands[first_results[0]][1].length;
		while(sec_results.length!==1 && counter<max_counter)
		{
            temp=[];
			for(i=0;i<sec_results.length;i++)
			{
				temp.push(best_hands[sec_results[i]][1][counter]);
			}
            console.log(temp);
            console.log(sec_results);
            
			max = Math.max.apply(null,temp);
            console.log(max);
			for(i=0;i<sec_results.length;i++)
			{
				if(best_hands[sec_results[i]][1][counter]!==max)
				{
					sec_results=sec_results.slice(0,i).concat(sec_results.slice(i+1,sec_results.length));
				    i--;
				}
			}
			counter++;
		}
		return sec_results;
	}
	else
	{
		return first_results;
	}
};

//arr = [ [ 1, [ 9, 14, 11, 6 ] ],[ 1, [ 9, 11, 7, 6 ] ],[ 1, [ 9, 12, 11, 6 ] ],[ 1, [ 9, 11, 7, 6 ] ],[ 2, [ 11, 9, 6 ] ],[ 1, [ 9, 11, 10, 6 ] ],[ 2, [ 11, 9, 6 ] ],[ 2, [ 9, 3, 11 ] ] ]
//arr2 = [ [ 1, [ 12, 14, 11, 6 ] ],[ 0, [ 13, 12, 11, 9, 6 ] ],[ 1, [ 5, 12, 11, 10 ] ],[ 1, [ 12, 11, 6, 5 ] ],[ 0, [ 13, 12, 11, 8, 6 ] ],[ 0, [ 12, 11, 6, 5, 4 ] ],[ 0, [ 14, 12, 11, 7, 6 ] ],[ 1, [ 2, 12, 11, 7 ] ] ]
//arr3 = [ [ 2, [ 13, 8, 12 ] ],[ 2, [ 13, 8, 12 ] ],[ 2, [ 13, 8, 12 ] ],[ 2, [ 13, 8, 12 ] ],[ 2, [ 13, 12, 8 ] ],[ 2, [ 13, 8, 12 ] ],[ 2, [ 13, 8, 12 ] ],[ 2, [ 13, 8, 12 ] ] ]
//console.log(winner(arr));
//console.log(arr);

console.log(winner(best_hands));
console.log(best_hands);