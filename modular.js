$(document).ready(function(){
    $("#module").hide();
    $("div.judge").each(function(i){
        let inner=document.getElementById("module").innerHTML
        let judg=$(this);
        let which=judg.attr('id');

        let obj="";

        fetch(which+".json")
        .then(function(res){
            if(!res.ok){
                throw new Error("http error");
            }
            return res.json();
        })
        .then(function(data){
            obj=data;
            inner=inner.replace("$statement$",obj.statement);
            inner=inner.replace("$input-form$",obj.inputf);
            inner=inner.replace("$output-form$",obj.outputf);
            inner=inner.replace("$input$",obj.input);
            inner=inner.replace("$output$",obj.output);
            judg.html(
                inner
            );
            judg.find('#subm').click(function(){
                let x=$("#snackbar");
                
                $.post("https://emkc.org/api/v2/piston/execute",
                    {
                        "language":"python",
                        "version":"3.10.0",
                        "files":[
                            {"content":judg.find("#code").val()}
                        ],
                        "stdin":judg.find("#input").val(),
                        "run_timeout":100
                    },
                    function(data){
                        if(data.run.signal!=null){
                            x.text("Bad Result (TLE/MLE)")
                            x.addClass("show");
                            setTimeout(function(){x.removeClass("show");},2000);
                        }
                        else{
                            let out=data.run.stdout
                            if(out===obj.output){
                                x.text("Accepted")
                                x.addClass("show");
                                setTimeout(function(){x.removeClass("show");},2000);
                            }
                            else{
                                x.text("Wrong Answer")
                                x.addClass("show");
                                setTimeout(function(){x.removeClass("show");},2000);
                            }
                        }
                    }
                ).fail(function(xhr,stat,err){
                    x.text("Ajax Call Error")
                    x.addClass("show");
                    setTimeout(function(){x.removeClass("show");},2000);
                })
            });
        }).catch(function(err){
            alert(err);
        });
        
    });
});