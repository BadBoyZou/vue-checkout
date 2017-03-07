new Vue({
	el : "#app",
	data : {
		productList : [],
		totalMoney : 0,
        checkAllFlag : false,
        delFlag : false,
        currProduct:[],
	},
	filters :{
        formatMoney : function(value,type){
            return "￥" + value.toFixed(2) + type;
        }
	},
	mounted : function(){
		this.$nextTick(function () {
            this.cartView();
        })
	},
	methods : {
        /*使用resource调取数据，实现前后端数据传输*/
		cartView : function () {
            var _this = this;
			this.$http.get("./data/cart.json").then(function(res){
                _this.productList = res.body.result.list;
                _this.totalMoney = res.body.result.totalMoney;
            })
		},
        /*为‘+’‘-’按钮绑定事件，判断当前是哪一个按钮，之后触发事件*/
        changMoney : function(item,way){
            if( way > 0){
                item.productQuentity++;
            }else{
                item.productQuentity--;
                if( item.productQuentity < 1){
                    item.productQuentity = 1;
                }
            }
        },
        /*单选事件，添加自定义添加属性‘check’，如果属性不存在，点击后自动添加上去完成单选，再点击取消属性*/
        selectedProduct : function(item){
            if(typeof item.checked == 'undefined'){
                this.$set(item,'checked',true);
            }else(
                item.checked = !item.checked
            )
            this.calaTotalPrice()
        },
        /*全选事件与取消全选，点击全选按钮，checkFlag=true。遍历列表，是否已经有单选事件触发，有：不变，无：添加全选事件*/
        checkAll : function(way){
            this.checkAllFlag = way;
            var _this = this;
            this.productList.forEach(function (item,index) {
                if(typeof item.checked == 'undefined'){
                    _this.$set(item,'checked',_this.checkAllFlag);
                }else(
                    item.checked = _this.checkAllFlag
                )
            })
            this.calaTotalPrice()
        },
        /*计算商品总金额，遍历列表，是否有单选事件 or 全选事件触发，根据事件的不同计算总金额*/
        calaTotalPrice: function () {
            this.totalMoney = 0;
            var _this = this;
            this.productList.forEach(function (item,index) {
                if (item.checked) {
                    _this.totalMoney += item.productPrice * item.productQuentity;
                }
            })
        },
        /*删除事件，获取当前商品的索引并保存*/
        delConfirm: function (item) {
            this.delFlag=true;
            this.currProduct = item;
        },
        /*弹窗的‘YES’按钮，点击后根据索引删除商品*/
        delProduct: function () {
            var index = this.productList.indexOf(this.currProduct);
            this.productList.splice(index,1);
            this.delFlag=false;
        }
	}
});