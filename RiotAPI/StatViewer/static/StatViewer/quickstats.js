var key = "API_KEY";


document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#searchbtn').addEventListener('click', find_player);
    document.querySelector('#resetbtn').addEventListener('click', reset_results);
})


function find_player() {
    
    const username = document.querySelector('#summonerName').value;
    const region = document.querySelector('#selectField').value;
    fetch(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${key}`, {
        method: 'GET',
        headers: {
            "User-Agent": window.navigator.userAgent,
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://developer.riotgames.com"
        }
    })
    .then(data => data.json())
    .then(profile => {          
        load_player(profile, region);
    })
    .catch(function() {
        alert('InvalidUsername');
        return;
    })
}


function load_player(player, region) {
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
    })
}


function show_player(player, stats) {
    const profile = document.createElement('div');
    profile.setAttribute('id', 'statBubble');

    if (stats.length === 0) {
        profile.innerHTML = `${player['name']} - Level: ${player['summonerLevel']} - UNRANKED`;
    }
    else{
    profile.innerHTML = `${player['name']} - Level: ${player['summonerLevel']}`;
    Array.from(stats).forEach(stat => {
        const queue = document.createElement('div');
        const {queueType ,tier, rank, leaguePoints, wins, losses} = stat
        queue.innerHTML = `${queueType.replace(/[^a-zA-Z ]/g," ").slice(0, -2)} - Rank: ${tier} ${rank} ${leaguePoints} LP<br>
                            Wins: ${wins} Losses:  ${losses} Win rate: ${calculate_winrate(wins, losses)}%`;
        queue.style.marginBottom = '5px';
        profile.appendChild(queue, profile);
    })}
    
    const summonerInfo = document.querySelector('#summonerInfo');
    summonerInfo.appendChild(profile, summonerInfo);
}


function calculate_winrate(wins, losses) {
    return Math.ceil(parseFloat((parseInt(wins)/(parseInt(wins) + parseInt(losses))) * 100))
}

function reset_results() {
    document.querySelector('#summonerInfo').innerHTML = '';

}

