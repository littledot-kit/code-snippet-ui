import {nextTick} from "vue";
import {codeSnippetManager, configManager} from "./core.js";
import {$var, CODE_VIEW, CREATE_VIEW, LIST_VIEW,  UPDATE_VIEW} from "./store"
import {handleCopy, handleRecoverLiteShow, refreshListView} from "./some";

// 控制长按键
let longKeyDown = false;
let lastTabTime = 0;  // 计算上次按下Tab时间



const gotoTheLastPosition = ()=>{
    // 校准位置
    if($var.utools.selectedIndex > -1 ){
        let distance = $var.scroll.itemOffsetArray[$var.utools.selectedIndex] -200;
        if(distance < 0){
            distance = 0;
        }
        $var.scroll.listInvoker?.(distance)
    }
}

/**
 * Only ListView
 */
function dealWithListView(e,list){
    switch (e.code){
        case "KeyH":
        case "ArrowLeft":
            // 校验是否有效
            if($var.utools.selectedIndex=== -1){
                if(configManager.get("enabledBeep")){
                    utools.shellBeep();
                }
            }else{
                if($var.view.isDel){
                    $var.utools.subItemSelectedIndex = $var.utools.subItemSelectedIndex === 0? 1:0;
                }else{
                    if($var.utools.subItemSelectedIndex === -1){
                        $var.utools.subItemSelectedIndex = 4;
                    }else{
                        $var.utools.subItemSelectedIndex --;
                    }
                }
            }
            break;
        case "KeyJ":
        case "ArrowDown":
            if($var.view.isDel){
                $var.view.isDel = false;
            }
            if ($var.utools.selectedIndex >= list.value.length -1) { // -1 >= 0-1
                if(configManager.get("enabledBeep")){
                    utools.shellBeep();
                }
            } else {
                $var.utools.selectedIndex++;
                $var.utools.subItemSelectedIndex = -1;
                $var.scroll.listInvoker?.("down")
            }
            break;
        case "KeyK":
        case "ArrowUp":
            if($var.view.isDel){
                $var.view.isDel = false;
            }
            if ($var.utools.selectedIndex <= 0) {
                if(configManager.get("enabledBeep")){
                    utools.shellBeep();
                }
            } else {
                $var.utools.selectedIndex--;
                $var.utools.subItemSelectedIndex = -1;
                $var.scroll.listInvoker?.("up")
            }
            break;
        case "KeyL":
        case "ArrowRight":
            // 校验是否有效
            if($var.utools.selectedIndex=== -1 ){
                if(configManager.get("enabledBeep")){
                    utools.shellBeep();
                }
            }else{
                if($var.view.isDel){
                    $var.utools.subItemSelectedIndex = $var.utools.subItemSelectedIndex === 0? 1:0;
                }else{
                    if($var.utools.subItemSelectedIndex === 4){
                        $var.utools.subItemSelectedIndex = -1;
                    }else{
                        $var.utools.subItemSelectedIndex ++;
                    }
                }
            }
            break;
        case "Space":
            if($var.utools.subItemSelectedIndex === -1){
                if(e.repeat){
                    $var.currentMode = CODE_VIEW;
                    longKeyDown = true;
                }
            }
            break;
        case "Digit0":
            if($var.utools.selectedIndex === -1){
                if(configManager.get("enabledBeep")){
                    utools.shellBeep();
                }
            }else{
                $var.utools.selectedIndex = 0;
                $var.scroll.listInvoker?.(0)
            }
            break;
        case 'KeyT':
            let index = configManager.getTopList().indexOf($var.currentName)
            if(index === -1){
                $var.utools.selectedIndex = configManager.addTopItem($var.currentName);
            }else{
                configManager.delTopItem(index)
            }
            refreshListView()
            break;
        case 'KeyD':
        case 'KeyX':
            $var.utools.subItemSelectedIndex = 1;
            $var.view.isDel = true;
            break;
        case 'KeyV':
                if(!$var.view.fullScreenShow){
                    $var.view.fullScreenShow = true;
                    $var.view.recoverLiteShow= true;
                    utools.setExpendHeight(545)
                }
                $var.currentMode = CODE_VIEW;
                return;
        default:
            dealWithCommonView(e)
            break;
    }

}

function dealWithCodeView(e){
    switch (e.code){
        case "KeyH":
        case "ArrowLeft":
            $var.scroll.codeInvoker?.("left");
            break;
        case "KeyJ":
        case "ArrowDown":
            $var.scroll.codeInvoker?.("down");
            break;
        case "KeyK":
        case "ArrowUp":
            $var.scroll.codeInvoker?.("up");
            break;
        case "KeyL":
        case "ArrowRight":
            $var.scroll.codeInvoker?.("right");
            break;
        case 'KeyS':
            $var.view.showCodeTip = !$var.view.showCodeTip;
            break;
        case 'KeyQ':
            handleRecoverLiteShow();
            $var.currentMode = LIST_VIEW;
            $var.utools.keepSelectedStatus = true;
            break;
        default:
            dealWithCommonView(e)
            break;
    }
}

/**
 * ListView & CodeView
 */
function dealWithCommonView(e){
    switch (e.code){
        case 'KeyC':
        case 'KeyY':
            handleCopy(false)
            break;
        case 'KeyP':
            handleCopy(true)
            break;
        case 'KeyE':
            if(!$var.view.fullScreenShow){
                $var.view.fullScreenShow = true;
                $var.view.recoverLiteShow= true;
                utools.setExpendHeight(545)
            }
            $var.currentMode = UPDATE_VIEW;
            break;
    }
}


/**
 * @param list - ListView的响应式列表
 */
function init(list) {
    document.onkeydown = e => {
        // ignore  update view or create view
        if ($var.currentMode > CODE_VIEW) {
            return;
        }
        // dialog or sideview
        if ($var.view.settingActive) {
            // prevent any possible event
            if (e.code === 'Space' || e.code === 'Enter' || e.code === 'Tab') {
                e.preventDefault();
            } else if (e.code === 'KeyQ') {
                $var.view.settingActive = false;
            }
            return;
        }
        // super key
        if (e.code === 'Enter') {
            handleCopy(true)
            return;
        } else if (e.code === 'Tab') {
            e.preventDefault();
            let gap = e.timeStamp - lastTabTime;
            if (gap < 300) {
                $var.view.fullScreenShow = !$var.view.fullScreenShow;
                $var.utools.focused = true;
                utools.subInputFocus();
            } else {
                if ($var.utools.focused && $var.utools.selectedIndex > -1) {
                    $var.utools.focused = false;
                    utools.subInputBlur();
                    gotoTheLastPosition();
                } else {
                    utools.subInputFocus();
                    $var.utools.focused = true;
                }
            }
            lastTabTime = e.timeStamp;
            return;
        }
        // 其他键无法触发
        if ($var.utools.focused || e.shiftKey || e.altKey) {
            return;
        }
        // 处理Ctrl键
        if (e.ctrlKey || e.metaKey) {
            if (e.code === 'KeyN') {
                if (!$var.view.fullScreenShow) {
                    $var.view.fullScreenShow = true;
                    $var.view.recoverLiteShow = true;
                    utools.setExpendHeight(545)
                }
                $var.currentMode = CREATE_VIEW;
                return;
            } else if (e.code === 'KeyR' && $var.currentMode === LIST_VIEW) {
                refreshListView()
                return;
            } else if (e.code === 'KeyF' && $var.currentMode === LIST_VIEW) {
                if (configManager.get("enabledFuzzySymbolQuery")) {
                    configManager.set("enabledFuzzySymbolQuery", false)
                    $message.info("退出【模糊符号查询】模式")
                } else {
                    configManager.set("enabledFuzzySymbolQuery", true)
                    $message.success("进入【模糊符号查询】模式")
                }
            }
            return;
        }
        // 剩余处理
        if ($var.currentMode === LIST_VIEW) {
            dealWithListView(e, list)
        } else {
            dealWithCodeView(e)
        }
    }
    document.onkeyup = e => {
        if ($var.view.settingActive | $var.utools.focused || $var.utools.selectedIndex < 0 || $var.currentMode > CODE_VIEW) {
            return;
        }
        if (e.code === 'Space') {
            e.preventDefault();
            if (longKeyDown.value) {
                longKeyDown.value = false;
                $var.currentMode = LIST_VIEW;
                $var.utools.keepSelectedStatus = true;
                return;
            }
            if ($var.currentMode === LIST_VIEW) {
                if ($var.utools.subItemSelectedIndex === -1) {
                    // // 校准位置
                    // console.log('space invoke to the last position')
                    // gotoTheLastPosition();
                } else {
                    // 处理 Vim 操作
                    $var.scroll.spaceInvoker[$var.utools.subItemSelectedIndex]?.()
                }
            }
        }
    }
}




/**
 *
 * @param {string} searchWord
 */
function parseSearchWord(searchWord){
    let array = [];
    if(searchWord == null || searchWord.length === 0){
        if($var.view.fullScreenShow  || !configManager.get('noShowForEmptySearch')){
            array = codeSnippetManager.queryForMany(null,null,null)
        }else{
            return [];
        }
    }else{
        const words = searchWord.split(/\s/).filter(v=>v.length>=1)
        let name = null;
        let type = null;
        let tags = [];
        for (let word of words) {
            if(word[0] === '@'){
                if(word.length !== 1){
                    type = word.slice(1)
                }
            }else if(word[0] === '#'){
                if(word.length !== 1){
                    tags.push(word.slice(1))
                }
            }else{
                name = word;
            }
        }
        array = codeSnippetManager.queryForMany(name,tags,type)
    }

    // 判断 keepSelectedStatus ，如果为true，需要保留selectIndex位置
    // 由于默认keepSelectedStatus为true，则selectIndex可能为非法，这时候需要忽视keepSelectedStatus
    // 只有当 删除/添加/搜索操作时，会将keepSelectedStatus置为false
    if( $var.utools.selectedIndex<0 || $var.utools.selectedIndex>=array.length ||   $var.utools.keepSelectedStatus===null){
        $var.utools.selectedIndex = (array.length===0)? -1: 0;
    }else if($var.utools.keepSelectedStatus){
        nextTick(()=>{
            // 校准位置
            console.log('go to the last position')
            gotoTheLastPosition();
        })
    }
    $var.utools.subItemSelectedIndex = -1;
    // 重置
    $var.utools.keepSelectedStatus = false;
    // 控制tip显示策略
    $var.others.onlyOne =  array.length === 1;
    return array;
}




export {
    init,
    parseSearchWord
}