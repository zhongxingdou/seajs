#seajs的时间戳插件plugin-timestamp.js介绍

##原理：

此插件重定义了seajs.pluginSDK.Module._resolve，新的_resolve方法被调用时先调用原方法，然后根据返回的文件url在timestamp.js定义的对象中查找出该文件的最后更新时间，然后以参数的形式附加到文件的url后面。这样就实现了时间戳的功能。

插件加载timestamp.js时，会在url后添加一个发布日期参数，此参数可通过seajs.config({public_date: "201309280355"})配置，我一般是将这一行语句放在一个名为pubdate.js的文件中，并将它放到插件之前加载。这样做的目的是不想每次都重新加载timestamp.js，因为每次加载只有一行的pubdate.js更小。

如果是combo的url，如www.abc.com/??a.js,b.js，那么会选择a.js和b.js之中更新时间更晚的那个作为它们的时间戳。

##使用示例：

###page.aspx
<pre><code>
&lt;script src='http://res.chukou1.com/vendor/seajs/1.2.1/sea.js' >&lt;/script>
&lt;script src='http://res.chukou1.com/seajs_config.js>&lt;/script>
&lt;script src='http://res.chukou1.com/pubdate.js?t=&lt;%= 产生随机数的后台代码  %>' >&lt;/script>
&lt;script src='http://res.chukou1.com/vendor/seajs/1.2.1/plugin-timestamp.js' >&lt;/script>
</code></pre>

###pubdate.js
<pre><code>
seajs.config({
    "publish_date": "201209270135"
});
</code></pre>

###timestamp.js
<pre><code>
define("timestamp",function(require, exports, module) {
    module.exports = {
        "vendor": {
            "es5-shim": {
                "1.2.10": {
                    "es5-shim.js": "0921154038"
                 }
             }
	     }
     }
});
</code></pre>

##生成时间戳文件：
1. 安装ruby运行环境， 
2. 安装生成时间戳的gem
   * gem install file-timestamp   
3. 查看帮助 
   * timestamp --help
4. 输出当前目录的时间戳信息并保存到timestamp.js中
   * timestamp  . --seajs > timestamp.js
5. 生成pubdate.js，以下语句只在mac osx下测试过
   * date "+seajs.config({'publish_date': '%Y%m%d%H%M%S'});" > pubdate.js



