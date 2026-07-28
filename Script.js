// ===========================================
// Marine Fish Finder
// script.js (1/4)
// 지도 생성 + 부산 해역 표시
// ===========================================

// ------------------------------
// 지도 생성
// ------------------------------

const map = L.map('map').setView([35.1796, 129.0756], 10);

// OpenStreetMap
L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
    attribution:'© OpenStreetMap'
}).addTo(map);


// ------------------------------
// 부산 해역 위치
// ------------------------------

const seaAreas = [

{
    name:"광안리",
    lat:35.1532,
    lng:129.1185
},

{
    name:"해운대",
    lat:35.1587,
    lng:129.1603
},

{
    name:"송정",
    lat:35.1799,
    lng:129.1990
},

{
    name:"다대포",
    lat:35.0465,
    lng:128.9668
},

{
    name:"송도",
    lat:35.0767,
    lng:129.0238
},

{
    name:"오륙도",
    lat:35.0898,
    lng:129.1274
},

{
    name:"기장",
    lat:35.2445,
    lng:129.2228
},

{
    name:"태종대",
    lat:35.0514,
    lng:129.0874
}

];


// ------------------------------
// 임시 해양 데이터
// (다음 단계에서 API 연결)
// ------------------------------

const seaData = {

"광안리":{

temperature:24.2,
salinity:33.8,
oxygen:7.6,
speed:1.2,
direction:"북동"

},

"해운대":{

temperature:23.9,
salinity:33.7,
oxygen:7.3,
speed:0.9,
direction:"동"

},

"송정":{

temperature:23.1,
salinity:33.9,
oxygen:7.4,
speed:1.5,
direction:"남동"

},

"다대포":{

temperature:25.0,
salinity:33.5,
oxygen:7.0,
speed:0.8,
direction:"남"

},

"송도":{

temperature:24.4,
salinity:33.6,
oxygen:7.2,
speed:0.7,
direction:"북"

},

"오륙도":{

temperature:23.5,
salinity:34.0,
oxygen:7.7,
speed:1.3,
direction:"북동"

},

"기장":{

temperature:22.8,
salinity:34.1,
oxygen:7.9,
speed:1.4,
direction:"동"

},

"태종대":{

temperature:23.7,
salinity:33.8,
oxygen:7.5,
speed:1.1,
direction:"남동"

}

};


// ------------------------------
// 지도에 마커 표시
// ------------------------------

seaAreas.forEach(area=>{

const marker=L.marker([area.lat,area.lng]).addTo(map);

marker.bindPopup(
`<b>${area.name}</b><br>
클릭하여 해양정보 보기`
);

marker.on("click",()=>{

showSeaData(area.name);

});

});


// ------------------------------
// 계절 자동 계산
// ------------------------------

function getSeason(){

const month=new Date().getMonth()+1;

if(month>=3 && month<=5)
return "봄";

if(month>=6 && month<=8)
return "여름";

if(month>=9 && month<=11)
return "가을";

return "겨울";

}

document.getElementById("season").textContent=getSeason();


// ------------------------------
// 해양 정보 표시
// ------------------------------

function showSeaData(area){

const data=seaData[area];

document.getElementById("temperature").textContent=
data.temperature+" ℃";

document.getElementById("salinity").textContent=
data.salinity+" PSU";

document.getElementById("oxygen").textContent=
data.oxygen+" mg/L";

document.getElementById("speed").textContent=
data.speed+" m/s";

document.getElementById("direction").textContent=
data.direction;

document.getElementById("tableTemp").textContent=
data.temperature+" ℃";

document.getElementById("tableSalinity").textContent=
data.salinity+" PSU";

document.getElementById("tableOxygen").textContent=
data.oxygen+" mg/L";

document.getElementById("tableCurrent").textContent=
data.direction+" / "+data.speed+" m/s";

document.getElementById("updateTime").textContent=
new Date().toLocaleTimeString();

}


// ------------------------------
// 처음 실행
// ------------------------------

showSeaData("광안리");
// ===========================================
// script.js (2/4)
// 수온 색상 + 해류 화살표 표시
// ===========================================

// ------------------------------
// 수온에 따른 색상
// ------------------------------

function getTemperatureColor(temp){

    if(temp <= 15) return "#0066ff";
    if(temp <= 20) return "#00b050";
    if(temp <= 23) return "#ffd400";
    if(temp <= 26) return "#ff8800";

    return "#ff2d2d";

}


// ------------------------------
// 지도에 수온 원 표시
// ------------------------------

const temperatureLayers = [];

seaAreas.forEach(area=>{

    const data = seaData[area.name];

    const circle = L.circle(
        [area.lat, area.lng],
        {
            radius:5000,
            color:getTemperatureColor(data.temperature),
            fillColor:getTemperatureColor(data.temperature),
            fillOpacity:0.45,
            weight:2
        }
    ).addTo(map);

    circle.bindPopup(
        `<b>${area.name}</b><br>
        🌡 수온 : ${data.temperature}℃`
    );

    temperatureLayers.push(circle);

});


// ------------------------------
// 방향 화살표
// ------------------------------

function getArrow(direction){

    switch(direction){

        case "북":
            return "↑";

        case "남":
            return "↓";

        case "동":
            return "→";

        case "서":
            return "←";

        case "북동":
            return "↗";

        case "북서":
            return "↖";

        case "남동":
            return "↘";

        case "남서":
            return "↙";

        default:
            return "•";

    }

}


// ------------------------------
// 해류 화살표 표시
// ------------------------------

seaAreas.forEach(area=>{

    const data = seaData[area.name];

    const arrow = L.marker(
        [area.lat, area.lng],
        {

            icon:L.divIcon({

                className:"",

                html:`
                <div style="
                    font-size:28px;
                    color:#003f88;
                    font-weight:bold;
                    text-shadow:0 0 5px white;
                ">
                ${getArrow(data.direction)}
                </div>
                `,

                iconSize:[30,30]

            })

        }

    ).addTo(map);

    arrow.bindPopup(
        `
        <b>${area.name}</b><br>
        해류 방향 : ${data.direction}<br>
        속도 : ${data.speed} m/s
        `
    );

});


// ------------------------------
// 지도 클릭
// ------------------------------

map.on("click",function(e){

    console.log(
        "위도 :",e.latlng.lat,
        "경도 :",e.latlng.lng
    );

});


// ------------------------------
// 현재 선택된 해역 강조
// ------------------------------

function highlightArea(areaName){

    temperatureLayers.forEach(layer=>{

        layer.setStyle({

            weight:2,

            fillOpacity:0.45

        });

    });

    const index = seaAreas.findIndex(
        area=>area.name===areaName
    );

    if(index!=-1){

        temperatureLayers[index].setStyle({

            weight:5,

            fillOpacity:0.8

        });

    }

}


// ------------------------------
// showSeaData 함수 확장
// ------------------------------

const originalShowSeaData = showSeaData;

showSeaData = function(area){

    originalShowSeaData(area);

    highlightArea(area);

};


// 첫 실행 시 광안리 강조
highlightArea("광안리");
// ===========================================
// script.js (3/4)
// AI 어종 추천 시스템
// ===========================================

// ------------------------------
// 어종 데이터베이스
// ------------------------------

const fishDatabase = [

{
    name:"고등어",
    minTemp:18,
    maxTemp:24,
    season:["봄","여름","가을"],
    score:0
},

{
    name:"갈치",
    minTemp:22,
    maxTemp:28,
    season:["여름","가을"],
    score:0
},

{
    name:"전갱이",
    minTemp:20,
    maxTemp:26,
    season:["여름","가을"],
    score:0
},

{
    name:"삼치",
    minTemp:18,
    maxTemp:23,
    season:["가을","여름"],
    score:0
},

{
    name:"광어",
    minTemp:12,
    maxTemp:20,
    season:["봄","겨울"],
    score:0
},

{
    name:"농어",
    minTemp:17,
    maxTemp:25,
    season:["여름","가을"],
    score:0
},

{
    name:"우럭",
    minTemp:10,
    maxTemp:18,
    season:["겨울","봄"],
    score:0
}

];


// ------------------------------
// 점수 계산
// ------------------------------

function calculateFish(temp, season){

    fishDatabase.forEach(fish=>{

        let score = 0;

        if(temp >= fish.minTemp &&
           temp <= fish.maxTemp){

            score += 70;

        }

        if(fish.season.includes(season)){

            score += 30;

        }

        fish.score = score;

    });

}


// ------------------------------
// 추천 출력
// ------------------------------

function showFishRecommendation(area){

    const data = seaData[area];

    calculateFish(
        data.temperature,
        getSeason()
    );

    fishDatabase.sort((a,b)=>b.score-a.score);

    const fishList =
        document.getElementById("fishList");

    fishList.innerHTML="";

    for(let i=0;i<4;i++){

        const fish = fishDatabase[i];

        fishList.innerHTML += `

        <div class="fish">

            <h3>🎣 ${fish.name}</h3>

            <p>추천도 : ${fish.score}%</p>

        </div>

        `;

    }

}


// ------------------------------
// 추천 이유
// ------------------------------

function updateReason(area){

    const data = seaData[area];

    const list =
        document.getElementById("reasonList");

    list.innerHTML="";

    list.innerHTML +=
    `<li>🌡 현재 수온 ${data.temperature}℃</li>`;

    list.innerHTML +=
    `<li>🍂 현재 계절 : ${getSeason()}</li>`;

    list.innerHTML +=
    `<li>🌊 해류 방향 : ${data.direction}</li>`;

    list.innerHTML +=
    `<li>🚤 해류 속도 : ${data.speed} m/s</li>`;

    list.innerHTML +=
    `<li>🧂 염분 : ${data.salinity} PSU</li>`;

    list.innerHTML +=
    `<li>💧 용존산소 : ${data.oxygen} mg/L</li>`;

}


// ------------------------------
// 기존 함수 확장
// ------------------------------

const previousShowSeaData = showSeaData;

showSeaData = function(area){

    previousShowSeaData(area);

    showFishRecommendation(area);

    updateReason(area);

};


// ------------------------------
// 첫 실행
// ------------------------------

showFishRecommendation("광안리");

updateReason("광안리");
// ===========================================
// script.js (4/4)
// 자동 갱신 + API 연결 준비
// ===========================================


// ------------------------------
// 실시간 데이터 갱신(데모)
// ------------------------------

function randomUpdate(){

    Object.keys(seaData).forEach(area=>{

        // 수온 ±0.3℃
        seaData[area].temperature =
            Number(
                (
                    seaData[area].temperature +
                    (Math.random()-0.5)*0.6
                ).toFixed(1)
            );

        // 용존산소 ±0.2
        seaData[area].oxygen =
            Number(
                (
                    seaData[area].oxygen +
                    (Math.random()-0.5)*0.2
                ).toFixed(1)
            );

        // 염분 ±0.1
        seaData[area].salinity =
            Number(
                (
                    seaData[area].salinity +
                    (Math.random()-0.5)*0.1
                ).toFixed(1)
            );

    });

}


// ------------------------------
// 지도 색상 업데이트
// ------------------------------

function refreshTemperatureLayer(){

    temperatureLayers.forEach((layer,index)=>{

        const area = seaAreas[index];

        const temp =
            seaData[area.name].temperature;

        layer.setStyle({

            color:getTemperatureColor(temp),

            fillColor:getTemperatureColor(temp)

        });

    });

}


// ------------------------------
// 현재 선택된 지역 기억
// ------------------------------

let currentArea = "광안리";

const oldShowSeaData = showSeaData;

showSeaData = function(area){

    currentArea = area;

    oldShowSeaData(area);

};


// ------------------------------
// 자동 새로고침
// ------------------------------

setInterval(()=>{

    randomUpdate();

    refreshTemperatureLayer();

    showSeaData(currentArea);

},10000);


// ------------------------------
// API 연결 예시
// ------------------------------

async function loadRealtimeData(){

    /*
    const response = await fetch(
        "여기에 OpenAPI 주소"
    );

    const result = await response.json();

    seaData["광안리"].temperature =
        result.temperature;

    seaData["광안리"].salinity =
        result.salinity;

    seaData["광안리"].oxygen =
        result.oxygen;

    seaData["광안리"].speed =
        result.currentSpeed;

    seaData["광안리"].direction =
        result.currentDirection;

    refreshTemperatureLayer();

    showSeaData(currentArea);
    */

}


// ------------------------------
// 시작
// ------------------------------

showSeaData(currentArea);

console.log(
    "Marine Fish Finder Ready!"
);
