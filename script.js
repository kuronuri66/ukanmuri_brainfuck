let i
let pointer
const memory_size = document.getElementById("memory_size");
let memory = new Array(1024).fill(0);
let result
let ireko_check
let result_i
let preview = document.querySelector("#preview");
let input_i;
let play_ = true;
const brainfuckletter = ['<', '>', '+', '-', '.', ',', '[' ,"]"];
let speed = 30;

//const pause = document.getElementById('pause');

//pause.style.visibility = 'hidden';

display();
initialize();

function plane_bf(code) {
    let p_code = "";
    let i=0;
    while(code.length > i){
        if(brainfuckletter.includes(code[i])){
            p_code += code[i]
        }
        i++
    }
    return(p_code);
}

function initialize() {
    i = 0;
    pointer = 0;
    result_i = document.getElementById("console").innerHTML.length + 1
    memory = new Array(Number(document.getElementById("memory_size").value)).fill(0);
    result = "";
    input_i = 0;
}

function play() {
    const pause = document.getElementById('pause');
    pause.style.display = 'block';
    const play = document.getElementById('play');
    play.style.display = 'none';
    if (play_==true){
        initialize();
        
        preview.innerHTML = plane_bf(document.getElementById('code').value);
        const input = document.getElementById("input").value;
        const bit = document.getElementById("cell_size").value;
        brainfuck(plane_bf(document.getElementById('code').value),input,bit);
    } else {
        play_ = true;
    }
}

function pause() {
    play_ = false;
    const pause = document.getElementById('pause');
    pause.style.display = 'none';
    const play = document.getElementById('play');
    play.style.display = 'block';
}

function stop() {
    if (play_ == true){
        i = code.length + 1;
    }
}

function brainfuck(code,input,bit) {
    if (play_==true){
        console.log(i, code[i]);
        if (code[i]=="+") {
            memory[pointer]++;
            if (memory[pointer] > Math.pow(2, bit) - 1) {
                memory[pointer] = 0;
            }
        } else
        if (code[i]=="-") {
            memory[pointer]--;
            if (memory[pointer]<0) {
                memory[pointer] = Math.pow(2, bit) - 1;
            }

        }else if (code[i]==">") {
            pointer++;

        }else if (code[i]=="<") {
            pointer--;
            if (pointer<0) {
                document.getElementById("console").innerHTML += ("ERROR: Pointer cannot be decremented past 0.  (" + i +")<br>");
            }

        }else if (code[i]==".") {
            console.log(i);
            result += String.fromCharCode(memory[pointer]);

            document.getElementById("console").innerHTML += ("> "+result+"<br>");
            scrollToBottom()

        }else if (code[i]==",") {
            if (input_i < input.length){
                memory[pointer] = input.charCodeAt(input_i);
                console.log(input.charCodeAt(input_i), input_i)
                input_i++
            }

        }else if (code[i]=="]" && memory[pointer]!=0) {
            ireko_check = 1 ;
            let kakko= i; 
            while (true) {
                if (ireko_check == 0 && code[i]=="["){
                    break;
                }
                i--
                if (code[i]=="]") {
                    ireko_check++
                }
                if (code[i]=="[") {
                    ireko_check--
                }
                if (i<0) {
                    document.getElementById("console").innerHTML += ("ERROR: Mismatched ']'.  (" + kakko +")<br>");
                    i = code.length + 1;
                    break;
                }
            }

        } else if (code[i]=="[" && memory[pointer]==0) {
            ireko_check = -1 ;
            let kakko= i; 
            while (true) {
                if (ireko_check == 0 && code[i]=="]"){
                    break;
                }
                i++
                if (code[i]=="]") {
                    ireko_check++
                }
                if (code[i]=="[") {
                    ireko_check--
                }
                if (i>code.length) {
                    document.getElementById("console").innerHTML += ("ERROR: Mismatched '['.  (" + kakko +")<br>");
                    i = code.length + 1; 
                    break;
                }
            }
        }

        i++;
    }

    display();
    if (document.getElementById("speed_select").value == "input"){
        speed = document.getElementById("speed_input").value
    } else {
        speed = Number(document.getElementById("speed_select").value)
    }
    if (code.length > i){
        if (speed == "0") {
            brainfuck(code);
        } else { 
            setTimeout(function() { brainfuck(code,input,bit); }, speed);
        }
    } else {
        const pause = document.getElementById('pause');
        pause.style.display = 'none';
        const play = document.getElementById('play');
        play.style.display = 'block';
    }
}


//表示側
function display(){
    //memory 表示
    let j=0;
    let memoryHtml = '';
    while(j < memory.length) {
        if (j==pointer){
            memoryHtml += '<span class="highlight">' + String(memory[j]).padStart(4, '0') + '</span>';
        } else {
            memoryHtml += '<span>' + String(memory[j]).padStart(4, '0')  + '</span>';
        }
        j++
    };

    document.getElementById("memory").innerHTML = memoryHtml;

    //preview
    preview_highlight(i,"preview")

}

//一番下にスクロールする
const logOutput = document.getElementById('console');
let logCounter = 0; // 初期のログ数から開始

function scrollToBottom() {
    logOutput.scrollTop = logOutput.scrollHeight;
}

//
function preview_highlight(target,id) {

    let preview = document.getElementById(id);
    if (!preview) {
        console.error('Code block not found.');
        return;
    }

    const textContent = preview.textContent; // preタグ内の純粋なテキストを取得
    let highlightedHtml = '';

    let targetIndex = target;

    // 文字列の各文字をループ処理
    for (let i = 0; i < textContent.length; i++) {
        if (brainfuckletter.includes(textContent[i])) {
            if (i === targetIndex) {
                // 指定したインデックスの文字を<span>で囲む
                highlightedHtml += `<span class="highlight">${textContent[i]}</span>`;
            } else {
                // それ以外の文字はそのまま追加
                highlightedHtml += textContent[i];
            }
        }
    }

    // preタグのinnerHTMLを更新
    preview.innerHTML = highlightedHtml;
};



//codenavbar系統

function save() {
    const txt = document.getElementById("code").value
    const blob = new Blob([txt], { type: 'text/plain' });

    const a = document.createElement('a');
    a.href =  URL.createObjectURL(blob);
    a.download = 'title.bf';
    a.click();
}

function load() {
    const fileInput = document.getElementById('load-file');
    const textArea = document.getElementById('code');

    // 選択されたファイルを取得
    const file = fileInput.files[0];

    // ファイルが選択されていない場合は何もしない
    if (!file) {
        return;
    }

    // FileReaderオブジェクトを作成
    const reader = new FileReader();
    reader.readAsText(file);

    // ファイルの読み込みが完了したときのイベントハンドラ
    reader.onload = function(e) {
        // 読み込んだ内容をtextareaにセット
        textArea.value = e.target.result;
    };

    // ファイルをテキストとして読み込む
}

const copy_button = document.getElementById("copy_button");
copy_button.addEventListener('click', async () => {
    try {
        // テキストをクリップボードに書き込む
        await navigator.clipboard.writeText(document.getElementById("code").value);
        alert('テキストがコピーされました！');
        console.log('Text copied to clipboard!');
    } catch (err) {
        // コピーに失敗した場合
        console.error('Failed to copy text: ', err);
        alert('テキストのコピーに失敗しました。ブラウザのセキュリティ設定を確認してください。');
    }
});

//popup系統
const myPopup = document.getElementById('myPopup');
const closePopupBtn = document.querySelector('.popup-close-btn');

const GuiedBtn = document.getElementById('GuiedBtn');
const golfBtn = document.getElementById('golfBtn')
const infoBtn = document.getElementById('infoBtn');
const settingBtn = document.getElementById('settingBtn');
const codei_btn = document.getElementById('codei_btn');


const Guidecontent = document.getElementById('Guidecontent');
const golfcontent = document.getElementById('golfcontent');
const infocontent = document.getElementById('infocontent');
const settingcontent = document.getElementById('settingcontent');
const code_infocontent = document.getElementById('code_infocontent');

let confirm_target = null;

function choosepopup(content) {
    if(content=="guide") {
        Guidecontent.style.display = 'block';
    }else{
        Guidecontent.style.display = 'none';
    }

    if(content=="golf") {
        golfcontent.style.display = 'block';
    }else{
        golfcontent.style.display = 'none';
    }

    if(content=="info") {
        infocontent.style.display = 'block';
    }else{
        infocontent.style.display = 'none';
    }

    if(content=="setting") {
        settingcontent.style.display = 'block';
    }else{
        settingcontent.style.display = 'none';
    }

    if(content=="codeinfo") {
        code_infocontent.style.display = 'block';
    }else {
        code_infocontent.style.display = 'none';
    }

    if(content=="confirm") {
        confirm_content.style.display = 'block';
    }else {
        confirm_content.style.display = 'none';
    }

}

// ボタンクリックでポップアップを表示
GuiedBtn.addEventListener('click', () => {
    myPopup.style.display = 'flex'; // 'flex'で中央寄せを適用
    choosepopup("guide");
    if(navigator.language == 'ja'){
        document.getElementById("CommandsTable-ja").style.display = 'block';
        document.getElementById("CommandsTable-en").style.display = 'none';
    }else {
        document.getElementById("CommandsTable-ja").style.display = 'none';
        document.getElementById("CommandsTable-en").style.display = 'block';
    }
});
/*/
golfBtn.addEventListener('click', () => {
    myPopup.style.display = 'flex'; // 'flex'で中央寄せを適用
    choosepopup("golf");
});
/*/

infoBtn.addEventListener('click', () => {
    myPopup.style.display = 'flex'; // 'flex'で中央寄せを適用
    choosepopup("info");
});

settingBtn.addEventListener('click', () => {
    myPopup.style.display = 'flex'; // 'flex'で中央寄せを適用
    choosepopup("setting");
});

codei_btn.addEventListener('click', () => {
    myPopup.style.display = 'flex'; // 'flex'で中央寄せを適用
    code_info();
    choosepopup("codeinfo");
});

function myconfirm() {
    myPopup.style.display = 'flex'; // 'flex'で中央寄せを適用
    choosepopup("confirm");
}

// 閉じるボタンクリックでポップアップを非表示
closePopupBtn.addEventListener('click', () => {
    myPopup.style.display = 'none';
});

const confirmOK = document.getElementById("confirm_button")
confirmOK.addEventListener('click', () => {
    myPopup.style.display = 'none';
    if(confirm_target=="bomb"){
        document.getElementById("code").value="";
    }
});

// ポップアップの背景クリックで非表示
myPopup.addEventListener('click', (event) => {
    // イベントのターゲットがポップアップのオーバーレイ自身である場合のみ非表示
    if (event.target === myPopup) {
        myPopup.style.display = 'none';
    }
});


//codeのinfo関係
function code_info() {
    const code = document.getElementById("code");
    const text = code.value; // textareaの現在値を取得
    let countl = 0;

    // テキスト内の各文字をループでチェック
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        // 現在の文字が特定の文字配列に含まれているかチェック
        if (brainfuckletter.includes(char)) {
            countl++;
        }
    }

    // 結果をHTMLに表示
    document.getElementById('count').innerHTML = countl+"/"+text.length;
}


//golfの問題関係
const json_data = 
[
    {
        "id": 1,
        "Difficulty": 1,
        "question": "Output 'A'",
        "target" : [66,25,24]
    },
    {
        "id": 2,
        "Difficulty": 2,
        "question": "Output 'HELLO WORLD!'",
        "target" : [108,100,76]
    }
];

const golf_Questions = document.getElementById("golf_Questions");
let k=0;
while (json_data.length > k) {
    golf_Questions.innerHTML += 
        "<div class='golf_Question'><div class='Question_contents Question_id'>"+
        json_data[k].id+
        "</div><div class='Question_contents Question_difficulty'>"+
        "<img src='img/star_yellow.svg'>".repeat(json_data[k].Difficulty)+"<img src='img/star (2).svg'>".repeat(5-json_data[k].Difficulty)+
        "</div><div class='Question_contents Question_question'>"+
        json_data[k].question+
        "</div><div class='Question_contents Question_target'> <img src='img/trophy_Gold.svg'>"+
        json_data[k].target[2]+
        "</div><div class='Question_contents Question_target'> <img src='img/trophy_Silver.svg'>"+
        json_data[k].target[1]+
        "</div><div class='Question_contents Question_target'> <img src='img/trophy_copper.svg'>"+
        json_data[k].target[0]+
        "</div>"
    
    k++
}



//textareaのtab対応
function OnTabKey( e, obj ){

	// タブキーが押された時以外は即リターン
	if( e.keyCode!=9 ){ return; }

	// タブキーを押したときのデフォルトの挙動を止める
	e.preventDefault();

	// 現在のカーソルの位置と、カーソルの左右の文字列を取得しておく
	var cursorPosition = obj.selectionStart;
	var cursorLeft     = obj.value.substr( 0, cursorPosition );
	var cursorRight    = obj.value.substr( cursorPosition, obj.value.length );

	// テキストエリアの中身を、
	// 「取得しておいたカーソルの左側」+「タブ」+「取得しておいたカーソルの右側」
	// という状態にする。
	obj.value = cursorLeft+"\t"+cursorRight;

	// カーソルの位置を入力したタブの後ろにする
	obj.selectionEnd = cursorPosition+1;
}


const checkbox=document.getElementById("storage_box");
// 対象となるテキストエリアにonkeydownイベントを追加する
document.getElementById( "code" ).onkeydown = function( e ){ OnTabKey( e, this ); }
if(checkbox.checked){
    if (localStorage.getItem('code')=="" || !localStorage.getItem(code)) {
        localStorage.setItem('code', 
            "+++++++++++[>++++++>++++++>+++>++++++++<<<<-]>+++>++++++.<.>++++..+++.>-.>-.<<.>>-----.<<---.<-.>>+."
        );
    }
}

function code_change() {
    if(checkbox.checked) {
        localStorage.setItem('code', document.getElementById("code").value);
    }
}

window.addEventListener("load", () =>{
    if(checkbox.checked) {
        document.getElementById("code").value = localStorage.getItem('code');
    }
});

//speed_input
const speed_select = document.getElementById("speed_select");
const speed_input = document.getElementById("speed_input");
speed_change()
function speed_change() {
    if (speed_select.value == "input"){
        speed_select.style.width = "15px";
        speed_input.style.display = "block";
    } else {
        speed_select.style.width = "10vh";
        speed_input.style.display = "none";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const keyboard = document.getElementById('keyboard');
    const keyboard_head = document.getElementById('keyboard-head');
    let isDragging = false;
    let offsetX, offsetY; // 要素内のクリックされた位置と要素の左上からの差

    // ドラッグ開始
    keyboard_head.addEventListener('mousedown', (e) => {
        isDragging = true;
        keyboard.classList.add('dragging');

        // クリックした位置と要素の左上からの差を計算
        offsetX = e.clientX - keyboard.getBoundingClientRect().left;
        offsetY = e.clientY - keyboard.getBoundingClientRect().top;
    });

    // ドラッグ中
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        // 新しい位置を計算
        const newLeft = e.clientX - offsetX;
        const newTop = e.clientY - offsetY;

        // 要素の位置を更新
        keyboard.style.left = `${newLeft}px`;
        keyboard.style.top = `${newTop}px`;
    });

    // ドラッグ終了
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            keyboard.classList.remove('dragging');
        }
    });

    // **タッチデバイス対応**
    keyboard_head.addEventListener('touchstart', (e) => {
        isDragging = true;
        keyboard.classList.add('dragging');

        const touch = e.touches[0]; // 最初の指の情報を取得
        offsetX = touch.clientX - keyboard.getBoundingClientRect().left;
        offsetY = touch.clientY - keyboard.getBoundingClientRect().top; // スクロールなど、デフォルトのタッチイベントを無効化
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        const touch = e.touches[0];
        const newLeft = touch.clientX - offsetX;
        const newTop = touch.clientY - offsetY;

        keyboard.style.left = `${newLeft}px`;
        keyboard.style.top = `${newTop}px`;
        e.preventDefault(); // スクロールなど、デフォルトのタッチイベントを無効化
    }, { passive: false });

    document.addEventListener('touchend', () => {
        if (isDragging) {
            isDragging = false;
            keyboard.classList.remove('dragging');
        }
    });
});

function keyboard_push(word){
    const code = document.getElementById("code");
    const sentence = code.value;
    const len = sentence.length;
    const pos = code.selectionStart;
    if(word=="←"){
        code.focus();
        code.setSelectionRange(pos-1, pos-1)
    }else if(word=="→"){
        code.focus();
        code.setSelectionRange(pos+1, pos+1)
    }else if(word=="bs"){
        const before = sentence.substr(0, pos-1);
        const after = sentence.substr(pos, len);

        code.value = before + after;

        code.focus();
        code.setSelectionRange(pos-1, pos-1)
    } else {
    const before = sentence.substr(0, pos);
    const after = sentence.substr(pos, len);

    code.value = before + word + after;

    code.focus();
    code.setSelectionRange(pos+1, pos+1)
    }

}

function close_keyboard() {
    document.getElementById("keyboard").style.display.none;
}
const keyBtn = document.getElementById("keyboardBtn")
keyBtn.addEventListener('click', () => {
    document.getElementById('keyboard').style.display='block';
});