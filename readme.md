## 自定义验证插件 支持浏览器和node环境

## 使用方法
   ## 1.0 安装 
      npm install hp-validatejs OR yarn add hp-validatejs
   ## 1.1 引入插件
     import { validate, validateAll } from 'hp-validatejs'

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


## 常用工具方法 （targetType，pick，queryParams，deepClone，deepMerge，debounce，timeFormat，timeFrom）
## 1. targetType, 判断数据类型 targetType(object,string)
   ## 参数：1.目标数据  2.类型 （string, array, null, object, number ...） 返回值 bool 类型
   ## 参数  目标数据 返回值为当前数据的类型
## 2. pick 提取对象中指定内容，pick(object, array, object)
   ## 参数1：目标对象 ， 参数2：提取的key值列表， 参数3：可选，需要修改的对象的键值 _id: id, 将数据中_id 修改成 id
## 3. queryParams 获取url中的参数 queryParams(url)
## 4. deepClone 深度克隆 deepClone(object)
## 5. deepMerge 对象深度合并
## 6. timeForma 时间日期格式化 timeForma（date, forma）
   ## 参数1：时间，类型 Number String Date，参数2：需要转换的格式 默认为yyyy-mm-dd，年:yyyy，月:mm，日:dd，时:hh，分:MM，秒:ss
## 7. timeFrom 很久以前 timeFrom(time, format = String | false)
   该函数必须传入第一个参数，格式为任何合法的时间格式、秒或毫秒的时间戳，第二个参数是可选的，返回的值类似刚刚，25分钟前，3小时前，7天前的结果。 如果第二个参数是时间的格式，当前和传入时间戳相差大于一个月时，返回格式化好的时间；如果第二个参数为false，则不会返回格式化好的时间，而是诸如"xxx年前"的结果。
   ## timestamp <String> 时间戳
      format <String / false> 时间格式，默认为yyyy-mm-dd，年为"yyyy"，月为"mm"，日为"dd"，时为"hh"，分为"MM"，秒为"ss"，格式可以自由搭配，如： yyyy:mm:dd，yyyy-mm-dd，yyyy年mm月dd日，yyyy年mm月dd日 hh时MM分ss秒，yyyy/mm/dd/，MM:ss等组合。 如果时间戳距离此时的时间，大于一个月，则返回一个格式化好的时间，如果此参数为false，返回均为"多久之前"的结果。
## 8.debounce 防抖 debounce(func, wait, immediate)