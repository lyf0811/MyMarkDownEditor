
declare var jQuery: (selector: string) => any;
var lastEditRange:any
var codenum:number
var isinit:boolean
var mytext:any=document.getElementById('mytext') 
var colorboard:any=document.getElementById('colorboard')
/* 页面初始化
    1.加载字体格式表
    2.加载字体大小表
    3.设置指针悬停按钮时显示的功能提示
    4.设置tab键和backspace键的特殊功能，包括tab实现缩进，backspace不会将所有内容删除
    5.
*/

function pageinit(){      
    lastEditRange=document.createRange()
    codenum=0
    isinit=false
    document.onkeydown=function(e){
        var ev:any = e || window.event; //获取event对象 
        var obj:any = ev.target || ev.srcElement; //获取事件源 
        var t:any = obj.type || obj.getAttribute('type'); //获取事件源类型 
        //获取作为判断条件的事件类型 
        var vReadOnly:any = obj.readOnly;
        var vDisabled:any = obj.disabled;
        //处理undefined值情况 
        vReadOnly = (vReadOnly == undefined) ? false : vReadOnly;
        vDisabled = (vDisabled == undefined) ? true : vDisabled;
        //当敲Backspace键时，事件源类型为密码或单行、多行文本的， 
        //并且readOnly属性为true或disabled属性为true的，则退格键失效 
        var flag1:boolean = ev.keyCode == 9
        var flag2:boolean = ev.keyCode == 8 && (mytext.innerHTML=="<p><br></p>"||mytext.innerText==null)
        //var flag3 = ev.keyCode == 8 && window.getSelection().getRangeAt(0).commonAncestorContainer.parentNode.nodeName=="XMP"&&window.getSelection().getRangeAt(0).commonAncestorContainer.
    
    
        if (flag2||flag1 ) return false;
    }
  

    lastEditRange.collapse(true)
    lastEditRange.setStart(mytext.firstChild.firstChild,0)
    lastEditRange.setEnd(mytext.firstChild.firstChild,0)

    
    mytext.addEventListener('keydown',function(e){
        if(e.keyCode==9){   

        var txt:any=document.createTextNode('\xa0\xa0\xa0\xa0')
        lastEditRange.insertNode(txt)
        mytext.focus()
        var range:any=document.createRange()
        range.setStart(txt,txt.length)
        range.setEnd(txt,txt.length)
        window.getSelection().removeAllRanges()
        window.getSelection().addRange(range)
        lastEditRange.setStart(txt,txt.length)
        lastEditRange.setEnd(txt,txt.length)

        }
        
        
  
    },false)
    mytext.scrollTop=100;
    var buttonlist:any=document.getElementsByClassName('menubutton')
    document.getElementById('list1').onmouseout=function(){
        document.getElementById('tips').style.visibility='hidden'
        
    }
    for(let i:number=0;i<buttonlist.length;i++){
        var offsetleft:number=buttonlist[i].offsetLeft
        var tip:any=document.getElementById('tips')
        var tipname:any=document.getElementById('tipsname')
        buttonlist[i].onmouseover=function(event){          
            tip.style.visibility='visible'               
            tipname.innerText=event.currentTarget.name
            tip.style.fontSize='20px'
            tip.style.left=event.currentTarget.offsetLeft+15-event.currentTarget.name.length*20/2+'px'
            tip.style.top=event.currentTarget.offsetTop-45+'px'
      
        }
        
    }
    mytext.onclick=function(){
        
        lastEditRange=window.getSelection().getRangeAt(0)
        console.log(lastEditRange)
        colorboard.style.display='none'
        document.getElementById('createtable').style.display='none'
        document.getElementById('insertcode').style.display='none'
    }    
    
    $(document).ready(function(){
        $('#backgroundOpacity').val("50%")
        $.getJSON('./src/data.json',function(json){
        for(var i:number=0;i<json.fontname.length;i++)
        {
            var str:string="<option>"+json.fontname[i]+"</option>"
            $('#fontstyle').append(str)
        }
        for(var i:number=0;i<json.fontsize.length;i++)
        {
            var num:string="<option>"+json.fontsize[i]+"</option>"
            $('#fontsize').append(num)
        }
        })
    })
    $("#musicbutton").click(function(){
        $("#musiccontent").slideToggle()
        
    })
    $('#wangyimusic').click(function(){
        $("#localplayer").css("display","none")
        $("#wangyiplayer").slideToggle()


    })

    $('#localmusic').click(function(){
        $("#wangyiplayer").css("display","none")
        $("#localplayer").slideToggle()

    })

    $("#changemusicbutton").click(function(){
   
        $("#changemusic").slideToggle()
    })
    $("#changeconfirm").click(function(){
        let url="//music.163.com/outchain/player?type=2&id="+$('#musicid').val()+"&auto=1&height=66"
        $("#changemusic").slideToggle()
        $('#wangyiyun').attr('src',url)
    })
}

/*

    实现所有menu中按钮功能的函数

*/

function change(name:string, args:any=null,args2:any=null){
    mytext.focus()
    var space:string="<p><br></p>"
    switch(name){
        case 'code':
            document.getElementById('insertcode').style.display='block'
            document.getElementById('insertcode').style.left=document.body.clientWidth/2-320+"px"
            console.log(document.body.clientWidth)
        break;
        case 'insertcode':

            var a:string='<div id="'+codenum+'"></div>'+space
            var codecontent:string='<pre><code class="code"><xmp>'+args+'</xmp></code></pre>'

            var range:any=window.getSelection().getRangeAt(0)
            range.setStart(lastEditRange.startContainer,lastEditRange.startOffset)
            range.setEnd(lastEditRange.startContainer,lastEditRange.endOffset)  
            document.execCommand('insertHTML',false,a)
            document.getElementById(codenum.toString()).innerHTML=codecontent        
            document.getElementById('insertcode').style.display='none'
            
            codenum++
        
            

        break;
        case 'hiliteColor':
            
            colorboard.style.display='block'
            colorboard.className='hiliteColor'
        break;
        case 'foreColor':
            colorboard.style.display='block'
            colorboard.className='foreColor'
        break;
        
        case 'table':
            document.getElementById('createtable').style.display='block'
            document.getElementById('createtable').style.left=document.getElementById('table').offsetLeft-100+'px'

        break;
        
        case 'inserttable':
            mytext.focus()
            var tablerow:any=""
            tablerow+='<tr style="background-color:gainsboro;height:50px">'
            for(let j:number=0;j<args2;j++){
                tablerow+='<td></td>'

            }
            tablerow+='</tr>'
            if(args>1){
                for(let i:number=0;i<args-1;i++){
                    tablerow+='<tr style="height:50px">'
                    for(let j:number=0;j<args2;j++){
                        tablerow+='<td></td>'

                    }
                    tablerow+='</tr>'
                }
                }

            if(lastEditRange.startContainer!=undefined){
            var range:any=window.getSelection().getRangeAt(0)
            range.setStart(lastEditRange.startContainer,lastEditRange.startOffset)
            range.setEnd(lastEditRange.startContainer,lastEditRange.endOffset)
            }
            
            var tablecontent='<table border="1" width="100%" cellpadding="0"cellspacing="0">'+tablerow
            +'</table>'  +space
            document.execCommand('insertHTML',false,tablecontent)
            document.execCommand('enableInlineTableEditing',false,'true')
            document.getElementById('createtable').style.display='none'
            
            
        break;

            
        case 'insert':{
            var file:any;
            switch(args){
                case 'picture':
                    file=document.getElementById('picturefile').files[0]
                break;

                case 'video':
                    file=document.getElementById('videofile').files[0]
                break;

                case 'music':
                    file=document.getElementById('musicfile').files[0]
                break;
            }
            var reader:any=new FileReader();  
            reader.readAsDataURL(file) 
            reader.onload=function(reader){
                switch(args){
                    case 'picture':
                        var htmlcontent:string='<img src="'+reader.target.result+'" alt=picture style="height:50%;">'
                        document.execCommand('insertHTML', false, htmlcontent);
                    break;

                    case 'video':
                        var mp4content:string='<source src="'+reader.target.result+'" type="video/mp4"/>'
                        var oggcontent:string='<source src="'+reader.target.result+'" type="video/ogg"/>'
                        var avicontent:string='<source src="'+reader.target.result+'" type="video/avi"/>'
                        var mpegcontent:string='<source src="'+reader.target.result+'" type="video/mpeg"/>'
                        var movcontent:string='<source src="'+reader.target.result+'" type="video/mov"/>'
                        var htmlcontent:string='<video height="50%" controls="controls"> '+mp4content+oggcontent+avicontent+mpegcontent+movcontent+' </video>'
                        document.execCommand('insertHTML', false, htmlcontent);
                    break;
                    
                    case 'music':
                        document.getElementById('music').src=reader.target.result;
                    break;
            
            }
        
        }
        break;
        
        default:  
            {
                document.execCommand(name, false, args);
                mytext.focus()
            }
        
    }
    
mytext.focus()
} 

function changeBackgroundOpacity(num:number){
    document.getElementById('text').style.backgroundColor="rgba(255,255,255,"+num/100+")"
    document.getElementById('backgroundOpacity').value=document.getElementById('opacityRange').value+"%"
}

function changeBackgroundImg(){
    var backgroundfile:any=document.getElementById('backgroundfile').files[0]
    var reader:any=new FileReader();  
    reader.readAsDataURL(backgroundfile) 
    reader.onload=function(reader){
        console.log(reader.target.result)
        document.getElementById('background').style.backgroundImage='url("'+reader.target.result+'")'
    }
  
}

function pagePrint(){
   
    
    let printDataHtml:any = document.getElementById('text').innerHTML;
    let pageHtml:any = document.body.innerHTML;
    document.body.innerHTML = printDataHtml;
    window.print();
    document.body.innerHTML = pageHtml;
//  刷新页面
  

}
pageinit()




