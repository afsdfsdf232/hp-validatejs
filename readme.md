## 自定义验证插件 支持浏览器和node环境

## 使用方法
   ## 1.0 安装 
      npm install hp-validate --save
   ## 1.1 引入插件
     import { validate, validateAll } from 'hp-validate'

## 方法介绍
   ## 1.0 validate
    对单个值进行验证，支持Promise 和 callback 回调
   ## 2.0 validateAll
    对多个值进行验证，例如表单所有项, 支持Promise 和 callback 回调

## 使用方法
   1.0 validate
   1.0.0 参数: ...args validate(rules,value,callback) 返回值：Promise 或者 void
   1.0.1 rules：规则，必传值 types：Object || Array || Funtion || RegExp 
  ## 1.0.1.0: 
            Object: { 
              min: -Infinity, // 最小值
              max: Infinity, // 最大值
              type: 'any', // 类型 如下 ①
              length:Infinity, // 字符串长度
              integer: false, // 是否为整数
              decimal: Infinity, // 保留小数点位数
              validator: null, // 自定义验证函数, 如下②
              regExp: null, // 对象中的正则验证，如下③
            }
             ① type: any string number object array boolean function date null undefined nan regexp email mobile id(身份证验证) carCode(车牌号验证) password
             ② 自定义函数验证，验证成功Promise.resolve(), 失败Promise.reject(message)
             ③ 自定义正则表达式
           Function：自定义函数验证，验证成功Promise.resolve(), 失败Promise.reject(message)
           Array：包含多项的验证规则
           RegExp：自定义正则表达式

  ## 2.0.0 validateAll
  ## 2.0.1 参数 validateAll(rules, values, callback)
  ## 2.0.2 rules: 规则内容，必传，type: Object ⑤
                          ⑤ => types：{ key: string ⑥, rules: Object || Array || Funtion || RegExp  }
                          ⑥ => key: 验证的字段名，必须和values中的key值对应
  ## 2.0.2 values：需要验证的所有值，必传，type: Object⑦ || Array⑧
                                     ⑦ => { name:'hp', age: 20 }
                                     ⑧ => [ { key: 'name', value: 'hp' }, { key: 'age', value: 20 }]

  ## 获取结果 （validate，validateAll 一致）
       1. Promise  const result = await validate(rules,value)
       2. callback  validate(rules,value,result => console.log(result))
   返回值：result: Object {
                     validate: bool 验证结果是否存在错误
                     errors: Array  验证未通过的列表 ④
                 }
                      errors：Array-> Object => { key:string, message: string, value: any }
                                                key: 验证的字段名，单个值验证为空 validate
                                                message：错误信息
                                                value：当前验证的值