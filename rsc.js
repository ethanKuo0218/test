var selected_list = []; //地區們
var list_dic = {}; //對應地區與物件
var data = []; //http取回的資料

main();

function main() {
    getData(); //取資料
    createSelectList(); //selected_list 取值
    generateHotBox(); //生成熱門行政區
    sortData(); //list_dic 取值
    topFunction(); //回到最上層
    var contentTitle = document.getElementById('contentTitle');
    contentTitle.innerHTML = '<h2 class = "contentTitle" data-num = ' + 0 + '>' + selected_list[0] + '</h2>'; //預設全部地區
    updateContent(1);
}
//get data by JSON
function getData() {
    var requireHTML = new XMLHttpRequest();
    try {
        requireHTML.open('get', 'https://ice880218.github.io/IceK0218.github.io/travel_site/data.json', false);
        requireHTML.send();
    } catch (error) {
        alert('error');
    }
    var get = requireHTML.responseText;
    data = JSON.parse(get).result.records;
}

//create selected＿list
function createSelectList() {
    var districts = document.getElementById('district');
    var hotBox = document.getElementById('hotBox');
    var str = '<option value="0">- -請選擇行政區- -</option>';
    var count = 0;
    selected_list[0] = '全部地區';
    for (var i = 0; i < data.length; i++) {
        if (selected_list.includes(data[i].Zone) == false) {
            selected_list.push(data[i].Zone);
            count++;
            str += '<option value="' + count + '">' + selected_list[count] + '</option>'
        }
    }
    districts.innerHTML = str;
    districts.addEventListener('change', selected_selBox, false);
}

//generate hot box
function generateHotBox() {
    var hotBox = document.getElementById('hotBox');
    var str = '<h3 class="selecTit">熱門行政區</h3>';
    for (var i = 1; i <= 5; i++) {
        str += '<span onclick  = "selected_hotBox(' + i + ')" class="dis" id="li' + i + '" value = "' + i + '">' + selected_list[i] + '</span>'
    }
    hotBox.innerHTML = str;
}

//generate list_dic
function sortData() {
    list_dic[0] = data;
    for (var i = 1; i < selected_list.length; i++) {
        var card = [];
        for (var j = 0; j < data.length; j++) {
            if (data[j].Zone == selected_list[i]) {
                card.push(data[j]);
            }
            list_dic[i] = card;
        }
    }
}

function page_content(e) {
    var select_value = e;
    var card_num = 8;
    var totalCard = list_dic[select_value].length;
    var totalPage = totalCard / card_num;
    var remainderCard = totalCard % 8;
    var now = 0;
    var page = [];
    if (remainderCard > 0) {
        totalPage = parseInt(totalPage + 1);
    } else {
        totalPage = totalPage;
    }
    for (var i = 0; i < totalPage; i++) {
        str = '';
        for (var j = now + 8 * i; j < now + 8 * i + 8 && j < totalCard; j++) {
            str += '<li class= "contCard">' +
                '<div class= "picture" style= "background-image: url(' +
                list_dic[select_value][j].Picture1 + ');">' +
                '<div class= "picTit">' +
                list_dic[select_value][j].Name + '</div>' +
                '<div class= "subTit">' +
                list_dic[select_value][j].Zone + '</div>' +
                '<p class= "time">' +
                '<img src= "css/img/icons_clock.png" style="vertical-align:middle; margin-right:5px">' +
                list_dic[select_value][j].Opentime + '</p>' +
                '<p class= "adr">' +
                '<img src="css/img/icons_pin.png" style="vertical-align:middle; margin-left:1px; margin-right:6px">' +
                list_dic[select_value][j].Add + '</p>' +
                '<p class= "telCon">' +
                '<img src="css/img/icons_phone.png" style="vertical-align:middle; margin-left:3px; margin-right:8px">' +
                list_dic[select_value][j].Tel +
                '<img src="css/img/icons_tag.png" style="vertical-align:middle; margin-left:170px; margin-right: 5px">' +
                list_dic[select_value][j].Ticketinfo + '</p>' +
                '</div></li>';
        }
        page[i + 1] = str;
    }
    return page;
}

//顯示所選畫面
//全部地區
function homePage() {
    var contentTitle = document.getElementById('contentTitle');
    var selectBox = document.getElementById('district');
    selectBox.options.selectedIndex = 0;
    contentTitle.innerHTML = '<h2 class = "contentTitle" data-num = ' + 0 + '>' + selected_list[0] + '</h2>';
    updateContent(1);
}
//由select box 選取
function selected_selBox(e) {
    var contentTitle = document.getElementById('contentTitle')
    var select_value = e.target.options.selectedIndex;
    var contentTitle = document.getElementById('contentTitle')
    contentTitle.innerHTML = '<h2 class = "contentTitle" data-num = ' + select_value + '>' + selected_list[select_value] + '</h2>';
    updateContent(1);
}
//由 熱門行政區 選取
function selected_hotBox(value) {
    var contentTitle = document.getElementById('contentTitle');
    var selectBox = document.getElementById('district');
    selectBox.options.selectedIndex = 0;
    contentTitle.innerHTML = '<h2 class = "contentTitle" data-num = ' + value + '>' + selected_list[value] + '</h2>';
    updateContent(1);
}

//顯示所選取內容
function updateContent(pageNum) {
    var content = document.getElementById('content');
    var cardNum = 8;
    var districtValue = document.querySelector('.contentTitle').dataset.num;
    var page = page_content(districtValue);
    var totalPage = list_dic[districtValue].length / cardNum;
    var remainderCard = list_dic[districtValue].length % cardNum;
    if (remainderCard > 0) {
        totalPage = parseInt(totalPage + 1);
    } else {
        totalPage = totalPage
    }
    if (pageNum > totalPage) {
        pageNum -= 1;
    } else if (pageNum < 1) {
        pageNum += 1;
    }
    var str = page[pageNum]
    content.innerHTML = str;
    updatePageBar(totalPage, pageNum)
}

//topbtn
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
//到指定頁數
function goPage(pageNum) {
    pageNum = parseInt(pageNum);
    updateContent(pageNum);
}
//上一頁
function goPrev(pageNum) {
    pageNum = pageNum - 1;
    updateContent(pageNum);
}
//下一頁
function goNext(pageNum) {
    pageNum = pageNum + 1;
    updateContent(pageNum);
}
//更新頁數欄
function updatePageBar(totalPage, pageNum) {
    var pageHtml = '';
    var pageShow = document.getElementById('page_show');
    var start, end;
    if (pageNum < 3) {
        start = 1;
    } else {
        start = pageNum - 2;
    }

    if (totalPage < pageNum + 2) {
        end = totalPage;
    } else {
        end = pageNum + 2;
    }

    pageHtml += '<span onclick = "goPrev(' + pageNum + ')"> < prev </span>';
    for (var i = start, page_cur = ''; i <= end; i++) {
        if (pageNum == i) {
            page_cur = 'page_cur';
        } else {
            page_cur = '';
        }
        pageHtml += '<span onclick="goPage(' + i + ')" class = "' + page_cur + '">' + i + '</span>';
    }
    pageHtml += '<span onclick = "goNext(' + pageNum + ')"> next > </span>';
    pageShow.innerHTML = pageHtml;
}