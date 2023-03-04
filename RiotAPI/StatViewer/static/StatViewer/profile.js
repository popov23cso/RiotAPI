var key = "API_KEY";

const username = document.querySelector('#userdata').dataset.username;
const region = document.querySelector('#userdata').dataset.region;

document.addEventListener('DOMContentLoaded', () => {
    find_player();
})


var modes = {
    400: "Draft Pick",
    420: "Solo/Duo",
    440: "Ranked Flex",
    1900: ""
    
}


function find_player() {
    fetch(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${key}`, {
        method: 'GET',
        headers: {
            "User-Agent": window.navigator.userAgent, //gets the user agent so its not hard coded for one browser
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://developer.riotgames.com"
        }
    })
    .then(data => data.json())
    .then(profile => {          
        load_player(profile);
    })
    .catch(function() {
        alert('InvalidUsername');
        return;
    })
}

function load_player(player) {
    fetch(`https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${player['id']}?api_key=${key}`, {
        method: 'GET',
        headers: {
            "User-Agent": window.navigator.userAgent,
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://developer.riotgames.com"
        }
    })
    .then(data => data.json())
    .then(stats => {
        show_player(player, stats);
        load_match_ids(player);
    })
}


function show_player(player, stats) {
    document.querySelector('#level').innerHTML = player['summonerLevel'];
    Array.from(stats).forEach(stat => {
        const rank = document.createElement('div');
        rank.innerHTML = `${stat['queueType'].replace(/[^a-zA-Z ]/g," ").slice(0, -2)} - 
                        Rank: ${stat['tier']} ${stat['rank']} ${stat['leaguePoints']} LP `;
        document.querySelector('#ranks').appendChild(rank, document.querySelector('#ranks'));
    })
}


function load_match_ids(player) {
    fetch(`https://${region == 'na1' ? 'americas' : 'europe'}.api.riotgames.com/lol/match/v5/matches/by-puuid/${player['puuid']}/ids?start=0&count=5&api_key=${key}`, {
        method: 'GET',
        headers: {
            "User-Agent": window.navigator.userAgent,
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://developer.riotgames.com"
        }
    })
    .then(data => data.json())
    .then(matches => {
        get_matches_stats(matches);
    })
}

function get_matches_stats(matches) {
    Array.from(matches).forEach(match => {
    fetch(`https://${region == 'na1' ? 'americas' : 'europe'}.api.riotgames.com/lol/match/v5/matches/${match}?api_key=${key}`, {
        method: 'GET',
        headers: {
            "User-Agent": window.navigator.userAgent,
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://developer.riotgames.com"
        }
    })
    .then(data => data.json())
    .then(matchdata => {
        show_match(matchdata)
    })})
}

function show_match(match) {
    const Match = document.createElement('div');
    const GameCreation = match['info']['gameCreation'];
    let StartDate = new Date(GameCreation);
    let player = match['info']['participants'].find(player => {
        return player['summonerName'] == username; 
    })
    const{championName, kills, deaths, assists, lane, win} = player;
    Match.innerHTML = `${championName} - ${modes[match['info']['queueId']]} ${ match['info']['gameMode']} ${win? '✔️':'❌'}<br>
                        ${lane} - ${kills}/${deaths}/${assists} <br>
                        ${StartDate.getDate()}/${StartDate.getMonth() + 1}/${StartDate.getFullYear()}`;
    Match.dataset.date = StartDate;
    Match.setAttribute('id', 'statBubble');
    const MatchHistory = document.querySelector('#matchHistory');
    const LoadedMatches = MatchHistory.getElementsByTagName('div');
    if (LoadedMatches.length > 0) {
        if (LoadedMatches.length == 1) {
            FirstMatch = new Date(LoadedMatches[0].dataset.date);
            if(FirstMatch < StartDate) {
                LoadedMatches[0].before(Match);
                return;
            }
            else {
                LoadedMatches[0].after(Match);
                return;
            }
        }
        for (let i = 0; i < LoadedMatches.length; i++) {
            LoadedDate = new Date(LoadedMatches[i].dataset.date);
            if (LoadedDate > StartDate) {
                continue;
            }
            else {
                LoadedMatches[i].before(Match);
                return;
            }
        }
        MatchHistory.appendChild(Match, MatchHistory);
        return;
    } 
    else {
        MatchHistory.appendChild(Match, MatchHistory);
    }
}