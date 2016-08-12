
// 过滤空格
app.filter('noSpace', function() {
    return function(input) {
        if (input) {
            return input.replace(/\s+/g, '');
        }
    };
});

//截取字符串
app.filter('strOmit', function() {
    return function(str, num, type, omit) {
        if (!str) {
            return;
        }
        var selfLen = str.length;
        var omitted = omit || '';
        var data = '';
        var tempLen = 0;
        if (type) {
            for (var i = 0; tempLen <= num; i++) {
                if (str.charCodeAt(i) > 255) {
                    tempLen += 2;
                } else {
                    tempLen += 1;
                }
            }
            if (tempLen > num) {
                i--;
            }
            data = str.slice(0, i);
        } else {
            data = str.slice(0, num);
        }
        if (selfLen > num || selfLen > i) {
            data += omitted;
        }
        return data;
    };
});

//空格转换为nbsp
app.filter('toNBSP', function() {
    return function(input) {
        var val = input.replace(/ /g, '&nbsp;');
        return val;
    };
});

//搜索结果着色
app.filter('resultsKey', function() {
    return function(input, key) {
        var reg = new RegExp(key);
        var val = input.replace(reg, `<span class="key">${key}</span>`);
        return val;
    };
});

app.filter('htmlTagsRemove', function() {
    return function(str) {
        str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
        str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
        str = str.replace(/\n[\s| | ]*\r/g, '\n'); //去除多余空行
        str = str.replace(/&nbsp;/ig, ''); //去掉&nbsp;
        return str;
    }
})

app.filter('htmlDecode', function() {
    return function(str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&amp;/g, "&");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/&#39;/g, "\'");
        s = s.replace(/&quot;/g, "\"");
        return s;
    }
});

// 过滤字符串NULL
app.filter('nullToSpace', function() {
    return function(input) {
        let str = input === 'NULL' ? '' : input;
        return str;
    };
});

// 百分比
app.filter('percentage', ['$filter', function($filter) {
    return function(input, decimals) {
        if (hasValue(input)) {
            return $filter('number')(toRMBFen(input), decimals) + '%';
        } else {
            return '0%';
        }
    };
}]);

// 价格区间显示
app.filter('showPriceSummary', ['$filter', function($filter) {
    return function(input, isSku) {
        var minPrice = null, maxPrice = null;

        if (hasTrue(isSku)) {
            minPrice = toRMBYuan(input.minSkuPrice);
            maxPrice = toRMBYuan(input.maxSkuPrice);
        } else {
            minPrice = toRMBYuan(input.minPrice);
            maxPrice = toRMBYuan(input.maxPrice);
        }

        if (minPrice === maxPrice) {
            return '&yen;' + minPrice;
        } else {
            return '&yen;' + minPrice + '-' + maxPrice;
        }
    };
}]);

// 显示价格
app.filter('showPrice', ['$filter', function($filter) {
    return function(input) {
        return $filter('currency')(toRMBYuan(input));
    };
}]);

// 显示空线
app.filter('showNullLine', ['$filter', function($filter) {
    return function(input) {
        return _getValue(input, '——');
    };
}]);

// 显示数组字符串
app.filter('showArrString', ['$filter', function($filter) {
    return function(input) {
        if (_hasValue(input) && _.isArray(input)) {
            return input.join(', ');
        } else {
            return '--';
        }
    };
}]);
