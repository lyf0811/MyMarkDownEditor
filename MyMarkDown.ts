

declare var jQuery: (selector: string) => any;
var selection
var lastEditRange
var codenum
var isinit

/* 页面初始化
    1.加载字体格式表
    2.加载字体大小表
    3.设置指针悬停按钮时显示的功能提示
*/

function pageinit(){           
    lastEditRange=document.createRange()
    codenum=0
    isinit=0
    document.onkeydown=function(e){
        var ev = e || window.event; //获取event对象 
        var obj = ev.target || ev.srcElement; //获取事件源 
        var t = obj.type || obj.getAttribute('type'); //获取事件源类型 
        //获取作为判断条件的事件类型 
        var vReadOnly = obj.readOnly;
        var vDisabled = obj.disabled;
        //处理undefined值情况 
        vReadOnly = (vReadOnly == undefined) ? false : vReadOnly;
        vDisabled = (vDisabled == undefined) ? true : vDisabled;
        //当敲Backspace键时，事件源类型为密码或单行、多行文本的， 
        //并且readOnly属性为true或disabled属性为true的，则退格键失效 
        var flag1 = ev.keyCode == 9
        //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效 
        var flag2 = ev.keyCode == 8 && (document.getElementById('mytext').innerHTML=="<p><br></p>"||document.getElementById('mytext').innerText==null)
        //var flag3 = ev.keyCode == 8 && window.getSelection().getRangeAt(0).commonAncestorContainer.parentNode.nodeName=="XMP"&&window.getSelection().getRangeAt(0).commonAncestorContainer.
    
        //判断 
        if (flag2||flag1||flag3 ) return false;
    }
    console.log(document.getElementById('mytext').firstChild.textContent.length)
    document.getElementById('mytext').focus()

    lastEditRange.collapse(true)
    lastEditRange.setStart(document.getElementById('mytext').firstChild.firstChild,0)
    lastEditRange.setEnd(document.getElementById('mytext').firstChild.firstChild,0)

    
    document.getElementById('mytext').addEventListener('keydown',function(e){
        if(e.keyCode==9){   

        var txt=document.createTextNode('\xa0\xa0\xa0\xa0')
        lastEditRange.insertNode(txt)
        document.getElementById('mytext').focus()

        var range=document.createRange()
        range.setStart(txt,txt.length)
        range.setEnd(txt,txt.length)
        window.getSelection().removeAllRanges()
        window.getSelection().addRange(range)
        }
        
        
  
    },false)
    document.getElementById("mytext").scrollTop=100;
    var buttonlist=document.getElementsByTagName('button')
    document.getElementById('list1').onmouseout=function(){
        document.getElementById('tips').style.visibility='hidden'
        
    }
    for(var i:number=0;i<buttonlist.length;i++){
        var offsetleft=buttonlist[i].offsetLeft
        var tip=document.getElementById('tips')
        buttonlist[i].onmouseover=function(event){          
            tip.style.visibility='visible'       
            tip.innerText=event.currentTarget.name
            tip.style.fontSize='20px'
            tip.style.left=event.currentTarget.offsetLeft+17.5-event.currentTarget.name.length*20/2+'px'
      
        }
        
    }
    document.getElementById('mytext').onclick=function(){
        
        lastEditRange=window.getSelection().getRangeAt(0)
        console.log(lastEditRange)


        document.getElementById('colorboard').style.display='none'
        document.getElementById('createtable').style.display='none'
        document.getElementById('insertcode').style.display='none'
    }    
    
    $(document).ready(function(){
        $.getJSON('data.json',function(json){
        for(var i:number=0;i<json.fontname.length;i++)
        {
            var str="<option>"+json.fontname[i]+"</option>"
            $('#fontstyle').append(str)
        }
        for(var i:number=0;i<json.fontsize.length;i++)
        {
            var num="<option>"+json.fontsize[i]+"</option>"
            $('#fontsize').append(num)
        }
        })
    })
}



    function change(name, args=null,args2=null){
    document.getElementById('mytext').focus()
       

        switch(name){
            case 'code':
                document.getElementById('insertcode').style.display='block'
                document.getElementById('insertcode').style.left=document.body.clientWidth/2-320+"px"
                console.log(document.body.clientWidth)
            break;
            case 'insertcode':

                var a='<div id="'+codenum+'"></div>'
                var space="<br>"
                var codecontent='<pre><code class="code"><xmp>'+args+'</xmp></code></pre> <p>&nbsp;<br></p>'

                var range=window.getSelection().getRangeAt(0)
                range.setStart(lastEditRange.startContainer,lastEditRange.startOffset)
                range.setEnd(lastEditRange.startContainer,lastEditRange.endOffset)  
                document.execCommand('insertHTML',false,a)
                document.getElementById(codenum).innerHTML=codecontent        
                document.getElementById('insertcode').style.display='none'
               
                
                codenum++
         
              

            break;
            case 'hiliteColor':
                
                document.getElementById('colorboard').style.display='block'
                document.getElementById('colorboard').className='hiliteColor'
            break;
            case 'foreColor':
                document.getElementById('colorboard').style.display='block'
                document.getElementById('colorboard').className='foreColor'
            break;
            
            case 'table':
                document.getElementById('createtable').style.display='block'
                document.getElementById('createtable').style.left=document.getElementById('table').offsetLeft-100+'px'

            break;
            
            case 'inserttable':
                document.getElementById('mytext').focus()
                var tablerow:any=""
                tablerow+='<tr style="background-color:gainsboro;height:50px">'
                for(var j:number=0;j<args2;j++){
                    tablerow+='<td></td>'

                }
                tablerow+='</tr>'
                if(args>1){
                    for(var i:number=0;i<args-1;i++){
                        tablerow+='<tr style="height:50px">'
                        for(var j:number=0;j<args2;j++){
                            tablerow+='<td></td>'

                        }
                        tablerow+='</tr>'
                    }
                 }

                if(lastEditRange.startContainer!=undefined){
                var range=window.getSelection().getRangeAt(0)
                range.setStart(lastEditRange.startContainer,lastEditRange.startOffset)
                range.setEnd(lastEditRange.startContainer,lastEditRange.endOffset)
                }
                
                var tablecontent='<table border="1" width="100%" cellpadding="0"cellspacing="0">'+tablerow
                +'</table>'  
                document.execCommand('insertHTML',false,tablecontent)
                document.execCommand('enableInlineTableEditing',false,'true')
                document.getElementById('createtable').style.display='none'
              
               
            break;

                
            case 'insert':{
                var file;
                switch(args){
                    case 'picture':
                        file=document.getElementById('picturefile').files[0]
                    break;

                    case 'video':
                        file=document.getElementById('videofile').files[0]
                    break;

                }
                var reader=new FileReader();  
                reader.readAsDataURL(file) 
                reader.onload=function(reader){
                    switch(args){
                        case 'picture':
                            var htmlcontent='<img src="'+reader.target.result+'" alt=picture style="height:50%;">'
                            document.execCommand('insertHTML', false, htmlcontent);
                        break;

                        case 'video':
                            var mp4content='<source src="'+reader.target.result+'" type="video/mp4"/>'
                            var oggcontent='<source src="'+reader.target.result+'" type="video/ogg"/>'
                            var avicontent='<source src="'+reader.target.result+'" type="video/avi"/>'
                            var mpegcontent='<source src="'+reader.target.result+'" type="video/mpeg"/>'
                            var movcontent='<source src="'+reader.target.result+'" type="video/mov"/>'
                            var htmlcontent='<video height="50%" controls="controls"> '+mp4content+oggcontent+avicontent+mpegcontent+movcontent+' </video>'
                            document.execCommand('insertHTML', false, htmlcontent);
                        break;
                
                }
            
            }
            break;
           
            default:  
                {
                    document.execCommand(name, false, args);
                    window.focus()
                }
            
        }
        
    document.getElementById('mytext').focus()
    } 





    





pageinit();