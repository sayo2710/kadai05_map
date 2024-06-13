//****************************************
//MAP成功関数
//****************************************
// input_area map
let input_map; //表示する地図
let input_lat; //緯度
let input_lon; //軽度
let input_pin;

function mapsInit(position) {
  input_lat = position.coords.latitude; //緯度取得
  input_lon = position.coords.longitude; //経度取得

  //Map表示
  input_map = new Bmap(".input_map");
  input_map.startMap(35.4660694, 139.6226196, "load", 16); //初期表示を横浜駅にセット

  //Pinを追加
  input_pin = input_map.pin(35.4660694, 139.6226196, "blue");

  //Infoboxを追加
  //map.infobox(35.4660694, 139.6226196, "おすすめスポット", "私のお気に入りの料理店です");
}

// output_area map
let output_map; //表示する地図
let output_lat; //緯度
let output_lon; //軽度
let output_pin;

function mapsInit(position) {
  output_lat = position.coords.latitude; //緯度取得
  output_lon = position.coords.longitude; //経度取得

  //Map表示
  output_map = new Bmap(".output_map");
  output_map.startMap(35.4660694, 139.6226196, "load", 16); //初期表示を横浜駅にセット

  //Pinを追加
  output_pin = output_map.pin(35.4660694, 139.6226196, "blue");

  //Infoboxを追加
  //output_map.infobox(35.4660694, 139.6226196, "おすすめスポット", "私のお気に入りの料理店です");
}

//****************************************
//失敗関数
//****************************************
function mapsError(error) {
  let e = "";
  if (error.code == 1) {
    e = "位置情報が許可されてません";
  }
  if (error.code == 2) {
    e = "現在位置を特定できません";
  }
  if (error.code == 3) {
    e = "位置情報を取得する前にタイムアウトになりました";
  }
  alert("エラー：" + e);
}

//****************************************
//オプション設定
//****************************************
const set = {
  enableHighAccuracy: true, //より高精度な位置を求める
  maximumAge: 20000, //最後の現在地情報取得が20秒以内であればその情報を再利用する設定
  timeout: 10000, //10秒以内に現在地情報を取得できなければ、処理を終了
};

//最初に実行する関数
function GetMap() {
  navigator.geolocation.getCurrentPosition(mapsInit, mapsError, set);
}

//****************************************
//音声入力
//****************************************
// 音声入力用のAPIを取得
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// 言語の設定
recognition.lang = "ja-JP";

// ボタンのクリック時に音声入力をOn
const pm_btn = document.querySelector(".place_mic_btn");
pm_btn.addEventListener("click", () => {
  recognition.start();
});

// 音声入力の結果が入る
recognition.onresult = (event) => {
  const pm_speech = event.results[0][0].transcript;
  $(".place_mic_text").html(pm_speech);
};

// ボタンのクリック時に音声入力をOn
const cm_btn = document.querySelector(".comment_mic_btn");
cm_btn.addEventListener("click", () => {
  recognition.start();
});

// 音声入力の結果が入る
recognition.onresult = (event) => {
  const cm_speech = event.results[0][0].transcript;
  $(".comment_mic_text").html(cm_speech);
};

//****************************************
//localStorage処理
//****************************************
//0.ページ読み込み（rerode）：保存データ取得表示
function rerode() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const array = localStorage.getItem(key);
    const hukugen_data = JSON.parse(array); //JSON形式から復元

    // テンプレートリテラル
    const html = `
      <li>
        <p>${key}</p>
        <p>${hukugen_data[0]}</p>
        <p>${hukugen_data[1]}</p>
        <p>${hukugen_data[2]}</p>
      </li>
      `;
    $(".display_area").append(html);
  }
  // 登録件数表示
  $(".count").html(localStorage.length);
}
rerode();

//1.登録 クリックイベント
$(".save").on("click", function () {
  const key = $(".date_text").val();
  //特定のキーが存在しているかチェックする
  if (localStorage.hasOwnProperty(key)) {
    alert("すでに登録されています");
  } else {
    let user_data = [
      (place = $(".place_text").val()),
      (comment = $(".comment_text").val()),
      (pic = $(".pic_file").val()),
    ];
    const value = JSON.stringify(user_data); //JSON形式へ変換
    localStorage.setItem(key, value);

    const array = localStorage.getItem(key);
    const hukugen_data = JSON.parse(array); //JSON形式から復元
    console.log(hukugen_data);

    // テンプレートリテラル
    const html = `
      <li>
        <p>${key}</p>
        <p>${hukugen_data[0]}</p>
        <p>${hukugen_data[1]}</p>
        <p>${hukugen_data[2]}</p>
      </li>
      `;
    $(".display_area").append(html);
    $(".count").html(localStorage.length);
    form.reset();
  }
});

//2.変更 クリックイベント
$(".change").on("click", function () {
  const key = $(".date_text").val();

  //特定のキーが存在しているかチェックする
  if (localStorage.hasOwnProperty(key)) {
    // 一回消して、再登録
    localStorage.removeItem(key);

    let user_data = [
      (place = $(".place_text").val()),
      (comment = $(".comment_text").val()),
      (pic = $(".pic_file").val()),
    ];
    const value = JSON.stringify(user_data); //JSON形式へ変換
    localStorage.setItem(key, value);

    // リスト初期化
    $(".display_area").empty();

    // 再表示＆登録件数表示
    rerode();
  } else {
    alert("まだ登録されていません");
  }
});

//3.削除クリックイベント
$(".remove").on("click", function () {
  const key = $(".date_text").val();

  //特定のキーが存在しているかチェックする
  if (localStorage.hasOwnProperty(key)) {
    localStorage.removeItem(key);

    // リスト初期化
    $(".display_area").empty();

    // 再表示＆登録件数表示
    rerode();
  } else {
    alert("まだ登録されていません");
  }
});
//4.全削除 クリックイベント
$(".clear").on("click", function () {
  // ストレージ削除
  localStorage.clear();

  // 画面のリスト削除
  $(".display_area").empty();

  // 登録件数表示
  $(".count").html(localStorage.length);
});
