/**
 * Created by Anil Ras on 4/9/2017.
 */
var LFT = require("leanft/leanft");
var SDK = LFT.SDK;
var Web = LFT.Web;
var expect = require("leanft/expect");
var whenDone = LFT.whenDone;


describe("HP Site",function(){
    var browser;

    beforeEach(function(done){
        LFT.init(); /*Add runtime engine and HTML report configuration in this method*/
        Web.Browser.launch("chrome").then(function(launchedBrowser){
            browser = launchedBrowser;
        });
        whenDone(done);
    });

    it("Should describe the purpose of your test case",function(done){
        //Navigate to the web site you want to test
        browser.navigate("http://www.hpe.com");

        //Add steps here


        whenDone(done);
    });



    afterEach(function(done){
        if(browser){
            browser.close();
        }

        LFT.cleanup();

        whenDone(done);
    });
});