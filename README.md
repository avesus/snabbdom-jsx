Write [Snabbdom](https://github.com/paldepind/snabbdom) virtual DOM with [Babel's JSX](http://babeljs.io/docs/advanced/transformers/other/react/).

Snabbdom is a small Virtual DOM library. Unlike React, it's not a fully opinionated framework, but just focuses on the core virtual DOM problem : construct virtual DOM trees (virtual nodes) and patch the real DOM with them. When those operations happen is entirely up to you. The main benefit is that you can adopt whatver architdectural UI pattern you like in your application.

Babel is JavaScript compiler that converts ES2015 (modern JavaScript) into compatible JavaScript (ES5) code. A nice feature of Babel is that it supports [React JSX syntax](http://facebook.github.io/react/docs/displaying-data.html#jsx-syntax) and in the same time allows you to take the result of this JSX (attributes + body) and do wharever you like with it. Sanbbdom-jsx transforms this JSX data into snabbdom virtual nodes. 

Features:

- Transforms Babel JSX templates into Snabbdom virtual nodes
- Straightforward mapping from JSX attributes to Snabbdom data attributes using namespaces 
- JSX Components are simple functions `(attributes, children) => vnode`. No more messy classes.

Usage
======

installation

```
npm install snabbdom-jsx
```

Hello example ([see the complete example here](https://github.com/yelouafi/snabbdom-jsx/blob/master/examples/hello/main.js))

```js
/** @jsx html */

import { html } from 'snabbdom-jsx';

const patch = snabbdom.init([...]);

const vnode = <div>Hello JSX</div>

patch(document.getElementById('placeholder'), vnode);
```

The `/** @jsx html */` pragma at the top tells Babel to use the `html` function instead of the React.createElement default. The `html` function takes arguments passed from Babel and generates virtual nodes as expected by Snabbdom's `patch` function.

Mapping JSX attributes
=======================

A quick remainder: in snabbdom, most of the functionalities like toggling classes, styles and setting properties on DOM elements are delegated to separate modules.

For example

```js
const myInput = h('input', { 
  props: { type: 'text' }       // handled by the props module
  on: { change: someCallback }, // handled by the eventlisteners module
  class: { class1: isEnabled }  // handled by the class module
  ...
})
```

Each module handles a portion of the data attributes (the 2nd parameter to `h`). And each portion is stored inside a *namespace*, for example, event attributes are placed inside the `on` namespace, class attributes inside the `class` namespace and so on.


By default all attributes listed in the JSX element are placed inside the `props` namespace.


```js
<input type="text" />
```
Is equivalent to

```js
h('input', { props: { type: 'text' } })
```

To attach event listeners, we use the `on-` prefix

```js
<button on-click={ callback } />

// is equivalent to

h('button', { on: { click: callback } })
```


This is a generic rule to map a JSX attribute to a specific module, you need to prefix the attribute with `pref-` where `pref` is the namespace used by the module in Snabbdom. As in the example above, all attributes with the `on-` prefix (i.e. event listeners) will be placed inside the the `on` namespace. This gives us a simple and extensible pattern to support other custom modules.

Another example using the `class` namespace


```js
<div
  class-visible={isVisible}
  class-enabled={isEnabled}>
  
  ...
</div>

// is equivalent to

h('div', { 
  class: { visible: isVisible, enabled: isEnabled } 
}, [...])
```

But you can also specify an unique object the same way as in the `h` function, this is useful when you have a dynamic object 

```js
<div
  style={ ({fontWeight: 'bold', color: 'red'}) }>
  
  ...
</div>

// is equivalent to

h('div', { 
  style: {fontWeight: 'bold', color: 'red'} 
}, [...])
```

You can mix both styles, the result will be a merge of all attributes


```js
<div
  class={ ({visible: isVisible}) }
  class-enabled={isEnabled}>
  
  ...
</div>
```

Static classes
==============

In Snabbdom you can create an element using a css-like syntax 

```js
h('div.class1.class2', ...)
```

This will add the class names to the classList of the element. Unlike classes specified in the `class` namesapce, those are static classes meaning they will not be re-updated during patch operations. 

In JSX you can use the `classNames` attribute to create static classes


```js
<div classNames="class1 class 2" />
```

You can also use an array instead of a string

```js
const classes = ['classe1', ...];
<div classNames={classes} />
```


JSX Components
===============

In React/JSX you can create components and use them inside other components

```js
var HelloMessage = React.createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});

React.render(<HelloMessage name="John" />, mountNode);
```

Instead of classes, Snabbdom-jsx components are simple functions of type  `(attributes, children) => vnode`.

```js
//HelloMessage : (attrs, body) -> vnode
const HelloMessage = ({name}) =>
  <div on-click={ _ => alert('Hi ' + name) }>
    {name}
  </div>;


var vnode = <HelloMessage name="Yassine" />
```

As in React, note that all components must start with a capital letter, while regular HTML tags start with lower case letters. This the way Babel also distinguish component invocation from simple tag creation. 

Perhaps of less obvious utility, but instead of a function, a component can also be an object with a `view` function; i added this in order to support nesting in UI patterns; especially in the Elm architecture, where a component is an object with a `view` function (among others)

for example you can have a `Task` component


```js
Task.view = ({task}) => ...
Task.update = ...
```

and use it inside a `Todos` component like this

```js
import Task from './task'


Todos.view = ({todos}) =>
  todos.map( task => <Task task={task} /> )
```


If you're wondering how Components would fit in a large application, you can look into the [todomvc example](https://github.com/yelouafi/snabbdom-jsx/tree/master/examples/todomvc). The application is implemented using the Elm architecture. For more information see [React-less Virtual DOM with Snabbdom : functions everywhere!](https://medium.com/@yelouafi/react-less-virtual-dom-with-snabbdom-functions-everywhere-53b672cb2fe3)
