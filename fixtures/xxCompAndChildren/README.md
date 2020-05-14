## xxComp 和 children的重新实现


每当`ReactMiniProgram.render`函数执行到`this.props.renderBody`的时候，说明`this.props.renderBody`这个值表示的是一个UI视图。
有两种情况

第一种：
```javascript
class X {
	render() {
		return this.props.renderBody
	}
}
```

第二种：
```javascript
class X {
	f() {
		return this.props.renderBody
	}
	
	g() {
		return this.f()
	}
	
	render() {
		
		const x = [this.f(), this.g(), this.props.renderBody]
		return (
			<View>
			     {this.props.renderBody}
			     {this.f()}
			     {this.g()}
			     {x}
			     
			     {true ? this.props.renderBody : this.props.renderFooter}
			     {true ? this.props.renderBody : <Y/>}
            </View>
		)
	}
}
```
第二种作为 JSXExpressionContainer的结果



```javascript
class B {
	render() {
		return (
			<A
               renderBody={<Text>Body</Text>}
            />
		)
	}
}


class A {
	
	render() {
		
		return (
			<View>
			     {this.props.renderBody}
            </View>
		)
	}
}
```

1. 每一个组件收集`renderXXX`关键字，创建`componentGenerics`字段， 如下：
   ```json
   {
       "componentGenerics": {
            "renderBody": true
       }
   }
   ```
   
2. 修改`childTemplate`为：
   ```html
    <template name="childTemplate">
        <block wx:if="{{t.l(d)}}">{{d}}</block>
        <template wx:elif="{{d.tempName}}" is="{{d.tempName}}" data="{{...d}}"/>
        <template wx:elif="{{d.cptTemplate}}" is="{{d.cptTemplate}}" data="{{...d}}"/>
        <block wx:else>
            <block wx:for="{{d}}" wx:key="key">
                <block wx:if="{{t.l(item)}}">{{item}}</block>
                <template wx:else is="{{item.tempName}}" data="{{...item}}"/>
            </block>
        </block>
    </template>

    <template name="cptTemplate">
         <childrenCpt wx:if="d.childrenCpt"/>
         <renderBody wx:elif="d.renderBodyCpt"/>
          <!--other cpt...-->
    </template>
   ```   
   
3. children/renderXXX 属性不再特殊处理。如上面的A组件 
   ```javascript
   class A {
   	   render() {
   	      	return (   
	      		<View>
   			         <template 
			              is="childTemplate" 
                          data="{{d: }}"
                          tempVnode={this.props.renderBody}
                      />
                </View>
             )
	   }
   }
   ```
   
4. 对于组件B，只要`JSXAttribute` 存在 `renderXXX` 表明此组件需要被外部渲染。 则生成一个outComp！，然后把
   自身转化为：
   ```javascript

    class B {
        render() {
            return (
                <A
                   generic:renderBody="outComp"
                />
            )
        }
    }
   ```
   
5. 另外需要对`<A renderBody={<Text>Body</Text>} renderFooter={() => this.f()} />` 中的`<Text>Body</Text>` 标记`cptTemplate`。
   在编译阶段，我们需要做``<A renderBody={cptWrapper(<Text>Body</Text>)} renderFooter={cptWrapper(() => this.f())} />``，而cptWrapper
   如下：
   ```javascript
   function cptWrapper(v, name) {
	   if (typeof v !== 'object' || v === null) {
 	        return v
       }
        
	   if(v.isReactElement) {
 	       v.cptName = name
       } else {
 	       Object.values(v).forEach(item => {
      	       if (item.isReactElement) {
      	       	   item.cptName = name
   	           }
           })
       }
   }
   ```
   
   
  

      
  

