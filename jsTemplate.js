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
            // 枚举
            'enum': null
        };

        // 函数
        $scope.f = {
            'ok': ok,
            'cancel': cancel,
            'submit': submit,
            'enumFilter': enumFilter,
            'askForDelUploaded': askForDelUploaded,
            'zoomInImg': zoomInImg
        };

        // 页面参数
        $scope.v.page = {
            // 页面初始化完毕标志
            'init': true,
            // 页面请求数据成功标志
            'hasData': false,
            // 编辑状态
            'editing': false,
            // http 请求状态
            'requesting': false
        };

        // 搜索配置
        $scope.v.search = {
            'isProcessing': false,
            'useAdvanced': false,
            'cancel': cancelSearching,
            // 简单搜索的数据
            'simple': {
                'form': {
                    'keyword': null
                },
                'replace': {
                    'keyword': 'name'
                },
                'data': {}, // 不需要重复写跟form一样的变量
                'method': smpSearch
            },
            // 高级搜索的数据
            'advanced': {
                'show': showAdvSearch,
                'clear': clearAdvSearchForm,
                'method': advSearch,
                'showed': false,
                'touched': false,
                'submitted': false,
                'form': {
                    'name': null
                },
                'ctrls': {
                    'pagination': [],
                    'tab': [],
                    'menu': [],
                    'select': ['status', 'type'],
                    'checkbox': [],
                    'radio': [],
                    'date': ['startTime', 'endTime'],
                    'editor': [],
                    'uploader': []
                },
                'replace': {
                    'name': 'name',
                    'status': 'status',
                    'type': 'type',
                    'startTime': 'startTime',
                    'endTime': 'endTime'
                },
                'data': {} // 不需要重复写跟form一样的变量
            }
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
            }
        };

        // 控件配置
        $scope.v.control = {
            'pagination': null,
            'tab': null,
            'menu': null,
            'sort': null,
            'select': null,
            'checkbox': null,
            'radio': null,
            'date': null,
            'editor': null,
            'uploader': null
        };

        // 分页配置
        $scope.v.control.pagination = {
            '_config': {
                'pageSize': 25,
                'maxSize': 7
            },
            '_action': {
                // 数据请求状态
                'submitted': false
            }
        };

        // 分页实例
        $scope.v.control.pagination.ins = {
            'main': {
                '_action': null,
                'pageNo': 1,
                'count': 0
            }
        };

        // tab 控件
        $scope.v.control.tab = {
            '_config': {},
            '_action': {
                // 数据请求状态
                'submitted': false
            },
            'change': changeTab
        };

        // tab 实例
        $scope.v.control.tab.ins = {
            'main': {
                'options': [{
                    _value: '全部商品',
                    _key: 0
                }, {
                    _value: '线上商品',
                    _key: 1
                }, {
                    _value: '下架商品',
                    _key: 2
                }],
                'current': {
                    _value: '全部商品',
                    _key: 0
                }
            }
        };

        // menu 控件
        $scope.v.control.menu = {
            '_config': {},
            '_action': {
                // 数据请求状态
                'submitted': false
            },
            'change': changeMenu
        };

        // menu 实例
        $scope.v.control.menu.ins = {
            'main': {
                'options': [],
                'current': null
            }
        };

        // sort 控件
        $scope.v.control.sort = {
            '_config': {
                'type': ['ASC', 'DESC', 'NONE']
            },
            '_action': {
                // 数据请求状态
                'submitted': false
            },
            'change': changeSort
        };

        $scope.v.control.sort.ins = {
            'main': {
                'replace': {
                    'price': {'ASC': 'PRICEASC', 'DESC': 'PRICEDESC', 'NONE': ''},
                    'sale': {'ASC': 'SALESASC', 'DESC': 'SALEDESC', 'NONE': ''}
                },
                'current': {
                    'name': null,
                    'sortBy': null
                }
            }
        };

        // select 控件
        $scope.v.control.select = {
            '_config': {},
            '_action': {
                // 数据请求状态
                'submitted': false
            },
            'change': changeSelect
        };

        // select 实例
        $scope.v.control.select.ins = {
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
                'disabled': false,
                'showed': false
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
                'disabled': false,
                'showed': false
            }
        };

        // checkbox 控件
        $scope.v.control.checkbox = {
            '_config': {},
            '_action': {
                // 数据请求状态
                'submitted': false
            }
        };

        // checkbox 实例
        $scope.v.control.checkbox.ins = {
            // 单个选项
            'single': {
                'disabled': false,
                'showed': false,
                'value': null,
                'change': null,
                'input': null
            },
            // 多个选项
            'group': {
                'value': [],
                'change': null,
                'choices': {
                    'no1': {'disabled': false, 'showed': false},
                    'no2': {'disabled': false, 'showed': false}
                }
            }
        };

        // radio 控件
        $scope.v.control.radio = {
            '_config': {},
            '_action': {
                // 数据请求状态
                'submitted': false
            }
        };

        // radio 实例
        $scope.v.control.radio.ins = {
            'group': {
                'value': null,
                'change': null,
                'choices': {
                    'no1': {'disabled': false, 'showed': false},
                    'no2': {'disabled': false, 'showed': false}
                }
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
                'time': {
                    'showMeridian': false
                },
                // 日期选项
                'date': {
                    'showWeeks': false
                },
                'show': showCalendar
            },
            '_action': {
                // 数据请求状态
                'submitted': false
            }
        };

        // 日期控件实例
        $scope.v.control.date.ins = {
            'startTime': {
                'disabled': false,
                'showed': false,
                'value': null
            },
            'endTime': {
                'disabled': false,
                'showed': false,
                'value': null
            }
        };

        // 富文本编辑器
        $scope.v.control.editor = {
            '_config': {
                'options': getEditorOptions(),
                'ready': readyEditor
            },
            '_action': {
                // 数据请求状态
                'submitted': false
            }
        };

        // 富文本编辑器实例
        $scope.v.control.editor.ins = {
            'desc': {'instance': null, 'content': null, 'disabled': false, 'showed': false}
        };

        // 上传插件
        $scope.v.control.uploader = {
            '_config': {
                'url': $rootScope.uploadImgUrl,
                'options': {
                    multi_selection: false,
                    max_files: 1,
                    file_data_name: 'imageFile'
                }
                // 'callbacks': uploaderCallbacks,
            },
            '_action': {
                // 数据请求状态
                'submitted': false
            }
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
                'files': [],
                'disabled': false,
                'showed': false
            }
        };

        // 枚举类型
        $scope.v.enum = {
            'type': {
                '0': '商品',
                '1': '店铺'
            },
            'status': {
                'SUCCESS': '成功',
                'FAILED': '失败'
            }
        };

        // 表单数据
        $scope.v.form = {
            '_action': {
                // 表单验证
                'touched': false,
                // 表单验证
                'submitted': false
            },
            // 从页面中获取 id 值
            'id': null, // document.getElementById('id').value,
            // 从页面中获取 type 值
            'type': null, // document.getElementById('type').value,
            // 从页面中获取 appKey 值
            'appKey': null // document.getElementById('appKey').value,

            // 表单的变量
        };

        // 枚举类型的 Filter
        function enumFilter(_name, _key) {
            return $scope.v.enum[_name][_key];
        }

        // 获取全局的上传地址
        // function getUploaderUrl() {
        //     return $rootScope.uploadSkuImgUrl;
        // }

        // 获取全局上传配置
        // function getUploaderOptions() {
        //     return $scope.v.control.uploader._config.options;
        // }

        // 上传回调函数
        function uploaderCallbacks(_name) {
            return {
                'filesAdded': function(uploader, files) {
                    if ($scope.v.control.uploader.ins[_name].data.length > uploader.settings.max_files ||
                        // uploader.files.length > uploader.settings.max_files ||
                        $scope.v.control.uploader.ins[_name].data.length + files.length > uploader.settings.max_files ||
                        files.length > uploader.settings.max_files) {
                        uploader.splice();
                        $scope.message('操作失败：上传个数超出限制！', 'error');
                        return false;
                    } else {
                        $scope.v.control.uploader.ins[_name].loading = true;
                        $scope.v.control.uploader.ins[_name].files = angular.copy(files);
                        uploader.settings.multipart_params._appKey = $scope.v.form.appKey;
                        uploader.start();
                        return true;
                    }
                },
                'uploadProgress': function(uploader, file) {
                    $scope.v.control.uploader.ins[_name].loading = parseFloat(file.percent / 100.0);
                },
                'fileUploaded': function(uploader, file, response) {
                    $scope.v.control.uploader.ins[_name].loading = false;
                    var res = JSON.parse(response.response);

                    $scope.v.control.uploader.ins[_name].push(_name, res);

                    $timeout(function() {
                        uploader.destroy();
                    }, 50);
                },
                'error': function(uploader, error) {
                    $scope.v.control.uploader.ins[_name].loading = false;
                    switch (error.code) {
                        case -600:
                            $scope.message('操作失败：文件大小超出限制！', 'error');
                            break;
                        case -601:
                            $scope.message('操作失败：不支持上传该类型文件！', 'error');
                            break;
                        default:
                            $scope.message('操作失败：' + error.code + ' - ' + error.message, 'error');
                    }
                }
            };
        }

        // 添加上传后的数据
        function addUploaded(_name, data) {
            $scope.v.control.uploader.ins[_name].data.push(data);
        }

        // 公共的图片上传成功后的回调
        function pushUploaded(_name, res) {
            if ((res.status === 1) && (_hasValue(res.data))) {
                addUploaded(_name, res.data);
            } else {

            }
        }

        // 删除上传后的数据
        function delUploaded(_name, index) {
            $scope.v.control.uploader.ins[_name].data.splice(index, 1);
        }

        // 询问删除数据
        function askForDelUploaded(_name, index) {
            $scope.message('确定删除该图片？', 'confirm').then(function() {
                delUploaded(_name, index);
            }).catch(function() {
                // 取消
            });
        }

        // 放大图片
        function zoomInImg(_name) {
            if (_hasValue($scope.v.control.uploader.ins[_name].data)) {
                window.open($scope.v.control.uploader.ins[_name].data[0].url, '_blank');
            }
        }

        // 编辑器加载完毕之后
        function readyEditor(_name, instance) {
            // 保存编辑器实例
            $scope.v.control.editor[_name].instance = instance;
            // 初始化编辑器附加功能
            addEditorFeatures(instance);
            // 页面主函数（有需要的时候要等编辑器加载完毕后才去请求数据）
            // main();
        }

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
        function showCalendar(_name) {
            if ($scope.v.control.date.ins[_name].disabled === false) {
                $scope.v.control.date.ins[_name].showed = !$scope.v.control.date.ins[_name].showed;
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

        // 判断页面是否有一项正在处于请求状态
        function isProcRequesting() {
            // return ($scope.v.control.tab._action.submitted ||
            //     $scope.v.control.menu._action.submitted ||
            //     $scope.v.control.select._action.submitted);

            if (hasTrue($scope.v.page.requesting)) {
                $scope.message('正在请求数据中……', 'error');
                return true;
            } else {
                // 进入请求状态
                $scope.v.page.requesting = true;
                // 延时重置请求状态
                $timeout(function() {
                    $scope.v.page.requesting = false;
                }, 5000);

                return false;
            }
        }

        function endOfRequest() {
            if (hasTrue($scope.v.page.requesting)) {
                $scope.v.page.requesting = false;
            } else {
                $scope.message('请求数据接口较慢！', 'error');
            }
        }

        // 判断页码是否在第一页，是的话就不用手动触发请求新数据
        function needManualChangePage(_name, action) {
            // 新搜索更改页码
            if ($scope.v.control.pagination.ins[_name].pageNo !== 1) {
                // 请求结束之后的回调函数需要修改状态
                if (_hasValue(action)) {
                    $scope.v.control.pagination.ins[_name]._action = action;
                }

                $scope.v.control.pagination.ins[_name].pageNo = 1;
                return false; // 已经修改页码可以直接跳出，不走请求流程
            } else {
                return true;
            }
        }

        // Tab 菜单改变
        function changeTab(_name, index) {
            // 页面处于请求状态
            if (isProcRequesting() === true) {
                return false;
            }

            // $scope.v.control.tab._action.submitted = true;
            $scope.v.control.tab.ins[_name].current = angular.copy($scope.v.control.tab.ins[_name].options[index]);
            // 是否手动触发请求
            if (needManualChangePage(_name, $scope.v.control.tab._action) === true) {
                // 异步执行
                $timeout(function() {
                    updateLstData(_name, false).finally(function() {
                        // $scope.v.control.tab._action.submitted = false;
                    });
                });
            }
        }

        // Menu 菜单改变
        function changeMenu(_name, index) {
            // 页面处于请求状态
            if (isProcRequesting() === true) {
                return false;
            }

            // $scope.v.control.menu._action.submitted = true;
            $scope.v.control.menu.ins[_name].current = angular.copy($scope.v.control.menu.ins[_name].options[index]);
            // 是否手动触发请求
            if (needManualChangePage(_name, $scope.v.control.menu._action) === true) {
                // 异步执行
                $timeout(function() {
                    updateLstData(_name, false).finally(function() {
                        // $scope.v.control.menu._action.submitted = false;
                    });
                });
            }
        }

        // 列表排序改变
        function changeSort(_name, _item) {
            // 页面处于请求状态
            if (isProcRequesting() === true) {
                return false;
            }

            var name = $scope.v.control.sort.ins[_name].current.name;
            var sortBy = $scope.v.control.sort.ins[_name].current.sortBy;
            var index = null;

            if (name === _name) {
                index = $scope.v.control.sort._config.type.indexOf(sortBy);
                index = index + 1;
                if (index >= $scope.v.control.sort._config.type.length) {
                    index = 0;
                }
                $scope.v.control.sort.ins[_name].current.sortBy = $scope.v.control.sort._config.type[index];
            } else {
                $scope.v.control.sort.ins[_name].current.name = _name;
                $scope.v.control.sort.ins[_name].current.sortBy = $scope.v.control.sort._config.type[0];
            }

            // 是否手动触发请求
            if (needManualChangePage(_name, $scope.v.control.sort._action) === true) {
                // 异步执行
                $timeout(function() {
                    updateLstData(_name, false).finally(function() {
                        // $scope.v.control.sort._action.submitted = false;
                    });
                });
            }
        }

        // Select 菜单改变
        function changeSelect(_name) {
            // 页面处于请求状态
            if (isProcRequesting() === true) {
                return false;
            }

            // $scope.v.control.select._action.submitted = true;
            // 是否手动触发请求
            if (needManualChangePage(_name, $scope.v.control.select._action) === true) {
                // 异步执行
                $timeout(function() {
                    updateLstData(_name, false).finally(function() {
                        // $scope.v.control.select._action.submitted = false;
                    });
                });
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

        // 从后端获取数据（这个函数的返回值必须是 Promises）
        function getFormData() {
            // 页面处于请求状态
            if (isProcRequesting() === true) {
                return procPromises(getPromises(false, false));
            }

            var data = {
                'id': $scope.v.form.id
            };

            return procRequest($scope.v.api.get(data)).then(function(_data) {
                if (_hasValue(_data)) {
                    setForm(_data);
                }
                return _data;
            });
        }

        // 编辑状态下的数据修改
        function modifyOldData(data) {
            return data;
        }

        // 新建状态下的数据修改
        function modifyNewData(data) {
            return data;
        }

        // 将页面表单的数据填充到结构体中发给后端
        function getForm() {
            // 先将发给后端的数据结构全部列一下
            // 然后再针对新建和编辑的情况下，对某些字段进行修改
            var data = {
            };

            // 编辑状态下对需要提交的数据做一些改动
            if ($scope.v.page.editing === true) {
                data = modifyOldData(data);
            } else {
                data = modifyNewData(data);
            }

            return data;
        }

        // 新建的时候
        function postFormData() {
            var data = getForm();

            return procRequest($scope.v.api.save(data)).then(function(_data) {
                if (_hasValue(_data)) {
                    $scope.message('保存成功！').finally(function() {
                        location.href = '/promotion/coupon-manage';
                    });
                }
                return _data;
            });
        }

        // 编辑的时候
        function postEditData() {
            // 请求数据
            var data = getForm();

            return procRequest($scope.v.api.update(data)).then(function(_data) {
                if (_hasValue(_data)) {
                    $scope.message('修改成功！').finally(function() {
                        jump2where();
                    });
                }
                return _data;
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
        function cancel() {
            jump2where();
        }

        // 校验表单内容
        function checkFormData() {
            // if (!_hasValue($scope.v.form.maxPeople)) {
            //    $scope.message('请输入成团人数！');
            //    return false;
            // }

            return true;
        }

        // 确认新建提交
        function submit(form) {
            $scope.v.form._action.touched = true;

            if (checkFormData() === false) {
                return false;
            }

            // 表单最终校验
            if (form.$invalid) {
                // console.dir(form.$error);
                // $scope.addAlert({'type': 'danger', 'msg': '提交数据有误，请正确输入数据后再尝试提交。'});
                // $scope.message('提交数据有误，请仔细检查数据后再尝试提交。').then(function() {
                // 错误输入框的focus操作
                $timeout(function() {
                    var errObj = document.querySelector('.form-group .has-error input');
                    if (_hasValue(errObj)) {
                        $timeout(function() {
                            errObj.focus();
                        });
                    } else {
                        errObj = document.querySelector('input.ng-invalid.ng-touched');
                        if (_hasValue(errObj)) {
                            $timeout(function() {
                                errObj.focus();
                            });
                        }
                    }
                }, 50);
                // });
                return false;
            }

            // 页面处于请求状态
            if (isProcRequesting() === true) {
                return false;
            }

            // if ($scope.v.form._action.submitted === true) {
            //     $scope.message('请勿重复提交表单！');
            //     return;
            // }

            // $scope.v.form._action.submitted = true;

            // 编辑
            if ($scope.v.page.editing === true) {
                return postEditData().finally(function() {
                    // if ($scope.v.form._action.submitted === true) {
                    //     $scope.v.form._action.submitted = false;
                    // }
                });
            } else { // 新建
                return postFormData().finally(function() {
                    // if ($scope.v.form._action.submitted === true) {
                    //     $scope.v.form._action.submitted = false;
                    // }
                });
            }

            // if ($scope.v.form._action.submitted === true) {
            //     $timeout(function() {
            //         $scope.v.form._action.submitted = false;
            //     }, 5000);
            // }
        }

        // 返回顶部
        function scroll2Top() {
            $timeout(function() {
                document.querySelector('.list-wrap .list-body').scrollTop = 0;
            });
        }

        // 页面刚加载，所有请求接口都走完之后调用
        function initPageComplete() {
            // 因为watch的原因要异步处理
            if ($scope.v.page.init === true) {
                $timeout(function() {
                    // 页面初始化完毕
                    $scope.v.page.init = false;
                });
            }
        }

        // 请求接口，然后有数据返回，用来标识数据库里是否有数据（列表页面时会用到）
        function hasPageData() {
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
        function cancelSearching(_name) {
            resetSearching();

            if ($scope.v.control.pagination.ins[_name].pageNo !== 1) {
                $scope.v.control.pagination.ins[_name].pageNo = 1;
            } else {
                updateLstData(_name, false);
            }
        }

        // 没有关键词返回空结果
        function returnEmptyResult() {
            $scope.v.lstData = [];
            $scope.v.control.pagination.ins.main.count = 0;
            return true;
        }

        // 没有关键词返回所有结果
        function returnSearchResult() {
            // 新搜索更改页码
            if ($scope.v.control.pagination.ins.main.pageNo !== 1) {
                $scope.v.control.pagination.ins.main.pageNo = 1;
                return true; // 已经修改页面可以直接跳出，不走请求流程
            } else {
                return false;
            }
        }

        // 简单搜索（这个函数的返回值必须是 Promises）
        function smpSearch(_name, isNextPage) {
            // 页面处于请求状态
            if (isProcRequesting() === true) {
                return procPromises(getPromises(false, false));
            }

            // 页面按钮点击的时候没有传入这个参数
            var isNewSearch = !_hasValue(isNextPage);

            if (isNewSearch) {
                if (_hasValue($scope.v.search.simple.form.keyword)) { // 新的搜索有关键词
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

            var data = getQueryData(_name);

            // _.extend(data, {
            //     'name': $scope.v.search.simple.data.keyword
            // });

            data[$scope.v.search.simple.replace.keyword] = $scope.v.search.simple.data.keyword;

            return reqSmpSearch(_name, data, isNextPage);
        }

        // 简单搜索请求
        function reqSmpSearch(_name, data, isNextPage) {
            return procRequest($scope.v.api.search(data)).then(function(_data) {
                if (_hasValue(_data)) {
                    setLstData(_name, _data.total, _data.rows);

                    if (hasTrue(isNextPage)) {
                        scroll2Top();
                    }
                }
                return _data;
            });
        }

        // 遍历判断控件里是否有值
        function checkAdvSearchCtrlData() {
            for (let ctrl in $scope.v.search.advanced.ctrls) {
                if ($scope.v.search.advanced.ctrls.hasOwnProperty(ctrl)) {
                    let ctl = $scope.v.search.advanced.ctrls[ctrl];
                    if (_hasValue(ctl)) {
                        _.each(ctl, function(_name) {
                            switch (ctrl) {
                                case 'pagination':
                                    if (_hasValue($scope.v.control[ctrl].ins[_name].pageNo)) {
                                        return true;
                                    }
                                    break;
                                case 'tab':
                                case 'menu':
                                case 'select':
                                    if (_hasValue($scope.v.control[ctrl].ins[_name].current)) {
                                        return true;
                                    }
                                    break;
                                case 'checkbox':
                                case 'radio':
                                case 'date':
                                    if (_hasValue($scope.v.control[ctrl].ins[_name].value)) {
                                        return true;
                                    }
                                    break;
                                case 'editor':
                                    if (_hasValue($scope.v.control[ctrl].ins[_name].content)) {
                                        return true;
                                    }
                                    break;
                                case 'uploader':
                                    if (_hasValue($scope.v.control[ctrl].ins[_name].data)) {
                                        return true;
                                    }
                                    break;
                            }
                        });
                    }
                }
            }
            return false;
        }

        // 是否有高级搜索内容
        function hasAdvSearchFormData() {
            // 循环判断form下的key是否有值
            for (let prop in $scope.v.search.advanced.form) {
                if ($scope.v.search.advanced.form.hasOwnProperty(prop)) {
                    let value = $scope.v.search.advanced.form[prop];
                    if (_hasValue(value)) {
                        return true;
                    }
                }
            }

            // 判断控件里是否有值
            if (checkAdvSearchCtrlData() === true) {
                return true;
            }

            // 逐个判断控件里是否有值
            // if (_hasValue($scope.v.control.select.ins.type.current)) {
            //     return true;
            // }

            // if (_hasValue($scope.v.control.select.ins.status.current)) {
            //     return true;
            // }

            return false;
        }

        // 遍历复制控件里的值
        function copyAdvSearchCtrlData() {
            for (let ctrl in $scope.v.search.advanced.ctrls) {
                if ($scope.v.search.advanced.ctrls.hasOwnProperty(ctrl)) {
                    let ctl = $scope.v.search.advanced.ctrls[ctrl];
                    if (_hasValue(ctl)) {
                        _.each(ctl, function(_name) {
                            var src = null;
                            var dst = $scope.v.search.advanced;
                            switch (ctrl) {
                                case 'pagination':
                                    src = $scope.v.control[ctrl].ins[_name].pageNo;
                                    dst.data[_name] = _hasValue(src) ? src : null;
                                    break;
                                case 'tab':
                                case 'menu':
                                case 'select':
                                    src = $scope.v.control[ctrl].ins[_name].current._key;
                                    dst.data[_name] = _hasValue(src) ? src : null;
                                    break;
                                case 'checkbox':
                                    src = $scope.v.control[ctrl].ins[_name].value;
                                    // dst.data[_name] = _hasValue(src) ? src : null; // 单个
                                    dst.data[_name] = _hasValue(src) ? src : null; // 多个
                                    break;
                                case 'radio':
                                    src = $scope.v.control[ctrl].ins[_name].value;
                                    dst.data[_name] = _hasValue(src) ? src : null;
                                    break;
                                case 'date':
                                    src = $scope.v.control[ctrl].ins[_name].value.getTime();
                                    dst.data[_name] = _hasValue(src) ? src : null;
                                    break;
                                case 'editor':
                                    src = $scope.v.control[ctrl].ins[_name].content;
                                    dst.data[_name] = _hasValue(src) ? src : null;
                                    break;
                                case 'uploader':
                                    src = $scope.v.control[ctrl].ins[_name].data;
                                    dst.data[_name] = _hasValue(src) ? src : null;
                                    break;
                            }
                        });
                    }
                }
            }
        }

        // 配置高级搜索参数
        function setAdvSearchData() {
            $scope.v.search.advanced.data = {};

            // 遍历表单输入框的值赋值
            for (let prop in $scope.v.search.advanced.form) {
                if ($scope.v.search.advanced.form.hasOwnProperty(prop)) {
                    let ipt = $scope.v.search.advanced.form[prop];
                    if (_hasValue(ipt)) {
                        $scope.v.search.advanced.data[prop] = angular.copy(ipt);
                    } else {
                        $scope.v.search.advanced.data[prop] = null;
                    }
                }
            }

            // 遍历复制控件里的值
            copyAdvSearchCtrlData();

            // 逐个复制控件里的值
            // if (_hasValue($scope.v.control.date.ins.startTime.value)) {
            //     $scope.v.search.advanced.form.startTime = angular.copy($scope.v.control.date.ins.startTime.value);
            //     $scope.v.search.advanced.data.startTime = angular.copy($scope.v.search.advanced.form.startTime);
            // } else {
            //     $scope.v.search.advanced.data.startTime = null;
            // }

            // if (_hasValue($scope.v.control.date.ins.endTime.value)) {
            //     $scope.v.search.advanced.form.endTime = angular.copy($scope.v.control.date.ins.endTime.value);
            //     $scope.v.search.advanced.data.endTime = angular.copy($scope.v.search.advanced.form.endTime);
            // } else {
            //     $scope.v.search.advanced.data.endTime = null;
            // }

            // if (_hasValue($scope.v.search.advanced.form.name)) {
            //     $scope.v.search.advanced.data.name = angular.copy($scope.v.search.advanced.form.name);
            // } else {
            //     $scope.v.search.advanced.data.name = null;
            // }

            // if (_hasValue($scope.v.control.select.ins.status.current)) {
            //     $scope.v.search.advanced.form.status = angular.copy($scope.v.control.select.ins.status.current;
            //     $scope.v.search.advanced.data.status = angular.copy($scope.v.search.advanced.form.status);
            // } else {
            //     $scope.v.search.advanced.data.status = null;
            // }

            // if (_hasValue($scope.v.control.select.ins.type.current)) {
            //     $scope.v.search.advanced.form.type = angular.copy($scope.v.control.select.ins.type.current);
            //     $scope.v.search.advanced.data.type = angular.copy($scope.v.search.advanced.form.type);
            // } else {
            //     $scope.v.search.advanced.data.type = null;
            // }
        }

        // 遍历设置控件里的值为 null
        function setAdvSearchCtrlDataNull() {
            for (let ctrl in $scope.v.search.advanced.ctrls) {
                if ($scope.v.search.advanced.ctrls.hasOwnProperty(ctrl)) {
                    let ctl = $scope.v.search.advanced.ctrls[ctrl];
                    if (_hasValue(ctl)) {
                        _.each(ctl, function(_name) {
                            switch (ctrl) {
                                case 'pagination':
                                    $scope.v.control[ctrl].ins[_name].pageNo = 1;
                                    break;
                                case 'tab':
                                case 'menu':
                                case 'select':
                                    $scope.v.control[ctrl].ins[_name].current = angular.copy($scope.v.control[ctrl].ins[_name].options[0]);
                                    break;
                                case 'checkbox':
                                    // $scope.v.control[ctrl].ins[_name].value = null; // 单个的情况
                                    $scope.v.control[ctrl].ins[_name].value = []; // 多个的情况
                                    break;
                                case 'radio':
                                    $scope.v.control[ctrl].ins[_name].value = 'default'; // 默认值，不能等于 null
                                    break;
                                case 'date':
                                    $scope.v.control[ctrl].ins[_name].value = null;
                                    break;
                                case 'editor':
                                    $scope.v.control[ctrl].ins[_name].content = null;
                                    break;
                                case 'uploader':
                                    $scope.v.control[ctrl].ins[_name].data = [];
                                    break;
                            }
                        });
                    }
                }
            }
        }

        // 清空高级搜索内容
        function clearAdvSearchForm() {
            // 遍历设置控件里的值为 null
            setAdvSearchCtrlDataNull();

            // 如果有控件部分，要单独处理
            // $scope.v.control.date.ins.startTime.value = null;
            // $scope.v.control.date.ins.endTime.value = null;
            // $scope.v.control.select.ins.status.current = null;
            // $scope.v.control.select.ins.type.current = null;

            // 循环把form下的key全部置null
            for (let prop in $scope.v.search.advanced.form) {
                if ($scope.v.search.advanced.form.hasOwnProperty(prop)) {
                    $scope.v.search.advanced.form[prop] = null;
                }
            }
        }

        // 重置高级搜索提交的数据
        function resetAdvSearchData() {
            // 循环把data下的key全部置null
            for (let prop in $scope.v.search.advanced.data) {
                if ($scope.v.search.advanced.data.hasOwnProperty(prop)) {
                    $scope.v.search.advanced.data[prop] = null;
                }
            }
        }

        // 扩展高级搜索请求参数
        function extendAdvSearchData(data) {
            // 遍历请求数据进行赋值
            for (let prop in $scope.v.search.advanced.data) {
                if ($scope.v.search.advanced.data.hasOwnProperty(prop)) {
                    let raw = $scope.v.search.advanced.data[prop];
                    if (_hasValue(raw)) {
                        let k = $scope.v.search.advanced.replace[prop];
                        data[k] = angular.copy(raw);
                    }
                }
            }

            // if (_hasValue($scope.v.search.advanced.data.startTime)) {
            //     _.extend(data, {
            //         'startTime': $scope.v.search.advanced.data.startTime.getTime()
            //     });
            // }

            // if (_hasValue($scope.v.search.advanced.data.endTime)) {
            //     _.extend(data, {
            //         'endTime': $scope.v.search.advanced.data.endTime.getTime()
            //     });
            // }

            // if (_hasValue($scope.v.search.advanced.data.name)) {
            //     _.extend(data, {
            //         'name': $scope.v.search.advanced.data.name
            //     });
            // }

            // if (_hasValue($scope.v.search.advanced.data.status)) {
            //     _.extend(data, {
            //         'status': $scope.v.search.advanced.data.status._key
            //     });
            // }

            // if (_hasValue($scope.v.search.advanced.data.type)) {
            //     _.extend(data, {
            //         'type': $scope.v.search.advanced.data.type._key
            //     });
            // }

            return data;
        }

        // 根据状态做一些请求数据修改
        function extraModifyData(data) {
            // if ($scope.v.search.advanced.data.status === 'REFUNDING') {
            //     data.status = ''; // 全部订单
            // }

            return data;
        }

        // 高级搜索（这个函数的返回值必须是 Promises）
        function advSearch(_name, isNextPage) {
            $scope.v.search.advanced.touched = true;

            // 页面处于请求状态
            if (isProcRequesting() === true) {
                return procPromises(getPromises(false, false));
            }

            // 页面按钮点击的时候没有传入这个参数
            var isNewSearch = !_hasValue(isNextPage);

            if (isNewSearch) {
                if (hasAdvSearchFormData()) {
                    $scope.v.search.isProcessing = true;
                    $scope.v.search.useAdvanced = true;
                    // $scope.v.search.advanced.submitted = true;

                    setAdvSearchData();

                    // 返回搜索结果
                    if (returnSearchResult() === true) {
                        return procPromises(getPromises(false, false)); // 已经修改页面可以直接跳出，不走请求流程
                    }
                } else { // 新的搜索没有关键词
                    $scope.v.search.isProcessing = true;
                    $scope.v.search.useAdvanced = true;
                    // $scope.v.search.advanced.submitted = true;

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

            var data = getQueryData(_name);

            data = extendAdvSearchData(data);

            // 根据状态做一些请求数据修改
            data = extraModifyData(data);

            // if ($scope.v.search.advanced.submitted === true) {
            //     $timeout(function() {
            //         $scope.v.search.advanced.submitted = false;
            //     }, 5000);
            // }

            return reqAdvSearch(_name, data, isNextPage);
        }

        // 高级搜索请求
        function reqAdvSearch(_name, data, isNextPage) {
            return procRequest($scope.v.api.search(data)).then(function(_data) {
                if (_hasValue(_data)) {
                    setLstData(_name, _data.total, _data.rows);

                    if (hasTrue(isNextPage)) {
                        scroll2Top();
                    }
                }

                // if ($scope.v.search.advanced.submitted === true) {
                //     $scope.v.search.advanced.submitted = false;
                // }
                return _data;
            });
        }

        function procSrvError(res) {
            $scope.message('操作失败：' + res.msg, 'error');
            return null;
        }

        function procReqError(res) {
            $scope.message('服务器未响应', 'error');
            return null;
        }

        // 统一的请求处理函数
        function procRequest(req) {
            return req.then(
                function success(res) {
                    endOfRequest(); // 关闭请求状态
                    if (res.status === 1) {
                        return res.data;
                    } else {
                        procSrvError(res);
                        return null;
                    }
                },
                function error(res) {
                    endOfRequest(); // 关闭请求状态
                    procReqError(res);
                    return null;
                }
            );
        }

        // 列表数据统一获取（基础数据）
        function getQueryData(_name) {
            return {
                'pageNo': $scope.v.control.pagination.ins[_name].pageNo - 1,
                'pagesize': $scope.v.control.pagination._config.pageSize,
                // 'status': $scope.v.control.tab.ins.main.current._key,
                'sortBy': $scope.v.control.sort.ins.main.replace[$scope.v.control.sort.ins.main.current.name][$scope.v.control.sort.ins.main.current.sortBy]
            };
        }

        // 列表数据（这个函数的返回值必须是 Promises）
        function getLstData(_name, isNextPage) {
            // 页面处于请求状态
            if (isProcRequesting() === true) {
                return procPromises(getPromises(false, false));
            }

            var data = getQueryData(_name);

            return procRequest($scope.v.api.list(data)).then(function(_data) {
                if (_hasValue(_data)) {
                    setLstData(_name, _data.total, _data.rows);

                    if (hasTrue(isNextPage)) {
                        scroll2Top();
                    }

                    hasPageData();
                }
                return _data;
            });
        }

        // 统一处理页面数据赋值
        function setLstData(_name, total, data) {
            $scope.v.control.pagination.ins[_name].count = total;
            $scope.v.lstData = angular.copy(data);
        }

        // 页面主函数
        (function(window, undefined) {
            // 判断当前是否是编辑状态
            if (_hasValue($scope.v.form.id)) {
                $scope.v.page.editing = true;
            } else {
                $scope.v.page.editing = false;
            }

            // 编辑状态
            if ($scope.v.page.editing === true) {
            } else {
            }

            // 列表页获取数据
            getLstData('main', false).finally(function() {
                initPageComplete();
            });

            // 编辑页获取数据
            getFormData().finally(function() {
                initPageComplete();
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
        //             <button class="btn btn-primary btn-lg" type="button" ng-click="f.ok()" ng-disabled="v.page.requesting">确定修改</button>
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
        //             // if (_hasValue(data.result)) {
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

        function updateLstData(_name, isNextPage) {
            // 搜索状态下的翻页
            if ($scope.v.search.isProcessing === true) {
                // 高级搜索
                if ($scope.v.search.useAdvanced === true) {
                    return advSearch(_name, isNextPage);
                } else { // 简单搜索
                    return smpSearch(_name, isNextPage);
                }
            } else { // 非搜索状态
                return getLstData(_name, isNextPage);
            }
        }

        // 由于手动修改页码引起的状态修改
        function afterChangePage(_name) {
            if (_hasValue($scope.v.control.pagination.ins[_name]._action)) {
                if (hasTrue($scope.v.control.pagination.ins[_name]._action.submitted)) {
                    $scope.v.control.pagination.ins[_name]._action.submitted = false;
                }
                $scope.v.control.pagination.ins[_name]._action = null;
            }
        }

        // 点击分页的时候，页面跳转
        $scope.$watch('v.control.pagination.ins.main.pageNo', function(newVal, oldVal) {
            if (newVal !== oldVal) {
                updateLstData('main', true).finally(function() {
                    // afterChangePage('main');
                });
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
//             'close': close,
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

//        function close() {
//            $modalInstance.dismiss('close');
//        }

//     }
// ]);
