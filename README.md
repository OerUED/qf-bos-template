# qf-bos-template
Some useful template files for qf-bos.

## htmlTemplate.html

#### 2016/06/12

1. 添加 checkbox 带输入框的代码；

#### 2016/06/07

1. 修改模板中的一些错误代码；

#### 2016/05/18

1. 模板代码初始化；

## lessTemplate.less

#### 2016/06/12

1. 添加 checkbox 带输入框的样式；

#### 2016/06/07

1. 添加高级搜索表单的错误提示样式；

#### 2016/05/18

1. 模板代码初始化；

## jsTemplate.js

#### 2016/06/12

1. 单个选项的 checkbox 添加 input 输入数据；
2. 简单搜索添加 replace 属性，将后端的参数名直接放在结构体里面做替换修改；
3. 修改 copyAdvSearchCtrlData() 函数里的赋值；
4. 高级搜索添加 replace 属性，将后端的参数名直接放在结构体里面做替换修改；
5. 修改 extendAdvSearchData() 函数的赋值方式；

#### 2016/06/08

1. 添加手动修改页码触发的请求回调处理；
2. 统一联动 Tab 和 Menu 和 Select 菜单，同一时间只能有一个请求操作；
3. 修复 Tab 或 Menu 或 Select 菜单改变的时候，页码不变的问题；
4. 统一修改所有控件处理都支持多实例；
5. 添加 setLstData() 函数统一处理页面数据赋值；
6. 添加遍历判断控件里是否有值的方法 checkAdvSearchCtrlData()，不再手工输入；
7. 添加遍历复制控件里值的方法 copyAdvSearchCtrlData()，不再手工输入；
8. 添加遍历设置控件里值为 null 的方法 setAdvSearchCtrlDataNull()，不再手工输入；
9. 所有涉及到翻页的方法统一添加 _name 参数实现多实例；

#### 2016/06/07

1. 添加 checkbox 的单个和多个选项的使用例子；
2. 添加 radio 的使用例子；
3. 添加 Tab Menu Select 控件的 _action 状态字段；
4. 添加 getPromises() 和 procPromises() 函数提供返回 Promises;
5. 添加 changeMainTab() changeMainMenu() changeMainSelect() 函数示例；
6. 添加 Tab Menu Select 控件的等待数据返回才能允许点击的方法；

#### 2016/06/06

1. 修改空白搜索返回全部结果；
2. 添加 submit() 的 $scope.v.form._action.submitted 定时器条件判断；
3. 添加放大图片函数 zoomInImg()；
4. 富文本编辑器允许图片拖拽排练顺序；
5. 修改 loadDataComplete() 和 loadDataSuccess() 的条件判断；
6. 修改字符串或数组判断一律用 hasLength()，其他用 hasValue()；

#### 2016/05/18

1. 添加 modifySpecial() 函数；
2. 修改图片上传的相关变量配置；

#### 2016/05/17

1. 修改 changeMainTab() 函数；
2. 添加 Tab 相关变量；
3. procRequest 后面的 finally 都改成 then；
4. 修改 hasAdvSearchFormData() 函数;

#### 2016/05/16

1. 添加 changeTab() 函数；
2. 修改一些变量命名；