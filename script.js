function getJSON() {
    var req = new XMLHttpRequest();		  // XMLHttpRequest オブジェクトを生成する
    req.onreadystatechange = function() {		  // XMLHttpRequest オブジェクトの状態が変化した際に呼び出されるイベントハンドラ
        if(req.readyState == 4 && req.status == 200){ // サーバーからのレスポンスが完了し、かつ、通信が正常に終了した場合
            var data = JSON.parse(req.responseText);
            // console.log(data);

            var leafletJson = {
                "type": "FeatureCollection",
                "features": []
            }

            for (i=0;i<data.length;i++){
                // console.log(data[i]["ID"])
                // console.log(data[i]["ShopName"])
                // console.log(data[i]["ShopAddr"])
                // console.log(data[i]["longitude"])
                // console.log(data[i]["latitude"])
                leafletJson["features"].push({
                    "type":"Feature",
                    "geometry":{
                        "type":"Point",
                        "coordinates":[data[i]["longitude"],data[i]["latitude"]]
                    },
                    "properties":{
                        "ID":data[i]["ID"],
                        "ShopName":data[i]["ShopName"],
                        "ShopAddr":data[i]["ShopAddr"],
                        "longitude":data[i]["longitude"],
                        "latitude":data[i]["latitude"]
                    }})
            }
            // console.log(leafletJson)
            mapDraw(leafletJson);
        }
    };
    req.open("GET", "/ShigaShop.json", false); // HTTPメソッドとアクセスするサーバーの　URL　を指定
    req.setRequestHeader('Last-Modified','application/x-www-form-urlencoded;charset=UTF-8');
    req.send(null);					    // 実際にサーバーへリクエストを送信
}

function mapDraw(placeData){
    //地図のデフォルト値
    var map = L.map('map').setView([35.235322,136.1094231], 10);
    //OSMレイヤー追加
    L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        ,{
            attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            maxZoom: 18
        }
    ).addTo(map);
    var geojsonFeature = placeData;
    var layerGroup = L.geoJSON(geojsonFeature, {
        onEachFeature: function (feature, layer) {
                const field =`
                    認証番号 : ${feature.properties.ID}</br>
                    店舗名:${feature.properties.ShopName}</br>
                    住所:${feature.properties.ShopAddr}<br>
                    <a href="https://www.google.com/search?q=${feature.properties.ShopName}" target="_blank" rel="noopener noreferrer">Googleで検索</a>
                    <a href="https://search.yahoo.co.jp/search?p=${feature.properties.ShopName}" target="_blank" rel="noopener noreferrer">Yahoo!Japanで検索</a>
                    <p id="attentionMapPin">※住所から自動変換しているためピンの位置は実際の場所とズレている場合があります。行かれる際ははGoogleマップなどで確認の上マスクをするなど感染症対策をするようお願いします。</p>
                `
                layer.bindPopup(field);
        }
    }).addTo(map);
}

getJSON()