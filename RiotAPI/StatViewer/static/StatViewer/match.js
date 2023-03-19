var key = "API_KEY";

document.addEventListener('DOMContentLoaded', ()=>{
const id = document.querySelector('match_id').dataset.match_id;
const region = document.querySelector('region').dataset.region;
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
    //TODO draw out the match stats
}