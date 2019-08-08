
// 行数
var rows = 10;


// 列数
var cols = 10;


// 雷数
var bombs = 10;


// 存放所有td的二维数组
var tdArr = [];


// 存放所有td的普通数组
var alltd = [];


// 记录游戏是否结束的布尔变量
var isOver = false;


// 找到table元素
var gameTable = document.getElementById("game-table");


// 第一层for循环,创建10个tr
for (var i = 0; i < rows; i++) {
    var tr = document.createElement("tr");
    var temp = [];
    // 里层for循环用于创建10个td
    for (var j = 0; j < cols; j++) {
        var td = document.createElement("td");
        td.classList.add("grid");
        // 为每个创建td设置初始状态为normal
        td.setAttribute("state", "normal")
        tr.appendChild(td);
        temp.push(td);
        alltd.push(td);
        td.onmousedown = tdClick;
        td.row = i;
        td.col = j;
    }
    tdArr.push(temp);


    gameTable.appendChild(tr);
}




// 随机生成每颗雷的位置


// var numArray = [];
// for (var i = 0; i < alltd.length; i++) {
//     numArray[i] = i;
// }


for (var i = 0; i < bombs; i++) {
    var index = Math.floor(Math.random() * alltd.length);
    // var num = numArray[index];
    // numArray.splice(index, 1);
    alltd[index].setAttribute("is-bomb", "yes");
    alltd.splice(index, 1);
}


// 阻止右键弹出菜单
document.body.oncontextmenu = function (e) {
    e.preventDefault();
}
// td点击事件绑定函数
function tdClick(e) {
    if (isOver) {
        return;
    }
    // alert(e.target.row+","+e.target.col);
    // console.log(e);
    if (e.button == 0) {
        // 左键
        if (e.target.getAttribute("state") == "normal") {
            if (e.target.getAttribute("is-bomb") == "yes") {
                gameOver(e.target);
                return;
            }


            openGrid(e.target);


            if (alltd.every(function (el) {
                if (el.getAttribute("state") == "normal" ||
                    el.getAttribute("state") == "flag") {
                    return false;
                } else {
                    return true;
                }
            })) {
                alert("胜利");
                isOver = true;
            }
        }
    } else if (e.button == 2) {
        // 右键
        if (e.target.getAttribute("state") == "normal") {
            e.target.setAttribute("state", "flag");
        } else if (e.target.getAttribute("state") == "flag") {
            e.target.setAttribute("state", "normal");
        }
    }
}






// 计算某个td周围有几课雷
function bombsArround(td) {
    var num = 0;


    // 遍历 
    for (var i = td.row - 1; i <= td.row + 1; i++) {
        for (var j = td.col - 1; j <= td.col + 1; j++) {
            // 排除自身
            if (i == td.row && j == td.col) {
                continue;
            }
            // 排除边界之外的
            if (i < 0 || i > rows - 1 || j < 0 || j > cols - 1) {
                continue;
            }
            var tar = tdArr[i][j];
            if (tar.getAttribute("is-bomb") == "yes") {
                num++;
            }
        }
    }
    return num;
}


// 游戏结束函数
function gameOver(td) {
    isOver = true;
    var bombtds = document.querySelectorAll("[is-bomb=yes]");
    for (var i = 0; i < bombtds.length; i++) {
        bombtds[i].setAttribute("state", "bomb");
    }
    td.setAttribute("state", "bomb-ex");


    alert("GAME OVER");
}


// 打开某个td的函数
function openGrid(td) {
    var bombNum = bombsArround(td);
    td.setAttribute("state", bombNum);
    if (bombNum == 0) {


        for (var i = td.row - 1; i <= td.row + 1; i++) {
            for (var j = td.col - 1; j <= td.col + 1; j++) {
                // 排除自身
                if (i == td.row && j == td.col) {
                    continue;
                }
                // 排除边界之外的
                if (i < 0 || i > rows - 1 || j < 0 || j > cols - 1) {
                    continue;
                }
                var tar = tdArr[i][j];
                if (tar.getAttribute("state") == "normal") {
                    openGrid(tar);
                }
            }
        }


    }
}