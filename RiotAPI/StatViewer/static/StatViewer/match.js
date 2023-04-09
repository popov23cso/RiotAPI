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
    
    let i = 0;
    const max_dmg = get_max_damage(matchdata['info']['participants']);
    show_general_matchdata(matchdata);
    Array.from(matchdata['info']['participants']).forEach(player => {
        const team = document.querySelector(`#team${i < 5 ? 1 : 2}`);
        const playerStats = document.createElement('h5');
        const dmgDone = document.createElement('div');
        const {summonerName, championName, champLevel, kills, deaths, assists, totalMinionsKilled, neutralMinionsKilled, totalDamageDealtToChampions, visionScore} = player;
        let dmgShare = (parseFloat(totalDamageDealtToChampions) * 100) / parseFloat(max_dmg);
        dmgDone.innerHTML = `<div class="progress">
                                <div class="progress-bar bg-danger" role="progressbar" style="width: ${dmgShare}%">
                                ${parseFloat(totalDamageDealtToChampions)}
                                </div>
                            </div>`;
        playerStats.innerHTML = `${summonerName} - ${championName}(lvl${champLevel})<br>
                                 KDA: ${kills}/${deaths}/${assists}  CS: ${totalMinionsKilled + neutralMinionsKilled}  Vision Score: ${visionScore}<br>`;
        playerStats.append(dmgDone);
        playerStats.setAttribute('id', i < 5 ? 'statBubble' : 'defeatBubble');
        playerStats.addEventListener('click',()=>{ viewProfile(summonerName)});

        team.append(playerStats);
        i ++;

    })



}


function get_max_damage(players) {
    let dmgDone = 0;
    Array.from(players).forEach(player => {
        if (player['totalDamageDealtToChampions'] > dmgDone) {
            dmgDone = player['totalDamageDealtToChampions'];
        } 
    })
    return dmgDone;
}

function viewProfile(username) {
    const id = document.querySelector('#matchdata').dataset.id;

    window.location = `/profile/${id.slice(0,4).toLowerCase()}/${username}`;
}

function show_general_matchdata(matchdata) {
    const matchHeadings = document.querySelector('#matchHeadings');
    const mode = modes[matchdata['info']['queueId']] == undefined ? '' : modes[matchdata['info']['queueId']];
    const player = matchdata['info']['participants'][0];


    matchHeadings.innerHTML = `Game type: ${mode} ${matchdata['info']['gameMode']}<br>
                               Game duration: ${parseFloat(parseFloat(player['timePlayed']) / 60).toFixed(2)} min`;


}
