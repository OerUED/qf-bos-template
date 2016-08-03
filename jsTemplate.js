app.controller('ctrlCouponPublish', ['$rootScope', '$scope', '$modal', '$filter', '$timeout', '$q', 'servHttp',
    function($rootScope, $scope, $modal, $filter, $timeout, $q, servHttp) {
        // 变量
        $scope.v = {
            // 页面
            'page': null,
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
            // 枚举过滤器
            'enumFilter': enumFilter,
            // 上传相关
            'askForDelUploaded': askForDelUploaded,
            'zoomInImg': zoomInImg,
            // 页面函数
            'addProduct': addProduct,
            'delProduct': delProduct,
            'hasProduct': hasProduct,
            'addAllProducts': addAllProducts,
            'getAllProducts': getAllProducts
        };

        // 页面参数
        $scope.v.page = {
            // 来源
            'from': null,
            // 页面初始化完毕标志
            'init': true,
            // 编辑状态
            'editing': false
        };

        // 控件配置
        $scope.v.control = {
            'block': null,
            // 块相关
            'list': null,
            'search': null,
            'pagination': null,
            'tab': null,
            'menu': null,
            'sort': null,
            // 以下跟块无关
            'select': null,
            'checkbox': null,
            'radio': null,
            'date': null,
            'editor': null,
            'uploader': null,
            'modal': null
        };

        // 列表
        $scope.v.control.list = {
            '_config': {},
            '_action': {},
            '_template': {}
        };

        // 搜索配置
        $scope.v.control.search = {
            '_config': {},
            '_action': {},
            '_template': {},
            'simple': smpSearch,
            'show': showAdvSearch,
            'cancel': cancelSearching,
            'clear': clearAdvSearch,
            'advanced': advSearch
        };

        // 分页配置
        $scope.v.control.pagination = {
            '_config': {
                'size': 25,
                'maxSize': 7
            },
            '_action': {},
            '_template': {}
        };

        // tab 控件
        $scope.v.control.tab = {
            '_config': {},
            '_action': {},
            '_template': {},
            'change': changeTab
        };

        // menu 控件
        $scope.v.control.menu = {
            '_config': {},
            '_action': {},
            '_template': {},
            'change': changeMenu
        };

        // sort 控件
        $scope.v.control.sort = {
            '_config': {
                'type': ['ASC', 'DESC', 'NONE']
            },
            '_action': {},
            '_template': {},
            'change': changeSort
        };

        // select 控件
        $scope.v.control.select = {
            '_config': {},
            '_action': {},
            '_template': {
                'options': [],
                'current': null,
                'disabled': false,
                'showed': false
            },
            'change': changeSelect
        };

        // 页面块
        $scope.v.control.block = {
            '_config': {},
            '_action': {},
            '_template': {
                // 页面请求数据成功标志
                'hasData': false,
                // http 请求状态
                'requesting': false,
                // http 请求状态定时器
                'reqTimer': null,
                // 列表
                'list': [],
                // 以下是实例
                'search': null,
                'pagination': null,
                'tab': null,
                'menu': null,
                'sort': null,
                'select': null
            }
        };

        // 块实例
        $scope.v.control.block.ins = {
            'main': {
                'hasData': false,
                'requesting': false,
                'reqTimer': null,
                'list': [],
                'search': null,
                'pagination': null,
                'tab': null,
                'menu': null,
                'sort': null,
                'select': null
            },
            'modal': {
                'hasData': false,
                'requesting': false,
                'reqTimer': null,
                'list': [],
                'search': null,
                'pagination': null,
                'tab': null,
                'menu': null,
                'sort': null,
                'select': null
            }
        };

        // 搜索实例
        $scope.v.control.block.ins.main.search = {
            'isProcessing': false,
            'useAdvanced': false,
            // 简单搜索的数据
            'simple': {
                'form': {
                    'keyword': null
                },
                'replace': {
                    'keyword': 'searchContent'
                },
                'data': {}
            },
            // 高级搜索的数据
            'advanced': {
                'showed': false,
                'touched': false,
                'submitted': false,
                'form': {
                    'name': null,
                    'minPrice': null,
                    'maxPrice': null,
                    'categoryId': []
                },
                'ctrls': {
                    'select': [],
                    'checkbox': [],
                    'radio': [],
                    'date': []
                },
                'replace': {
                    'name': 'searchContent',
                    'minPrice': 'priceFrom',
                    'maxPrice': 'priceUntil',
                    'categoryId': 'cateIds'
                },
                'data': {}
            }
        };

        // 分页实例
        $scope.v.control.block.ins.main.pagination = {
            'num': 1,
            'count': 0
        };

        // tab 实例
        $scope.v.control.block.ins.main.tab = {
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
        };

        // menu 实例
        $scope.v.control.block.ins.main.menu = {
            'options': [],
            'current': null
        };

        $scope.v.control.block.ins.main.sort = {
            'replace': {
                'price': {'ASC': 'PRICEASC', 'DESC': 'PRICEDESC', 'NONE': ''},
                'sale': {'ASC': 'SALESASC', 'DESC': 'SALEDESC', 'NONE': ''}
            },
            'current': {
                'name': null,
                'sortBy': null
            }
        };

        // select 实例（特殊）
        $scope.v.control.block.ins.main.select = {
            '_change': changeMainSelect,
            'status': {
                'options': [],
                'current': null,
                'disabled': false,
                'showed': false
            }
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
            '_action': {},
            '_template': {
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
            }
        };

        // checkbox 实例
        $scope.v.control.checkbox.ins = {
            'draw': {
                'disabled': false,
                'showed': false,
                'value': 1,
                'change': null,
                'input': null
            }
        };

        // radio 控件
        $scope.v.control.radio = {
            '_config': {},
            '_action': {},
            '_template': {
                'value': null,
                'change': null,
                'choices': {
                    'no1': {'disabled': false, 'showed': false},
                    'no2': {'disabled': false, 'showed': false}
                }
            }
        };

        // radio 实例
        $scope.v.control.radio.ins = {
            'type': {
                'value': 1,
                'change': null,
                'choices': {
                    'no1': {'disabled': false, 'showed': false},
                    'no2': {'disabled': false, 'showed': false}
                }
            },
            'link': {
                'value': 'ALL',
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
                }
            },
            '_action': {
                // 数据请求状态
                'submitted': false
            },
            '_template': {
                'disabled': false,
                'showed': false,
                'value': null
            },
            'show': showCalendar
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
                'used': false   // 当页面中有富文本编辑器的时候置为 true
            },
            '_action': {},
            '_template': {'instance': null, 'content': null, 'disabled': false, 'showed': false},
            'options': getEditorOptions(),
            'ready': readyEditor
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
            '_action': {},
            '_template': {
                'url': '',
                'options': null,
                'callback': uploaderCallbacks(),
                'push': pushUploaded,
                'loading': false,
                'data': [],
                'files': [],
                'disabled': false,
                'showed': false
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

        // 弹窗
        $scope.v.control.modal = {
            '_config': {},
            '_action': {},
            '_template': {
                'show': null,
                'controller': null,
                'templateUrl': '',
                'windowClass': '',
                'data': null
            }
        };

        // 弹窗实例
        $scope.v.control.modal.ins = {
            'product': {
                'show': showSelectedProducts,
                'controller': ctrlSelectedProducts,
                'templateUrl': 'coupon-publish-show-selected.html',
                'windowClass': 'coupon-publish-show-selected-width',
                'data': null
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
            'id': document.getElementById('couponId').value,
            // 从页面中获取 type 值
            'type': null, // document.getElementById('type').value,
            // 从页面中获取 appKey 值
            'appKey': null, // document.getElementById('appKey').value,

            // 表单的变量
            'name': null,
            'price': null,
            'count': null,
            'discount': null,
            'minPrice': null,
            'productIds': []
        };

        // 接口（每一个api对应一个单独的处理函数）
        $scope.v.api = {
            'list': function(data) {
                return servHttp.post('/product/getProductList', data);
            },
            'prods': function(data) {
                return servHttp.post('/promotion/coupon/getProducts', data);
            },
            'search': function(data) {
                return servHttp.post('/product/getProductList', data);
            },
            'import': function(data) {
                return servHttp.get('', data);
            },
            'get': function(data) {
                return servHttp.get('/promotion/coupon/detail', data);
            },
            'save': function(data) {
                return servHttp.post('/promotion/coupon/create', data);
            },
            'update': function(data) {
                return servHttp.post('/promotion/coupon/edit', data);
            }
        };

        // 显示高级搜索
        function showAdvSearch(_name) {
            $scope.v.control.block.ins[_name].search.advanced.showed = !$scope.v.control.block.ins[_name].search.advanced.showed;
        }

        // 枚举类型的 Filter
        function enumFilter(_name, _key) {
            return $scope.v.enum[_name][_key];
        }

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
                    let res = JSON.parse(response.response);

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

        // 初始化编辑器附加功能
        function addEditorFeatures($editor) {
            $editor.execCommand('serverparam', {
                '_appKey': $scope.v.form.appKey
            });
        }

        // 编辑器加载完毕之后
        function readyEditor(_name, $editor) {
            // 保存编辑器实例
            $scope.v.control.editor[_name].instance = $editor;
            // 初始化编辑器附加功能
            addEditorFeatures($editor);
            // 页面主函数（有需要的时候要等编辑器加载完毕后才去请求数据）
            main();
        }

        // 显示日期选择器
        function showCalendar(_name) {
            if ($scope.v.control.date.ins[_name].disabled === false) {
                $scope.v.control.date.ins[_name].showed = !$scope.v.control.date.ins[_name].showed;
            }
        }

        // 判断页面是否有一项正在处于请求状态
        function procRequesting(_name) {
            if (hasTrue($scope.v.control.block.ins[_name].requesting)) {
                $scope.message('正在请求数据中……', 'error');
                return true;
            } else {
                // 进入请求状态
                $scope.v.control.block.ins[_name].requesting = true;

                // 延时重置请求状态
                $scope.v.control.block.ins[_name].reqTimer = $timeout(function() {
                    $scope.v.control.block.ins[_name].requesting = false;
                }, 5000);

                return false;
            }
        }

        // 结束请求
        function endOfRequest(_name) {
            if (hasTrue($scope.v.control.block.ins[_name].requesting)) {
                $timeout.cancel($scope.v.control.block.ins[_name].reqTimer);
                $scope.v.control.block.ins[_name].requesting = false;
            } else {
                $scope.v.control.block.ins[_name].requesting = false;
                // $scope.message('请求数据接口较慢！', 'error');
            }
        }

        // 处理服务器错误
        function procSrvError(res) {
            $scope.message('操作失败：' + res.msg, 'error');
            return null;
        }

        // 处理请求错误
        function procReqError(res) {
            $scope.message('服务器未响应', 'error');
            return null;
        }

        // 统一的请求处理函数
        function procRequest(req) {
            return req.then(
                function success(res) {
                    return (_hasValue(res) ? ((res.status === 1) ? res.data : procSrvError(res)) : null);
                },
                function error(res) {
                    return (_hasValue(res) ? procReqError(res) : null);
                }
            );
        }

        // 处理 api 请求
        function procApi(_api, _name, data) {
            // 页面处于请求状态
            if (procRequesting(_name) === true) {
                return getNullPromises();
            }

            return procRequest($scope.v.api[_api](data)).then(function(_data) {
                endOfRequest(_name); // 关闭请求状态
                return _data;
            });
        }

        function procMainApi(_api, data) {
            return procApi(_api, 'main', data);
        }

        // 判断页码是否在第一页，是的话就不用手动触发请求新数据
        function needManualChangePage(_name) {
            // 新搜索更改页码
            if ($scope.v.control.block.ins[_name].pagination.num !== 1) {
                $scope.v.control.block.ins[_name].pagination.num = 1;
                return false; // 已经修改页码可以直接跳出，不走请求流程
            } else {
                return true;
            }
        }

        // Tab 菜单改变
        function changeTab(_name, index) {
            $scope.v.control.block.ins[_name].tab.current = angular.copy($scope.v.control.block.ins[_name].tab.options[index]);
            // 是否手动触发请求
            if (needManualChangePage(_name) === true) {
                // 异步执行
                $timeout(function() {
                    updateLstData(_name).then(function(_data) {
                    });
                });
            }
        }

        // Menu 菜单改变
        function changeMenu(_name, index) {
            $scope.v.control.block.ins[_name].menu.current = angular.copy($scope.v.control.block.ins[_name].menu.options[index]);
            // 是否手动触发请求
            if (needManualChangePage(_name) === true) {
                // 异步执行
                $timeout(function() {
                    updateLstData(_name).then(function(_data) {
                    });
                });
            }
        }

        // 列表排序改变
        function changeSort(_name, _item) {
            let name = $scope.v.control.sort.ins[_name].current.name;
            let sortBy = $scope.v.control.sort.ins[_name].current.sortBy;
            let index = null;

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
                    updateLstData(_name).then(function(_data) {
                        // $scope.v.control.sort._action.submitted = false;
                    });
                });
            }
        }

        // Select 选项改变（特殊）
        function changeMainSelect(_name, index) {
            $scope.v.control.block.ins.main.select[_name].current = angular.copy($scope.v.control.block.ins.main.select[_name].options[index]);
            // 是否手动触发请求
            if (needManualChangePage(_name) === true) {
                // 异步执行
                $timeout(function() {
                    updateLstData(_name).then(function(_data) {
                    });
                });
            }
        }

        // Select 选项改变
        function changeSelect(_name, index) {
        }

        // 获取 Promises
        function getPromises(isSucceed, data) {
            return $q(function(resolve, reject) {
                if (hasTrue(isSucceed)) {
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

        // 返回 null 的 Promises
        function getNullPromises() {
            return procPromises(getPromises(true, null));
        }

        // 将后端的数据填充到页面表单的结构体
        function setFormData(data) {
            $scope.v.form.ruleId = _getValue(data.rule.id);
            $scope.v.form.name = _getValue(data.couponName);
            $scope.v.control.radio.ins.type.value = _getValue(data.type, 1);
            $scope.v.form.minPrice = toRMBYuan(_getValue(data.rule.fullFee));

            if ($scope.v.control.radio.ins.type.value === 3) {
                $scope.v.form.discount = toRMBYuan(_getValue(data.profitFee));
            } else {
                $scope.v.form.price = toRMBYuan(_getValue(data.profitFee));
            }

            $scope.v.form.count = _getValue(data.inventory);
            $scope.v.control.date.ins.startTime.value = new Date(_getValue(data.startTime));
            $scope.v.control.date.ins.endTime.value = new Date(_getValue(data.endTime));
            $scope.v.control.checkbox.ins.draw.value = _getValue(data.distribute, 1);

            if (_hasValue(data.rule.productIds)) {
                $scope.v.form.productIds = data.rule.productIds.split(',').map(function(num) {
                    return parseInt(num, 10);
                });
                $scope.v.control.radio.ins.link.value = 'PART';
            }
        }

        // 从后端获取数据（这个函数的返回值必须是 Promises）
        function getSaveData() {
            let data = {
                'id': $scope.v.form.id
            };

            return procMainApi('get', data).then(function(_data) {
                if (_hasValue(_data)) {
                    setFormData(_data);
                }
                return _data;
            });
        }

        // 编辑状态下的数据修改
        function modifyEditData(data) {
            data.id = $scope.v.form.id;
            data.ruleId = $scope.v.form.ruleId;
            return data;
        }

        // 新建状态下的数据修改
        function modifyFormData(data) {
            return data;
        }

        // 将页面表单的数据填充到结构体中发给后端
        function getFormData() {
            // 先将发给后端的数据结构全部列一下
            // 然后再针对新建和编辑的情况下，对某些字段进行修改
            let data = {
                'couponName': $scope.v.form.name,
                'type': $scope.v.control.radio.ins.type.value,
                'fullFee': toRMBFen($scope.v.form.minPrice),
                'profitFee': null,
                'inventory': $scope.v.form.count,
                'startTime': $scope.v.control.date.ins.startTime.value.getTime(),
                'endTime': $scope.v.control.date.ins.endTime.value.getTime(),
                'distribute': $scope.v.control.checkbox.ins.draw.value,
                'actionType': $scope.v.control.radio.ins.type.value,
                'productIds': null
            };

            if ($scope.v.control.radio.ins.type.value === 3) {
                data.profitFee = toRMBFen($scope.v.form.discount);
            } else {
                data.profitFee = toRMBFen($scope.v.form.price);
            }

            if ($scope.v.control.radio.ins.link.value === 'PART') {
                data.productIds = $scope.v.form.productIds.join(',');
            }

            // 编辑状态下对需要提交的数据做一些改动
            return (hasTrue($scope.v.page.editing) ? modifyEditData(data) : modifyFormData(data));
        }

        // 新建的时候
        function postFormData() {
            let data = getFormData();

            return procMainApi('save', data).then(function(_data) {
                if (_hasValue(_data)) {
                    $scope.message('保存成功！').finally(function() {
                        go2here('/promotion/coupon-manage');
                    });
                }
                return _data;
            });
        }

        // 编辑的时候
        function postEditData() {
            // 请求数据
            let data = getFormData();

            return procMainApi('update', data).then(function(_data) {
                if (_hasValue(_data)) {
                    $scope.message('修改成功！').finally(function() {
                        back2where();
                    });
                }
                return _data;
            });
        }

        // 页面跳转
        function go2here(url) {
            window.location.href = url;
        }

        // 取消 和 确认修改成功之后，跳转的地方
        function back2where() {
            if ($scope.v.page.form === 'list') {
                go2here('/promotion/coupon-manage');
            } else {
                go2here('/promotion/coupon-detail?id=' + $scope.v.form.id);
            }
        }

        // 确定修改
        function ok(form) {
            submit(form);
        }

        // 取消
        function cancel() {
            back2where();
        }

        // 校验表单内容
        function checkFormData() {
            if (!_hasValue($scope.v.form.name)) {
                $scope.message('请输入优惠券名称！');
                return false;
            }

            if (!_hasValue($scope.v.form.minPrice)) {
                $scope.message('请输入优惠券使用限制金额！');
                return false;
            }

            if ($scope.v.control.radio.ins.type.value === 3) {
                if (!_hasValue($scope.v.form.discount)) {
                    $scope.message('请输入优惠券折扣！');
                    return false;
                }
            }

            if ($scope.v.control.radio.ins.type.value !== 3) {
                if (!_hasValue($scope.v.form.price)) {
                    $scope.message('请输入优惠券面额！');
                    return false;
                }
            }

            if (!_hasValue($scope.v.form.count)) {
                $scope.message('请输入优惠券库存！');
                return false;
            }

            if (!_hasValue($scope.v.control.date.ins.startTime.value)) {
                $scope.message('请输入优惠券有效期开始时间！');
                return false;
            }

            if (!_hasValue($scope.v.control.date.ins.endTime.value)) {
                $scope.message('请输入优惠券有效期结束时间！');
                return false;
            }

            if ($scope.v.control.radio.ins.link.value === 'PART') {
                if (!_hasValue($scope.v.form.productIds)) {
                    $scope.message('请选择关联商品！');
                    return false;
                }
            }

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
                console.dir(form.$error);
                $scope.message('提交数据有误，请仔细检查数据后再尝试提交。').then(function() {
                    // 错误输入框的focus操作
                    $timeout(function() {
                        let errObj = document.querySelector('.form-group .has-error input');
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
                });
                return false;
            }

            if ($scope.v.page.editing === true) {   // 编辑
                return postEditData().then(function(_data) {
                    return _data;
                });
            } else { // 新建
                return postFormData().then(function(_data) {
                    return _data;
                });
            }
        }

        // 返回顶部
        function scroll2Top() {
            $timeout(function() {
                document.querySelector('.coupon-publish .list-wrap .list-body').scrollTop = 0;
            });
        }

        // 页面刚加载，所有请求接口都走完之后调用
        function initPageComplete() {
            // 因为watch的原因要异步处理
            if (hasTrue($scope.v.page.init)) {
                $timeout(function() {   // 页面初始化完毕
                    $scope.v.page.init = false;
                });
            }
        }

        // 请求接口，然后有数据返回，用来标识数据库里是否有数据（列表页面时会用到）
        function hasPageData(_name) {
            // 因为watch的原因要异步处理
            if (hasFalse($scope.v.control.block.ins[_name].hasData)) {
                $timeout(function() {   // 页面初始化完毕
                    $scope.v.control.block.ins[_name].hasData = true;
                });
            }
        }

        // 重置搜索参数
        function resetSearching(_name) {
            $scope.v.control.block.ins[_name].search.isProcessing = false;
            $scope.v.control.block.ins[_name].search.useAdvanced = false;
            $scope.v.control.block.ins[_name].search.advanced.showed = false;
        }

        // 搜索，返回
        function cancelSearching(_name) {
            resetSearching(_name);

            if ($scope.v.control.block.ins[_name].pagination.num !== 1) {
                $scope.v.control.block.ins[_name].pagination.num = 1;
            } else {
                updateLstData(_name);
            }
        }

        // 没有关键词返回空结果
        function returnEmptyResult(_name) {
            $scope.v.control.block.ins[_name].list = [];
            $scope.v.control.block.ins[_name].pagination.count = 0;
            return true;
        }

        // 没有关键词返回所有结果
        function returnSearchResult(_name) {
            // 新搜索更改页码
            if ($scope.v.control.block.ins[_name].pagination.num !== 1) {
                $scope.v.control.block.ins[_name].pagination.num = 1;
                return true; // 已经修改页面可以直接跳出，不走请求流程
            } else {
                return false;
            }
        }

        // 简单搜索（这个函数的返回值必须是 Promises）
        function smpSearch(_name, isNew) {
            if (hasTrue(isNew)) {
                resetSearching(_name);
                $scope.v.control.block.ins[_name].search.isProcessing = true;

                if (_hasValue($scope.v.control.block.ins[_name].search.simple.form.keyword)) { // 新的搜索有关键词

                    $scope.v.control.block.ins[_name].search.simple.data = {
                        'keyword': angular.copy($scope.v.control.block.ins[_name].search.simple.form.keyword)
                    };

                    // 返回搜索结果
                    if (returnSearchResult(_name) === true) {
                        return getNullPromises(); // 已经修改页面可以直接跳出，不走请求流程
                    }
                } else { // 新的搜索没有关键词
                    $scope.v.control.block.ins[_name].search.simple.data.keyword = null;

                    // 返回空白结果
                    // if (returnEmptyResult(_name) === true) {
                    //     return getNullPromises(); // 空白结果直接返回
                    // }

                    // 返回搜索结果
                    if (returnSearchResult(_name) === true) {
                        return getNullPromises(); // 已经修改页面可以直接跳出，不走请求流程
                    }
                }
            }

            let data = getQueryData(_name);

            let key = $scope.v.control.block.ins[_name].search.simple.replace.keyword;
            data[key] = $scope.v.control.block.ins[_name].search.simple.data.keyword;

            return reqSmpSearch(_name, data);
        }

        // 简单搜索请求
        function reqSmpSearch(_name, data) {
            return procApi('search', _name, data).then(function(_data) {
                if (_hasValue(_data)) {
                    setLstData(_name, _data.total, _data.rows);
                }
                return _data;
            });
        }

        // 遍历判断控件里是否有值
        function hasAdvSearchCtrlData(_name) {
            for (let ctrl in $scope.v.control.block.ins[_name].search.advanced.ctrls) {
                if (hasProp($scope.v.control.block.ins[_name].search.advanced.ctrls, ctrl)) {
                    let objs = $scope.v.control.block.ins[_name].search.advanced.ctrls[ctrl];
                    if (_hasValue(objs)) {
                        for (let i = 0, len = objs.length; i < len; i++) {
                            let name = objs[i];
                            switch (ctrl) {
                                case 'select':
                                    if (_hasValue($scope.v.control[ctrl].ins[name].current)) {
                                        return true;
                                    }
                                    break;
                                case 'checkbox':
                                case 'radio':
                                case 'date':
                                    if (_hasValue($scope.v.control[ctrl].ins[name].value)) {
                                        return true;
                                    }
                                    break;
                            }
                        }
                    }
                }
            }
            return false;
        }

        // 是否有高级搜索内容
        function hasAdvSearchData(_name) {
            // 循环判断form下的key是否有值
            for (let prop in $scope.v.control.block.ins[_name].search.advanced.form) {
                if (hasProp($scope.v.control.block.ins[_name].search.advanced.form, prop)) {
                    let value = $scope.v.control.block.ins[_name].search.advanced.form[prop];
                    if (_hasValue(value)) {
                        return true;
                    }
                }
            }

            // 判断控件里是否有值
            if (hasAdvSearchCtrlData(_name) === true) {
                return true;
            }

            return false;
        }

        // 遍历复制控件里的值
        function setAdvSearchCtrlData(_name) {
            for (let ctrl in $scope.v.control.block.ins[_name].search.advanced.ctrls) {
                if (hasProp($scope.v.control.block.ins[_name].search.advanced.ctrls, ctrl)) {
                    let objs = $scope.v.control.block.ins[_name].search.advanced.ctrls[ctrl];
                    if (_hasValue(objs)) {
                        _.each(objs, function(name) {
                            let src = null;
                            let dst = $scope.v.control.block.ins[_name].search.advanced;

                            switch (ctrl) {
                                case 'select':
                                    src = $scope.v.control[ctrl].ins[name].current;
                                    dst.data[name] = _hasValue(src) ? src._key : null;
                                    break;
                                case 'checkbox':
                                    src = $scope.v.control[ctrl].ins[name].value;
                                    // dst.data[name] = _getValue(src, null); // 单个
                                    dst.data[name] = _getValue(src, null); // 多个
                                    break;
                                case 'radio':
                                    src = $scope.v.control[ctrl].ins[name].value;
                                    dst.data[name] = _getValue(src, null);
                                    break;
                                case 'date':
                                    src = $scope.v.control[ctrl].ins[name].value;
                                    dst.data[name] = _hasValue(src) ? src.getTime() : null;
                                    break;
                            }
                        });
                    }
                }
            }
        }

        // 配置高级搜索参数
        function setAdvSearchData(_name) {
            $scope.v.control.block.ins[_name].search.advanced.data = {};

            // 遍历表单输入框的值赋值
            for (let prop in $scope.v.control.block.ins[_name].search.advanced.form) {
                if (hasProp($scope.v.control.block.ins[_name].search.advanced.form, prop)) {
                    let text = $scope.v.control.block.ins[_name].search.advanced.form[prop];
                    if (_hasValue(text)) {
                        $scope.v.control.block.ins[_name].search.advanced.data[prop] = text;
                    } else {
                        $scope.v.control.block.ins[_name].search.advanced.data[prop] = null;
                    }
                }
            }

            // 遍历复制控件里的值
            setAdvSearchCtrlData(_name);
        }

        // 遍历设置控件里的值为 null
        function clearAdvSearchCtrlData(_name) {
            for (let ctrl in $scope.v.control.block.ins[_name].search.advanced.ctrls) {
                if (hasProp($scope.v.control.block.ins[_name].search.advanced.ctrls, ctrl)) {
                    let objs = $scope.v.control.block.ins[_name].search.advanced.ctrls[ctrl];
                    if (_hasValue(objs)) {
                        _.each(objs, function(name) {
                            switch (ctrl) {
                                case 'select':
                                    $scope.v.control[ctrl].ins[name].current = angular.copy($scope.v.control[ctrl].ins[name].options[0]);
                                    break;
                                case 'checkbox':
                                    // $scope.v.control[ctrl].ins[name].value = null; // 单个的情况
                                    $scope.v.control[ctrl].ins[name].value = []; // 多个的情况
                                    break;
                                case 'radio':
                                    $scope.v.control[ctrl].ins[name].value = 'default'; // 默认值，不能等于 null
                                    break;
                                case 'date':
                                    $scope.v.control[ctrl].ins[name].value = null;
                                    break;
                            }
                        });
                    }
                }
            }
        }

        // 清空高级搜索内容
        function clearAdvSearch(_name) {
            // 循环把form下的key全部置null
            for (let prop in $scope.v.control.block.ins[_name].search.advanced.form) {
                if (hasProp($scope.v.control.block.ins[_name].search.advanced.form, prop)) {
                    $scope.v.control.block.ins[_name].search.advanced.form[prop] = null;
                }
            }

            // 特殊处理
            $scope.v.control.block.ins[_name].search.advanced.form.categoryId = [];

            // 遍历设置控件里的值为 null
            clearAdvSearchCtrlData(_name);
        }

        // 重置高级搜索提交的数据
        function resetAdvSearchData(_name) {
            // 循环把data下的key全部置null
            for (let prop in $scope.v.control.block.ins[_name].search.advanced.data) {
                if (hasProp($scope.v.control.block.ins[_name].search.advanced.data, prop)) {
                    $scope.v.control.block.ins[_name].search.advanced.data[prop] = null;
                }
            }
        }

        // 扩展高级搜索请求参数
        function extendAdvSearchData(_name, data) {
            // 遍历请求数据进行赋值
            for (let prop in $scope.v.control.block.ins[_name].search.advanced.data) {
                if (hasProp($scope.v.control.block.ins[_name].search.advanced.data, prop)) {
                    let value = $scope.v.control.block.ins[_name].search.advanced.data[prop];
                    if (_hasValue(value)) {
                        let key = $scope.v.control.block.ins[_name].search.advanced.replace[prop];
                        data[key] = value;
                    }
                }
            }
            return data;
        }

        // 根据状态做一些请求数据修改
        function modifyAdvSearchData(data) {
            // if ($scope.v.search.advanced.data.status === 'REFUNDING') {
            //     data.status = ''; // 全部订单
            // }

            if (data.priceFrom) {
                data.priceFrom = toRMBFen(data.priceFrom);
            }

            if (data.priceUntil) {
                data.priceUntil = toRMBFen(data.priceUntil);
            }

            return data;
        }

        // 高级搜索（这个函数的返回值必须是 Promises）
        function advSearch(_name, isNew) {
            $scope.v.control.block.ins[_name].search.advanced.touched = true;

            if (hasTrue(isNew)) {
                $scope.v.control.block.ins[_name].search.isProcessing = true;
                $scope.v.control.block.ins[_name].search.useAdvanced = true;

                if (hasAdvSearchData(_name) === true) {
                    setAdvSearchData(_name);

                    // 返回搜索结果
                    if (returnSearchResult(_name) === true) {
                        return getNullPromises(); // 已经修改页面可以直接跳出，不走请求流程
                    }
                } else { // 新的搜索没有关键词
                    resetAdvSearchData(_name);

                    // 返回空白结果
                    // if (returnEmptyResult(_name) === true) {
                    //     return getNullPromises(); // 空白结果直接返回
                    // }

                    // 返回搜索结果
                    if (returnSearchResult(_name) === true) {
                        return getNullPromises(); // 已经修改页面可以直接跳出，不走请求流程
                    }
                }
            }

            let data = getQueryData(_name);

            // 根据状态做一些请求数据修改
            data = modifyAdvSearchData(extendAdvSearchData(_name, data));

            return reqAdvSearch(_name, data);
        }

        // 高级搜索请求
        function reqAdvSearch(_name, data) {
            return procApi('search', _name, data).then(function(_data) {
                if (_hasValue(_data)) {
                    setLstData(_name, _data.total, _data.rows);
                }
                return _data;
            });
        }

        // 列表数据统一获取（基础数据）
        function getQueryData(_name) {
            return {
                'productSortType': 'DEFAULT',
                'productStatus': null,
                'pageNo': $scope.v.control.block.ins[_name].pagination.num - 1,
                'pagesize': $scope.v.control.pagination._config.size
                // 'status': $scope.v.control.block.ins[_name].tab.current._key
            };
        }

        // 列表数据（这个函数的返回值必须是 Promises）
        function getLstData(_name) {
            let data = getQueryData(_name);

            return procMainApi('list', data).then(function(_data) {
                if (_hasValue(_data)) {
                    setLstData(_name, _data.total, _data.rows);
                    hasPageData(_name);
                }
                return _data;
            });
        }

        // 统一处理页面数据赋值
        function setLstData(_name, count, list) {
            $scope.v.control.block.ins[_name].pagination.count = count;
            $scope.v.control.block.ins[_name].list = angular.copy(list);
        }

        // 页面主函数
        function main() {
            // 判断当前是否是编辑状态
            $scope.v.page.editing = _hasValue($scope.v.form.id);

            // 编辑状态
            if (hasTrue($scope.v.page.editing)) {
                // 编辑页获取数据
                return getSaveData().then(function(_data) {
                    if ($scope.v.control.radio.ins.link.value === 'PART') {
                        return getLstData('main').then(function(_data) {
                            initPageComplete();
                            return _data;
                        });
                    } else {
                        initPageComplete();
                        return _data;
                    }
                });
            } else {
                initPageComplete();
                // 列表页获取数据
                // return getLstData('main').then(function(_data) {
                //     initPageComplete();
                //     return _data;
                // });
            }
        }

        // 当页面中有富文本编辑器的时候, 编辑器加载完会自动调用 main 函数
        if ($scope.v.control.editor._config.used === false) {
            main();
        }

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

        function addProduct(id) {
            $scope.v.form.productIds.push(id);
        }

        function delProduct(id) {
            $scope.v.form.productIds = _removeItem($scope.v.form.productIds, id);
        }

        function hasProduct(id) {
            return ($scope.v.form.productIds.indexOf(id) > -1);
        }

        function addAllProducts() {
            for (let i = 0, len = $scope.v.control.block.ins.main.list.length; i < len; i++) {
                if (!hasProduct($scope.v.control.block.ins.main.list[i].id)) {
                    addProduct($scope.v.control.block.ins.main.list[i].id);
                }
            }
        }

        function getAllProducts() {
            $scope.v.form.productIds = [];
            return getLstData('main').then(function(_data) {
                return _data;
            });
        }

        function ctrlSelectedProducts($vm) {
            $vm.f = {};
            // 重新拷贝一份
            $vm.v.productIds = angular.copy($vm.v.data);

            $vm.v.form = {};

            $vm.v.lstData = [];

            $vm.v.page = {
                'requesting': false,
                'no': 1,
                'size': 10,
                'maxSize': 7,
                'count': $vm.v.data.length
            };

            $vm.f.addProduct = function(id) {
                $vm.v.productIds.push(id);
            };

            $vm.f.delProduct = function(id) {
                $vm.v.productIds = _removeItem($vm.v.productIds, id);
            };

            $vm.f.hasProduct = function(id) {
                return ($vm.v.productIds.indexOf(id) > -1);
            };

            $vm.f.ok = function() {
                $vm.m.close($vm.v.productIds);
            };

            $vm.f.cancel = function() {
                $vm.m.dismiss(null);
            };

            $vm.f.close = function() {
                $vm.m.dismiss(null);
            };

            $vm.m.scroll2Top = function() {
                $timeout(function() {
                    document.querySelector('.coupon-publish-show-selected .list-body').scrollTop = 0;
                });
            };

            $vm.m.getProductIds = function(page) {
                let res = [];

                for (let i = parseInt(page, 10) * $vm.v.page.size, maxLen = $vm.v.page.count, len = i + $vm.v.page.size;
                     (i < maxLen) && (i < len); i++) {
                    res.push($vm.v.data[i]);
                }

                return res.join(',');
            };

            $vm.m.procModalApi = function(_api, data) {
                $vm.v.page.requesting = true;
                return $vm.m.procApi(_api, 'modal', data).then(function(_data) {
                    $vm.v.page.requesting = false;
                    return _data;
                });
            };

            $vm.m.updateLstData = function() {
                if ($vm.v.page.count < 1) {
                    return null;
                }

                let data = {
                    'productIds': $vm.m.getProductIds($vm.v.page.no - 1)
                };

                return $vm.m.procModalApi('prods', data).then(function(_data) {
                    if (_hasValue(_data)) {
                        $vm.v.lstData = _data.rows;
                    }
                    return _data;
                });
            };

            $vm.m.main = function() {
                $vm.m.updateLstData();
            };

            $vm.$watch('v.page.no', function(newVal, oldVal) {
                if (parseInt(newVal, 10) !== parseInt(oldVal, 10)) {
                    return $vm.m.updateLstData().then(function(_data) {
                        if (_hasValue(_data)) {
                            $vm.m.scroll2Top();
                        }
                        return _data;
                    });
                }
            }, true);

            $vm.m.main();
        }

        function showSelectedProducts() {
            let cfgModal = $scope.v.control.modal.ins['product'];
            cfgModal.data = $scope.v.form.productIds;

            return showModal(cfgModal).then(function(data) {
                // 确定和取消的返回数据都通过 data
                if (_hasValue(data)) {
                    $scope.v.form.productIds = data;
                }
                return data;
            });
        }

        // 弹窗公共处理
        function ctrlCommonModal($scope, $modalInstance, _data) {
            const that = this;

            $scope.message = _data.message;

            $scope.v = {
                'api': _data.api,
                'data': _data.body
            };

            // 内部函数
            $scope.m = {
                'procApi': _data.procApi
            };

            $scope.m.close = function(data) {
                $modalInstance.close(angular.copy(data));
            };

            $scope.m.dismiss = function(data) {
                $modalInstance.dismiss(angular.copy(data));
            };

            if (_hasValue(_data.ctrl) && _.isFunction(_data.ctrl)) {
                _data.ctrl.call(that, $scope);
            }
        }

        // 显示弹窗（这个函数的返回值必须是 Promises）
        function showModal(cfg) {
            if (!_hasValue(cfg) ||
                !_hasValue(cfg.controller) ||
                !_hasValue(cfg.templateUrl) ||
                !_hasValue(cfg.windowClass)) {
                return getNullPromises();
            }

            let modalInstance = $modal.open({
                'animation': true,
                'controller': ctrlCommonModal,
                'templateUrl': cfg.templateUrl,
                'windowClass': cfg.windowClass,
                'resolve': {
                    '_data': function() {
                        return {
                            'procApi': procApi,
                            'api': $scope.v.api,
                            'message': $scope.message,
                            'ctrl': cfg.controller,
                            'body': _getCopyValue(cfg.data)
                        };
                    }
                }
            });

            return modalInstance.result.then(
                function(data) {
                    return data;
                },
                function(data) {
                    return data;
                }
            );
        }

        function updateLstData(_name) {
            // 搜索状态下的翻页
            if ($scope.v.control.block.ins[_name].search.isProcessing === true) {
                // 高级搜索
                if ($scope.v.control.block.ins[_name].search.useAdvanced === true) {
                    return advSearch(_name);
                } else { // 简单搜索
                    return smpSearch(_name);
                }
            } else { // 非搜索状态
                return getLstData(_name);
            }
        }

        // 点击分页的时候，页面跳转
        $scope.$watch('v.control.block.ins.main.pagination.num', function(newVal, oldVal) {
            if (parseInt(newVal, 10) !== parseInt(oldVal, 10)) {
                return updateLstData('main').then(function(_data) {
                    if (_hasValue(_data)) {
                        scroll2Top();
                    }
                    return _data;
                });
            }
        }, true);
    }
]);
