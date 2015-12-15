# sw-resource-priority
Trying out Resource Scheduler with Service Worker. 

### Priority

These are just assumptions - You can change (Lower the better)
```
css : 1
fonts : 2
js : 3
images: 4
```

You can force the priority manually through query params like this

```
    http://www.example.com/a.js?priority=1
```

### Issue

+ Works only after SW install is done - Finding a way to work around


### Development

```js
npm run watch
node server.js
```


