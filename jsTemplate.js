// JS模板更新日志：
//
// 2016/06/07
// 1.添加 checkbox 的单个和多个选项的使用例子；
// 2.添加 radio 的使用例子；
// 3.添加 Tab Menu Select 控件的 _action 状态字段；
// 4.添加 getPromises() 和 procPromises() 函数提供返回 Promises;
// 5.添加 changeMainTab() changeMainMenu() changeMainSelect() 函数示例；
// 6.添加 Tab Menu Select 控件的等待数据返回才能允许点击的方法；
//
// 2016/06/06
// 1.修改空白搜索返回全部结果；
// 2.添加 submit() 的 $scope.v.form._action.submitted 定时器条件判断；
// 3.添加放大图片函数 zoomInImg()；
// 4.富文本编辑器允许图片拖拽排练顺序；
// 5.修改 loadDataComplete() 和 loadDataSuccess() 的条件判断；
// 6.修改字符串或数组判断一律用 hasLength()，其他用 hasValue()；
//
// 2016/05/18
// 1.添加 modifySpecial() 函数；
// 2.修改图片上传的相关变量配置；
//
// 2016/05/17
// 1.修改 changeMainTab() 函数；
// 2.添加 Tab 相关变量；
// 3.procRequest 后面的 finally 都改成 then；
// 4.修改 hasAdvSearchFormData() 函数;
//
// 2016/05/16
// 1.添加 changeTab() 函数；
// 2.修改一些变量命名；

app.controller('ctrlPromotionProductManage', ['$rootScope', '$scope', '$modal', '$filter', '$timeout', '$q', 'servHttp',
    function($rootScope, $scope, $modal, $filter, $timeout, $q, servHttp) {

        // 变量
        $scope.v = {
            // 页面
            'page': null,
            // 列表
            'lstData': [],
            // 搜索
            'search': null,
            // 表单
            'form': null,
            // 接口
            'api': null,
            // 控件
            'control': null,
        };

        // 函数
        $scope.f = {
            'ok': ok,
            'cancel': cancel,
            'submit': submit,
            'askForDelUploaded': askForDelUploaded,
            'zoomInImg': zoomInImg,
        };

        // 页面参数
        $scope.v.page = {
            // 页面初始化完毕标志
            'init': true,
            // 页面请求数据成功标志
            'hasData': false,
            // 编辑状态
            'editing': false,
        };

        // 搜索配置
        $scope.v.search = {
            'isProcessing': false,
            'useAdvanced': false,
            'cancel': cancelSearching,
            // 简单搜索的数据
            'simple': {
                'form': {
                    'keyword': null,
                },
                'data': {}, // 不需要重复写跟form一样的变量
                'method': smpSearch,
            },
            // 高级搜索的数据
            'advanced': {
                'open': showAdvSearch,
                'clear': clearAdvSearchForm,
                'method': advSearch,
                'showed': false,
                'touched': false,
                'submitted': false,
                'form': {
                    'startTime': null,
                    'endTime': null,
                    'name': null,
                    'status': null,
                    'type': null,
                },
                'data': {}, // 不需要重复写跟form一样的变量
            },
        };

        // 显示高级搜索
        function showAdvSearch() {
            $scope.v.search.advanced.showed = !$scope.v.search.advanced.showed;
        }

        // 接口（每一个api对应一个单独的处理函数）
        $scope.v.api = {
            'list': function(data) {
                return servHttp.get('', data);
            },
            'search': function(data) {
                return servHttp.get('', data);
            },
            'import': function(data) {
                return servHttp.get('', data);
            },
            'get': function(data) {
                return servHttp.get('', data);
            },
            'save': function(data) {
                return servHttp.post('', data);
            },
            'update': function(data) {
                return servHttp.post('', data);
            },
        };

        // 控件配置
        $scope.v.control = {
            'pagination': null,
            'tab': null,
            'menu': null,
            'select': null,
            'checkbox': null,
            'radio': null,
            'date': null,
            'editor': null,
            'uploader': null,
        };

        // 分页配置
        $scope.v.control.pagination = {
            'pageSize': 25,
            'maxSize': 7,
            'pageNo': 1,
            'count': 0,
        };

        // tab 控件
        $scope.v.control.tab = {
            '_action': {
                // 数据请求状态
                'submitted': false,
            },
            'main': {
                'options': [{
                    _value: '全部商品',
                    _key: 0,
                }, {
                    _value: '线上商品',
                    _key: 1,
                }, {
                    _value: '下架商品',
                    _key: 2,
                }],
                'current': {
                    _value: '全部商品',
                    _key: 0,
                },
                'change': changeMainTab,
            },
        };

        // menu 控件
        $scope.v.control.menu = {
            '_action': {
                // 数据请求状态
                'submitted': false,
            },
            'main': {
                'options': [],
                'current': null,
                'change': changeMainMenu,
            },
        };

        // select 控件
        $scope.v.control.select = {
            '_action': {
                // 数据请求状态
                'submitted': false,
            },
            'status': {
                'options': [{
                    '_key': 'ONSALE',
                    '_value': '进行中'
                }, {
                    '_key': '0',
                    '_value': '未开始'
                }, {
                    '_key': '1',
                    '_value': '已结束'
                }],
                'current': null,
                'change': null,
                'disabled': false,
                'showed': false,
            },
            'type': {
                'options': [{
                    '_key': '2',
                    '_value': '拼团'
                }, {
                    '_key': '0',
                    '_value': '秒送'
                }, {
                    '_key': '1',
                    '_value': '抽奖'
                }],
                'current': null,
                'change': null,
                'disabled': false,
                'showed': false,
            }
        };

        // checkbox 控件
        $scope.v.control.checkbox = {
            // 单个选项
            'single': {
                'disabled': false,
                'showed': false,
                'value': null,
                'change': null,
            },
            // 多个选项
            'group': {
                'value': [],
                'change': null,
                'ins': {
                    'no1': { 'disabled': false, 'showed': false },
                    'no2': { 'disabled': false, 'showed': false },
                },
            },
        };

        // radio 控件
        $scope.v.control.radio = {
            'example': {
                'value': null,
                'change': null,
                'ins': {
                    'no1': { 'disabled': false, 'showed': false },
                    'no2': { 'disabled': false, 'showed': false },
                },
            }
        };

        // 日期控件
        $scope.v.control.date = {
            '_config': {
                // 当前时间
                'now': new Date(),
                // 时间限制
                'min': calcDate(1, true),
                'max': calcDate(7, true),
                // 时间选项
                'timeOptions': {
                    'showMeridian': false,
                },
                // 日期选项
                'dateOptions': {
                    'showWeeks': false,
                },
                'method': showCalendar,
            },
            'startTime': { 'disabled': false, 'showed': false, 'value': null },
            'endTime': { 'disabled': false, 'showed': false, 'value': null },
        };

        // 富文本编辑器
        $scope.v.control.editor = {
            '_config': {
                'options': getEditorOptions(),
                'ready': readyEditor,
            },
        };

        // 富文本编辑器实例
        $scope.v.control.editor.ins = {
            'desc': {'instance': null, 'content': null, 'disabled': false, 'showed': false},
        };

        // 上传插件
        $scope.v.control.uploader = {
            '_config': {
                'url': $rootScope.uploadImgUrl,
                'options': {
                    multi_selection: false,
                    max_files: 1,
                    file_data_name: 'imageFile',
                },
                // 'callbacks': uploaderCallbacks,
            },
        };

        // 上传插件实例
        $scope.v.control.uploader.ins = {
            'main': {
                'url': $scope.v.control.uploader._config.url,
                'options': $scope.v.control.uploader._config.options,
                'callback': uploaderCallbacks('main'),
                'push': pushUploaded,
                'loading': false,
                'data': [],
                'disabled': false,
                'showed': false,
            },
        };

        // 表单数据
        $scope.v.form = {
            '_action': {
                // 表单验证
                'touched': false,
                // 表单验证
                'submitted': false,
            },
            // 从页面中获取 id 值
            'id': null, //document.getElementById('id').value,
            // 从页面中获取 type 值
            'type': null, //document.getElementById('type').value,
            // 从页面中获取 appKey 值
            'appKey': null, //document.getElementById('appKey').value,

            // 表单的变量
        };

        // 获取全局的上传地址
        // function getUploaderUrl() {
        //     return $rootScope.uploadSkuImgUrl;
        // }

        // 获取全局上传配置
        // function getUploaderOptions() {
        //     return $scope.v.control.uploader._config.options;
        // }

        // 上传回调函数
        function uploaderCallbacks(name) {
            return {
                'filesAdded': function (uploader, files) {
                    if ($scope.v.control.uploader.ins[name].data.length > uploader.settings.max_files ||
                        // uploader.files.length > uploader.settings.max_files ||
                        $scope.v.control.uploader.ins[name].data.length + files.length > uploader.settings.max_files ||
                        files.length > uploader.settings.max_files) {
                        uploader.splice();
                        return false;
                    } else {
                        $scope.v.control.uploader.ins[name].loading = true;
                        uploader.settings.multipart_params._appKey = $scope.v.form.appKey;
                        uploader.start();
                        return true;
                    }
                },
                'uploadProgress': function (uploader, file) {
                    $scope.v.control.uploader.ins[name].loading = parseFloat(file.percent / 100.0);
                },
                'fileUploaded': function (uploader, file, response) {
                    $scope.v.control.uploader.ins[name].loading = false;
                    var resp = JSON.parse(response.response);

                    $scope.v.control.uploader.ins[name].push(name, resp);

                    $timeout(function () {
                        uploader.destroy();
                    }, 50);
                },
                'error': function (uploader, error) {
                    $scope.v.control.uploader.ins[name].loading = false;
                }
            };
        }

        // 添加上传后的数据
        function addUploaded(name, data) {
            $scope.v.control.uploader.ins[name].data.push(data);
        }

        // 公共的图片上传成功后的回调
        function pushUploaded(name, res) {
            if ((res.status === 1) && (hasValue(res.data))) {
                addUploaded(name, res.data);
            } else {

            }
        }

        // 删除上传后的数据
        function delUploaded(name, index) {
            $scope.v.control.uploader.ins[name].data.splice(index, 1);
        }

        // 询问删除数据
        function askForDelUploaded(name, index) {
            $scope.message('确定删除该图片？', 'confirm').then(function () {
                delUploaded(name, index);
            }).catch(function () {
                //取消
            });
        }

        // 放大图片
        function zoomInImg(name){
            if (hasLength($scope.v.control.uploader.ins[name].data)) {
                window.open($scope.v.control.uploader.ins[name].data[0].url, '_blank');
            }
        }

        // 上传成功后的回调函数
        // function afterThen(res) {
        //     return $q(function (resolve, reject) {
        //         if ((res.status === 1) && (hasValue(res.data))) {
        //             resolve(res.data);
        //         } else {
        //             reject(res);
        //         }
        //     });
        // }

        // 编辑器加载完毕之后
        function readyEditor(name, instance) {
            // 保存编辑器实例
            $scope.v.control.editor[name].instance = instance;
            // 初始化编辑器附加功能
            addEditorFeatures(instance);
            // 页面主函数（有需要的时候要等编辑器加载完毕后才去请求数据）
            //main();
        };

        // 计算时间间隔
        function calcDate(day, isResetTime) {
            var now = new Date();
            now.setDate(now.getDate() + day);
            if (hasTrue(isResetTime)) {
                now.setHours(23, 59, 59, 999);
            }
            return now;
        }

        // 显示日期选择器
        function showCalendar(name) {
            if ($scope.v.control.date[name].disabled === false) {
                $scope.v.control.date[name].showed = !$scope.v.control.date[name].showed;
            }
        }

        // 初始化编辑器附加功能
        function addEditorFeatures(editor) {
            editor.execCommand('serverparam', {
                // domain
                '_appKey': $scope.v.form.appKey
            });

            // console.log('UEditor ' + editor.uid + ' ready!');
            // 以下是单图上传时的配置
            // editor.on('beforeinserthtml', function(cmd, arg) {
            //     if (arg.indexOf('<img') === 0) {
            //         editor.execCommand('insertparagraph');
            //     }
            // });
            // 设置图片行禁止编辑
            // editor.on('afterinserthtml', function(cmd, arg) {
            //     if (arg.indexOf('<img') === 0) {
            //         editor.execCommand('insertparagraph');

            //         for (var i = 0, len = editor.body.children.length; i < len; i++) {
            //             var node = editor.body.children[i];
            //             if (node && node.firstChild && node.firstChild.tagName == 'IMG') {
            //                 node.contentEditable = false;
            //             }
            //         }
            //     }
            // });
            // 以下是多图上传时的配置
            // 设置图片行禁止编辑
            // editor.on('afterinsertimage', function(cmd, arg) {
            //     var imgs = UE.dom.domUtils.getElementsByTagName(editor.body, 'img');
            //     _.each(imgs, function (node) {
            //         node.setAttribute('ondragstart', 'return false;');
            //         node.setAttribute('unselectable', 'on');
            //         node.setAttribute('contentEditable', 'false');
            //     });
            // });
            // editor.addListener('keydown', function(type, evt) {
            //     var keyCode = evt.keyCode || evt.which;
            //     if (keyCode == 8) {
            //         var domUtils = UE.dom.domUtils;

                    // console.log('getStartElementPath:');console.dir(editor.selection.getStartElementPath());
                    // console.log('getRange:');console.dir(editor.selection.getRange());
                    // console.log('getStart:');console.dir(editor.selection.getStart());

                    // var range = editor.selection.getRange();
                    // if (range.collapsed && !domUtils.findParentByTagName(range.startContainer, 'a', true)){
                    //     return true;
                    // }

                    // if (editor.selection.getStart().tagName.toLowerCase() === 'a') {
                    //     var childNode = editor.selection.getStartElementPath()[0];
                    //     // console.log('childNode:');console.dir(childNode);
                    //     var parentNode = childNode.parentNode;
                    //     // console.log('parentNode:');console.dir(parentNode);
                    //     parentNode.removeChild(childNode);
                    //     // domUtils.preventDefault(evt);
                    //     return false;
                    // }

                    // if (editor.selection.getStart().tagName.toLowerCase() === 'a') {
                    //     UE.dom.domUtils.remove(editor.selection.getStartElementPath()[0]);
                    //     // UE.dom.domUtils.remove(editor.selection.getRange().startContainer);
                    //     evt.preventDefault();
                    //     return false;
                    // }

                    // var start = range.startContainer, end = range.endContainer;
                    // if ( start = domUtils.findParentByTagName( start, 'a', true ) ) {
                    //     range.setStartBefore( start );
                    // }
                    // if ( end = domUtils.findParentByTagName( end, 'a', true ) ) {
                    //     range.setEndAfter( end );
                    // }

                    // console.dir(start);
                    // console.dir(end);
                    // start.outerHTML = '';
                    // start.outerText = '';
                    // start.innerHTML = '';
                    // start.innerText = '';
                    // start.Text = '';
                    // start.textContent = '';

                    // range.deleteContents();

                    // domUtils.preventDefault(evt);
                    // return false;
            //     }
            // });
        }

        // 状态更改
        function changeStatus(newVal) {
            // 异步执行
            $timeout(function() {
                updateLstData();
            });
        }

        // Tab 菜单改变
        function changeMainTab(index) {
            if ($scope.v.control.tab._action.submitted === false) {
                $scope.v.control.tab._action.submitted = true;
                $scope.v.control.tab.main.current = angular.copy($scope.v.control.tab.main.options[index]);
                // 异步执行
                $timeout(function() {
                    updateLstData().finally(function () {
                        $scope.v.control.tab._action.submitted = false;
                    });
                });
            } else {
                $scope.message('正在请求数据中……', 'error');
            }
        }

        // Menu 菜单改变
        function changeMainMenu(index) {
            if ($scope.v.control.menu._action.submitted === false) {
                $scope.v.control.menu._action.submitted = true;
                $scope.v.control.menu.main.current = angular.copy($scope.v.control.menu.main.options[index]);
                // 异步执行
                $timeout(function() {
                    updateLstData().finally(function () {
                        $scope.v.control.menu._action.submitted = false;
                    });
                });
            } else {
                $scope.message('正在请求数据中……', 'error');
            }
        }

        // Select 菜单改变
        function changeMainSelect(name) {
            if ($scope.v.control.select._action.submitted === false) {
                $scope.v.control.select._action.submitted = true;
                // 异步执行
                $timeout(function() {
                    updateLstData().finally(function () {
                        $scope.v.control.select._action.submitted = false;
                    });
                });
            } else {
                $scope.message('正在请求数据中……', 'error');
            }
        }

        // 获取 Promises
        function getPromises(isSucceed, data) {
            return $q(function(resolve, reject) {
                if (isSucceed === true) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        }

        // 处理 Promises
        function procPromises(_p) {
            return _p.then(
                function success(data) {
                    return data;
                },
                function error(data) {
                    return data;
                }
            );
        }

        // 将后端的数据填充到页面表单的结构体
        function setForm(data) {}

        // 从后端获取数据
        function getFormData() {
            var data = {
                'id': $scope.v.form.id
            };

            return procRequest($scope.v.api.get(data)).then(function(res) {
                if ((res.result === 1) && (hasValue(res.data))) {
                    setForm(res.data);
                }
                return res;
            });
        }

        // 对需要提交的数据做一些改动
        function modifySpecial(data) {
            return data;
        }

        // 将页面表单的数据填充到结构体中发给后端
        function getForm() {
            var data = {};

            // 编辑状态下对需要提交的数据做一些改动
            if ($scope.v.page.editing === true) {
                data = modifySpecial(data);
            }

            return data;
        }

        // 新建的时候
        function postFormData() {
            var data = getForm();

            return procRequest($scope.v.api.save(data)).then(function(res) {
                if ((res.result === 1) && (hasValue(res.data))) {
                    $scope.message('保存成功！').finally(function() {
                        // location.href = '/promotion/coupon-manage';
                    });
                }
                if ($scope.v.form._action.submitted === true) {
                    $scope.v.form._action.submitted = false;
                }
                return res;
            });
        }

        // 编辑的时候
        function postEditData() {
            // 请求数据
            var data = getForm();

            return procRequest($scope.v.api.update(data)).then(function(res) {
                if ((res.result === 1) && (hasValue(res.data))) {
                    $scope.message('修改成功！').finally(function() {
                        jump2where();
                    });
                }
                if ($scope.v.form._action.submitted === true) {
                    $scope.v.form._action.submitted = false;
                }
                return res;
            });
        }

        // 取消 和 确认修改成功之后，跳转的地方
        function jump2where() {
            if ($scope.v.page.isFromProduct === true) {
                location.href = '/product/product-manage';
            } else {
                if ($scope.v.form.status === 'ENDED') {
                    location.href = '/promotion/group-manage';
                } else {
                    location.href = '/promotion/group-detail?id=' + $scope.v.form.id;
                }
            }
        }

        // 确定修改
        function ok(form) {
            submit(form);
        }

        // 取消
        function cancel(e) {
            jump2where();
        }

        // 校验表单内容
        function checkFormData() {
            // 强调：字符串或数组判断一律用 hasLength()，其他用 hasValue()

            // if (!hasValue($scope.v.form.maxPeople)) {
            //    $scope.message('请输入成团人数！');
            //    return false;
            // }

            return true;
        }

        // 确认新建提交
        function submit(form) {
            $scope.v.form._action.touched = true;

            if (checkFormData() === false) {
                return;
            }

            // 表单最终校验
            if (form.$invalid) {
                // console.dir(form.$error);
                // $scope.addAlert({'type': 'danger', 'msg': '提交数据有误，请正确输入数据后再尝试提交。'});
                //$scope.message('提交数据有误，请仔细检查数据后再尝试提交。').then(function() {
                // 错误输入框的focus操作
                $timeout(function() {
                    var errObj = document.querySelector('.form-group .has-error input');
                    if (hasValue(errObj)) {
                        $timeout(function() {
                            errObj.focus();
                        });
                    } else {
                        errObj = document.querySelector('input.ng-invalid.ng-touched');
                        if (hasValue(errObj)) {
                            $timeout(function() {
                                errObj.focus();
                            });
                        }
                    }
                }, 50);
                //});
                return;
            }

            if ($scope.v.form._action.submitted === true) {
                $scope.message('请勿重复提交表单！');
                return;
            }

            $scope.v.form._action.submitted = true;

            // 编辑
            if ($scope.v.page.editing === true) {
                postEditData();
            } else { // 新建
                postFormData();
            }

            if ($scope.v.form._action.submitted === true) {
                $timeout(function() {
                    $scope.v.form._action.submitted = false;
                }, 5000);
            }
        }

        // 返回顶部
        function scroll2Top() {
            $timeout(function() {
                document.querySelector('.list-wrap .list-body').scrollTop = 0;
            });
        }

        // 页面刚加载，所有请求接口都走完之后调用
        function loadDataComplete() {
            // 因为watch的原因要异步处理
            if ($scope.v.page.init === true) {
                $timeout(function() {
                    // 页面初始化完毕
                    $scope.v.page.init = false;
                });
            }
        }

        // 请求接口，然后有数据返回，用来标识数据库里是否有数据（列表页面时会用到）
        function loadDataSuccess() {
            // 因为watch的原因要异步处理
            if ($scope.v.page.hasData === false) {
                $timeout(function() {
                    // 页面初始化完毕
                    $scope.v.page.hasData = true;
                });
            }
        }

        // 重置搜索参数
        function resetSearching() {
            $scope.v.search.isProcessing = false;
            $scope.v.search.useAdvanced = false;
            $scope.v.search.advanced.showed = false;
        }

        // 搜索，返回
        function cancelSearching() {
            resetSearching();

            if ($scope.v.control.pagination.pageNo !== 1) {
                $scope.v.control.pagination.pageNo = 1;
            } else {
                getLstData();
            }
        }

        // 简单搜索请求
        function reqSmpSearch(data, isNextPage) {
            return procRequest($scope.v.api.search(data)).then(function(res) {
                if ((res.result === 1) && (hasValue(res.data))) {
                    $scope.v.control.pagination.count = res.data.total;
                    $scope.v.lstData = res.data.rows;

                    if (hasTrue(isNextPage)) {
                        scroll2Top();
                    }
                }
                return res;
            });
        }

        // 没有关键词返回空结果
        function returnEmptyResult() {
            $scope.v.lstData = [];
            $scope.v.control.pagination.count = 0;
            return true;
        }

        // 没有关键词返回所有结果
        function returnSearchResult() {
            // 新搜索更改页码
            if ($scope.v.control.pagination.pageNo !== 1) {
                $scope.v.control.pagination.pageNo = 1;
                return true; // 已经修改页面可以直接跳出，不走请求流程
            } else {
                return false;
            }
        }

        // 简单搜索（这个函数的返回值必须是 Promises）
        function smpSearch(isNextPage) {
            // 页面按钮点击的时候没有传入这个参数
            var isNewSearch = !hasValue(isNextPage);

            if (isNewSearch) {
                if (hasLength($scope.v.search.simple.form.keyword)) { // 新的搜索有关键词
                    resetSearching();
                    $scope.v.search.isProcessing = true;

                    $scope.v.search.simple.data = {
                        'keyword': angular.copy($scope.v.search.simple.form.keyword)
                    };

                    // 返回搜索结果
                    if (returnSearchResult() === true) {
                        return procPromises(getPromises(false, false)); // 已经修改页面可以直接跳出，不走请求流程
                    }
                } else { // 新的搜索没有关键词
                    resetSearching();
                    $scope.v.search.isProcessing = true;

                    $scope.v.search.simple.data.keyword = null;

                    // 返回空白结果
                    // if (returnEmptyResult() === true) {
                    //     return procPromises(getPromises(false, false)); // 空白结果直接返回
                    // }

                    // 返回搜索结果
                    if (returnSearchResult() === true) {
                        return procPromises(getPromises(false, false)); // 已经修改页面可以直接跳出，不走请求流程
                    }
                }
            }

            var data = getQueryData();

            _.extend(data, {
                'name': $scope.v.search.simple.data.keyword
            });

            return reqSmpSearch(data, isNextPage);
        }

        // 是否有高级搜索内容
        function hasAdvSearchFormData() {
            var hasFormData = false;

            // 循环判断form下的key是否有值
            for (var prop in $scope.v.search.advanced.form) {
                if ($scope.v.search.advanced.form.hasOwnProperty(prop)) {
                    var value = $scope.v.search.advanced.form[prop];
                    if (_.isArray(value) || _.isString(value)) {
                        if (hasLength(value)) {
                            hasFormData = true;
                            break;
                        }
                    } else {
                        if (hasValue(value)) {
                            hasFormData = true;
                            break;
                        }
                    }
                }
            }

            if (hasFormData === false) {
                // 逐个判断控件里是否有值
                if (hasValue($scope.v.control.select.type.current)) {
                    return true;
                }
                if (hasValue($scope.v.control.select.status.current)) {
                    return true;
                }
            }

            return hasFormData;
        }

        // 配置高级搜索参数
        function setAdvSearchData() {
            $scope.v.search.advanced.data = {};

            if (hasValue($scope.v.control.date.startTime.value)) {
                $scope.v.search.advanced.form.startTime = angular.copy($scope.v.control.date.startTime.value.getTime());
                $scope.v.search.advanced.data.startTime = angular.copy($scope.v.search.advanced.form.startTime);
            } else {
                $scope.v.search.advanced.data.startTime = null;
            }

            if (hasValue($scope.v.control.date.endTime.value)) {
                $scope.v.search.advanced.form.endTime = angular.copy($scope.v.control.date.endTime.value.getTime());
                $scope.v.search.advanced.data.endTime = angular.copy($scope.v.search.advanced.form.endTime);
            } else {
                $scope.v.search.advanced.data.endTime = null;
            }

            if (hasLength($scope.v.search.advanced.form.name)) {
                $scope.v.search.advanced.data.name = angular.copy($scope.v.search.advanced.form.name);
            } else {
                $scope.v.search.advanced.data.name = null;
            }

            if (hasValue($scope.v.control.select.status.current)) {
                $scope.v.search.advanced.form.status = angular.copy($scope.v.control.select.status.current._key);
                $scope.v.search.advanced.data.status = angular.copy($scope.v.search.advanced.form.status);
            } else {
                $scope.v.search.advanced.data.status = null;
            }

            if (hasValue($scope.v.control.select.type.current)) {
                $scope.v.search.advanced.form.type = angular.copy($scope.v.control.select.type.current._key);
                $scope.v.search.advanced.data.type = angular.copy($scope.v.search.advanced.form.type);
            } else {
                $scope.v.search.advanced.data.type = null;
            }
        }

        // 清空高级搜索内容
        function clearAdvSearchForm() {
            // 如果有控件部分，要单独处理
            $scope.v.control.date.startTime.value = null;
            $scope.v.control.date.endTime.value = null;
            $scope.v.control.select.status.current = null;
            $scope.v.control.select.type.current = null;

            // 循环把form下的key全部置null
            for (var prop in $scope.v.search.advanced.form) {
                if ($scope.v.search.advanced.form.hasOwnProperty(prop)) {
                    $scope.v.search.advanced.form[prop] = null;
                }
            }
        }

        // 重置高级搜索提交的数据
        function resetAdvSearchData() {
            // 循环把data下的key全部置null
            for (var prop in $scope.v.search.advanced.data) {
                if ($scope.v.search.advanced.data.hasOwnProperty(prop)) {
                    $scope.v.search.advanced.data[prop] = null;
                }
            }
        }

        // 扩展高级搜索请求参数
        function extendAdvSearchData(data) {
            var result = angular.copy(data);

            if (hasValue($scope.v.search.advanced.data.startTime)) {
                _.extend(result, {
                    'startTime': $scope.v.search.advanced.data.startTime
                });
            }

            if (hasValue($scope.v.search.advanced.data.endTime)) {
                _.extend(result, {
                    'endTime': $scope.v.search.advanced.data.endTime
                });
            }

            if (hasLength($scope.v.search.advanced.data.name)) {
                _.extend(result, {
                    'name': $scope.v.search.advanced.data.name
                });
            }

            if (hasValue($scope.v.search.advanced.data.status)) {
                _.extend(result, {
                    'status': $scope.v.search.advanced.data.status
                });
            }

            if (hasValue($scope.v.search.advanced.data.type)) {
                _.extend(result, {
                    'type': $scope.v.search.advanced.data.type
                });
            }

            return result;
        }

        // 根据状态做一些请求数据修改
        function extraModifyData(data) {
            //if ($scope.v.search.advanced.data.status === 'REFUNDING') {
            //    data.status = ''; // 全部订单
            //}

            return data;
        }

        // 高级搜索（这个函数的返回值必须是 Promises）
        function advSearch(isNextPage) {
            $scope.v.search.advanced.touched = true;

            // 页面按钮点击的时候没有传入这个参数
            var isNewSearch = !hasValue(isNextPage);

            if (isNewSearch) {
                if (hasAdvSearchFormData()) {
                    $scope.v.search.isProcessing = true;
                    $scope.v.search.useAdvanced = true;
                    $scope.v.search.advanced.submitted = true;

                    setAdvSearchData();

                    // 返回搜索结果
                    if (returnSearchResult() === true) {
                        return procPromises(getPromises(false, false)); // 已经修改页面可以直接跳出，不走请求流程
                    }
                } else { // 新的搜索没有关键词
                    $scope.v.search.isProcessing = true;
                    $scope.v.search.useAdvanced = true;
                    $scope.v.search.advanced.submitted = true;

                    resetAdvSearchData();

                    // 返回空白结果
                    // if (returnEmptyResult() === true) {
                    //     return procPromises(getPromises(false, false)); // 空白结果直接返回
                    // }

                    // 返回搜索结果
                    if (returnSearchResult() === true) {
                        return procPromises(getPromises(false, false)); // 已经修改页面可以直接跳出，不走请求流程
                    }
                }
            }

            var data = getQueryData();

            data = extendAdvSearchData(data);

            // 根据状态做一些请求数据修改
            data = extraModifyData(data);

            if ($scope.v.search.advanced.submitted === true) {
                $timeout(function() {
                    $scope.v.search.advanced.submitted = false;
                }, 5000);
            }

            return reqAdvSearch(data, isNextPage);
        }

        // 高级搜索请求
        function reqAdvSearch(data, isNextPage) {
            return procRequest($scope.v.api.search(data)).then(function(res) {
                if ((res.result === 1) && (hasValue(res.data))) {
                    $scope.v.control.pagination.count = res.data.total;
                    $scope.v.lstData = res.data.rows;

                    if (hasTrue(isNextPage)) {
                        scroll2Top();
                    }
                }

                if ($scope.v.search.advanced.submitted === true) {
                    $scope.v.search.advanced.submitted = false;
                }
                return res;
            });
        }

        // 统一的请求处理函数
        function procRequest(req) {
            var res = {
                'data': null,
                'result': -1
            };

            return req.then(
                function success(response) {
                    if (response.status === 1) {
                        res.result = 1;
                        res.data = response.data;
                    } else {
                        res.result = 0;
                        res.data = response;
                        $scope.message('操作失败：' + response.msg, 'error');
                    }
                    return res;
                },
                function error(response) {
                    res.result = -1;
                    res.data = response;
                    $scope.message('服务器未响应', 'error');
                    return res;
                }
            );
        }

        // 列表数据统一获取（基础数据）
        function getQueryData() {
            return {
                'pageNo': $scope.v.control.pagination.pageNo,
                'pagesize': $scope.v.control.pagination.pageSize,
                'status': $scope.v.control.tab.main.current._key,
            };
        }

        // 列表数据（这个函数的返回值必须是 Promises）
        function getLstData(isNextPage) {
            var data = getQueryData();

            return procRequest($scope.v.api.list(data)).then(function(res) {
                if ((res.result === 1) && (hasValue(res.data))) {
                    $scope.v.control.pagination.count = res.data.total;
                    $scope.v.lstData = res.data.rows;

                    if (hasTrue(isNextPage)) {
                        scroll2Top();
                    }

                    loadDataSuccess();
                }
                return res;
            });
        }

        // 页面主函数
        (function(window, undefined) {
            // 判断当前是否是编辑状态
            if (hasLength($scope.v.form.id)) {
                $scope.v.page.editing = true;
            } else {
                $scope.v.page.editing = false;
            }

            // 编辑状态
            if ($scope.v.page.editing === true) {

            } else {

            }

            // 列表页获取数据
            getLstData().finally(function() {
                loadDataComplete();
            });

            // 编辑页获取数据
            getFormData().finally(function() {
                loadDataComplete();
            });
        })(window);

        // 弹窗模板代码
        // <script type="text/ng-template" id="thirds-log-orders-modal.html">
        //     <div class="thirds-log-orders-modal ng-cloak">
        //         <div class="modal-header">
        //             <span>已选择</span>
        //             <span class="dialog-close" ng-click="f.close()"></span>
        //         </div>
        //         <div class="modal-body">
        //         </div>
        //         <div class="modal-footer">
        //             <button class="btn btn-primary btn-lg" type="button" ng-click="f.ok()" ng-disabled="v.submitted">确定修改</button>
        //             <button class="btn btn-default btn-lg" type="button" ng-click="f.cancel()">取消</button>
        //         </div>
        //     </div>
        // </script>

        //  windowClass 模板代码
        // .thirds-log-orders-modal-width .modal-dialog {
        //     width: auto;
        // }

        // function showModal() {
        //     var modalInstance = $modal.open({
        //         'animation': true,
        //         'controller': 'ctrlThirdsLogOrdersModal',
        //         'templateUrl': 'thirds-log-orders-modal.html',
        //         'windowClass': 'thirds-log-orders-modal-width',
        //         'resolve': {
        //             '_data': function() {
        //                 return {    // 注意：传参都用 angular.copy
        //                      'procRequest': procRequest,
        //                     'api': $scope.v.api,
        //                     'message': $scope.message,
        //                     'body': null, // angular.copy($scope.v.form.id),
        //                 };
        //             }
        //         }
        //     });

        //     return modalInstance.result.then(
        //         function(data) {
        //             // if (hasValue(data.result)) {
        //             // } else {
        //             // }
        //              return data;
        //         },
        //         function(data) {
        //             // console.log('Modal dismissed at: ' + new Date());
        //              return data;
        //         }
        //     );
        // }

        // Promise 使用例子
        // function asyncGreet(name) {
            // return $q(function(resolve, reject) {
                // setTimeout(function() {
                    // if (okToGreet(name)) {
                        // resolve('Hello, ' + name + '!');
                    // } else {
                        // reject('Greeting ' + name + ' is not allowed.');
                    // }
                // }, 1000);
            // });
        // }

        function updateLstData(isNextPage) {
            // 搜索状态下的翻页
            if ($scope.v.search.isProcessing === true) {
                // 高级搜索
                if ($scope.v.search.useAdvanced === true) {
                    return advSearch(isNextPage);
                } else { // 简单搜索
                    return smpSearch(isNextPage);
                }
            } else { // 非搜索状态
                return getLstData(isNextPage);
            }
        }

        // 点击分页的时候，页面跳转
        $scope.$watch('v.control.pagination.pageNo', function(newVal, oldVal) {
            if (newVal !== oldVal) {
                updateLstData(true);
            }
        }, true);
    }
]);


// app.controller('ctrlThirdsLogOrdersModal', ['$rootScope', '$scope', '$modalInstance', '$filter', '$timeout', 'servHttp', '_data',
//     function($rootScope, $scope, $modalInstance, $filter, $timeout, servHttp, _data) {
//         var procRequest = _data.procRequest;
//         $scope.message = _data.message;

//         // variables
//         $scope.v = {
//              'api': _data.api
//         };

//         // function
//         $scope.f = {
//             'ok': ok,
//             'cancel': cancel,
//             'close': cancel,
//         };

//         // data 例子
//         // { 'result': 'ok' }
//         function closeModal(data) {
//             $modalInstance.close(data);
//         }

//         function ok() {
//         }

//         function cancel() {
//             $modalInstance.dismiss('cancel');
//         }
//     }
// ]);

