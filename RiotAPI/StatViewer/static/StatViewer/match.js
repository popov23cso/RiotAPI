var key = "API_KEY";


var modes = {
    400: "Draft Pick",
    420: "Solo/Duo",
    440: "Ranked Flex",
    1900: ""
    
}

document.addEventListener('DOMContentLoaded', ()=>{
    const id = document.querySelector('#matchdata').dataset.id;
    const region = document.querySelector('#matchdata').dataset.region;
    load_match(id, region);


})


function load_match(match_id, match_region) {
    fetch(`https://${match_region == 'na1' ? 'americas' : 'europe'}.api.riotgames.com/lol/match/v5/matches/${match_id}?api_key=${key}`, {
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
        draw_match(matchdata)})
}

function draw_match(matchdata) {
    
    const matchHeadings = document.querySelector('#matchHeadings');
    const mode = modes[matchdata['info']['queueId']] == undefined ? '' : modes[matchdata['info']['queueId']];
    matchHeadings.innerHTML = `Game type: ${mode} ${matchdata['info']['gameMode']}`;
    let i = 0;
    const max_dmg = get_max_damage(matchdata['info']['participants']);
    Array.from(matchdata['info']['participants']).forEach(player => {
        const team = document.querySelector(`#team${i < 5 ? 1 : 2}`);
        const playerStats = document.createElement('h5');
        const dmgDone = document.createElement('div');
        dmgDone.innerHTML = `<div class="progress">
                                <div class="progress-bar bg-danger" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
                                </div>
                            </div>`;
        const {summonerName, championName, champLevel, kills, deaths, assists, totalMinionsKilled, neutralMinionsKilled} = player;
        playerStats.innerHTML = `${summonerName} - ${championName}(lvl${champLevel})<br>
                                 KDA: ${kills}/${deaths}/${assists} CS: ${totalMinionsKilled + neutralMinionsKilled}<br>`;
        playerStats.append(dmgDone);
        playerStats.setAttribute('id', i < 5 ? 'statBubble' : 'defeatBubble');
        team.append(playerStats);
        i ++;

    })



}


function get_max_damage(players) {
    let dmgDone = 0;
    //TODO get max damage done by a player



}
