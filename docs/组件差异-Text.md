## Text

* numberOfLines 最好和 height 配合使用，否则可能会出现文字显示不全。
  
* Text 标签的子元素，如果是变量，那么这个变量需要为 简单类型
   
   合法
   
   ```javascript
   
   x = 1  
 
   <Text>
       <Text>{x}</Text>
   </Text>
   ```  
   
   非法
   
   ```javascript
      
    x = <Text>1</Text>

     <Text>
       {1}
     </Text>
   ```  
   